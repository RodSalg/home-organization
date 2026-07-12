import { useState } from "react";
import styles from "../styles/Home.module.css";
import { PESSOAS, TAREFAS, CORES } from "../lib/constants";
import { formatarData } from "../lib/format";
import { IconEditar, IconExcluir } from "./icons";

const POR_PAGINA = 8;

export default function HistoricoList({ registros, aoEditar, aoExcluir }) {
  const [filtroPessoa, setFiltroPessoa] = useState("");
  const [filtroTarefa, setFiltroTarefa] = useState("");
  const [pagina, setPagina] = useState(1);

  const registrosFiltrados = registros
    .filter((r) => (!filtroPessoa || r.pessoa === filtroPessoa) && (!filtroTarefa || r.tarefa === filtroTarefa))
    .sort((a, b) => new Date(b.data) - new Date(a.data));

  const totalPaginas = Math.max(1, Math.ceil(registrosFiltrados.length / POR_PAGINA));
  const registrosPagina = registrosFiltrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  function aplicarFiltroPessoa(valor) {
    setFiltroPessoa(valor);
    setPagina(1);
  }

  function aplicarFiltroTarefa(valor) {
    setFiltroTarefa(valor);
    setPagina(1);
  }

  return (
    <div className={styles.card}>
      <p className={styles.cardTitulo}>Historico</p>

      <div className={styles.filtros}>
        <select className={styles.selectPequeno} value={filtroPessoa} onChange={(e) => aplicarFiltroPessoa(e.target.value)}>
          <option value="">Todas as pessoas</option>
          {PESSOAS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select className={styles.selectPequeno} value={filtroTarefa} onChange={(e) => aplicarFiltroTarefa(e.target.value)}>
          <option value="">Todas as tarefas</option>
          {TAREFAS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {registrosFiltrados.length === 0 ? (
        <div className={styles.vazio}>Nenhum registro encontrado.</div>
      ) : (
        <>
          <p className={styles.contagem}>
            {registrosFiltrados.length} registro{registrosFiltrados.length !== 1 ? "s" : ""}
          </p>

          <div className={styles.lista}>
            {registrosPagina.map((r) => (
              <div key={r.id} className={styles.linha}>
                <div className={styles.linhaConteudo}>
                  <span className={styles.pilula} style={{ background: CORES[r.pessoa] || "#eee" }}>{r.pessoa}</span>
                  <p className={styles.linhaTarefa}>{r.tarefa}</p>
                  <p className={styles.linhaData}>{formatarData(r.data)}</p>
                </div>
                <div className={styles.acoes}>
                  <button className={`${styles.iconBtn} ${styles.iconBtnEditar}`} onClick={() => aoEditar(r)} aria-label="Editar">
                    <IconEditar size={17} />
                  </button>
                  <button className={`${styles.iconBtn} ${styles.iconBtnExcluir}`} onClick={() => aoExcluir(r)} aria-label="Excluir">
                    <IconExcluir size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className={styles.paginacao}>
              <button className={styles.paginaBtn} onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1}>
                anterior
              </button>
              <span className={styles.paginaInfo}>{pagina} de {totalPaginas}</span>
              <button className={styles.paginaBtn} onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}>
                proximo
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
