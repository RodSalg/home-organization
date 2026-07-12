import { useState } from "react";
import styles from "../styles/Home.module.css";
import Sheet from "./Sheet";
import { PESSOAS, TAREFAS } from "../lib/constants";

export default function RegistroSheet({ registro, aoFechar, aoSalvar }) {
  const [pessoa, setPessoa] = useState(registro?.pessoa || "");
  const [tarefa, setTarefa] = useState(registro?.tarefa || "");
  const [data, setData] = useState(registro?.data ? registro.data.split("T")[0] : "");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const emEdicao = Boolean(registro);

  async function salvar() {
    if (!pessoa || !tarefa || !data) {
      setErro("Preencha todos os campos.");
      return;
    }

    setErro("");
    setSalvando(true);
    await aoSalvar({ id: registro?.id, pessoa, tarefa, data });
    setSalvando(false);
  }

  return (
    <Sheet titulo={emEdicao ? "Editar registro" : "Novo registro"} aoFechar={aoFechar}>
      <div className={styles.campo}>
        <label className={styles.label}>Quem fez</label>
        <select className={styles.select} value={pessoa} onChange={(e) => setPessoa(e.target.value)}>
          <option value="">Selecione...</option>
          {PESSOAS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className={styles.campo}>
        <label className={styles.label}>Tarefa</label>
        <select className={styles.select} value={tarefa} onChange={(e) => setTarefa(e.target.value)}>
          <option value="">Selecione...</option>
          {TAREFAS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className={styles.campo}>
        <label className={styles.label}>Data</label>
        <input className={styles.input} type="date" value={data} onChange={(e) => setData(e.target.value)} />
      </div>

      {erro && <div className={`${styles.mensagem} ${styles.mensagemErro}`}>{erro}</div>}

      <div className={styles.sheetBotoes}>
        <button className={styles.btnSecundario} onClick={aoFechar}>Cancelar</button>
        <button className={styles.btnPrimario} onClick={salvar} disabled={salvando}>
          {salvando ? "Salvando..." : emEdicao ? "Salvar alteracoes" : "Registrar"}
        </button>
      </div>
    </Sheet>
  );
}
