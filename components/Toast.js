import styles from "../styles/Home.module.css";

export default function Toast({ mensagem }) {
  if (!mensagem) return null;

  const classe = mensagem.tipo === "ok" ? styles.toastOk : styles.toastErro;

  return <div className={`${styles.toast} ${classe}`}>{mensagem.texto}</div>;
}
