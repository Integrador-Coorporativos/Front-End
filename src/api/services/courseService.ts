import api from '../api'; 
import { type Course } from '../types/course';

export const getCourses = async (): Promise<Course[]> => {
  const response = await api.get<Course[]>('/api/courses');
  return response.data;
};

export const createCourse = async (courseData: Omit<Course, 'id'>): Promise<Course> => {
  const response = await api.post<Course>('/api/courses', courseData);
  return response.data;
};

export const updateCourse = async (id: number, data: Partial<Course>): Promise<Course> => {
  const response = await api.put<Course>(`/api/courses/${id}`, data);
  return response.data;
};