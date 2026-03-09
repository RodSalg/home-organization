import { getDb, initDb } from "../../lib/db";

export default async function handler(req, res) {
  await initDb();
  const sql = getDb();

  if (req.method === "GET") {
    const registros = await sql`
      SELECT * FROM registros ORDER BY data DESC, criado_em DESC
    `;
    return res.status(200).json(registros);
  }

  if (req.method === "POST") {
    const { pessoa, tarefa, data } = req.body;

    if (!pessoa || !tarefa || !data) {
      return res.status(400).json({ error: "Campos obrigatorios ausentes" });
    }

    const [novo] = await sql`
      INSERT INTO registros (pessoa, tarefa, data)
      VALUES (${pessoa}, ${tarefa}, ${data})
      RETURNING *
    `;
    return res.status(201).json(novo);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    await sql`DELETE FROM registros WHERE id = ${id}`;
    return res.status(200).json({ ok: true });
  }

  res.status(405).json({ error: "Metodo nao permitido" });
}
