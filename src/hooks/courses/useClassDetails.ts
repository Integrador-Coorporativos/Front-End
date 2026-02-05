import { useState, useEffect } from 'react';
import { getClassById } from '../../api/services/classesService'; // ajuste o caminho conforme sua pasta
import type { ClassResponse } from '@/api/types/classes'; // a interface que criamos

export function useClassDetails(classId: number | undefined) {
  const [classData, setClassData] = useState<ClassResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Só dispara a busca se houver um ID válido
    if (!classId) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getClassById(classId);
        setClassData(data);
      } catch (err) {
        console.error("Erro no hook useClassDetails:", err);
        setError("Erro ao carregar detalhes da turma.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [classId]); // Recarrega se o ID da turma mudar

  return { classData, loading, error };
}