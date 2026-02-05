import { useState } from 'react';
import { updateCourse } from '@/api/services/courseService';
import type { Course } from '@/api/types/course';

export function useUpdateCourse() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const executeUpdate = async (id: number, data: Partial<Course>) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const updatedData = await updateCourse(id, data);
      return updatedData; // Retorna para o componente atualizar o estado local
    } catch (err) {
      setUpdateError("Falha ao atualizar o curso.");
      throw err; 
    } finally {
      setIsUpdating(false);
    }
  };

  return { executeUpdate, isUpdating, updateError };
}