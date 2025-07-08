import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { Input } from "../ui/Input";
import { Label } from "../ui/label";
import { Scale, TrendingUp, Target, AlertTriangle, Brain, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const sucessoData = [
  { vara: "1ª Vara Cível", sucesso: 85, total: 120 },
  { vara: "2ª Vara Cível", sucesso: 72, total: 95 },
  { vara: "3ª Vara Cível", sucesso: 91, total: 110 },
  { vara: "Vara Trabalhista", sucesso: 67, total: 89 },
  { vara: "Vara Criminal", sucesso: 45, total: 78 }
];

const tipoAcaoData = [
  { name: "Indenização", value: 35, color: "#0ea5e9" },
  { name: "Trabalhista", value: 28, color: "#10b981" },
  { name: "Família", value: 20, color: "#f59e0b" },
  { name: "Criminal", value: 17, color: "#ef4444" }
];

export function JurimetriaDashboard() {
  const [filtros, setFiltros] = useState({
    comarca: "",
    vara: "",
    periodo: "6m"
  });

  const [predicao, setPredicao] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePredicao = async () => {
    setLoading(true);
    
    // Simulação de chamada para Edge Function
    setTimeout(() => {
      setPredicao({
        probabilidadeSucesso: 78,
        tempoEstimado: "8-12 meses",
        valorSugerido: "R$ 25.000 - R$ 35.000",
        fundamentosChave: [
          "Jurisprudência favorável no STJ",
          "Precedente similar na mesma vara",
          "Histórico positivo com o juiz responsável"
        ],
        recomendacoes: [
          "Negociar acordo em fase inicial",
          "Fortalecer fundamentação em danos morais",
          "Incluir perícia técnica especializada"
        ]
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-blue-600 mb-2 flex items-center gap-2">
          <Scale className="w-8 h-8" />
          Dashboard de Jurimetria com IA
        </h1>
        <p className="text-muted-foreground">
          Análise preditiva avançada para decisões estratégicas em processos judiciais
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Análise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Comarca</Label>
              <Select value={filtros.comarca} onValueChange={(value: string) => setFiltros({...filtros, comarca: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a comarca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sao-paulo">São Paulo</SelectItem>
                  <SelectItem value="rio-janeiro">Rio de Janeiro</SelectItem>
                  <SelectItem value="belo-horizonte">Belo Horizonte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Vara</Label>
              <Select value={filtros.vara} onValueChange={(value: string) => setFiltros({...filtros, vara: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a vara" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-civel">1ª Vara Cível</SelectItem>
                  <SelectItem value="2-civel">2ª Vara Cível</SelectItem>
                  <SelectItem value="trabalhista">Vara Trabalhista</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Período</Label>
              <Select value={filtros.periodo} onValueChange={(value: string) => setFiltros({...filtros, periodo: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">Últimos 3 meses</SelectItem>
                  <SelectItem value="6m">Últimos 6 meses</SelectItem>
                  <SelectItem value="1a">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handlePredicao} disabled={loading} className="w-full">
                {loading ? "Analisando..." : "Analisar com IA"}
                <Brain className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Sucesso Geral</p>
                <p className="text-2xl font-bold text-green-600">74%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tempo Médio</p>
                <p className="text-2xl font-bold text-blue-600">14 meses</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Casos Ativos</p>
                <p className="text-2xl font-bold text-orange-600">127</p>
              </div>
              <Scale className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recursos</p>
                <p className="text-2xl font-bold text-red-600">23</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predição IA */}
      {predicao && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-700 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Análise Preditiva com IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-green-600">{predicao.probabilidadeSucesso}%</div>
                <div className="text-sm text-muted-foreground">Probabilidade de Sucesso</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-lg font-bold text-blue-600">{predicao.tempoEstimado}</div>
                <div className="text-sm text-muted-foreground">Tempo Estimado</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-lg font-bold text-orange-600">{predicao.valorSugerido}</div>
                <div className="text-sm text-muted-foreground">Valor Sugerido</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-blue-700 mb-2">Fundamentos Chave</h4>
                <ul className="space-y-1">
                  {predicao.fundamentosChave.map((item: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-700 mb-2">Recomendações Estratégicas</h4>
                <ul className="space-y-1">
                  {predicao.recomendacoes.map((item: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Sucesso por Vara</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sucessoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="vara" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sucesso" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Tipo de Ação</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tipoAcaoData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tipoAcaoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
