// Importa os tipos do Express e o recurso Router para organizar as rotas
import { Router, Request, Response } from "express";

// Importa a conexão com o banco de dados
import { db } from "./database";

// Importa o middleware de autenticação e os utilitários de criptografia
import { authMiddleware } from "./middlewares/auth";
import { encrypt, decrypt } from "./utils/crypto";

// Cria uma instância do roteador do Express
const router = Router();

// Aplica o middleware de autenticação JWT em TODAS as rotas deste arquivo
router.use(authMiddleware);

/*
  ROTA: GET /apostadores
  OBJETIVO: Retornar todos os apostadores cadastrados no banco.
*/
router.get("/apostadores", (req: Request, res: Response) => {
  db.all("SELECT * FROM apostadores", [], (err, rows: any[]) => {
    if (err) {
      return res.status(500).json({
        erro: "Erro ao buscar apostadores",
        detalhes: err.message
      });
    }

    // Descriptografa a chave pix antes de enviar de volta (opcional, dependendo do design)
    const apostadores = rows.map(row => ({
      ...row,
      chave_pix: decrypt(row.chave_pix)
    }));

    return res.status(200).json(apostadores);
  });
});

/*
  ROTA: GET /apostadores/:id
  OBJETIVO: Buscar um único apostador pelo ID.
*/
router.get("/apostadores/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  db.get("SELECT * FROM apostadores WHERE id = ?", [id], (err, row: any) => {
    if (err) {
      return res.status(500).json({
        erro: "Erro ao buscar apostador",
        detalhes: err.message
      });
    }

    if (!row) {
      return res.status(404).json({
        mensagem: "Apostador não encontrado"
      });
    }

    // Descriptografa a chave_pix
    row.chave_pix = decrypt(row.chave_pix);

    return res.status(200).json(row);
  });
});

/*
  ROTA: POST /apostadores
  OBJETIVO: Cadastrar um novo apostador.
*/
router.post("/apostadores", (req: Request, res: Response) => {
  const { nome, idade, chavePix } = req.body;

  // Validação simples
  if (!nome || !idade || !chavePix) {
    return res.status(400).json({
      mensagem: "Os campos nome, idade e chavePix são obrigatórios"
    });
  }

  // Criptografa o dado sensível ANTES de salvar no banco de dados
  const chavePixCriptografada = encrypt(chavePix);

  const sql = "INSERT INTO apostadores (nome, idade, chave_pix) VALUES (?, ?, ?)";

  db.run(sql, [nome, idade, chavePixCriptografada], function (err) {
    if (err) {
      return res.status(500).json({
        erro: "Erro ao cadastrar apostador",
        detalhes: err.message
      });
    }

    return res.status(201).json({
      id: this.lastID,
      nome,
      idade,
      chavePix // Retornamos o dado original limpo para o cliente na criação
    });
  });
});

/*
  ROTA: PUT /apostadores/:id
  OBJETIVO: Atualizar os dados de um apostador existente.
*/
router.put("/apostadores/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, idade, chavePix } = req.body;

  if (!nome || !idade || !chavePix) {
    return res.status(400).json({
      mensagem: "Os campos nome, idade e chavePix são obrigatórios"
    });
  }

  // Criptografa o dado atualizado
  const chavePixCriptografada = encrypt(chavePix);

  const sql = `
    UPDATE apostadores
    SET nome = ?, idade = ?, chave_pix = ?
    WHERE id = ?
  `;

  db.run(sql, [nome, idade, chavePixCriptografada, id], function (err) {
    if (err) {
      return res.status(500).json({
        erro: "Erro ao atualizar apostador",
        detalhes: err.message
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        mensagem: "Apostador não encontrado"
      });
    }

    return res.status(200).json({
      id: Number(id),
      nome,
      idade,
      chavePix
    });
  });
});

/*
  ROTA: DELETE /apostadores/:id
  OBJETIVO: Remover um apostador do banco pelo ID.
*/
router.delete("/apostadores/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  db.run("DELETE FROM apostadores WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({
        erro: "Erro ao remover apostador",
        detalhes: err.message
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        mensagem: "Apostador não encontrado"
      });
    }

    return res.status(200).json({
      mensagem: "Apostador removido com sucesso"
    });
  });
});

// Exporta o roteador para ser usado no arquivo principal do servidor
export default router;