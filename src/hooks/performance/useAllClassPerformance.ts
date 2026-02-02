import { useEffect, useState } from "react";
import { getAllClassPerformance } from "@/api/services/performanceService";
import type { ClassPerformanceResponse } from "@/api/types/performance";

export function useAllClassPerformance() {
  const [data, setData] = useState<ClassPerformanceResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllClassPerformance();
      setData(result);
    } catch (err) {
      console.error("Erro no hook useAllClassPerformance:", err);
      setError("Erro ao carregar performance das turmas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return { data, loading, error, refresh: loadData };
}