import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Importa a conexão com o banco de dados (Vercel Postgres)
import { sql } from "@vercel/postgres";

// Importa o middleware de autenticação e os utilitários de criptografia
import { authMiddleware } from "./middlewares/auth";
import { encrypt, decrypt } from "./utils/crypto";

// Cria uma instância do roteador do Express
const router = Router();

/*
  ROTA: POST /login
  OBJETIVO: Gerar um token de acesso para testes e integração.
*/
router.post("/login", (req: Request, res: Response) => {
  const { usuario, senha } = req.body;

  // Como é um projeto de estudo, vamos aceitar qualquer usuário para gerar o token
  const SECRET = process.env.JWT_SECRET || "fallback_secret";
  const token = jwt.sign({ id: "usuario_estudo", nome: usuario }, SECRET, { expiresIn: "1d" });

  return res.status(200).json({ auth: true, token });
});

// Aplica o middleware de autenticação JWT em TODAS as rotas ABAIXO desta linha
router.use(authMiddleware as any);

/*
  ROTA: GET /apostadores
  OBJETIVO: Retornar todos os apostadores cadastrados no banco.
*/
router.get("/apostadores", async (req: Request, res: Response) => {
  try {
    const { rows } = await sql`SELECT * FROM apostadores ORDER BY id ASC`;
    
    // Descriptografa a chave pix antes de enviar de volta
    const apostadores = rows.map(row => ({
      ...row,
      chave_pix: decrypt(row.chave_pix)
    }));

    return res.status(200).json(apostadores);
  } catch (err: any) {
    return res.status(500).json({
      erro: "Erro ao buscar apostadores",
      detalhes: err.message
    });
  }
});

/*
  ROTA: GET /apostadores/:id
  OBJETIVO: Buscar um único apostador pelo ID.
*/
router.get("/apostadores/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { rows } = await sql`SELECT * FROM apostadores WHERE id = ${id}`;
    
    if (rows.length === 0) {
      return res.status(404).json({
        mensagem: "Apostador não encontrado"
      });
    }

    const row = rows[0];
    row.chave_pix = decrypt(row.chave_pix);

    return res.status(200).json(row);
  } catch (err: any) {
    return res.status(500).json({
      erro: "Erro ao buscar apostador",
      detalhes: err.message
    });
  }
});

/*
  ROTA: POST /apostadores
  OBJETIVO: Cadastrar um novo apostador.
*/
router.post("/apostadores", async (req: Request, res: Response) => {
  const { nome, idade, chavePix } = req.body;

  if (!nome || !idade || !chavePix) {
    return res.status(400).json({
      mensagem: "Os campos nome, idade e chavePix são obrigatórios"
    });
  }

  const chavePixCriptografada = encrypt(chavePix);

  try {
    const { rows } = await sql`
      INSERT INTO apostadores (nome, idade, chave_pix) 
      VALUES (${nome}, ${idade}, ${chavePixCriptografada})
      RETURNING id;
    `;

    return res.status(201).json({
      id: rows[0].id,
      nome,
      idade,
      chavePix
    });
  } catch (err: any) {
    return res.status(500).json({
      erro: "Erro ao cadastrar apostador",
      detalhes: err.message
    });
  }
});

/*
  ROTA: PUT /apostadores/:id
  OBJETIVO: Atualizar os dados de um apostador existente.
*/
router.put("/apostadores/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, idade, chavePix } = req.body;

  if (!nome || !idade || !chavePix) {
    return res.status(400).json({
      mensagem: "Os campos nome, idade e chavePix são obrigatórios"
    });
  }

  const chavePixCriptografada = encrypt(chavePix);

  try {
    const result = await sql`
      UPDATE apostadores
      SET nome = ${nome}, idade = ${idade}, chave_pix = ${chavePixCriptografada}
      WHERE id = ${id}
    `;

    if (result.rowCount === 0) {
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
  } catch (err: any) {
    return res.status(500).json({
      erro: "Erro ao atualizar apostador",
      detalhes: err.message
    });
  }
});

/*
  ROTA: DELETE /apostadores/:id
  OBJETIVO: Remover um apostador do banco pelo ID.
*/
router.delete("/apostadores/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await sql`DELETE FROM apostadores WHERE id = ${id}`;

    if (result.rowCount === 0) {
      return res.status(404).json({
        mensagem: "Apostador não encontrado"
      });
    }

    return res.status(200).json({
      mensagem: "Apostador removido com sucesso"
    });
  } catch (err: any) {
    return res.status(500).json({
      erro: "Erro ao remover apostador",
      detalhes: err.message
    });
  }
});

export default router;