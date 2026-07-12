import styles from "../styles/Home.module.css";
import { IconFechar } from "./icons";

export default function Sheet({ titulo, aoFechar, children }) {
  return (
    <div className={styles.overlay} onClick={aoFechar}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.sheetHandle} />
        <div className={styles.sheetHeader}>
          <p className={styles.sheetTitulo}>{titulo}</p>
          <button className={styles.sheetClose} onClick={aoFechar} aria-label="Fechar">
            <IconFechar size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
