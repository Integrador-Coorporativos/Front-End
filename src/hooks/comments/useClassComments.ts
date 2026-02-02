import { useEffect, useState } from "react";
import { getClassComments } from "@/api/services/classCommentsService";
import type { ClassComment } from "@/api/types/classComments";

export function useClassComments(classId?: number) {
  const [data, setData] = useState<ClassComment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    if (!classId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await getClassComments(classId);
      setData(result);
    } catch (err) {
      console.error("Erro no hook useClassComments:", err);
      setError("Erro ao carregar comentários da turma.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [classId]);

  return { data, loading, error, refresh: loadData };
}
