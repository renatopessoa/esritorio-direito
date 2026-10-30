// Consulta processual via Jusbrasil. O Jusbrasil não tem API pública gratuita,
// então a consulta abre a busca do site em nova aba. Se a URL de busca mudar,
// basta ajustar JUSBRASIL_BUSCA_URL.

export const JUSBRASIL_BUSCA_URL = 'https://www.jusbrasil.com.br/busca';

export type TipoConsulta = 'numero' | 'documento' | 'nome';

export function jusbrasilUrl(termo: string): string {
  return `${JUSBRASIL_BUSCA_URL}?q=${encodeURIComponent(termo.trim())}`;
}

export function abrirNoJusbrasil(termo: string) {
  window.open(jusbrasilUrl(termo), '_blank', 'noopener,noreferrer');
}

const digitos = (value: string) => value.replace(/\D/g, '');

// --- Número único CNJ (Resolução CNJ nº 65/2008): NNNNNNN-DD.AAAA.J.TR.OOOO ---

/** Resto da divisão por 97 de um número com muitos dígitos (sem perder precisão). */
function mod97(numero: string): number {
  return numero.split('').reduce((resto, d) => (resto * 10 + Number(d)) % 97, 0);
}

export function formatarCNJ(value: string): string {
  const d = digitos(value).slice(0, 20);
  return d
    .replace(/^(\d{7})(\d)/, '$1-$2')
    .replace(/^(\d{7}-\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{7}-\d{2}\.\d{4})(\d)/, '$1.$2')
    .replace(/^(\d{7}-\d{2}\.\d{4}\.\d)(\d)/, '$1.$2')
    .replace(/^(\d{7}-\d{2}\.\d{4}\.\d\.\d{2})(\d)/, '$1.$2');
}

/** Valida os dígitos verificadores (módulo 97, ISO 7064). */
export function cnjValido(value: string): boolean {
  const d = digitos(value);
  if (d.length !== 20) return false;
  const sequencial = d.slice(0, 7);
  const dv = Number(d.slice(7, 9));
  const resto = d.slice(9); // AAAA J TR OOOO
  return 98 - mod97(sequencial + resto + '00') === dv;
}

const SEGMENTOS: Record<string, string> = {
  '1': 'Supremo Tribunal Federal',
  '2': 'Conselho Nacional de Justiça',
  '3': 'Superior Tribunal de Justiça',
  '4': 'Justiça Federal',
  '5': 'Justiça do Trabalho',
  '6': 'Justiça Eleitoral',
  '7': 'Justiça Militar da União',
  '8': 'Justiça Estadual',
  '9': 'Justiça Militar Estadual',
};

// Código TR da Justiça Estadual (J = 8)
const TRIBUNAIS_ESTADUAIS: Record<string, string> = {
  '01': 'TJAC', '02': 'TJAL', '03': 'TJAP', '04': 'TJAM', '05': 'TJBA', '06': 'TJCE', '07': 'TJDFT',
  '08': 'TJES', '09': 'TJGO', '10': 'TJMA', '11': 'TJMT', '12': 'TJMS', '13': 'TJMG', '14': 'TJPA',
  '15': 'TJPB', '16': 'TJPR', '17': 'TJPE', '18': 'TJPI', '19': 'TJRJ', '20': 'TJRN', '21': 'TJRS',
  '22': 'TJRO', '23': 'TJRR', '24': 'TJSC', '25': 'TJSE', '26': 'TJSP', '27': 'TJTO',
};

export interface InfoCNJ {
  ano: string;
  segmento: string;
  tribunal: string;
  origem: string;
}

export function decodificarCNJ(value: string): InfoCNJ | null {
  const d = digitos(value);
  if (d.length !== 20) return null;
  const ano = d.slice(9, 13);
  const j = d.slice(13, 14);
  const tr = d.slice(14, 16);
  const origem = d.slice(16, 20);

  let tribunal = `Tribunal ${tr}`;
  if (j === '8') tribunal = TRIBUNAIS_ESTADUAIS[tr] ?? tribunal;
  else if (j === '4') tribunal = `TRF${Number(tr)}`;
  else if (j === '5') tribunal = tr === '00' ? 'TST' : `TRT${Number(tr)}`;
  else if (j === '6') tribunal = tr === '00' ? 'TSE' : `TRE (${tr})`;
  else if (['1', '2', '3'].includes(j)) tribunal = SEGMENTOS[j];

  return { ano, segmento: SEGMENTOS[j] ?? 'Segmento desconhecido', tribunal, origem };
}

// --- CPF / CNPJ ---

export function cpfValido(value: string): boolean {
  const d = digitos(value);
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
  const dv = (base: string, pesoInicial: number) => {
    const soma = base.split('').reduce((acc, n, i) => acc + Number(n) * (pesoInicial - i), 0);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return dv(d.slice(0, 9), 10) === Number(d[9]) && dv(d.slice(0, 10), 11) === Number(d[10]);
}

export function cnpjValido(value: string): boolean {
  const d = digitos(value);
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
  const dv = (base: string) => {
    const pesos = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const soma = base.split('').reduce((acc, n, i) => acc + Number(n) * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  return dv(d.slice(0, 12)) === Number(d[12]) && dv(d.slice(0, 13)) === Number(d[13]);
}

/** Identifica o tipo do termo digitado pelo formato. */
export function detectarTipo(termo: string): TipoConsulta {
  const d = digitos(termo);
  if (/[a-zA-ZÀ-ÿ]/.test(termo) || !d) return 'nome';
  if (d.length === 11 || d.length === 14) return 'documento';
  return 'numero';
}
