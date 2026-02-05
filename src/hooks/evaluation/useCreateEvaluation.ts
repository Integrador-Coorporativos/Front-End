import { useState } from "react"
import axios from "axios"
import { createEvaluation } from "@/api/services/evaluationsService"
import type {
  CreateEvaluationRequest,
  CreateEvaluationResponse,
} from "@/api/types/evaluation"

export function useCreateEvaluation() {
  const [data, setData] = useState<CreateEvaluationResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitEvaluation = async (
    classId: number,
    payload: CreateEvaluationRequest
  ) => {
    setLoading(true)
    setError(null)

    try {
      const result = await createEvaluation(classId, payload)
      setData(result)
      return result
    } catch (err) {
      let msg = "Erro ao salvar avaliação."

      if (axios.isAxiosError(err)) {
        const apiMsg =
          (err.response?.data as any)?.message ||
          (err.response?.data as any)?.error ||
          (err.response?.data as any)?.detail ||
          JSON.stringify(err.response?.data)

        if (apiMsg) msg = apiMsg
      }

      console.error("Erro ao criar avaliação:", err)
      setError(msg)
      setData(null)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, submitEvaluation }
}
