import { getDb, initDb } from "../../../lib/db";

export default async function handler(req, res) {
  await initDb();
  const sql = getDb();

  if (req.method === "DELETE") {
    const { id } = req.query;
    await sql`DELETE FROM registros WHERE id = ${id}`;
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Metodo nao permitido" });
}