import { DIAS, ORDEM_CIRCULAR } from "./constants";

export function formatarData(d) {
  if (!d) return "";
  const partes = d.split("T")[0].split("-");
  const date = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
  const diaSemana = DIAS[date.getDay()];
  return `${diaSemana}, ${partes[2]}/${partes[1]}/${partes[0]}`;
}

export function dataDeHoje() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export function calcularProximo(registros, tarefa) {
  const totaisPorPessoa = ORDEM_CIRCULAR.map((p) => ({
    pessoa: p,
    total: registros.filter((r) => r.tarefa === tarefa && r.pessoa === p).length,
  }));

  const minTotal = Math.min(...totaisPorPessoa.map((p) => p.total));
  const comMenos = totaisPorPessoa.filter((p) => p.total === minTotal);

  if (comMenos.length === ORDEM_CIRCULAR.length) {
    const ultimaFeita = registros
      .filter((r) => r.tarefa === tarefa)
      .sort((a, b) => new Date(b.data) - new Date(a.data))[0];

    if (!ultimaFeita) return { pessoa: ORDEM_CIRCULAR[0], motivo: "seguindo a ordem circular, nenhuma feita ainda" };

    const idxUltima = ORDEM_CIRCULAR.indexOf(ultimaFeita.pessoa);
    const proxima = ORDEM_CIRCULAR[(idxUltima + 1) % ORDEM_CIRCULAR.length];
    return { pessoa: proxima, motivo: `seguindo a ordem circular, ultima foi ${ultimaFeita.pessoa}` };
  }

  if (comMenos.length === 1) {
    return { pessoa: comMenos[0].pessoa, motivo: `fez menos vezes (${comMenos[0].total}x)` };
  }

  const proximaNaOrdem = ORDEM_CIRCULAR.find((p) => comMenos.some((c) => c.pessoa === p));
  return { pessoa: proximaNaOrdem, motivo: `empatada com menos vezes (${minTotal}x), seguindo a ordem circular` };
}
