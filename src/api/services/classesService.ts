import api from '../api';
import { type ClassResponse } from '../types/classes';

// Função isolada para buscar os cursos
export const getCourses = async (): Promise<ClassResponse[]> => {
  const response = await api.get<ClassResponse[]>('/api/classes');
  return response.data;
};

export const getClassById = async (classId: number): Promise<ClassResponse> => {
  const response = await api.get<ClassResponse>(`/api/classes/${classId}`);
  return response.data;
};