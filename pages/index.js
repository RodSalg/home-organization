import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import TabBar from "../components/TabBar";
import Toast from "../components/Toast";
import RegistroSheet from "../components/RegistroSheet";
import ConfirmSheet from "../components/ConfirmSheet";
import HistoricoList from "../components/HistoricoList";
import Estatisticas from "../components/Estatisticas";

export default function Home() {
  const [aba, setAba] = useState("historico");
  const [registros, setRegistros] = useState([]);
  const [stats, setStats] = useState(null);
  const [mensagem, setMensagem] = useState(null);
  const [sheetRegistro, setSheetRegistro] = useState(null);
  const [sheetAberta, setSheetAberta] = useState(false);
  const [confirmacao, setConfirmacao] = useState(null);

  useEffect(() => { carregarRegistros(); carregarStats(); }, []);

  async function carregarRegistros() {
    const res = await fetch("/api/registros");
    const dados = await res.json();
    setRegistros(dados);
  }

  async function carregarStats() {
    const res = await fetch("/api/stats");
    const dados = await res.json();
    setStats(dados);
  }

  function mostrarMensagem(tipo, texto) {
    setMensagem({ tipo, texto });
    setTimeout(() => setMensagem(null), 2600);
  }

  function abrirNovoRegistro() {
    setSheetRegistro(null);
    setSheetAberta(true);
  }

  function abrirEdicaoRegistro(registro) {
    setSheetRegistro(registro);
    setSheetAberta(true);
  }

  function fecharSheetRegistro() {
    setSheetAberta(false);
    setSheetRegistro(null);
  }

  async function salvarRegistro({ id, pessoa, tarefa, data }) {
    const url = id ? `/api/registros/${id}` : "/api/registros";
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pessoa, tarefa, data }),
    });

    if (res.ok) {
      fecharSheetRegistro();
      mostrarMensagem("ok", id ? "Registro atualizado!" : "Registrado com sucesso!");
      carregarRegistros();
      carregarStats();
    } else {
      mostrarMensagem("erro", "Nao foi possivel salvar o registro.");
    }
  }

  async function confirmarExclusao() {
    await fetch(`/api/registros/${confirmacao.id}`, { method: "DELETE" });
    setConfirmacao(null);
    mostrarMensagem("ok", "Registro excluido.");
    carregarRegistros();
    carregarStats();
  }

  return (
    <>
      <Head>
        <title>Organizacao da Casa</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <div className={styles.page}>
        <Header />

        <main className={styles.main}>
          {aba === "historico" && (
            <HistoricoList registros={registros} aoEditar={abrirEdicaoRegistro} aoExcluir={setConfirmacao} />
          )}

          {aba === "estatisticas" && stats && (
            <Estatisticas registros={registros} stats={stats} />
          )}
        </main>

        <TabBar aba={aba} aoTrocarAba={setAba} aoAbrirNovo={abrirNovoRegistro} />

        <Toast mensagem={mensagem} />

        {sheetAberta && (
          <RegistroSheet registro={sheetRegistro} aoFechar={fecharSheetRegistro} aoSalvar={salvarRegistro} />
        )}

        {confirmacao && (
          <ConfirmSheet registro={confirmacao} aoFechar={() => setConfirmacao(null)} aoConfirmar={confirmarExclusao} />
        )}
      </div>
    </>
  );
}
