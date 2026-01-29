import { useState, useEffect } from 'react';
import { getClassesForPanel } from '@/api/services/classesService';
import type { ClassPanel } from '@/api/types/classPanel';

export function useClassesPanel() {
  const [classes, setClasses] = useState<ClassPanel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getClassesForPanel();
        setClasses(data);
      } catch (err) {
        console.error('Erro ao carregar turmas para panel:', err);
        setError('Erro ao carregar turmas para panel');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { classes, loading, error };
}
