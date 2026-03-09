import { useState, useEffect } from "react";
import Head from "next/head";

const PESSOAS = ["Ane", "Gabriele", "Duda", "Nida"];
const TAREFAS = ["Almoco de domingo", "Limpar fogao", "Limpar area externa", "Limpar casa papai"];
const CORES = { Ane: "#e8b4b8", Gabriele: "#b4d4e8", Duda: "#b4e8c4", Nida: "#e8ddb4" };

export default function Home() {
  const [pessoa, setPessoa] = useState("");
  const [tarefa, setTarefa] = useState("");
  const [data, setData] = useState("");
  const [registros, setRegistros] = useState([]);
  const [stats, setStats] = useState(null);
  const [aba, setAba] = useState("registrar");
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => { carregarRegistros(); carregarStats(); }, []);

  async function carregarRegistros() {
    const res = await fetch("/api/registros");
    const data = await res.json();
    setRegistros(data);
  }

  async function carregarStats() {
    const res = await fetch("/api/stats");
    const data = await res.json();
    setStats(data);
  }

  async function salvar() {
    if (!pessoa || !tarefa || !data) {
      setMensagem({ tipo: "erro", texto: "Preencha todos os campos." });
      return;
    }
    setSalvando(true);
    const res = await fetch("/api/registros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pessoa, tarefa, data }),
    });
    setSalvando(false);
    if (res.ok) {
      setMensagem({ tipo: "ok", texto: "Registrado com sucesso!" });
      setPessoa(""); setTarefa(""); setData("");
      carregarRegistros();
      carregarStats();
      setTimeout(() => setMensagem(null), 3000);
    }
  }

  async function deletar(id) {
    await fetch(`/api/registros/${id}`, { method: "DELETE" });
    carregarRegistros();
    carregarStats();
  }

  function formatarData(d) {
    if (!d) return "";
    const partes = d.split("T")[0].split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  const maxTotal = stats?.porPessoa?.length > 0 ? Math.max(...stats.porPessoa.map((p) => Number(p.total))) : 1;

  return (
    <>
      <Head>
        <title>Organizacao da Casa</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #faf8f5; color: #2a2a2a; min-height: 100vh; }
        h1 { font-family: 'DM Serif Display', serif; font-weight: 400; }
      `}</style>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 20px" }}>

        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <p style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#999", marginBottom: 8 }}>organizacao</p>
          <h1 style={{ fontSize: 36, color: "#1a1a1a", lineHeight: 1.1 }}>Tarefas da Casa</h1>
          <div style={{ width: 40, height: 2, background: "#d4a896", margin: "16px auto 0" }} />
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 32, background: "#ede9e3", borderRadius: 10, padding: 4 }}>
          {["registrar", "historico", "estatisticas"].map((a) => (
            <button key={a} onClick={() => setAba(a)} style={{
              flex: 1, padding: "10px 0", border: "none", borderRadius: 8, cursor: "pointer",
              fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, letterSpacing: 0.5,
              textTransform: "capitalize", background: aba === a ? "#fff" : "transparent",
              color: aba === a ? "#1a1a1a" : "#888",
              boxShadow: aba === a ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s",
            }}>{a}</button>
          ))}
        </div>

        {aba === "registrar" && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 2px 20px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#bbb", marginBottom: 24 }}>novo registro</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              <div>
                <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6, letterSpacing: 0.5 }}>Quem fez</label>
                <select value={pessoa} onChange={(e) => setPessoa(e.target.value)} style={{
                  width: "100%", padding: "12px 16px", border: `1.5px solid ${pessoa ? CORES[pessoa] : "#ede9e3"}`,
                  borderRadius: 10, fontSize: 15, fontFamily: "'DM Sans', sans-serif",
                  background: "#faf8f5", color: pessoa ? "#1a1a1a" : "#aaa", outline: "none", cursor: "pointer",
                }}>
                  <option value="">Selecione...</option>
                  {PESSOAS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6, letterSpacing: 0.5 }}>Tarefa</label>
                <select value={tarefa} onChange={(e) => setTarefa(e.target.value)} style={{
                  width: "100%", padding: "12px 16px", border: "1.5px solid #ede9e3",
                  borderRadius: 10, fontSize: 15, fontFamily: "'DM Sans', sans-serif",
                  background: "#faf8f5", color: tarefa ? "#1a1a1a" : "#aaa", outline: "none", cursor: "pointer",
                }}>
                  <option value="">Selecione...</option>
                  {TAREFAS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6, letterSpacing: 0.5 }}>Data</label>
                <input type="date" value={data} onChange={(e) => setData(e.target.value)} style={{
                  width: "100%", padding: "12px 16px", border: "1.5px solid #ede9e3",
                  borderRadius: 10, fontSize: 15, fontFamily: "'DM Sans', sans-serif",
                  background: "#faf8f5", color: "#1a1a1a", outline: "none",
                }} />
              </div>

              {mensagem && (
                <div style={{
                  padding: "12px 16px", borderRadius: 10, fontSize: 13,
                  background: mensagem.tipo === "ok" ? "#e8f5e9" : "#fdecea",
                  color: mensagem.tipo === "ok" ? "#2e7d32" : "#c62828",
                }}>{mensagem.texto}</div>
              )}

              <button onClick={salvar} disabled={salvando} style={{
                padding: "14px", background: "#2a2a2a", color: "#fff", border: "none", borderRadius: 10,
                fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: salvando ? "not-allowed" : "pointer",
                opacity: salvando ? 0.7 : 1, letterSpacing: 0.5, transition: "opacity 0.2s",
              }}>{salvando ? "Salvando..." : "Registrar"}</button>

            </div>
          </div>
        )}

        {aba === "historico" && (
          <div>
            {registros.length === 0 ? (
              <div style={{ textAlign: "center", color: "#bbb", padding: 60, fontSize: 14 }}>Nenhum registro ainda.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {registros.map((r) => (
                  <div key={r.id} style={{
                    background: "#fff", borderRadius: 12, padding: "16px 20px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    boxShadow: "0 1px 8px rgba(0,0,0,0.04)", borderLeft: `4px solid ${CORES[r.pessoa] || "#ddd"}`,
                  }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, padding: "3px 10px", background: CORES[r.pessoa] || "#eee", borderRadius: 20, color: "#444" }}>{r.pessoa}</span>
                        <span style={{ fontSize: 12, color: "#bbb" }}>{formatarData(r.data)}</span>
                      </div>
                      <p style={{ fontSize: 14, color: "#444" }}>{r.tarefa}</p>
                    </div>
                    <button onClick={() => deletar(r.id)} style={{
                      background: "none", border: "none", color: "#ddd", cursor: "pointer",
                      fontSize: 18, padding: "4px 8px", borderRadius: 6, transition: "color 0.2s",
                    }}
                      onMouseEnter={(e) => (e.target.style.color = "#e57373")}
                      onMouseLeave={(e) => (e.target.style.color = "#ddd")}>x</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {aba === "estatisticas" && stats && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 20px rgba(0,0,0,0.05)" }}>
              <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#bbb", marginBottom: 20 }}>total por pessoa</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {stats.porPessoa.map((p) => (
                  <div key={p.pessoa}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{p.pessoa}</span>
                      <span style={{ fontSize: 14, color: "#888" }}>{p.total}x</span>
                    </div>
                    <div style={{ height: 8, background: "#f0ece6", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 4,
                        width: `${(Number(p.total) / maxTotal) * 100}%`,
                        background: CORES[p.pessoa] || "#ccc", transition: "width 0.6s ease",
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 20px rgba(0,0,0,0.05)" }}>
              <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#bbb", marginBottom: 20 }}>ultimos 30 dias</p>
              {stats.ultimaMes.length === 0 ? (
                <p style={{ fontSize: 14, color: "#bbb" }}>Nenhum registro neste periodo.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {stats.ultimaMes.map((r, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "8px 0", borderBottom: "1px solid #f5f2ee" }}>
                      <span style={{ color: "#444" }}>{r.tarefa}</span>
                      <div style={{ display: "flex", gap: 12 }}>
                        <span style={{ fontSize: 12, padding: "2px 10px", borderRadius: 20, background: CORES[r.pessoa] || "#eee", color: "#444" }}>{r.pessoa}</span>
                        <span style={{ color: "#bbb", fontSize: 12 }}>{formatarData(r.data)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 20px rgba(0,0,0,0.05)" }}>
              <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#bbb", marginBottom: 20 }}>por tarefa</p>
              {TAREFAS.map((t) => {
                const dados = stats.porTarefa.filter((x) => x.tarefa === t);
                if (dados.length === 0) return null;
                return (
                  <div key={t} style={{ marginBottom: 20 }}>
                    <p style={{ fontSize: 13, color: "#888", marginBottom: 10 }}>{t}</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {dados.map((d) => (
                        <div key={d.pessoa} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 13, background: CORES[d.pessoa] || "#eee", color: "#444" }}>
                          {d.pessoa} ({d.total}x)
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </div>
    </>
  );
}
