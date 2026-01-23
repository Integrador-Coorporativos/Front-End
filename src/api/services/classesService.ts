import api from '../api';
import { type ClassResponse } from '../types/classes';


export const getClassById = async (classId: number): Promise<ClassResponse> => {
  const response = await api.get<ClassResponse>(`/api/classes/${classId}`);
  return response.data;
};