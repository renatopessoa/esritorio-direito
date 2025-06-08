import React, { useState } from 'react';
import { Card, Button, TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../services/api';

interface JurimetryAnalysisProps {
  clientId: number;
}

interface SettlementSuggestion {
  recommendedRange: {
    min: number;
    max: number;
  };
  idealTiming: number;
  probability: number;
  reasoning?: string;
}

interface AnalysisData {
  similarCasesCount: number;
  dataQuality: string;
  confidenceLevel: string;
}

interface JurimetryResult {
  successRate: number;
  averageDuration: number;
  averageValue: number;
  settlementSuggestion?: SettlementSuggestion;
  analysisData: AnalysisData;
}

export const JurimetryAnalysis: React.FC<JurimetryAnalysisProps> = ({ clientId }) => {
  const [formData, setFormData] = useState({
    clientId,
    caseType: '',
    legalThesis: '',
    court: '',
    courtSection: '',
    judgeId: null
  });

  const [analysisResult, setAnalysisResult] = useState<JurimetryResult | null>(null);

  const mutation = useMutation({
    mutationFn: api.jurimetry.analyzeCase,
    onSuccess: (data: { analysis: JurimetryResult }) => {
      setAnalysisResult(data.analysis);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const successData = analysisResult ? [
    { name: 'Sucesso', value: analysisResult.successRate },
    { name: 'Insucesso', value: 100 - analysisResult.successRate }
  ] : [];

  const COLORS = ['#4CAF50', '#F44336'];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Análise Jurimetrica</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormControl fullWidth>
            <InputLabel>Tipo de Caso</InputLabel>
            <Select
              value={formData.caseType}
              onChange={(e) => setFormData({...formData, caseType: e.target.value})}
            >
              <MenuItem value="trabalhista">Trabalhista</MenuItem>
              <MenuItem value="civil">Civil</MenuItem>
              <MenuItem value="criminal">Criminal</MenuItem>
              <MenuItem value="tributario">Tributário</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Tese Jurídica"
            value={formData.legalThesis}
            onChange={(e) => setFormData({...formData, legalThesis: e.target.value})}
            placeholder="Descreva a tese jurídica do caso..."
          />

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Comarca"
              value={formData.court}
              onChange={(e) => setFormData({...formData, court: e.target.value})}
            />
            <TextField
              label="Vara"
              value={formData.courtSection}
              onChange={(e) => setFormData({...formData, courtSection: e.target.value})}
            />
          </div>

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
            disabled={mutation.isPending}
          >
            {mutation.isPending ? <CircularProgress size={24} /> : 'Analisar Caso'}
          </Button>
        </form>
      </Card>

      {mutation.error && (
        <Alert severity="error">
          Erro na análise: {mutation.error.message}
        </Alert>
      )}

      {analysisResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Probabilidade de Sucesso</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={successData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {successData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-2">
              <p className="text-2xl font-bold">{analysisResult.successRate}%</p>
              <p className="text-gray-600">Taxa de Sucesso Prevista</p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Métricas do Processo</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Duração Média</p>
                <p className="text-xl font-bold">{Math.round(analysisResult.averageDuration / 30)} meses</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor Médio de Condenação</p>
                <p className="text-xl font-bold">
                  {new Intl.NumberFormat('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL' 
                  }).format(analysisResult.averageValue)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nível de Confiança</p>
                <p className="text-xl font-bold capitalize">{analysisResult.analysisData.confidenceLevel}</p>
              </div>
            </div>
          </Card>

          {analysisResult.settlementSuggestion && (
            <Card className="p-6 md:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Sugestão de Acordo</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Faixa Recomendada</p>
                  <p className="text-lg font-bold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                      .format(analysisResult.settlementSuggestion.recommendedRange.min)} - {' '}
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                      .format(analysisResult.settlementSuggestion.recommendedRange.max)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Timing Ideal</p>
                  <p className="text-lg font-bold">{analysisResult.settlementSuggestion.idealTiming} dias</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Probabilidade de Acordo</p>
                  <p className="text-lg font-bold">{analysisResult.settlementSuggestion.probability}%</p>
                </div>
              </div>
              {analysisResult.settlementSuggestion.reasoning && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Fundamentação</p>
                  <p className="text-sm">{analysisResult.settlementSuggestion.reasoning}</p>
                </div>
              )}
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
