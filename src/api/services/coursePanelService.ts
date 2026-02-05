import api from '../api';
import type { CoursePanel } from '../../types/CoursesPanel';

export const getCoursesPanel = async (): Promise<CoursePanel[]> => {
  const response = await api.get<CoursePanel[]>('/api/courses/panel');
  return response.data;
};
