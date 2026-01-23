import { useState, useEffect } from 'react';
import { getCourses } from '../../api/services/courseService';
import type { Course } from '@/api/types/course';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar cursos.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { courses, loading, error };
}