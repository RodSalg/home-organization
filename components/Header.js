import styles from "../styles/Home.module.css";
import { PESSOAS, CORES } from "../lib/constants";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div>
          <p className={styles.eyebrow}>organizacao</p>
          <h1 className={styles.titulo}>Tarefas da Casa</h1>
        </div>
        <div className={styles.avatares}>
          {PESSOAS.map((p) => (
            <div key={p} className={styles.avatar} style={{ background: CORES[p] }} title={p}>
              {p.charAt(0)}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
