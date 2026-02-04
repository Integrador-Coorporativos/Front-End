import { useState } from "react";
import axios from "axios";
import { updateClassComment } from "@/api/services/classCommentsService";
import type { ClassComment, UpdateClassCommentRequest } from "@/api/types/classComments";

export function useUpdateClassComment(options?: { onSuccess?: (updated?: ClassComment) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
    classId: number,
    commentId: number,
    payload: UpdateClassCommentRequest
  ) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await updateClassComment(classId, commentId, payload);
      options?.onSuccess?.(updated);
      return updated;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const data = err.response?.data as any;

        const backendMsg =
          data?.message || data?.error || data?.detail || (typeof data === "string" ? data : null);

        console.error("PUT comment error:", { status, data, err });

        setError(
          backendMsg
            ? `Erro (${status}): ${backendMsg}`
            : `Erro ao atualizar comentário${status ? ` (${status})` : ""}.`
        );
      } else {
        console.error("PUT comment unknown error:", err);
        setError("Erro ao atualizar comentário.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}
