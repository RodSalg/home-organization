import { getDb, initDb } from "../../../lib/db";

export default async function handler(req, res) {
  await initDb();
  const sql = getDb();

  if (req.method === "PUT") {
    const { id } = req.query;
    const { pessoa, tarefa, data } = req.body;

    if (!pessoa || !tarefa || !data) {
      return res.status(400).json({ error: "Campos obrigatorios ausentes" });
    }

    const [atualizado] = await sql`
      UPDATE registros
      SET pessoa = ${pessoa}, tarefa = ${tarefa}, data = ${data}
      WHERE id = ${id}
      RETURNING *
    `;

    if (!atualizado) return res.status(404).json({ error: "Registro nao encontrado" });
    return res.status(200).json(atualizado);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;

    const [registro] = await sql`SELECT * FROM registros WHERE id = ${id}`;
    if (!registro) return res.status(404).json({ error: "Registro nao encontrado" });

    await sql`
      INSERT INTO registros_deletados (registro_id, pessoa, tarefa, data, criado_em)
      VALUES (${registro.id}, ${registro.pessoa}, ${registro.tarefa}, ${registro.data}, ${registro.criado_em})
    `;

    await sql`DELETE FROM registros WHERE id = ${id}`;
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Metodo nao permitido" });
}