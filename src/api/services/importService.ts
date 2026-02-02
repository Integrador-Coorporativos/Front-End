import api from '../api';

export const downloadModeloPlanilha = async (): Promise<Blob> => {
  const response = await api.get('/api/processing/template', {
    responseType: 'blob', 
    headers: {
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  });
  return response.data;
};

export const uploadPlanilhaDados = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file); 

  const response = await api.post('/api/processing/uploadFile', formData);
  return response.data;
};