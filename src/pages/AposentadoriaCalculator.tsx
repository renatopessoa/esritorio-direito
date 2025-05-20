import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Info, Calculator, Calendar, User } from 'lucide-react';

interface AposentadoriaResult {
    idadeMinima: number;
    tempoContribuicaoMinimo: number;
    atendeIdade: boolean;
    atendeContribuicao: boolean;
    percentualBase: number;
    percentualAdicional: number;
    percentualTotal: number;
    valorEstimado: number;
}

export default function AposentadoriaCalculator() {
    const [genero, setGenero] = useState<'masculino' | 'feminino'>('masculino');
    const [idade, setIdade] = useState('');
    const [tempoContribuicao, setTempoContribuicao] = useState('');
    const [mediaSalarial, setMediaSalarial] = useState('');
    const [result, setResult] = useState<AposentadoriaResult | null>(null);

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();

        const idadeValue = parseInt(idade, 10);
        const tempoContribuicaoValue = parseInt(tempoContribuicao, 10);
        const mediaSalarialValue = parseFloat(mediaSalarial.replace(/[^\d,]/g, '').replace(',', '.'));

        if (isNaN(idadeValue) || isNaN(tempoContribuicaoValue) || isNaN(mediaSalarialValue)) {
            return;
        }

        // Regras de aposentadoria por idade
        const idadeMinima = genero === 'feminino' ? 62 : 65;
        const tempoContribuicaoMinimo = genero === 'feminino' ? 15 : 20;

        // Verificação de elegibilidade
        const atendeIdade = idadeValue >= idadeMinima;
        const atendeContribuicao = tempoContribuicaoValue >= tempoContribuicaoMinimo;

        // Cálculo do percentual
        const percentualBase = 60; // 60% da média salarial
        const anosAdicionais = Math.max(0, tempoContribuicaoValue - tempoContribuicaoMinimo);
        const percentualAdicional = Math.min(anosAdicionais * 2, 40); // Limite de 40% adicional (total 100%)
        const percentualTotal = percentualBase + percentualAdicional;

        // Cálculo do valor estimado da aposentadoria
        const valorEstimado = (mediaSalarialValue * percentualTotal) / 100;

        setResult({
            idadeMinima,
            tempoContribuicaoMinimo,
            atendeIdade,
            atendeContribuicao,
            percentualBase,
            percentualAdicional,
            percentualTotal,
            valorEstimado
        });
    };

    // Formatação de valores monetários
    const formatCurrency = (value: number): string => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-green-600 text-white p-6">
                        <h1 className="text-3xl font-bold flex items-center">
                            <Calendar className="mr-3" />
                            Cálculo de Aposentadoria por Idade
                        </h1>
                        <p className="mt-2 opacity-90">
                            Simule o valor da sua aposentadoria de acordo com as regras atuais
                        </p>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <form onSubmit={handleCalculate} className="space-y-6 bg-gray-50 p-5 rounded-lg">
                                    <div>
                                        <label className="block mb-2 font-medium text-lg text-black">Gênero:</label>
                                        <div className="flex space-x-4">
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id="masculino"
                                                    name="genero"
                                                    value="masculino"
                                                    checked={genero === 'masculino'}
                                                    onChange={() => setGenero('masculino')}
                                                    className="w-4 h-4 text-green-600"
                                                />
                                                <label htmlFor="masculino" className="ml-2 text-black">
                                                    Masculino
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id="feminino"
                                                    name="genero"
                                                    value="feminino"
                                                    checked={genero === 'feminino'}
                                                    onChange={() => setGenero('feminino')}
                                                    className="w-4 h-4 text-green-600"
                                                />
                                                <label htmlFor="feminino" className="ml-2 text-black">
                                                    Feminino
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block mb-2 font-medium text-lg text-black">Idade atual (anos):</label>
                                        <input
                                            type="number"
                                            value={idade}
                                            onChange={(e) => setIdade(e.target.value)}
                                            className="border rounded-lg px-4 py-3 w-full text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                                            placeholder="Ex: 60"
                                            min="0"
                                            max="120"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 font-medium text-lg text-black">Tempo de contribuição (anos):</label>
                                        <input
                                            type="number"
                                            value={tempoContribuicao}
                                            onChange={(e) => setTempoContribuicao(e.target.value)}
                                            className="border rounded-lg px-4 py-3 w-full text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                                            placeholder="Ex: 25"
                                            min="0"
                                            max="100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 font-medium text-lg text-black">Média salarial (R$):</label>
                                        <input
                                            type="text"
                                            value={mediaSalarial}
                                            onChange={(e) => setMediaSalarial(e.target.value)}
                                            className="border rounded-lg px-4 py-3 w-full text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                                            placeholder="Ex: 3500,00"
                                        />
                                        <div className="text-sm text-gray-700 mt-1 flex items-center">
                                            <Info className="w-4 h-4 mr-1" />
                                            Média de todos os salários a partir de julho de 1994
                                        </div>
                                    </div>

                                    <div>
                                        <Button
                                            type="submit"
                                            className="bg-green-600 hover:bg-green-700 px-6 py-3 text-white font-medium rounded-lg flex items-center"
                                        >
                                            <Calculator className="w-5 h-5 mr-2" />
                                            Calcular Aposentadoria
                                        </Button>
                                    </div>
                                </form>

                                <div className="mt-6 bg-white p-5 rounded-lg border border-gray-200">
                                    <h2 className="text-xl font-semibold mb-4 text-black">Regras para Aposentadoria por Idade</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                            <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                                                <User className="w-5 h-5 mr-2" /> Homens
                                            </h3>
                                            <ul className="space-y-2 text-black">
                                                <li className="flex items-start">
                                                    <span className="text-blue-500 mr-2">•</span>
                                                    Idade mínima: 65 anos
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-blue-500 mr-2">•</span>
                                                    Tempo mínimo de contribuição: 20 anos
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
                                            <h3 className="font-medium text-pink-800 mb-2 flex items-center">
                                                <User className="w-5 h-5 mr-2" /> Mulheres
                                            </h3>
                                            <ul className="space-y-2 text-black">
                                                <li className="flex items-start">
                                                    <span className="text-pink-500 mr-2">•</span>
                                                    Idade mínima: 62 anos
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-pink-500 mr-2">•</span>
                                                    Tempo mínimo de contribuição: 15 anos
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <h3 className="font-medium text-black mb-2">Cálculo do Benefício</h3>
                                        <p className="text-black mb-2">
                                            O valor da aposentadoria é calculado com base na média salarial e no tempo de contribuição:
                                        </p>
                                        <ul className="space-y-2 text-black">
                                            <li className="flex items-start">
                                                <span className="text-green-500 mr-2">•</span>
                                                60% da média salarial (valor base)
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-green-500 mr-2">•</span>
                                                + 2% por ano de contribuição que exceder o mínimo exigido
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-green-500 mr-2">•</span>
                                                Até o limite de 100% da média salarial
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-1">
                                {result ? (
                                    <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded-lg shadow">
                                        <h2 className="text-xl font-bold mb-4 text-green-800">Resultado da Simulação</h2>

                                        <div className="space-y-4">
                                            <div className="bg-white p-3 rounded border border-gray-200">
                                                <div className="text-sm text-gray-700 font-medium">Requisitos mínimos</div>
                                                <div className="mt-1 text-black">
                                                    <div className="flex items-center">
                                                        <div className={`w-4 h-4 rounded-full mr-2 ${result.atendeIdade ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                        <span>Idade: {idade} anos (mínimo {result.idadeMinima})</span>
                                                    </div>
                                                    <div className="flex items-center mt-1">
                                                        <div className={`w-4 h-4 rounded-full mr-2 ${result.atendeContribuicao ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                        <span>Contribuição: {tempoContribuicao} anos (mínimo {result.tempoContribuicaoMinimo})</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {(result.atendeIdade && result.atendeContribuicao) ? (
                                                <>
                                                    <div className="bg-white p-3 rounded border border-gray-200">
                                                        <div className="text-sm text-gray-700 font-medium">Cálculo do percentual</div>
                                                        <div className="text-black">
                                                            <div>Base: {result.percentualBase}%</div>
                                                            <div>Adicional: {result.percentualAdicional}%</div>
                                                            <div className="font-semibold">Total: {result.percentualTotal}% da média</div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-green-100 p-4 rounded border border-green-200">
                                                        <div className="text-sm text-green-800 font-medium">Valor estimado da aposentadoria</div>
                                                        <div className="text-2xl font-bold text-green-800">
                                                            {formatCurrency(result.valorEstimado)}
                                                        </div>
                                                        <div className="text-xs text-green-700 mt-1">
                                                            {result.percentualTotal}% de {formatCurrency(parseFloat(mediaSalarial.replace(',', '.')))}
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="bg-yellow-100 p-4 rounded border border-yellow-200">
                                                    <div className="text-yellow-800 font-medium">
                                                        Você ainda não atende os requisitos mínimos para aposentadoria por idade.
                                                    </div>
                                                    <div className="mt-2 text-sm text-yellow-700">
                                                        {!result.atendeIdade && (
                                                            <div className="mt-1">
                                                                Faltam {result.idadeMinima - parseInt(idade)} anos para atingir a idade mínima.
                                                            </div>
                                                        )}
                                                        {!result.atendeContribuicao && (
                                                            <div className="mt-1">
                                                                Faltam {result.tempoContribuicaoMinimo - parseInt(tempoContribuicao)} anos de contribuição.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 h-full flex flex-col justify-center items-center text-center">
                                        <Calendar className="w-12 h-12 text-gray-400 mb-3" />
                                        <h3 className="text-lg font-medium text-gray-700">Simulação de Aposentadoria</h3>
                                        <p className="text-gray-500 mt-1">Preencha os dados ao lado para calcular.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-white rounded-lg p-5 shadow">
                    <h2 className="text-xl text-black font-bold mb-3">Entenda o Cálculo da Aposentadoria por Idade</h2>
                    <p className="mb-3 text-black">
                        A aposentadoria por idade é um benefício concedido aos trabalhadores que atingem a idade mínima exigida e
                        cumprem o tempo mínimo de contribuição ao INSS. O cálculo é baseado na média de todos os salários de contribuição
                        a partir de julho de 1994.
                    </p>
                    <p className="text-gray-700 mb-3">
                        O valor inicial é de 60% da média salarial, acrescido de 2% para cada ano que exceder o tempo mínimo de contribuição.
                        Por exemplo, uma mulher com 20 anos de contribuição (15 mínimos + 5 adicionais) terá direito a 70% da média salarial
                        (60% + 10%).
                    </p>
                    <p className="text-gray-700">
                        Para obter 100% da média, é necessário contribuir por 35 anos no caso das mulheres e 40 anos no caso dos homens.
                    </p>
                </div>
            </div>
        </div>
    );
}
