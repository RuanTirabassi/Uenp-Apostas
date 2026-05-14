// Importa a biblioteca sqlite3 para permitir a conexão com o banco SQLite
import sqlite3 from "sqlite3";
import path from "path";

// Ativa mensagens mais detalhadas de erro e debug do SQLite
const sqlite = sqlite3.verbose();

/*
  Na Vercel, o sistema de arquivos é apenas leitura (Read-Only), exceto a pasta "/tmp".
  Portanto, se estivermos na Vercel, criamos o SQLite dentro do /tmp.
  Atenção: Na Vercel os dados no /tmp são efêmeros (são perdidos periodicamente), 
  o que serve perfeitamente para testes de integração com a faculdade.
*/
const dbPath = process.env.VERCEL 
  ? path.join("/tmp", "database.sqlite") 
  : "./database.sqlite";

export const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar no banco:", err.message);
  } else {
    console.log(`Banco conectado com sucesso em: ${dbPath}`);
  }
});

/*
  O método serialize garante que os comandos SQL serão executados em ordem.
*/
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS apostadores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      idade INTEGER NOT NULL,
      chave_pix TEXT NOT NULL
    )
  `);
});