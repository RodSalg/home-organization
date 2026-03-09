import { neon } from "@neondatabase/serverless";

export function getDb() {
  return neon(process.env.DATABASE_URL);
}

export async function initDb() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS registros (
      id SERIAL PRIMARY KEY,
      pessoa TEXT NOT NULL,
      tarefa TEXT NOT NULL,
      data DATE NOT NULL,
      criado_em TIMESTAMP DEFAULT NOW()
    )
  `;
}
