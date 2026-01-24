import api from '../api';

/**
 * Baixa o modelo de planilha para importação de turmas.
 * Retorna um Blob que representa o arquivo binário.
 */
export const downloadModeloPlanilha = async (): Promise<Blob> => {
  const response = await api.get('/api/processing/template', {
    responseType: 'blob', // Obrigatório para arquivos binários (Excel, PDF, etc)
    headers: {
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  });
  return response.data;
};

/**
 * Envia a planilha para o servidor de processamento.
 */
export const uploadPlanilhaDados = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file); // 'file' deve ser o nome esperado pelo @RequestParam no Java

  const response = await api.post('/api/processing/uploadFile', formData);
  return response.data;
};