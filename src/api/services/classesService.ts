import api from '../api';
import type { ClassResponse } from '../types/classes';
import type { ClassListItem } from '../types/classes';
import type { ClassUpdateRequest } from '../types/classUpdate';
import type { ClassPanel } from '../types/classPanel';

export const getClassesForPanel = async (): Promise<ClassPanel[]> => {
  const response = await api.get<ClassPanel[]>('/api/classes/panel');
  return response.data;
};

export const getClasses = async (): Promise<ClassListItem[]> => {
  const response = await api.get<ClassListItem[]>('/api/classes');
  return response.data;
};

export const getClassById = async (classId: number): Promise<ClassResponse> => {
  const response = await api.get<ClassResponse>(`/api/classes/${classId}`);
  return response.data;
};

export const updateClass = async (
  id: number,
  data: ClassUpdateRequest
): Promise<ClassResponse> => {
  const response = await api.put<ClassResponse>(`/api/classes/${id}`, data);
  return response.data;
};
