import { getDb, initDb } from "../../lib/db";

export default async function handler(req, res) {
  await initDb();
  const sql = getDb();

  const porPessoa = await sql`
    SELECT pessoa, COUNT(*) as total
    FROM registros
    GROUP BY pessoa
    ORDER BY total DESC
  `;

  const porTarefa = await sql`
    SELECT tarefa, pessoa, COUNT(*) as total
    FROM registros
    GROUP BY tarefa, pessoa
    ORDER BY tarefa, total DESC
  `;

  const ultimosPorTarefa = await sql`
    SELECT DISTINCT ON (tarefa) tarefa, pessoa, data
    FROM registros
    ORDER BY tarefa, data DESC
  `;

  return res.status(200).json({ porPessoa, porTarefa, ultimosPorTarefa });
}
