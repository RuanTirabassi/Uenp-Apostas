import { sql } from "@vercel/postgres";
import sqlite3 from "sqlite3";
import path from "path";

// Detecta se estamos na Vercel
const isVercel = process.env.VERCEL === "1" || !!process.env.POSTGRES_URL;

/*
  CONFIGURAÇÃO PARA VERCEL (POSTGRES)
*/
export async function initDatabase() {
  if (isVercel) {
    console.log("Utilizando Vercel Postgres");
    try {
      // Cria a tabela caso ela não exista (Sintaxe Postgres)
      await sql`
        CREATE TABLE IF NOT EXISTS apostadores (
          id SERIAL PRIMARY KEY,
          nome TEXT NOT NULL,
          idade INTEGER NOT NULL,
          chave_pix TEXT NOT NULL
        );
      `;
      console.log("Tabela Postgres verificada/criada com sucesso.");
    } catch (error) {
      console.error("Erro ao inicializar Postgres:", error);
    }
  } else {
    /*
      CONFIGURAÇÃO LOCAL (SQLITE)
    */
    console.log("Utilizando SQLite Local");
    const dbPath = path.join(__dirname, "..", "database.sqlite");
    const db = new sqlite3.Database(dbPath);
    
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run(`
          CREATE TABLE IF NOT EXISTS apostadores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            idade INTEGER NOT NULL,
            chave_pix TEXT NOT NULL
          )
        `, (err) => {
          if (err) reject(err);
          else resolve(db);
        });
      });
    });
  }
}

// Exportamos o objeto sql para ser usado nas rotas quando estivermos na Vercel
export { sql };