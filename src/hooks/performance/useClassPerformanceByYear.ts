import { useEffect, useState } from "react";
import { getClassPerformanceByYear } from "@/api/services/performanceService";
import type { ClassPerformanceByYearResponse } from "@/api/types/performance";

export function useClassPerformanceByYear(
  classId?: number,
  year?: number
) {
  const [data, setData] = useState<ClassPerformanceByYearResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    if (!classId || !year) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getClassPerformanceByYear(classId, year);
      setData(result);
    } catch (err) {
      console.error("Erro no hook useClassPerformanceByYear:", err);
      setError("Erro ao carregar performance da turma.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [classId, year]);

  return { data, loading, error, refresh: loadData };
}
