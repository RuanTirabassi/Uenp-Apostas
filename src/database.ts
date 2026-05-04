// Importa a biblioteca sqlite3 para permitir a conexão com o banco SQLite
import sqlite3 from "sqlite3";

// Ativa mensagens mais detalhadas de erro e debug do SQLite
const sqlite = sqlite3.verbose();

/*
  Cria a conexão com o banco de dados local.
  O arquivo "database.sqlite" será criado automaticamente na raiz do projeto
  se ele ainda não existir.
*/
export const db = new sqlite.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Erro ao conectar no banco:", err.message);
  } else {
    console.log("Banco conectado com sucesso.");
  }
});

/*
  O método serialize garante que os comandos SQL serão executados em ordem.
  Aqui criamos a tabela "apostadores" apenas se ela ainda não existir.
  
  Estrutura da tabela:
  - id: identificador único do apostador
  - nome: nome do apostador
  - idade: idade do apostador
  - chave_pix: chave Pix do apostador
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