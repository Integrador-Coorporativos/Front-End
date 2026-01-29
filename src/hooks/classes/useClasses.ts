import { useState, useEffect } from 'react';
import { getClasses } from '@/api/services/classesService';
import type { ClassListItem } from '../../api/types/classes';

export function useClasses() {
  const [classes, setClasses] = useState<ClassListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getClasses();
        setClasses(data);
      } catch (err) {
        console.error('Erro ao carregar turmas:', err);
        setError('Erro ao carregar turmas');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { classes, loading, error, setClasses };
}
