// hooks/classes/useUpdateClass.ts
import { useState } from 'react';
import { updateClass } from '@/api/services/classesService';
import type { ClassResponse } from '@/api/types/classes';

export function useUpdateClass() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeUpdate = async (id: number, data: Partial<ClassResponse>) => {
    setIsUpdating(true);
    setError(null);
    try {
      const updatedData = await updateClass(id, data);
      return updatedData;
    } catch (err) {
      setError("Falha ao atualizar a turma.");
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return { executeUpdate, isUpdatingClass: isUpdating, updateClassError: error };
}