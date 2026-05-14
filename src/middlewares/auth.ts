import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET || "fallback_secret";

// Estende o tipo Request do Express para incluir o ID do usuário (se necessário depois)
export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: "Token de autenticação não fornecido" });
  }

  // O cabeçalho deve ter o formato "Bearer <token>"
  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ erro: "Erro no formato do token. Use 'Bearer <token>'" });
  }

  const token = parts[1];

  try {
    // Verifica a assinatura do token usando o segredo compartilhado
    const decoded = jwt.verify(token, SECRET) as any;
    
    // Podemos passar dados do token para frente (ex: id do Integrador ou papel)
    req.userId = decoded.id;
    
    return next();
  } catch (err) {
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }
};
