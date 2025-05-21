import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Info, Calculator, History, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const INSS_TABLE_2025 = [
    { min: 0, max: 1518.00, aliquot: 0.075, deduction: 0 },
    { min: 1518.01, max: 2793.88, aliquot: 0.09, deduction: 22.77 },
    { min: 2793.89, max: 4190.83, aliquot: 0.12, deduction: 106.59 },
    { min: 4190.84, max: 8157.41, aliquot: 0.14, deduction: 190.40 },
];

interface CalculationResult {
    salary: number;
    faixa: string;
    aliquot: number;
    deduction: number;
    inss: number;
    date: Date;
}

function calculateINSS(salary: number): { faixa: string, aliquot: number, deduction: number, inss: number } | null {
    const faixa = INSS_TABLE_2025.find(f => salary >= f.min && salary <= f.max);
    if (!faixa) return null;
    const inss = salary * faixa.aliquot - faixa.deduction;
    return {
        faixa: `R$ ${faixa.min.toFixed(2)} até R$ ${faixa.max.toFixed(2)}`,
        aliquot: faixa.aliquot * 100,
        deduction: faixa.deduction,
        inss: inss < 0 ? 0 : inss,
    };
}

// Formatação de valores monetários
const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
};

export default function INSSCalculator() {
    const [salary, setSalary] = useState('');
    const [result, setResult] = useState<ReturnType<typeof calculateINSS> | null>(null);
    const [history, setHistory] = useState<CalculationResult[]>([]);
    const [showTable, setShowTable] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [formattedSalary, setFormattedSalary] = useState('');

    // Carregar histórico do localStorage
    useEffect(() => {
        const savedHistory = localStorage.getItem('inssCalculationHistory');
        if (savedHistory) {
            try {
                const parsed = JSON.parse(savedHistory);
                setHistory(parsed.map((item: any) => ({
                    ...item,
                    date: new Date(item.date)
                })));
            } catch (e) {
                console.error('Erro ao carregar histórico:', e);
            }
        }
    }, []);

    // Formatar entrada de salário
    const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Permite digitar o valor completo antes de formatar
        if (value === '') {
            setSalary('');
            setFormattedSalary('');
            return;
        }

        // Mantém apenas números, vírgulas e pontos
        const cleaned = value.replace(/[^\d,.]/g, '');

        // Não formata enquanto o usuário está digitando
        setSalary(cleaned);

        // Não mostra a formatação no campo enquanto o usuário digita
        setFormattedSalary(cleaned);
    };

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();

        // Remove os símbolos não numéricos, preservando apenas um separador decimal
        const normalizedValue = salary.replace(/[^\d]/g, '');
        const value = parseFloat(normalizedValue) / 100; // Considera os dois últimos dígitos como centavos

        if (isNaN(value) || value <= 0) {
            setResult(null);
            return;
        }

        // Formata o valor apenas após o cálculo
        setFormattedSalary(formatCurrency(value));

        const calculationResult = calculateINSS(value);
        setResult(calculationResult);

        if (calculationResult) {
            const newResult: CalculationResult = {
                ...calculationResult,
                salary: value,
                date: new Date()
            };

            const updatedHistory = [newResult, ...history.slice(0, 9)];
            setHistory(updatedHistory);
            localStorage.setItem('inssCalculationHistory', JSON.stringify(updatedHistory));
        }
    };

    const downloadCSV = () => {
        if (history.length === 0) return;

        const headers = ['Data', 'Salário', 'Faixa', 'Alíquota', 'Dedução', 'INSS'];
        const rows = history.map(item => [
            item.date.toLocaleDateString('pt-BR'),
            formatCurrency(item.salary),
            item.faixa,
            `${item.aliquot}%`,
            formatCurrency(item.deduction),
            formatCurrency(item.inss)
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `calculo_inss_${new Date().toISOString().split('T')[0]}.csv`);
        link.click();
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('inssCalculationHistory');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-blue-600 text-black p-6">
                        <h1 className="text-3xl font-bold flex items-center">
                            <Calculator className="mr-3" />
                            Cálculo do INSS 2025
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
                                        <label className="block mb-2 font-medium text-lg text-black">Informe seu salário bruto:</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formattedSalary}
                                                onChange={handleSalaryChange}
                                                className="border rounded-lg px-4 py-3 w-full text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                                placeholder="Digite o valor sem R$ (ex: 3000,00)"
                                                inputMode="decimal"
                                            />
                                        </div>
                                        <div className="text-sm text-gray-700 mt-1 flex items-center">
                                            <Info className="w-4 h-4 mr-1" />
                                            Digite o valor completo, como 3000 ou 3000,00
                                        </div>
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
                                        <h2 className="text-xl font-semibold mb-3 text-black">Tabela INSS 2025</h2>
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
                                                    {INSS_TABLE_2025.map((faixa, index) => (
                                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                            <td className="border border-gray-200 px-4 py-2 text-black">
                                                                {formatCurrency(faixa.min)} até {formatCurrency(faixa.max)}
                                                            </td>
                                                            <td className="border border-gray-200 px-4 py-2 text-black font-medium">
                                                                {faixa.aliquot * 100}%
                                                            </td>
                                                            <td className="border border-gray-200 px-4 py-2 text-black">
                                                                {formatCurrency(faixa.deduction)}
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
                                                            <td className="border border-gray-200  text-black px-3 py-2">
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
                                                <div className="text-lg font-semibold text-black">{formatCurrency(parseFloat(salary))}</div>
                                            </div>

                                            <div className="bg-white p-3 rounded border border-gray-200">
                                                <div className="text-sm text-gray-700 font-medium">Faixa salarial</div>
                                                <div className="text-md text-black">{result.faixa}</div>
                                            </div>

                                            <div className="bg-white p-3 rounded border border-gray-200">
                                                <div className="text-sm text-gray-700 font-medium">Alíquota aplicada</div>
                                                <div className="text-md font-medium text-black">{result.aliquot}%</div>
                                            </div>

                                            <div className="bg-white p-3 rounded border border-gray-200">
                                                <div className="text-sm text-gray-700 font-medium">Parcela a deduzir</div>
                                                <div className="text-md text-black">{formatCurrency(result.deduction)}</div>
                                            </div>

                                            <div className="bg-blue-100 p-4 rounded border border-blue-200">
                                                <div className="text-sm text-blue-800 font-medium">Contribuição INSS</div>
                                                <div className="text-2xl font-bold text-blue-800">{formatCurrency(result.inss)}</div>
                                            </div>
                                        </div>

                                        <div className="mt-4 text-sm text-black bg-white p-3 rounded">
                                            <p className="flex items-start">
                                                <Info className="w-4 h-4 mr-1 mt-0.5 text-blue-500" />
                                                Cálculo: {formatCurrency(parseFloat(salary))} × {result.aliquot}% - {formatCurrency(result.deduction)} = {formatCurrency(result.inss)}
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
                        Exemplo: Para um salário de R$ 3.000,00, aplica-se a alíquota de 12% e subtrai-se a dedução de R$ 106,59, resultando em uma contribuição de R$ 253,41.
                    </p>
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-black flex items-center">
                            <Calculator className="w-5 h-5 mr-2 text-green-600" />
                            <span>Quer calcular sua aposentadoria por idade? </span>
                            <Link to="/aposentadoria" className="ml-2 text-green-600 hover:text-green-800 font-medium">
                                Acesse nosso simulador de aposentadoria →
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
