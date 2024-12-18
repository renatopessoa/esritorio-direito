import React from 'react';
import { Upload, FolderPlus, Search, List, Grid } from 'lucide-react';
import { Card } from '../components/ui/Card';

export default function Documents() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Documentos</h1>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Upload
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center">
            <FolderPlus className="w-5 h-5 mr-2" />
            Nova Pasta
          </button>
        </div>
      </div>

      <Card className="mb-6">
        <div className="flex items-center justify-between p-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar documentos..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <List className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg bg-gray-100">
              <Grid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DocumentCard
          title="Petição Inicial"
          type="petition"
          date="2024-03-10"
          size="256 KB"
        />
        <DocumentCard
          title="Contrato Social"
          type="contract"
          date="2024-03-08"
          size="1.2 MB"
        />
        <DocumentCard
          title="Procuração"
          type="document"
          date="2024-03-05"
          size="128 KB"
        />
      </div>
    </div>
  );
}

function DocumentCard({ title, type, date, size }: {
  title: string;
  type: string;
  date: string;
  size: string;
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {type} • {size}
          </p>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>
    </div>
  );
}