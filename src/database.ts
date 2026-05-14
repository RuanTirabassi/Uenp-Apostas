import { sql } from "@vercel/postgres";

// Detecta se estamos na Vercel ou se temos a URL do Postgres
const hasPostgres = !!process.env.POSTGRES_URL || !!process.env.DATABASE_URL;

export async function initDatabase() {
  console.log("Iniciando verificação do banco de dados...");
  
  if (hasPostgres) {
    console.log("Ambiente com Postgres detectado. Tentando criar tabela...");
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS apostadores (
          id SERIAL PRIMARY KEY,
          nome TEXT NOT NULL,
          idade INTEGER NOT NULL,
          chave_pix TEXT NOT NULL
        );
      `;
      console.log("✅ Tabela Postgres pronta.");
    } catch (error: any) {
      console.error("❌ Erro fatal ao conectar no Postgres da Neon:");
      console.error("Mensagem:", error.message);
      // Não lançamos o erro aqui para não travar o servidor inteiro se o banco estiver instável,
      // mas o log nos dirá o que houve.
    }
  } else {
    console.log("⚠️ Nenhuma URL de Postgres encontrada. O app pode falhar ao realizar queries.");
  }
}

export { sql };