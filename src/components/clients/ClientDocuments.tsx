import React from 'react';
import { Upload, File, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { Client } from '../../types/client';

interface ClientDocumentsProps {
  client: Client;
  onUpload: (files: FileList) => Promise<void>;
  onDelete: (documentId: string) => Promise<void>;
}

export function ClientDocuments({ client, onUpload, onDelete }: ClientDocumentsProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      onUpload(e.target.files);
    }
  };

  return (
    <Card title="Documentos">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Documentos do Cliente</h3>
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <Button type="button">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </label>
        </div>

        <div className="divide-y divide-white/10">
          {client.documents?.map((doc) => (
            <div
              key={doc.id}
              className="py-3 flex items-center justify-between"
            >
              <div className="flex items-center">
                <File className="w-5 h-5 text-blue-400 mr-3" />
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-gray-400">
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
                  Visualizar
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

          {!client.documents?.length && (
            <p className="text-gray-400 text-center py-4">
              Nenhum documento cadastrado
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}