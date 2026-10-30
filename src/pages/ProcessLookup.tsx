import { useEffect, useState } from 'react';
import { ExternalLink, Search, History, FileText, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { processService } from '../services/processService';
import { getErrorMessage } from '../lib/axios';
import { maskCNPJ, maskCPF } from '../utils/masks';
import type { Process } from '../types/process';
import {
  abrirNoJusbrasil,
  cnjValido,
  cnpjValido,
  cpfValido,
  decodificarCNJ,
  detectarTipo,
  formatarCNJ,
  type TipoConsulta,
} from '../utils/jusbrasil';

const tipoLabels: Record<TipoConsulta, string> = {
  numero: 'Número do processo',
  documento: 'CPF / CNPJ',
  nome: 'Nome da parte',
};

const placeholders: Record<TipoConsulta, string> = {
  numero: '0000000-00.0000.0.00.0000',
  documento: '000.000.000-00 ou 00.000.000/0000-00',
  nome: 'Nome completo da parte',
};

interface ConsultaRecente {
  tipo: TipoConsulta;
  termo: string;
  data: string;
}

const HISTORICO_KEY = 'jusbrasilConsultasRecentes';

function lerHistorico(): ConsultaRecente[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORICO_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function mascarar(tipo: TipoConsulta, value: string) {
  if (tipo === 'numero') return formatarCNJ(value);
  if (tipo === 'documento') {
    const d = value.replace(/\D/g, '');
    return d.length <= 11 ? maskCPF(d) : maskCNPJ(d.slice(0, 14));
  }
  return value;
}

/** Retorna um aviso (não bloqueia a consulta) ou um erro (bloqueia). */
function validar(tipo: TipoConsulta, termo: string): { erro?: string; aviso?: string } {
  const d = termo.replace(/\D/g, '');
  if (tipo === 'numero') {
    if (d.length !== 20) return { erro: 'O número CNJ tem 20 dígitos.' };
    if (!cnjValido(d)) return { aviso: 'Os dígitos verificadores não conferem. Confira o número antes de consultar.' };
  }
  if (tipo === 'documento') {
    if (d.length === 11 && !cpfValido(d)) return { erro: 'CPF inválido.' };
    if (d.length === 14 && !cnpjValido(d)) return { erro: 'CNPJ inválido.' };
    if (d.length !== 11 && d.length !== 14) return { erro: 'Informe um CPF (11 dígitos) ou CNPJ (14 dígitos).' };
  }
  if (tipo === 'nome') {
    if (termo.trim().length < 3) return { erro: 'Informe ao menos 3 letras.' };
    if (!termo.trim().includes(' ')) return { aviso: 'Use o nome completo para reduzir resultados de homônimos.' };
  }
  return {};
}

export default function ProcessLookup() {
  const [tipo, setTipo] = useState<TipoConsulta>('numero');
  const [termo, setTermo] = useState('');
  const [tentou, setTentou] = useState(false);
  const [historico, setHistorico] = useState<ConsultaRecente[]>(lerHistorico);
  const [processos, setProcessos] = useState<Process[] | null>(null);

  useEffect(() => {
    processService
      .list({ status: 'ACTIVE' })
      .then(setProcessos)
      .catch((error) => {
        setProcessos([]);
        toast.error(getErrorMessage(error, 'Erro ao carregar processos do escritório'));
      });
  }, []);

  const { erro, aviso } = validar(tipo, termo);
  const info = tipo === 'numero' ? decodificarCNJ(termo) : null;

  const consultar = (t: TipoConsulta, valor: string) => {
    abrirNoJusbrasil(valor);
    const novo = [{ tipo: t, termo: valor, data: new Date().toISOString() }, ...historico.filter((h) => h.termo !== valor)].slice(0, 10);
    setHistorico(novo);
    try {
      localStorage.setItem(HISTORICO_KEY, JSON.stringify(novo));
    } catch {
      // histórico é só conveniência
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTentou(true);
    if (erro) return;
    consultar(tipo, termo.trim());
  };

  // Ao colar, detecta o tipo pelo formato (ex.: colar um número CNJ no campo de nome)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const colado = e.clipboardData.getData('text');
    const detectado = detectarTipo(colado);
    if (detectado !== tipo) {
      e.preventDefault();
      setTipo(detectado);
      setTermo(mascarar(detectado, colado));
    }
  };

  const limparHistorico = () => {
    setHistorico([]);
    try {
      localStorage.removeItem(HISTORICO_KEY);
    } catch {
      // ignora
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Consulta Processual</h1>
        <p className="text-gray-400 mt-1">A consulta é feita no Jusbrasil e abre em uma nova aba.</p>
      </div>

      <Card title="Nova consulta">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Consultar por">
            {(Object.keys(tipoLabels) as TipoConsulta[]).map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={tipo === t}
                onClick={() => {
                  setTipo(t);
                  setTermo('');
                  setTentou(false);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  tipo === t ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {tipoLabels[t]}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="input-dark w-full pl-10"
                placeholder={placeholders[tipo]}
                value={termo}
                onChange={(e) => setTermo(mascarar(tipo, e.target.value))}
                onPaste={handlePaste}
                inputMode={tipo === 'nome' ? 'text' : 'numeric'}
                aria-label={tipoLabels[tipo]}
                aria-invalid={tentou && !!erro}
              />
            </div>
            <Button type="submit">
              <ExternalLink className="w-4 h-4 mr-2" />
              Consultar no Jusbrasil
            </Button>
          </div>

          {tentou && erro && <p className="text-sm text-red-400">{erro}</p>}
          {!erro && aviso && (
            <p className="text-sm text-yellow-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {aviso}
            </p>
          )}

          {info && (
            <div className="glass-card rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Segmento</p>
                <p className="text-white">{info.segmento}</p>
              </div>
              <div>
                <p className="text-gray-400">Tribunal</p>
                <p className="text-white">{info.tribunal}</p>
              </div>
              <div>
                <p className="text-gray-400">Ano de ajuizamento</p>
                <p className="text-white">{info.ano}</p>
              </div>
              <div>
                <p className="text-gray-400">Unidade de origem</p>
                <p className="text-white flex items-center gap-1">
                  {info.origem}
                  {cnjValido(termo) && <CheckCircle2 className="w-4 h-4 text-green-400" aria-label="Número válido" />}
                </p>
              </div>
            </div>
          )}
        </form>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Processos ativos do escritório">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {processos === null && <p className="text-center py-4 text-gray-400">Carregando...</p>}
            {processos?.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-4 p-3 glass-card rounded-lg">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-5 h-5 text-blue-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-white truncate">{p.number}</p>
                    <p className="text-sm text-gray-400 truncate">{p.client.name} · {p.subject}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => consultar('numero', p.number)}>
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Jusbrasil
                </Button>
              </div>
            ))}
            {processos && processos.length === 0 && (
              <p className="text-center py-4 text-gray-400">Nenhum processo ativo cadastrado</p>
            )}
          </div>
        </Card>

        <Card
          title={
            <span className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Consultas recentes
              </span>
              {historico.length > 0 && (
                <button type="button" onClick={limparHistorico} className="text-sm font-normal text-gray-400 hover:text-white">
                  Limpar
                </button>
              )}
            </span>
          }
        >
          <div className="space-y-2">
            {historico.map((h) => (
              <div key={h.termo} className="flex items-center justify-between gap-4 p-3 glass-card rounded-lg">
                <div className="min-w-0">
                  <p className="text-white truncate">{h.termo}</p>
                  <p className="text-xs text-gray-400">
                    {tipoLabels[h.tipo]} · {new Date(h.data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => consultar(h.tipo, h.termo)} aria-label="Consultar novamente">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Remover do histórico"
                    onClick={() => {
                      const novo = historico.filter((x) => x.termo !== h.termo);
                      setHistorico(novo);
                      try {
                        localStorage.setItem(HISTORICO_KEY, JSON.stringify(novo));
                      } catch {
                        // ignora
                      }
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {historico.length === 0 && <p className="text-center py-4 text-gray-400">Nenhuma consulta ainda</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
