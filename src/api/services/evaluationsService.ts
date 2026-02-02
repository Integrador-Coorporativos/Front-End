import api from "../api"
import type {
  CreateEvaluationRequest,
  CreateEvaluationResponse,
} from "../types/evaluation"

export const createEvaluation = async (
  classId: number,
  payload: CreateEvaluationRequest
): Promise<CreateEvaluationResponse> => {
  const response = await api.post<CreateEvaluationResponse>(
    "/api/evaluations",
    payload,
    {
      params: {
        id: classId,
      },
    }
  )

  return response.data
}
