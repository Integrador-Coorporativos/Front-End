import { useState } from "react";
import axios from "axios";
import { createClassComment } from "@/api/services/classCommentsService";
import type { CreateClassCommentRequest, ClassComment } from "@/api/types/classComments";

export function useCreateClassComment(options?: { onSuccess?: (created?: ClassComment) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (classId: number, payload: CreateClassCommentRequest) => {
    setLoading(true);
    setError(null);

    try {
      const created = await createClassComment(classId, payload);
      options?.onSuccess?.(created);
      return created;
    } catch (err: unknown) {
      // ✅ pega mensagem real do backend
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const data = err.response?.data as any;

        const backendMsg =
          data?.message ||
          data?.error ||
          data?.detail ||
          (typeof data === "string" ? data : null);

        console.error("POST comment error:", { status, data, err });

        setError(
          backendMsg
            ? `Erro (${status}): ${backendMsg}`
            : `Erro ao enviar comentário${status ? ` (${status})` : ""}.`
        );
      } else {
        console.error("POST comment unknown error:", err);
        setError("Erro ao enviar comentário.");
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}
