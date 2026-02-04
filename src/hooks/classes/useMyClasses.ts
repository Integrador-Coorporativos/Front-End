import { useState, useEffect } from 'react';
import { getMyClasses  } from '../../api/services/classesService'; 
import type { ClassResponse } from '@/api/types/classes';

export function useMyClasses() {
  const [classes, setClasses] = useState<ClassResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyClasses();
      setClasses(data);
    } catch (err) {
      console.error("Erro no hook useClasses:", err);
      setError("Erro ao carregar a lista de turmas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []); // Executa apenas uma vez ao montar o componente

  return { classes, loading, error, refresh: loadData };
}