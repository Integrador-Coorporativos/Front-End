import { useState, useEffect } from 'react';
import { getCoursesPanel } from '@/api/services/coursePanelService';
import type { CoursePanel } from '../../types/CoursesPanel';

export function useCoursesPanel() {
  const [coursesPanel, setCoursesPanel] = useState<CoursePanel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getCoursesPanel();
        setCoursesPanel(data);
      } catch (err) {
        setError("Erro ao carregar painel de cursos.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { coursesPanel, loading, error };
}
