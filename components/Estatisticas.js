import styles from "../styles/Home.module.css";
import { TAREFAS, CORES } from "../lib/constants";
import { formatarData, calcularProximo } from "../lib/format";

export default function Estatisticas({ registros, stats }) {
  const maxTotal = stats.porPessoa.length > 0 ? Math.max(...stats.porPessoa.map((p) => Number(p.total))) : 1;
  const proximosPorTarefa = TAREFAS.map((t) => ({ tarefa: t, ...calcularProximo(registros, t) }));

  return (
    <>
      <div className={styles.card}>
        <p className={styles.cardTitulo}>Proxima por tarefa</p>
        {proximosPorTarefa.map((item) => (
          <div key={item.tarefa} className={styles.proximoLinha}>
            <div>
              <p className={styles.proximoTarefa}>{item.tarefa}</p>
              <p className={styles.proximoMotivo}>porque {item.motivo}</p>
            </div>
            <span className={styles.pilula} style={{ background: CORES[item.pessoa] || "#eee" }}>{item.pessoa}</span>
          </div>
        ))}
      </div>

      <div className={styles.card}>
        <p className={styles.cardTitulo}>Total por pessoa</p>
        <div className={styles.barras}>
          {stats.porPessoa.map((p) => (
            <div key={p.pessoa}>
              <div className={styles.barraLabel}>
                <span>{p.pessoa}</span>
                <span className={styles.barraNum}>{p.total}x</span>
              </div>
              <div className={styles.barraFundo}>
                <div
                  className={styles.barraPreenchimento}
                  style={{ width: `${(Number(p.total) / maxTotal) * 100}%`, background: CORES[p.pessoa] || "#ccc" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.cardTitulo}>Ultimos 30 dias</p>
        {stats.ultimosPorTarefa.length === 0 ? (
          <p className={styles.vazio}>Nenhum registro neste periodo.</p>
        ) : (
          stats.ultimosPorTarefa.map((r, i) => (
            <div key={i} className={styles.recente}>
              <span className={styles.recenteTarefa}>{r.tarefa}</span>
              <div className={styles.recenteDir}>
                <span className={styles.tabelaPilula} style={{ background: CORES[r.pessoa] || "#eee" }}>{r.pessoa}</span>
                <span className={styles.proximoMotivo}>{formatarData(r.data)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.card}>
        <p className={styles.cardTitulo}>Por tarefa</p>
        {TAREFAS.map((t) => {
          const dados = stats.porTarefa.filter((x) => x.tarefa === t);
          if (dados.length === 0) return null;

          return (
            <div key={t} className={styles.grupoTarefa}>
              <p className={styles.grupoTarefaNome}>{t}</p>
              <div className={styles.grupoTarefaPessoas}>
                {dados.map((d) => (
                  <span key={d.pessoa} className={styles.tabelaPilula} style={{ background: CORES[d.pessoa] || "#eee" }}>
                    {d.pessoa} ({d.total}x)
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
