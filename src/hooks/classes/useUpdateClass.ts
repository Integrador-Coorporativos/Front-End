import { useState } from 'react';
import { updateClass } from '@/api/services/classesService';
import type { ClassUpdateRequest } from '@/api/types/classUpdate';

export function useUpdateClass() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeUpdate = async (id: number, data: ClassUpdateRequest) => {
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