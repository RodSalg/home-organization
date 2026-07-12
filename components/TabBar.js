import styles from "../styles/Home.module.css";
import { IconHistorico, IconEstatisticas, IconPlus } from "./icons";

const ABAS = [
  { chave: "historico", rotulo: "Historico", Icone: IconHistorico },
  { chave: "estatisticas", rotulo: "Estatisticas", Icone: IconEstatisticas },
];

export default function TabBar({ aba, aoTrocarAba, aoAbrirNovo }) {
  return (
    <>
      <button className={styles.fab} onClick={aoAbrirNovo} aria-label="Novo registro">
        <IconPlus size={24} />
      </button>

      <nav className={styles.tabbar}>
        <div className={styles.tabbarInner}>
          {ABAS.map(({ chave, rotulo, Icone }) => (
            <button
              key={chave}
              onClick={() => aoTrocarAba(chave)}
              className={`${styles.tabBtn} ${aba === chave ? styles.tabBtnAtivo : ""}`}
            >
              <Icone size={20} />
              <span className={styles.tabLabel}>{rotulo}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
