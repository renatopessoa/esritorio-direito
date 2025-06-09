import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PenTool, FileText, Sparkles, Download, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const tiposDocumento = [
  { value: "peticao-inicial", label: "Petição Inicial" },
  { value: "contestacao", label: "Contestação" },
  { value: "recurso", label: "Recurso" },
  { value: "contrato", label: "Contrato" },
  { value: "parecer", label: "Parecer Jurídico" },
  { value: "memorando", label: "Memorando" }
];

const especialidades = [
  { value: "civil", label: "Direito Civil" },
  { value: "trabalhista", label: "Direito Trabalhista" },
  { value: "criminal", label: "Direito Criminal" },
  { value: "tributario", label: "Direito Tributário" },
  { value: "empresarial", label: "Direito Empresarial" },
  { value: "familia", label: "Direito de Família" }
];

export function RedatorAssistente() {
  const [parametros, setParametros] = useState({
    tipoDocumento: "",
    especialidade: "",
    resumoCaso: "",
    fundamentacao: "",
    pedidos: ""
  });
  
  const [documentoGerado, setDocumentoGerado] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGerar = async () => {
    if (!parametros.tipoDocumento || !parametros.especialidade || !parametros.resumoCaso) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos o tipo de documento, especialidade e resumo do caso.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    // Simulação de geração com IA
    setTimeout(() => {
      const docGerado = `
EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA ${parametros.especialidade === 'civil' ? 'VARA CÍVEL' : 'VARA COMPETENTE'} DE SÃO PAULO/SP

${parametros.tipoDocumento === 'peticao-inicial' ? 'PETIÇÃO INICIAL' : parametros.tipoDocumento.toUpperCase()}

Processo nº: [A SER DISTRIBUÍDO]
Assunto: ${parametros.resumoCaso}

[NOME DO REQUERENTE], [qualificação completa], por intermédio de seu(ua) advogado(a) que esta subscreve, com base nos artigos [artigos pertinentes] do Código ${parametros.especialidade === 'civil' ? 'Civil' : 'de Processo Civil'}, vem respeitosamente à presença de Vossa Excelência propor a presente ação em face de [NOME DO REQUERIDO], [qualificação], pelas razões de fato e direito a seguir expostas:

I - DOS FATOS

${parametros.resumoCaso}

${parametros.fundamentacao && `
II - DO DIREITO

${parametros.fundamentacao}

A jurisprudência pátria tem se manifestado de forma consolidada sobre a matéria, conforme se verifica nos seguintes precedentes:

[Precedentes relevantes serão inseridos aqui baseados na fundamentação fornecida]
`}

III - DOS PEDIDOS

Diante do exposto, requer-se a Vossa Excelência que se digne:

${parametros.pedidos || 'a) Julgar procedente a presente ação;\nb) Condenar o requerido ao pagamento das custas processuais e honorários advocatícios;\nc) Deferir outros pedidos que se fizerem necessários.'}

Protesta pela produção de todas as provas em direito admitidas, especialmente prova documental, testemunhal e pericial, se necessário.

Dá-se à causa o valor de R$ [VALOR A SER DEFINIDO].

Termos em que,
Pede e espera deferimento.

São Paulo, ${new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}.

_________________________
[NOME DO ADVOGADO]
OAB/SP nº [NÚMERO]
      `;
      
      setDocumentoGerado(docGerado);
      setLoading(false);
    }, 3000);
  };

  const handleCopiar = () => {
    navigator.clipboard.writeText(documentoGerado);
    toast({
      title: "Documento copiado!",
      description: "O documento foi copiado para a área de transferência.",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([documentoGerado], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${parametros.tipoDocumento}_${Date.now()}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-purple-600 mb-2 flex items-center gap-2">
          <PenTool className="w-8 h-8" />
          Redator Assistente com IA
        </h1>
        <p className="text-muted-foreground">
          Geração inteligente de documentos jurídicos com fundamentação automatizada
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de Parâmetros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Parâmetros do Documento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Tipo de Documento *</Label>
              <Select value={parametros.tipoDocumento} onValueChange={(value) => setParametros({...parametros, tipoDocumento: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  {tiposDocumento.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>{tipo.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Área do Direito *</Label>
              <Select value={parametros.especialidade} onValueChange={(value) => setParametros({...parametros, especialidade: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a especialidade" />
                </SelectTrigger>
                <SelectContent>
                  {especialidades.map((esp) => (
                    <SelectItem key={esp.value} value={esp.value}>{esp.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Resumo do Caso *</Label>
              <Textarea
                placeholder="Descreva brevemente os fatos principais do caso..."
                value={parametros.resumoCaso}
                onChange={(e) => setParametros({...parametros, resumoCaso: e.target.value})}
                rows={3}
              />
            </div>

            <div>
              <Label>Fundamentação Legal (Opcional)</Label>
              <Textarea
                placeholder="Artigos de lei, jurisprudência, doutrina relevante..."
                value={parametros.fundamentacao}
                onChange={(e) => setParametros({...parametros, fundamentacao: e.target.value})}
                rows={3}
              />
            </div>

            <div>
              <Label>Pedidos Específicos (Opcional)</Label>
              <Textarea
                placeholder="Liste os pedidos específicos que devem constar no documento..."
                value={parametros.pedidos}
                onChange={(e) => setParametros({...parametros, pedidos: e.target.value})}
                rows={3}
              />
            </div>

            <Button onClick={handleGerar} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Gerando documento...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar Documento com IA
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Documento Gerado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documento Gerado
              </div>
              {documentoGerado && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopiar}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {documentoGerado ? (
              <div className="relative">
                <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg border max-h-[600px] overflow-y-auto">
                  {documentoGerado}
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>O documento gerado aparecerá aqui</p>
                  <p className="text-sm">Preencha os parâmetros e clique em "Gerar Documento"</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sugestões de Melhorias */}
      {documentoGerado && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-purple-700">Sugestões de IA para Melhorias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">Considere adicionar fundamentação específica sobre precedentes do STJ</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">Recomenda-se incluir pedido de tutela de urgência se aplicável</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">Verificar se há necessidade de juntada de documentos específicos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
