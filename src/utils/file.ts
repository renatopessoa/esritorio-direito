export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function validateFile(file: File, maxSize: number, accept: string): string | null {
  if (!accept.split(',').some(type => 
    file.name.toLowerCase().endsWith(type.replace('*', '').trim())
  )) {
    return 'Formato de arquivo não suportado';
  }
  
  if (file.size > maxSize) {
    return `Arquivo muito grande (máximo ${formatFileSize(maxSize)})`;
  }
  
  return null;
}