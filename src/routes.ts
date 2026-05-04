// Importa os tipos do Express e o recurso Router para organizar as rotas
import { Router, Request, Response } from "express";

// Importa a conexão com o banco de dados
import { db } from "./database";

// Cria uma instância do roteador do Express
const router = Router();

/*
  ROTA: GET /apostadores
  OBJETIVO: Retornar todos os apostadores cadastrados no banco.

  db.all:
  - Executa uma consulta SQL
  - Retorna todas as linhas encontradas
*/
router.get("/apostadores", (req: Request, res: Response) => {
  db.all("SELECT * FROM apostadores", [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        erro: "Erro ao buscar apostadores",
        detalhes: err.message
      });
    }

    return res.status(200).json(rows);
  });
});

/*
  ROTA: GET /apostadores/:id
  OBJETIVO: Buscar um único apostador pelo ID.

  db.get:
  - Executa uma consulta SQL
  - Retorna apenas um único registro
*/
router.get("/apostadores/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  db.get("SELECT * FROM apostadores WHERE id = ?", [id], (err, row) => {
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

    return res.status(200).json(row);
  });
});

/*
  ROTA: POST /apostadores
  OBJETIVO: Cadastrar um novo apostador.

  Espera receber no body:
  {
    "nome": "Carlos",
    "idade": 28,
    "chavePix": "carlos@email.com"
  }

  db.run:
  - Executa comandos como INSERT, UPDATE e DELETE
*/
router.post("/apostadores", (req: Request, res: Response) => {
  const { nome, idade, chavePix } = req.body;

  // Validação simples para garantir que os campos obrigatórios foram enviados
  if (!nome || !idade || !chavePix) {
    return res.status(400).json({
      mensagem: "Os campos nome, idade e chavePix são obrigatórios"
    });
  }

  const sql = "INSERT INTO apostadores (nome, idade, chave_pix) VALUES (?, ?, ?)";

  db.run(sql, [nome, idade, chavePix], function (err) {
    if (err) {
      return res.status(500).json({
        erro: "Erro ao cadastrar apostador",
        detalhes: err.message
      });
    }

    /*
      this.lastID:
      Após o INSERT, o SQLite disponibiliza o ID gerado automaticamente.
    */
    return res.status(201).json({
      id: this.lastID,
      nome,
      idade,
      chavePix
    });
  });
});

/*
  ROTA: PUT /apostadores/:id
  OBJETIVO: Atualizar os dados de um apostador existente.

  Espera receber no body:
  {
    "nome": "Novo Nome",
    "idade": 30,
    "chavePix": "nova-chave"
  }
*/
router.put("/apostadores/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, idade, chavePix } = req.body;

  // Validação simples para impedir atualização incompleta
  if (!nome || !idade || !chavePix) {
    return res.status(400).json({
      mensagem: "Os campos nome, idade e chavePix são obrigatórios"
    });
  }

  const sql = `
    UPDATE apostadores
    SET nome = ?, idade = ?, chave_pix = ?
    WHERE id = ?
  `;

  db.run(sql, [nome, idade, chavePix, id], function (err) {
    if (err) {
      return res.status(500).json({
        erro: "Erro ao atualizar apostador",
        detalhes: err.message
      });
    }

    /*
      this.changes:
      Informa quantas linhas foram alteradas.
      Se for 0, significa que o ID não existe no banco.
    */
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