// Regras previdenciárias (INSS / EC 103/2019) organizadas por ano.
// Para um novo ano basta incluir a tabela em INSS_TABELAS com os valores da
// Portaria Interministerial MPS/MF publicada em janeiro.

export type Genero = 'masculino' | 'feminino';

interface TabelaINSS {
  salarioMinimo: number;
  // Limite superior de cada faixa; a última é o teto do INSS
  faixas: { ate: number; aliquota: number }[];
}

export const INSS_TABELAS: Record<number, TabelaINSS> = {
  // Portaria Interministerial MPS/MF nº 6/2025
  2025: {
    salarioMinimo: 1518.0,
    faixas: [
      { ate: 1518.0, aliquota: 0.075 },
      { ate: 2793.88, aliquota: 0.09 },
      { ate: 4190.83, aliquota: 0.12 },
      { ate: 8157.41, aliquota: 0.14 },
    ],
  },
  // Portaria Interministerial MPS/MF nº 13/2026
  2026: {
    salarioMinimo: 1621.0,
    faixas: [
      { ate: 1621.0, aliquota: 0.075 },
      { ate: 2902.84, aliquota: 0.09 },
      { ate: 4354.27, aliquota: 0.12 },
      { ate: 8475.55, aliquota: 0.14 },
    ],
  },
};

export const ANOS_DISPONIVEIS = Object.keys(INSS_TABELAS).map(Number).sort((a, b) => a - b);

/** Ano vigente, ou o mais recente cadastrado se a tabela do ano ainda não foi incluída. */
export function anoVigente(): number {
  const atual = new Date().getFullYear();
  return INSS_TABELAS[atual] ? atual : ANOS_DISPONIVEIS[ANOS_DISPONIVEIS.length - 1];
}

export const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function tetoINSS(ano: number): number {
  const { faixas } = INSS_TABELAS[ano];
  return faixas[faixas.length - 1].ate;
}

export function salarioMinimo(ano: number): number {
  return INSS_TABELAS[ano].salarioMinimo;
}

export interface FaixaINSS {
  min: number;
  max: number;
  aliquota: number;
  /** Parcela a deduzir equivalente ao cálculo progressivo */
  deducao: number;
}

/** Faixas com a parcela a deduzir derivada do cálculo progressivo. */
export function faixasINSS(ano: number): FaixaINSS[] {
  let deducao = 0;
  let anterior = 0;
  let aliquotaAnterior = 0;
  return INSS_TABELAS[ano].faixas.map(({ ate, aliquota }) => {
    deducao += anterior * (aliquota - aliquotaAnterior);
    const faixa = { min: anterior === 0 ? 0 : round2(anterior + 0.01), max: ate, aliquota, deducao: round2(deducao) };
    anterior = ate;
    aliquotaAnterior = aliquota;
    return faixa;
  });
}

export interface ResultadoINSS {
  salario: number;
  baseCalculo: number; // salário limitado ao teto
  acimaDoTeto: boolean;
  faixa: FaixaINSS;
  aliquotaEfetiva: number; // em %
  inss: number;
}

/** Contribuição do segurado empregado com alíquotas progressivas (art. 28 da EC 103/2019). */
export function calcularINSS(salario: number, ano: number): ResultadoINSS {
  const teto = tetoINSS(ano);
  const baseCalculo = Math.min(salario, teto);

  let inss = 0;
  let anterior = 0;
  for (const { ate, aliquota } of INSS_TABELAS[ano].faixas) {
    if (baseCalculo <= anterior) break;
    inss += (Math.min(baseCalculo, ate) - anterior) * aliquota;
    anterior = ate;
  }
  inss = round2(inss);

  const faixas = faixasINSS(ano);
  const faixa = faixas.find((f) => baseCalculo <= f.max) ?? faixas[faixas.length - 1];

  return {
    salario,
    baseCalculo,
    acimaDoTeto: salario > teto,
    faixa,
    aliquotaEfetiva: salario > 0 ? round2((inss / salario) * 100) : 0,
    inss,
  };
}

/**
 * Converte valor digitado em reais: "3000", "3000,50", "3.000,50", "3000.50", "R$ 3.000".
 * Retorna NaN se não houver número.
 */
export function parseValorBR(input: string): number {
  const limpo = input.replace(/[^\d.,]/g, '');
  if (!/\d/.test(limpo)) return NaN;

  if (limpo.includes(',')) {
    // vírgula é o separador decimal; pontos são de milhar
    return Number(limpo.replace(/\./g, '').replace(',', '.'));
  }
  const partes = limpo.split('.');
  if (partes.length > 1 && partes.slice(1).every((p) => p.length === 3)) {
    return Number(partes.join('')); // "3.000" ou "1.234.567"
  }
  // ponto como decimal: mantém só o último
  const ultimo = limpo.lastIndexOf('.');
  return ultimo === -1
    ? Number(limpo)
    : Number(limpo.slice(0, ultimo).replace(/\./g, '') + '.' + limpo.slice(ultimo + 1));
}

// --- Regras de transição da EC 103/2019 -------------------------------------
// Os requisitos progressivos sobem a cada 1º de janeiro a partir de 2020.

const anosDesde2019 = (ano: number) => Math.max(0, ano - 2019);

/** Art. 15: pontos (idade + tempo de contribuição), +1 por ano. */
export function pontosMinimos(ano: number, genero: Genero, professor = false): number {
  const n = anosDesde2019(ano);
  if (professor) return genero === 'feminino' ? Math.min(81 + n, 92) : Math.min(91 + n, 100);
  return genero === 'feminino' ? Math.min(86 + n, 100) : Math.min(96 + n, 105);
}

/** Art. 16: idade mínima progressiva, +6 meses por ano. */
export function idadeMinimaProgressiva(ano: number, genero: Genero, professor = false): number {
  const n = anosDesde2019(ano) * 0.5;
  if (professor) return genero === 'feminino' ? Math.min(51 + n, 57) : Math.min(56 + n, 60);
  return genero === 'feminino' ? Math.min(56 + n, 62) : Math.min(61 + n, 65);
}

/**
 * Coeficiente do benefício (art. 26 da EC 103/2019): 60% + 2% por ano que exceder
 * 15 anos (mulher) ou 20 anos (homem). Não há limite de 100%.
 */
export function coeficienteBeneficio(tempoContribuicaoAnos: number, genero: Genero): number {
  const carencia = genero === 'feminino' ? 15 : 20;
  return 60 + Math.max(0, Math.floor(tempoContribuicaoAnos) - carencia) * 2;
}

/** Benefício limitado ao piso (salário mínimo) e ao teto do INSS. */
export function limitarBeneficio(valor: number, ano: number): number {
  return round2(Math.min(Math.max(valor, salarioMinimo(ano)), tetoINSS(ano)));
}

/** Formata anos decimais como "64 anos e 6 meses". */
export function formatarAnos(anos: number): string {
  const inteiros = Math.floor(anos + 1e-9);
  const meses = Math.round((anos - inteiros) * 12);
  const a = `${inteiros} ${inteiros === 1 ? 'ano' : 'anos'}`;
  return meses ? `${a} e ${meses} ${meses === 1 ? 'mês' : 'meses'}` : a;
}
