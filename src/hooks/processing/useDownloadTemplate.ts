import { useState } from 'react';
import { downloadModeloPlanilha } from '@/api/services/importService';

export const useDownloadTemplate = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const download = async (filename: string = 'template_importacao.xlsx') => {
    setIsDownloading(true);
    setError(null);

    try {
      const blob = await downloadModeloPlanilha();
      
      // Criação do link temporário
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao baixar modelo:', err);
      setError('Não foi possível baixar o modelo. Tente novamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  return { download, isDownloading, error };
};