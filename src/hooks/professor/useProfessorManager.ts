import { useState, useEffect } from "react";
import { professorService } from "../../api/services/professorService";
import type { Professor } from "@/types/Professor";

export function useProfessorManager() {
  const [professores, setProfessores] = useState<Professor[]>([]);
  console.log("HOOK DE PROFESSORES ATIVADO!");
  const [loading, setLoading] = useState(true);

  const fetchProfessores = async () => {
    setLoading(true);
    try {
      const data = await professorService.getAll();
      console.log(data);
      setProfessores(data);
    } catch (error) {
      console.error("Erro ao buscar professores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessores();
  }, []);

  return { professores, loading, refresh: fetchProfessores };
}