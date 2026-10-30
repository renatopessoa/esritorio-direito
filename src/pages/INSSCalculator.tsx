import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Info, Calculator, History, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    ANOS_DISPONIVEIS,
    anoVigente,
    calcularINSS,
    faixasINSS,
    parseValorBR,
    tetoINSS,
    type ResultadoINSS,
} from '../utils/previdencia';

interface CalculationResult {
    salary: number;
    year?: number;
    faixa: string;
    aliquot: number;
    deduction: number;
    inss: number;
    date: Date;
}

const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
};

const formatPercent = (value: number) => `${(value * 100).toLocaleString('pt-BR')}%`;

export default function INSSCalculator() {
    const [salary, setSalary] = useState('');
    const [year, setYear] = useState(anoVigente);
    const [result, setResult] = useState<ResultadoINSS | null>(null);
    const [error, setError] = useState('');
    const [history, setHistory] = useState<CalculationResult[]>([]);
    const [showTable, setShowTable] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    // Carregar histórico do localStorage
    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem('inssCalculationHistory');
            if (!savedHistory) return;
            const parsed = JSON.parse(savedHistory);
            setHistory(parsed.map((item: Omit<CalculationResult, 'date'> & { date: string }) => ({
                ...item,
                date: new Date(item.date)
            })));
        } catch (e) {
            console.error('Erro ao carregar histórico:', e);
        }
    }, []);

    const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Mantém apenas números, vírgulas e pontos; a conversão acontece ao calcular
        setSalary(e.target.value.replace(/[^\d,.]/g, ''));
        setError('');
    };

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();

        const value = parseValorBR(salary);
        if (isNaN(value) || value <= 0) {
            setResult(null);
            setError('Informe um salário válido, por exemplo 3000 ou 3.000,00');
            return;
        }

        setSalary(value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

        const calculationResult = calcularINSS(value, year);
        setResult(calculationResult);

        const newResult: CalculationResult = {
            salary: value,
            year,
            faixa: `${formatCurrency(calculationResult.faixa.min)} até ${formatCurrency(calculationResult.faixa.max)}`,
            aliquot: calculationResult.faixa.aliquota * 100,
            deduction: calculationResult.faixa.deducao,
            inss: calculationResult.inss,
            date: new Date()
        };

        const updatedHistory = [newResult, ...history.slice(0, 9)];
        setHistory(updatedHistory);
        try {
            localStorage.setItem('inssCalculationHistory', JSON.stringify(updatedHistory));
        } catch {
            // histórico é só conveniência
        }
    };

    const downloadCSV = () => {
        if (history.length === 0) return;

        const headers = ['Data', 'Ano da tabela', 'Salário', 'Faixa', 'Alíquota', 'Dedução', 'INSS'];
        const rows = history.map(item => [
            item.date.toLocaleDateString('pt-BR'),
            String(item.year ?? ''),
            formatCurrency(item.salary),
            item.faixa,
            `${item.aliquot.toLocaleString('pt-BR')}%`,
            formatCurrency(item.deduction),
            formatCurrency(item.inss)
        ]);

        // Ponto e vírgula: os valores em reais usam vírgula decimal
        const csvCell = (cell: string) => `"${cell.replace(/"/g, '""')}"`;
        const csvContent = [headers, ...rows].map(row => row.map(csvCell).join(';')).join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `calculo_inss_${new Date().toISOString().split('T')[0]}.csv`);
        link.click();
        URL.revokeObjectURL(url);
    };

    const clearHistory = () => {
        setHistory([]);
        try {
            localStorage.removeItem('inssCalculationHistory');
        } catch {
            // ignora
        }
    };

    const exemplo = calcularINSS(3000, year);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-blue-600 text-black p-6">
                        <h1 className="text-3xl font-bold flex items-center">
                            <Calculator className="mr-3" />
                            Cálculo do INSS {year}
                        </h1>
                        <p className="mt-2 opacity-90">
                            Simule o valor da sua contribuição de acordo com as novas alíquotas e faixas salariais
                        </p>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <form onSubmit={handleCalculate} className="space-y-4 bg-gray-50 p-5 rounded-lg">
                                    <div>
                                        <label htmlFor="inss-year" className="block mb-2 font-medium text-lg text-black">Ano da tabela:</label>
                                        <select
                                            id="inss-year"
                                            value={year}
                                            onChange={(e) => { setYear(Number(e.target.value)); setResult(null); }}
                                            className="border rounded-lg px-4 py-3 w-full text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                        >
                                            {ANOS_DISPONIVEIS.map((ano) => (
                                                <option key={ano} value={ano}>{ano}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block mb-2 font-medium text-lg text-black">Informe seu salário bruto:</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={salary}
                                                onChange={handleSalaryChange}
                                                className="border rounded-lg px-4 py-3 w-full text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                                placeholder="Digite o valor sem R$ (ex: 3000,00)"
                                                inputMode="decimal"
                                            />
                                        </div>
                                        <div className="text-sm text-gray-700 mt-1 flex items-center">
                                            <Info className="w-4 h-4 mr-1" />
                                            Digite o valor completo, como 3000, 3000,50 ou 3.000,50
                                        </div>
                                        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
                                    </div>

                                    <div className="flex space-x-3">
                                        <Button
                                            type="submit"
                                            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white font-medium rounded-lg flex items-center"
                                        >
                                            <Calculator className="w-5 h-5 mr-2" />
                                            Calcular
                                        </Button>

                                        <Button
                                            type="button"
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 font-medium rounded-lg flex items-center"
                                            onClick={() => setShowTable(!showTable)}
                                        >
                                            <Info className="w-5 h-5 mr-2" />
                                            {showTable ? 'Ocultar Tabela' : 'Ver Tabela INSS'}
                                        </Button>

                                        <Button
                                            type="button"
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 font-medium rounded-lg flex items-center"
                                            onClick={() => setShowHistory(!showHistory)}
                                        >
                                            <History className="w-5 h-5 mr-2" />
                                            {showHistory ? 'Ocultar Histórico' : 'Ver Histórico'}
                                        </Button>
                                    </div>
                                </form>

                                {showTable && (
                                    <div className="mt-6 bg-white p-5 rounded-lg border border-gray-200">
                                        <h2 className="text-xl font-semibold mb-3 text-black">Tabela INSS {year}</h2>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-100">
                                                        <th className="border border-gray-200 px-4 py-2 text-left text-black font-bold">Faixa Salarial</th>
                                                        <th className="border border-gray-200 px-4 py-2 text-left text-black font-bold">Alíquota</th>
                                                        <th className="border border-gray-200 px-4 py-2 text-left text-black font-bold">Dedução</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {faixasINSS(year).map((faixa, index) => (
                                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                            <td className="border border-gray-200 px-4 py-2 text-black">
                                                                {formatCurrency(faixa.min)} até {formatCurrency(faixa.max)}
                                                            </td>
                                                            <td className="border border-gray-200 px-4 py-2 text-black font-medium">
                                                                {formatPercent(faixa.aliquota)}
                                                            </td>
                                                            <td className="border border-gray-200 px-4 py-2 text-black">
                                                                {formatCurrency(faixa.deducao)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {showHistory && history.length > 0 && (
                                    <div className="mt-6 bg-white p-5 rounded-lg border border-gray-200">
                                        <div className="flex justify-between items-center mb-3">
                                            <h2 className="text-xl text-black font-poppins">Histórico de Cálculos</h2>
                                            <div className="flex space-x-2">
                                                <Button
                                                    onClick={downloadCSV}
                                                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                                                >
                                                    <Download className="w-4 h-4 mr-1" />
                                                    Exportar
                                                </Button>
                                                <Button
                                                    onClick={clearHistory}
                                                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                                                >
                                                    Limpar
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="min-w-full border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-100">
                                                        <th className="border border-gray-200 text-black px-3 py-2 text-left">Data</th>
                                                        <th className="border border-gray-200 text-black px-3 py-2 text-left">Tabela</th>
                                                        <th className="border border-gray-200 text-black px-3 py-2 text-left">Salário</th>
                                                        <th className="border border-gray-200 text-black px-3 py-2 text-left">INSS</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {history.map((item, index) => (
                                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                            <td className="border border-gray-200 text-black px-3 py-2">
                                                                {item.date.toLocaleDateString('pt-BR')}
                                                            </td>
                                                            <td className="border border-gray-200 text-black px-3 py-2">
                                                                {item.year ?? '—'}
                                                            </td>
                                                            <td className="border border-gray-200 text-black px-3 py-2">
                                                                {formatCurrency(item.salary)}
                                                            </td>
                                                            <td className="border border-gray-200 px-3 py-2 font-medium text-blue-600">
                                                                {formatCurrency(item.inss)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-1">
                                {result ? (
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-lg shadow">
                                        <h2 className="text-xl font-bold mb-4 text-blue-700">Resultado do Cálculo</h2>

                                        <div className="space-y-3">
                                            <div className="bg-white p-3 rounded border border-gray-200">
                                                <div className="text-sm text-gray-700 font-medium">Salário bruto</div>
                                                <div className="text-lg font-semibold text-black">{formatCurrency(result.salario)}</div>
                                            </div>

                                            {result.acimaDoTeto && (
                                                <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-sm text-yellow-800">
                                                    Salário acima do teto: a contribuição é calculada sobre {formatCurrency(tetoINSS(year))} (valor máximo).
                                                </div>
                                            )}

                                            <div className="bg-white p-3 rounded border border-gray-200">
                                                <div className="text-sm text-gray-700 font-medium">Faixa salarial</div>
                                                <div className="text-md text-black">
                                                    {formatCurrency(result.faixa.min)} até {formatCurrency(result.faixa.max)}
                                                </div>
                                            </div>

                                            <div className="bg-white p-3 rounded border border-gray-200">
                                                <div className="text-sm text-gray-700 font-medium">Alíquota aplicada</div>
                                                <div className="text-md font-medium text-black">{formatPercent(result.faixa.aliquota)}</div>
                                            </div>

                                            <div className="bg-white p-3 rounded border border-gray-200">
                                                <div className="text-sm text-gray-700 font-medium">Parcela a deduzir</div>
                                                <div className="text-md text-black">{formatCurrency(result.faixa.deducao)}</div>
                                            </div>

                                            <div className="bg-blue-100 p-4 rounded border border-blue-200">
                                                <div className="text-sm text-blue-800 font-medium">Contribuição INSS</div>
                                                <div className="text-2xl font-bold text-blue-800">{formatCurrency(result.inss)}</div>
                                                <div className="text-xs text-blue-700 mt-1">
                                                    Alíquota efetiva: {result.aliquotaEfetiva.toLocaleString('pt-BR')}%
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 text-sm text-black bg-white p-3 rounded">
                                            <p className="flex items-start">
                                                <Info className="w-4 h-4 mr-1 mt-0.5 text-blue-500" />
                                                Cálculo: {formatCurrency(result.baseCalculo)} × {formatPercent(result.faixa.aliquota)} - {formatCurrency(result.faixa.deducao)} = {formatCurrency(result.inss)}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 h-full flex flex-col justify-center items-center text-center">
                                        <Calculator className="w-12 h-12 text-gray-400 mb-3" />
                                        <h3 className="text-lg font-medium text-gray-700">Informe seu salário</h3>
                                        <p className="text-gray-500 mt-1">O resultado do cálculo aparecerá aqui.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-white rounded-lg p-5 shadow">
                    <h2 className="text-xl text-black font-bold mb-3">Como funciona o cálculo do INSS?</h2>
                    <p className="mb-3 text-black">
                        O cálculo do INSS segue o modelo de alíquotas progressivas, onde cada faixa salarial tem uma alíquota específica.
                        O valor final é calculado aplicando-se a alíquota correspondente ao seu salário e subtraindo a parcela a deduzir.
                    </p>
                    <p className="text-gray-600">
                        Exemplo ({year}): para um salário de R$ 3.000,00, aplica-se a alíquota de {formatPercent(exemplo.faixa.aliquota)} e
                        subtrai-se a dedução de {formatCurrency(exemplo.faixa.deducao)}, resultando em uma contribuição de {formatCurrency(exemplo.inss)}.
                        Salários acima do teto ({formatCurrency(tetoINSS(year))}) contribuem sobre o teto.
                    </p>
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-black flex items-center">
                            <Calculator className="w-5 h-5 mr-2 text-green-600" />
                            <span>Quer calcular sua aposentadoria por idade? </span>
                            <Link to="/app/AposentadoriaCalculator" className="ml-2 text-green-600 hover:text-green-800 font-medium">
                                Acesse nosso simulador de aposentadoria →
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
