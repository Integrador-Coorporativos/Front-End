import api from '../api'; // Sua instância do Axios configurada
import { type Course } from '../types/course';

// Função isolada para buscar os cursos
export const getCourses = async (): Promise<Course[]> => {
  const response = await api.get<Course[]>('/api/courses');
  return response.data;
};

// Exemplo de como você já poderia deixar o POST preparado
export const createCourse = async (courseData: Omit<Course, 'id'>): Promise<Course> => {
  const response = await api.post<Course>('/api/courses', courseData);
  return response.data;
};

export const updateCourse = async (id: number, data: Partial<Course>): Promise<Course> => {
  const response = await api.put<Course>(`/api/courses/${id}`, data);
  return response.data;
};