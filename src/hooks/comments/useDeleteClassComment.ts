import { useState } from "react";
import axios from "axios";
import { deleteClassComment } from "@/api/services/classCommentsService";

export function useDeleteClassComment(options?: { onSuccess?: (commentId?: number) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (classId: number, commentId: number) => {
    setLoading(true);
    setError(null);

    try {
      await deleteClassComment(classId, commentId);
      options?.onSuccess?.(commentId);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const data = err.response?.data as any;

        const backendMsg =
          data?.message || data?.error || data?.detail || (typeof data === "string" ? data : null);

        console.error("DELETE comment error:", { status, data, err });

        setError(
          backendMsg
            ? `Erro (${status}): ${backendMsg}`
            : `Erro ao deletar comentário${status ? ` (${status})` : ""}.`
        );
      } else {
        console.error("DELETE comment unknown error:", err);
        setError("Erro ao deletar comentário.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}
