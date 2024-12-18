import React from 'react';
import { Upload, File, Trash2, Download } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { Process } from '../../types/process';

interface ProcessDocumentsProps {
  process: Process;
  onUpload: (files: FileList) => Promise<void>;
  onDelete: (documentId: string) => Promise<void>;
}

export function ProcessDocuments({ process, onUpload, onDelete }: ProcessDocumentsProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      onUpload(e.target.files);
    }
  };

  return (
    <Card title="Documentos do Processo">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Documentos</h3>
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </label>
        </div>

        <div className="divide-y divide-white/10">
          {process.documents?.map((doc) => (
            <div
              key={doc.id}
              className="py-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <File className="w-8 h-8 text-blue-400" />
                <div>
                  <h4 className="font-medium text-white">{doc.title}</h4>
                  <p className="text-sm text-gray-400">
                    Versão {doc.version} • Enviado em{' '}
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(doc.url)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(doc.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </Button>
              </div>
            </div>
          ))}

          {!process.documents?.length && (
            <p className="text-center py-8 text-gray-400">
              Nenhum documento anexado
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}