import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";    
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderOpen, Upload, FileText, Brain, Check, AlertCircle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentoAnalisado {
  nome: string;
  tipo: string;
  categoria: string;
  confianca: number;
  informacoesExtraidas: {
    numeroProcesso?: string;
    partes?: string[];
    dataDocumento?: string;
    vara?: string;
    assunto?: string;
  };
  status: 'processando' | 'concluido' | 'erro';
}

export function DocumentClassifier() {
  const [documentos, setDocumentos] = useState<DocumentoAnalisado[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    processarArquivos(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processarArquivos(files);
    }
  };

  const processarArquivos = (files: File[]) => {
    files.forEach((file) => {
      const novoDoc: DocumentoAnalisado = {
        nome: file.name,
        tipo: file.type,
        categoria: '',
        confianca: 0,
        informacoesExtraidas: {},
        status: 'processando'
      };

      setDocumentos(prev => [...prev, novoDoc]);

      // Simulação de processamento com IA
      setTimeout(() => {
        const categorias = [
          'Petição Inicial',
          'Contestação',
          'Sentença',
          'Recurso',
          'Contrato',
          'Certidão',
          'Alvará',
          'Procuração'
        ];

        const categoria = categorias[Math.floor(Math.random() * categorias.length)];
        const confianca = Math.floor(Math.random() * 30) + 70; // 70-100%

        const informacoesSimuladas = {
          numeroProcesso: `${Math.floor(Math.random() * 9000000) + 1000000}-${Math.floor(Math.random() * 90) + 10}.2024.8.26.0001`,
          partes: ['João Silva', 'Maria Santos'],
          dataDocumento: new Date().toLocaleDateString('pt-BR'),
          vara: '1ª Vara Cível',
          assunto: 'Ação de Indenização por Danos Morais'
        };

        setDocumentos(prev => 
          prev.map(doc => 
            doc.nome === file.name 
              ? {
                  ...doc,
                  categoria,
                  confianca,
                  informacoesExtraidas: informacoesSimuladas,
                  status: 'concluido'
                }
              : doc
          )
        );
      }, 2000 + Math.random() * 3000);
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processando':
        return <Brain className="w-4 h-4 animate-pulse text-blue-500" />;
      case 'concluido':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'erro':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getConfiancaColor = (confianca: number) => {
    if (confianca >= 90) return 'text-green-600';
    if (confianca >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-600 mb-2 flex items-center gap-2">
          <FolderOpen className="w-8 h-8" />
          Classificador Inteligente de Documentos
        </h1>
        <p className="text-muted-foreground">
          Análise e classificação automática de documentos jurídicos com extração de informações
        </p>
      </div>

      {/* Área de Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload de Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 hover:border-green-400'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">
              Arraste documentos aqui ou clique para selecionar
            </h3>
            <p className="text-muted-foreground mb-4">
              Suporta PDF, DOC, DOCX, TXT (máx. 10MB por arquivo)
            </p>
            <Input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="max-w-xs mx-auto"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Documentos Processados */}
      {documentos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Documentos Analisados ({documentos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documentos.map((doc, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(doc.status)}
                      <div>
                        <h4 className="font-medium">{doc.nome}</h4>
                        <p className="text-sm text-muted-foreground">
                          {doc.status === 'processando' ? 'Analisando com IA...' : 
                           doc.status === 'concluido' ? `Classificado como: ${doc.categoria}` :
                           'Erro na análise'}
                        </p>
                      </div>
                    </div>
                    {doc.status === 'concluido' && (
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getConfiancaColor(doc.confianca)}`}>
                          {doc.confianca}% confiança
                        </div>
                      </div>
                    )}
                  </div>

                  {doc.status === 'concluido' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-3 rounded">
                      {doc.informacoesExtraidas.numeroProcesso && (
                        <div>
                          <Label className="text-xs font-medium text-gray-600">Nº Processo</Label>
                          <p className="text-sm">{doc.informacoesExtraidas.numeroProcesso}</p>
                        </div>
                      )}
                      {doc.informacoesExtraidas.partes && (
                        <div>
                          <Label className="text-xs font-medium text-gray-600">Partes</Label>
                          <p className="text-sm">{doc.informacoesExtraidas.partes.join(' vs ')}</p>
                        </div>
                      )}
                      {doc.informacoesExtraidas.vara && (
                        <div>
                          <Label className="text-xs font-medium text-gray-600">Vara</Label>
                          <p className="text-sm">{doc.informacoesExtraidas.vara}</p>
                        </div>
                      )}
                      {doc.informacoesExtraidas.dataDocumento && (
                        <div>
                          <Label className="text-xs font-medium text-gray-600">Data</Label>
                          <p className="text-sm">{doc.informacoesExtraidas.dataDocumento}</p>
                        </div>
                      )}
                      {doc.informacoesExtraidas.assunto && (
                        <div className="md:col-span-2">
                          <Label className="text-xs font-medium text-gray-600">Assunto</Label>
                          <p className="text-sm">{doc.informacoesExtraidas.assunto}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {doc.status === 'concluido' && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button variant="outline" size="sm">
                        Exportar Dados
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas */}
      {documentos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {documentos.filter(d => d.status === 'concluido').length}
                </div>
                <div className="text-sm text-muted-foreground">Processados</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {documentos.filter(d => d.status === 'processando').length}
                </div>
                <div className="text-sm text-muted-foreground">Em Análise</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {documentos.filter(d => d.confianca >= 90).length}
                </div>
                <div className="text-sm text-muted-foreground">Alta Confiança</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(documentos.filter(d => d.categoria).map(d => d.categoria)).size}
                </div>
                <div className="text-sm text-muted-foreground">Categorias</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
