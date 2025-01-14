import React, { useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { Card } from '../ui/Card';

interface AvatarUploadProps {
  value?: string;
  onChange: (value: string) => void;
}

export function AvatarUpload({ value, onChange }: AvatarUploadProps) {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onChange]);

  return (
    <Card title="Foto de Perfil">
      <div className="flex items-center gap-4">
        <div className="relative">
          {value ? (
            <div className="relative">
              <img
                src={value}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover"
              />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Upload de foto
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="avatar-upload"
          />
          <label
            htmlFor="avatar-upload"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 cursor-pointer"
          >
            Escolher arquivo
          </label>
          <p className="mt-1 text-xs text-gray-400">
            JPG, PNG ou GIF. Máximo 2MB.
          </p>
        </div>
      </div>
    </Card>
  );
}