import { useState } from "react";
import { setMyClasses } from '../../api/services/classesService';

export function useLinkClass() {
  const [isLinking, setIsLinking] = useState(false);

  const link = async (classId: number) => {
    setIsLinking(true);
    try {
      const data = await setMyClasses(classId);
      return data;
    } catch (error) {
      console.error("Erro ao vincular turma:", error);
      throw error; // Repassa o erro para o componente tratar (ex: mostrar um toast)
    } finally {
      setIsLinking(false);
    }
  };

  return { link, isLinking };
}