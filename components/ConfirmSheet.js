import styles from "../styles/Home.module.css";
import Sheet from "./Sheet";
import { CORES } from "../lib/constants";
import { formatarData } from "../lib/format";

export default function ConfirmSheet({ registro, aoFechar, aoConfirmar }) {
  return (
    <Sheet titulo="Confirmar exclusao" aoFechar={aoFechar}>
      <p className={styles.sheetTexto}>Tem certeza que deseja apagar este registro?</p>

      <div className={styles.sheetResumo} style={{ borderLeft: `4px solid ${CORES[registro.pessoa] || "#ddd"}` }}>
        <span className={styles.pilula} style={{ background: CORES[registro.pessoa] || "#eee" }}>{registro.pessoa}</span>
        <p className={styles.sheetResumoTarefa}>{registro.tarefa}</p>
        <p className={styles.sheetResumoData}>{formatarData(registro.data)}</p>
      </div>

      <div className={styles.sheetBotoes}>
        <button className={styles.btnSecundario} onClick={aoFechar}>Cancelar</button>
        <button className={styles.btnPerigo} onClick={aoConfirmar}>Apagar</button>
      </div>
    </Sheet>
  );
}
