import { useState } from 'react';
import { uploadPlanilhaDados } from '@/api/services/importService';

export const useUploadPlanilha = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setSuccess(false);

    try {
      await uploadPlanilhaDados(file);
      setSuccess(true);
    } catch (err: any) {
      console.error('Erro no upload:', err);
      setError(err.response?.data?.message || 'Falha ao processar a planilha.');
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, success, error };
};