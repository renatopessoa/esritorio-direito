import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Info, Calculator, ArrowLeft, BookUser, History } from 'lucide-react';
import { Link } from 'react-router-dom';

type TipoCalculo =
    | 'idadeUrbana'
    | 'pontosComum'
    | 'idadeMinimaProgressivaComum'
    | 'pontosProfessor'
    | 'idadeMinimaProgressivaProfessor'
    | 'pedagio50'
    | 'pedagio100';

interface ResultadoDetalhes {
    [key: string]: string | number | boolean | undefined;
}

interface AposentadoriaResult {
    timestamp: number;
    tipoRegra: string;
    elegivel: boolean;
    mensagemPrincipal: string;
    detalhes?: ResultadoDetalhes;
    valorEstimado?: number; // Para regra de idade urbana
    percentualTotal?: number; // Para regra de idade urbana
}

const REGRAS_APOSENTADORIA = {
    idadeUrbana: "Aposentadoria por Idade (Urbana)",
    pontosComum: "Tempo de Contribuição - Regra de Pontos",
    idadeMinimaProgressivaComum: "Tempo de Contribuição - Idade Mínima Progressiva",
    pontosProfessor: "Aposentadoria do Professor - Regra de Pontos",
    idadeMinimaProgressivaProfessor: "Aposentadoria do Professor - Idade Mínima Progressiva",
    pedagio50: "Tempo de Contribuição - Pedágio 50%",
    pedagio100: "Tempo de Contribuição - Pedágio 100%",
};

// Ano base para regras progressivas (2025 conforme material)
const ANO_ATUAL_REGRAS = 2025;

export default function AposentadoriaCalculator() {
    const [tipoCalculo, setTipoCalculo] = useState<TipoCalculo>('idadeUrbana');
    const [genero, setGenero] = useState<'masculino' | 'feminino'>('masculino');
    const [idade, setIdade] = useState('');
    const [tempoContribuicaoAnos, setTempoContribuicaoAnos] = useState('');
    const [tempoContribuicaoMeses, setTempoContribuicaoMeses] = useState(''); // Para pedágio
    // const [mediaSalarial, setMediaSalarial] = useState(''); // Substituído
    const [salarioBrutoOuMedia, setSalarioBrutoOuMedia] = useState(''); // valor numérico em string
    const [formattedSalarioBrutoOuMedia, setFormattedSalarioBrutoOuMedia] = useState(''); // valor formatado
    const [tempoFaltantePedagioAnos, setTempoFaltantePedagioAnos] = useState('');
    const [tempoFaltantePedagioMeses, setTempoFaltantePedagioMeses] = useState('');
    // Adicionar estado para histórico de cálculos
    const [calculationHistory, setCalculationHistory] = useState<AposentadoriaResult[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    const [result, setResult] = useState<AposentadoriaResult | null>(null);

    const parseTempoContribuicaoTotalAnos = () => {
        const anos = parseInt(tempoContribuicaoAnos, 10) || 0;
        const meses = parseInt(tempoContribuicaoMeses, 10) || 0;
        return anos + (meses / 12);
    };

    const parseTempoFaltantePedagioTotalAnos = () => {
        const anos = parseInt(tempoFaltantePedagioAnos, 10) || 0;
        const meses = parseInt(tempoFaltantePedagioMeses, 10) || 0;
        return anos + (meses / 12);
    };


    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        setResult(null);

        const idadeNum = parseInt(idade, 10);
        const tempoContTotalAnos = parseTempoContribuicaoTotalAnos();
        // Corrige: pega o valor numérico corretamente
        const salarioBrutoOuMediaNum = Number(salarioBrutoOuMedia);
        const tempoFaltantePedagioTotalAnos = parseTempoFaltantePedagioTotalAnos();

        let calculatedResult: AposentadoriaResult = {
            tipoRegra: REGRAS_APOSENTADORIA[tipoCalculo],
            elegivel: false,
            mensagemPrincipal: "Dados insuficientes ou inválidos.",
            timestamp: 0
        };

        if (isNaN(idadeNum) && tipoCalculo !== 'pedagio50') { // Idade não é obrigatória para pedágio 50%
            setResult(calculatedResult);
            return;
        }
        if (isNaN(tempoContTotalAnos) || tempoContTotalAnos <= 0) {
            setResult(calculatedResult);
            return;
        }


        switch (tipoCalculo) {
            case 'idadeUrbana':
                if (isNaN(salarioBrutoOuMediaNum) || salarioBrutoOuMediaNum <= 0) {
                    setResult({ ...calculatedResult, mensagemPrincipal: "Média salarial inválida." });
                    return;
                }
                const idadeMinimaIdade = genero === 'feminino' ? 62 : 65;
                const tempoContMinimoIdade = genero === 'feminino' ? 15 : 20;
                const atendeIdade = idadeNum >= idadeMinimaIdade;
                const atendeContribuicaoIdade = tempoContTotalAnos >= tempoContMinimoIdade;
                calculatedResult.elegivel = atendeIdade && atendeContribuicaoIdade;

                if (calculatedResult.elegivel) {
                    const percentualBase = 60;
                    const anosExcedentes = Math.max(0, tempoContTotalAnos - (genero === 'feminino' ? 15 : 20));
                    const percentualAdicional = Math.min(anosExcedentes * 2, 40);
                    const percentualTotal = percentualBase + percentualAdicional;
                    calculatedResult.valorEstimado = (salarioBrutoOuMediaNum * percentualTotal) / 100;
                    calculatedResult.percentualTotal = percentualTotal;
                    calculatedResult.mensagemPrincipal = "Você é elegível para Aposentadoria por Idade!";
                } else {
                    calculatedResult.mensagemPrincipal = "Você não atende aos requisitos para Aposentadoria por Idade.";
                }
                calculatedResult.detalhes = {
                    idadeAtual: idadeNum, idadeMinimaExigida: idadeMinimaIdade, atendeIdade,
                    tempoContribuicaoAtual: tempoContTotalAnos.toFixed(2), tempoContribuicaoMinimoExigido: tempoContMinimoIdade, atendeContribuicao: atendeContribuicaoIdade,
                    mediaSalarial: formatCurrency(salarioBrutoOuMediaNum),
                };
                break;

            case 'pontosComum':
                const tcMinPontosComum = genero === 'feminino' ? 30 : 35;
                const pontosMinComum = genero === 'feminino' ? 92 : 102; // Para 2025
                const pontosAtuaisComum = idadeNum + tempoContTotalAnos;
                const atendeTcPontosComum = tempoContTotalAnos >= tcMinPontosComum;
                const atendePontosComum = pontosAtuaisComum >= pontosMinComum;
                calculatedResult.elegivel = atendeTcPontosComum && atendePontosComum;
                calculatedResult.mensagemPrincipal = calculatedResult.elegivel ? "Elegível pela Regra de Pontos." : "Não elegível pela Regra de Pontos.";
                calculatedResult.detalhes = {
                    idadeAtual: idadeNum,
                    tempoContribuicaoAtual: tempoContTotalAnos.toFixed(2), tcMinExigido: tcMinPontosComum, atendeTcPontosComum,
                    pontosAtuais: pontosAtuaisComum.toFixed(2), pontosMinExigidos: pontosMinComum, atendePontosComum,
                    anoReferencia: ANO_ATUAL_REGRAS,
                };
                break;

            case 'idadeMinimaProgressivaComum':
                const tcMinIdadeProgComum = genero === 'feminino' ? 30 : 35;
                const idadeMinIdadeProgComum = genero === 'feminino' ? 59 : 64; // Para 2025
                const atendeTcIdadeProgComum = tempoContTotalAnos >= tcMinIdadeProgComum;
                const atendeIdadeIdadeProgComum = idadeNum >= idadeMinIdadeProgComum;
                calculatedResult.elegivel = atendeTcIdadeProgComum && atendeIdadeIdadeProgComum;
                calculatedResult.mensagemPrincipal = calculatedResult.elegivel ? "Elegível pela Regra de Idade Mínima Progressiva." : "Não elegível pela Regra de Idade Mínima Progressiva.";
                calculatedResult.detalhes = {
                    idadeAtual: idadeNum, idadeMinExigida: idadeMinIdadeProgComum, atendeIdadeIdadeProgComum,
                    tempoContribuicaoAtual: tempoContTotalAnos.toFixed(2), tcMinExigido: tcMinIdadeProgComum, atendeTcIdadeProgComum,
                    anoReferencia: ANO_ATUAL_REGRAS,
                };
                break;

            case 'pontosProfessor':
                const tcMinPontosProf = genero === 'feminino' ? 25 : 30;
                const pontosMinProf = genero === 'feminino' ? 87 : 97; // Para 2025
                const pontosAtuaisProf = idadeNum + tempoContTotalAnos;
                const atendeTcPontosProf = tempoContTotalAnos >= tcMinPontosProf;
                const atendePontosProf = pontosAtuaisProf >= pontosMinProf;
                calculatedResult.elegivel = atendeTcPontosProf && atendePontosProf;
                calculatedResult.mensagemPrincipal = calculatedResult.elegivel ? "Elegível pela Regra de Pontos (Professor)." : "Não elegível pela Regra de Pontos (Professor).";
                calculatedResult.detalhes = {
                    cargo: "Professor(a)",
                    idadeAtual: idadeNum,
                    tempoContribuicaoMagisterio: tempoContTotalAnos.toFixed(2), tcMinExigido: tcMinPontosProf, atendeTcPontosProf,
                    pontosAtuais: pontosAtuaisProf.toFixed(2), pontosMinExigidos: pontosMinProf, atendePontosProf,
                    anoReferencia: ANO_ATUAL_REGRAS,
                };
                break;

            case 'idadeMinimaProgressivaProfessor':
                const tcMinIdadeProgProf = genero === 'feminino' ? 25 : 30;
                const idadeMinIdadeProgProf = genero === 'feminino' ? 54 : 59; // Para 2025
                const atendeTcIdadeProgProf = tempoContTotalAnos >= tcMinIdadeProgProf;
                const atendeIdadeIdadeProgProf = idadeNum >= idadeMinIdadeProgProf;
                calculatedResult.elegivel = atendeTcIdadeProgProf && atendeIdadeIdadeProgProf;
                calculatedResult.mensagemPrincipal = calculatedResult.elegivel ? "Elegível pela Regra de Idade Mínima Progressiva (Professor)." : "Não elegível pela Regra de Idade Mínima Progressiva (Professor).";
                calculatedResult.detalhes = {
                    cargo: "Professor(a)",
                    idadeAtual: idadeNum, idadeMinExigida: idadeMinIdadeProgProf, atendeIdadeIdadeProgProf,
                    tempoContribuicaoMagisterio: tempoContTotalAnos.toFixed(2), tcMinExigido: tcMinIdadeProgProf, atendeTcIdadeProgProf,
                    anoReferencia: ANO_ATUAL_REGRAS,
                };
                break;

            case 'pedagio50':
                if (isNaN(tempoFaltantePedagioTotalAnos) || tempoFaltantePedagioTotalAnos < 0) {
                    setResult({ ...calculatedResult, mensagemPrincipal: "Tempo faltante para pedágio inválido." });
                    return;
                }
                const tcMinPedagio50 = genero === 'feminino' ? 30 : 35;
                const pedagio50 = tempoFaltantePedagioTotalAnos * 0.5;
                const tcNecessarioPedagio50 = tcMinPedagio50 + pedagio50;
                calculatedResult.elegivel = tempoContTotalAnos >= tcNecessarioPedagio50;
                calculatedResult.mensagemPrincipal = calculatedResult.elegivel ? "Elegível pela Regra de Pedágio 50%." : "Não elegível pela Regra de Pedágio 50%.";
                calculatedResult.detalhes = {
                    tempoContribuicaoAtual: tempoContTotalAnos.toFixed(2),
                    tempoFaltavaEm13_11_2019: tempoFaltantePedagioTotalAnos.toFixed(2),
                    pedagioCalculado: pedagio50.toFixed(2),
                    tcMinimoOriginal: tcMinPedagio50,
                    tcNecessarioComPedagio: tcNecessarioPedagio50.toFixed(2),
                    atendeTcComPedagio: calculatedResult.elegivel,
                };
                break;

            case 'pedagio100':
                if (isNaN(tempoFaltantePedagioTotalAnos) || tempoFaltantePedagioTotalAnos < 0) {
                    setResult({ ...calculatedResult, mensagemPrincipal: "Tempo faltante para pedágio inválido." });
                    return;
                }
                const idadeMinPedagio100 = genero === 'feminino' ? 57 : 60;
                const tcMinPedagio100 = genero === 'feminino' ? 30 : 35;
                const pedagio100 = tempoFaltantePedagioTotalAnos * 1.0; // Pedágio é 100% do tempo que faltava
                const tcNecessarioPedagio100 = tcMinPedagio100 + pedagio100;
                const atendeIdadePedagio100 = idadeNum >= idadeMinPedagio100;
                const atendeTcPedagio100 = tempoContTotalAnos >= tcNecessarioPedagio100;
                calculatedResult.elegivel = atendeIdadePedagio100 && atendeTcPedagio100;
                calculatedResult.mensagemPrincipal = calculatedResult.elegivel ? "Elegível pela Regra de Pedágio 100%." : "Não elegível pela Regra de Pedágio 100%.";
                calculatedResult.detalhes = {
                    idadeAtual: idadeNum, idadeMinExigida: idadeMinPedagio100, atendeIdadePedagio100,
                    tempoContribuicaoAtual: tempoContTotalAnos.toFixed(2),
                    tempoFaltavaEm13_11_2019: tempoFaltantePedagioTotalAnos.toFixed(2),
                    pedagioCalculado: pedagio100.toFixed(2),
                    tcMinimoOriginal: tcMinPedagio100,
                    tcNecessarioComPedagio: tcNecessarioPedagio100.toFixed(2),
                    atendeTcComPedagio: atendeTcPedagio100,
                };
                break;

            default:
                calculatedResult.mensagemPrincipal = "Tipo de cálculo não reconhecido.";
        }

        // Adicionar ao histórico se o cálculo foi bem-sucedido
        if (calculatedResult.mensagemPrincipal !== "Dados insuficientes ou inválidos." &&
            calculatedResult.mensagemPrincipal !== "Tipo de cálculo não reconhecido.") {
            const timestampedResult = {
                ...calculatedResult,
                timestamp: Date.now()
            };
            setCalculationHistory(prev => [timestampedResult, ...prev.slice(0, 9)]); // Mantém os 10 últimos
        }

        setResult(calculatedResult);
    };

    const formatCurrency = (value: number): string => {
        if (isNaN(value)) return "R$ -";
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // Formatação automática do salário bruto/média salarial
    const handleSalarioBrutoOuMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Remove tudo exceto dígitos
        const numericValue = value.replace(/[^\d]/g, '');

        if (!numericValue) {
            setSalarioBrutoOuMedia('');
            setFormattedSalarioBrutoOuMedia('');
            return;
        }

        // Converte para número - consideramos o valor como reais inteiros, não como centavos
        const numericAmount = parseInt(numericValue, 10);

        // Atualiza o estado com o valor numérico para cálculos
        setSalarioBrutoOuMedia(numericAmount.toString());

        // Formata o valor para exibição como moeda brasileira
        setFormattedSalarioBrutoOuMedia(
            numericAmount.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
        );
    };

    const clearHistory = () => {
        setCalculationHistory([]);
    };

    const renderDetalhesResultado = (detalhes: ResultadoDetalhes | undefined) => {
        if (!detalhes) return null;
        return (
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
                {Object.entries(detalhes).map(([key, value]) => {
                    let displayValue = value;
                    if (typeof value === 'boolean') {
                        displayValue = value ? 'Sim' : 'Não';
                    } else if (typeof value === 'number' && (key.toLowerCase().includes('salarial') || key.toLowerCase().includes('valor'))) {
                        displayValue = formatCurrency(value);
                    } else if (typeof value === 'number' && key.toLowerCase().includes('pontos') || key.toLowerCase().includes('anos') || key.toLowerCase().includes('idade') || key.toLowerCase().includes('tempo')) {
                        displayValue = `${value} ${key.toLowerCase().includes('pontos') ? 'pontos' : key.toLowerCase().includes('idade') ? 'anos (idade)' : 'anos'}`;
                    }


                    // Melhorar a apresentação da chave
                    const displayKey = key
                        .replace(/([A-Z])/g, ' $1') // Adiciona espaço antes de maiúsculas
                        .replace(/^./, (str) => str.toUpperCase()) // Capitaliza a primeira letra
                        .replace(/Tc/g, 'Tempo de Contribuição') // Expande abreviações comuns
                        .replace(/Min /g, 'Mínimo ')
                        .replace(/Exigid[ao]/g, 'Exigido(a)');


                    return (
                        <li key={key} className="flex justify-between">
                            <span className="font-medium">{displayKey}:</span>
                            <span>{String(displayValue)}</span>
                        </li>
                    );
                })}
            </ul>
        );
    };


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-4">
                    <Link to="/app/INSSCalculator" className="text-green-600 hover:text-green-800 flex items-center">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar para calculadora do INSS
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-green-600 text-white p-6">
                        <h1 className="text-3xl font-bold flex items-center">
                            <BookUser className="mr-3" />
                            Simulador de Aposentadoria
                        </h1>
                        <p className="mt-2 opacity-90">
                            Verifique sua elegibilidade para diferentes regras de aposentadoria.
                        </p>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <form onSubmit={handleCalculate} className="space-y-6 bg-gray-50 p-5 rounded-lg">
                                    <div>
                                        <label htmlFor="tipoCalculo" className="block mb-2 font-medium text-lg text-black">Selecione a Regra de Aposentadoria:</label>
                                        <select
                                            id="tipoCalculo"
                                            value={tipoCalculo}
                                            onChange={(e) => setTipoCalculo(e.target.value as TipoCalculo)}
                                            className="border rounded-lg px-4 py-3 w-full text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                                        >
                                            {Object.entries(REGRAS_APOSENTADORIA).map(([key, value]) => (
                                                <option key={key} value={key}>{value}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block mb-2 font-medium text-lg text-black">Gênero:</label>
                                        <div className="flex space-x-4">
                                            <div className="flex items-center">
                                                <input type="radio" id="masculino" name="genero" value="masculino" checked={genero === 'masculino'} onChange={() => setGenero('masculino')} className="w-4 h-4 text-green-600" />
                                                <label htmlFor="masculino" className="ml-2 text-black">Masculino</label>
                                            </div>
                                            <div className="flex items-center">
                                                <input type="radio" id="feminino" name="genero" value="feminino" checked={genero === 'feminino'} onChange={() => setGenero('feminino')} className="w-4 h-4 text-green-600" />
                                                <label htmlFor="feminino" className="ml-2 text-black">Feminino</label>
                                            </div>
                                        </div>
                                    </div>

                                    {tipoCalculo !== 'pedagio50' && ( // Idade não é obrigatória para pedágio 50%
                                        <div>
                                            <label className="block mb-2 font-medium text-lg text-black">Idade atual (anos):</label>
                                            <input type="number" value={idade} onChange={(e) => setIdade(e.target.value)} className="border rounded-lg px-4 py-3 w-full text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black" placeholder="Ex: 60" min="0" max="120" />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block mb-2 font-medium text-lg text-black">
                                            Tempo de contribuição total{tipoCalculo.includes('Professor') ? ' (em magistério)' : ''}:
                                        </label>
                                        <div className="flex space-x-2">
                                            <input type="number" value={tempoContribuicaoAnos} onChange={(e) => setTempoContribuicaoAnos(e.target.value)} className="border rounded-lg px-4 py-3 w-1/2 text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black" placeholder="Anos" min="0" max="100" />
                                            <input type="number" value={tempoContribuicaoMeses} onChange={(e) => setTempoContribuicaoMeses(e.target.value)} className="border rounded-lg px-4 py-3 w-1/2 text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black" placeholder="Meses" min="0" max="11" />
                                        </div>
                                    </div>

                                    {tipoCalculo === 'idadeUrbana' && (
                                        <div>
                                            <label className="block mb-2 font-medium text-lg text-black">Informe sua média salarial (R$):</label>
                                            <input
                                                type="text"
                                                value={formattedSalarioBrutoOuMedia}
                                                onChange={handleSalarioBrutoOuMediaChange}
                                                className="border rounded-lg px-4 py-3 w-full text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                                                placeholder="R$ 0,00"
                                            />
                                            <div className="text-sm text-gray-700 mt-1 flex items-center"><Info className="w-4 h-4 mr-1" />Média de todos os salários a partir de julho de 1994. Digite apenas números.</div>
                                        </div>
                                    )}

                                    {(tipoCalculo === 'pedagio50' || tipoCalculo === 'pedagio100') && (
                                        <div>
                                            <label className="block mb-2 font-medium text-lg text-black">Tempo que faltava para {genero === 'feminino' ? '30 anos (mulher)' : '35 anos (homem)'} de contribuição em 13/11/2019:</label>
                                            <div className="flex space-x-2">
                                                <input type="number" value={tempoFaltantePedagioAnos} onChange={(e) => setTempoFaltantePedagioAnos(e.target.value)} className="border rounded-lg px-4 py-3 w-1/2 text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black" placeholder="Anos" min="0" max="50" />
                                                <input type="number" value={tempoFaltantePedagioMeses} onChange={(e) => setTempoFaltantePedagioMeses(e.target.value)} className="border rounded-lg px-4 py-3 w-1/2 text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black" placeholder="Meses" min="0" max="11" />
                                            </div>
                                            <div className="text-sm text-gray-700 mt-1 flex items-center"><Info className="w-4 h-4 mr-1" />Informe o tempo que faltava para completar o mínimo de contribuição na data da reforma.</div>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-3">
                                        <Button type="submit" className="bg-green-600 hover:bg-green-700 px-6 py-3 text-white font-medium rounded-lg flex items-center">
                                            <Calculator className="w-5 h-5 mr-2" />
                                            Simular Aposentadoria
                                        </Button>

                                        <Button
                                            type="button"
                                            onClick={() => setShowHistory(!showHistory)}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 font-medium rounded-lg flex items-center"
                                        >
                                            <History className="w-5 h-5 mr-2" />
                                            {showHistory ? 'Ocultar Histórico' : 'Ver Histórico'}
                                        </Button>
                                    </div>
                                </form>

                                {/* Adicionar histórico de cálculos */}
                                {showHistory && calculationHistory.length > 0 && (
                                    <div className="mt-6 bg-white p-5 trounded-lg border border-gray-200">
                                        <div className="flex justify-between items-center mb-3">
                                            <h2 className="text-xl font-semibold text-black">Histórico de Cálculos</h2>
                                            <Button
                                                onClick={clearHistory}
                                                className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                                            >
                                                Limpar
                                            </Button>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-100">
                                                        <th className="border border-gray-200 px-3 py-2 text-left text-black">Data</th>
                                                        <th className="border border-gray-200 px-3 py-2 text-left text-black">Regra</th>
                                                        <th className="border border-gray-200 px-3 py-2 text-left text-black">Resultado</th>
                                                        {calculationHistory[0].valorEstimado && (
                                                            <th className="border border-gray-200 px-3 py-2 text-left text-black">Valor</th>
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {calculationHistory.map((item, index) => (
                                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                            <td className="border border-gray-200 px-3 py-2 text-black">
                                                                {new Date(item.timestamp || Date.now()).toLocaleDateString('pt-BR')}
                                                            </td>
                                                            <td className="border border-gray-200 px-3 py-2 text-black">
                                                                {item.tipoRegra}
                                                            </td>
                                                            <td className={`border border-gray-200 px-3 py-2 font-medium ${item.elegivel ? 'text-green-600' : 'text-red-600'}`}>
                                                                {item.elegivel ? 'Elegível' : 'Não elegível'}
                                                            </td>
                                                            {item.valorEstimado && (
                                                                <td className="border border-gray-200 px-3 py-2 font-medium text-black">
                                                                    {formatCurrency(item.valorEstimado)}
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {result ? (
                                    <div className={`p-5 rounded-lg shadow border-l-4 ${result.elegivel ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                                        <h2 className={`text-xl font-bold mb-2 ${result.elegivel ? 'text-green-800' : 'text-red-800'}`}>
                                            Resultado da Simulação
                                        </h2>
                                        <p className={`font-semibold mb-1 ${result.elegivel ? 'text-green-700' : 'text-red-700'}`}>
                                            Regra: {result.tipoRegra}
                                        </p>
                                        <p className={`text-lg mb-3 ${result.elegivel ? 'text-green-700' : 'text-red-700'}`}>
                                            {result.mensagemPrincipal}
                                        </p>

                                        {renderDetalhesResultado(result.detalhes)}

                                        {result.valorEstimado !== undefined && result.elegivel && (
                                            <div className="mt-4 bg-green-100 p-3 rounded border border-green-200">
                                                <div className="text-sm text-green-800 font-medium">Valor estimado da aposentadoria</div>
                                                <div className="text-2xl font-bold text-green-800">
                                                    {formatCurrency(result.valorEstimado)}
                                                </div>
                                                {result.percentualTotal !== undefined && (
                                                    <div className="text-xs text-green-700 mt-1">
                                                        ({result.percentualTotal}% da média salarial)
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 h-full flex flex-col justify-center items-center text-center">
                                        <BookUser className="w-12 h-12 text-gray-400 mb-3" />
                                        <h3 className="text-lg font-medium text-gray-700">Simulação de Aposentadoria</h3>
                                        <p className="text-gray-500 mt-1">Preencha os dados e clique em simular.</p>
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-1">
                                {/* ...existing code... */}
                            </div>
                        </div>
                    </div>
                </div >

                <div className="mt-6 bg-white rounded-lg p-5 shadow">
                    <h2 className="text-xl text-black font-bold mb-3">Informações Importantes</h2>
                    <p className="mb-2 text-black">
                        Este simulador utiliza as regras de aposentadoria vigentes e de transição conforme a Emenda Constitucional nº 103/2019, com base no ano de {ANO_ATUAL_REGRAS} para os critérios progressivos.
                    </p>
                    <p className="mb-2 text-gray-700">
                        Os resultados são apenas uma estimativa e não substituem uma análise individualizada por um profissional do direito previdenciário ou consulta ao INSS.
                    </p>
                    <p className="text-gray-700">
                        O cálculo do valor do benefício para as regras de transição por tempo de contribuição (pontos, idade mínima progressiva, pedágios) pode variar e, para uma estimativa precisa, considera-se a média de 100% dos salários de contribuição desde julho de 1994, aplicando-se o coeficiente de 60% + 2% por ano de contribuição que exceder 15 anos (mulher) ou 20 anos (homem), exceto para a regra do pedágio de 100% (100% da média) e pedágio de 50% (média multiplicada pelo fator previdenciário). Esta calculadora foca na elegibilidade.
                    </p>
                </div>
            </div >
        </div >
    );
}
