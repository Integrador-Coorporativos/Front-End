import api from '../api';
import { type ObjectWriteResponse } from '../types/minio';

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

export const imageService = {
  uploadProfileImage: async (file: File): Promise<ObjectWriteResponse> => {
    const formData = new FormData();
    formData.append("image", file);

    const { data } = await api.post<ObjectWriteResponse>(
      "/api/processing/uploadImage", 
      formData, 
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    
    return data;
  }
};