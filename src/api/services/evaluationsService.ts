import api from "../api"
import type {
  CreateEvaluationRequest,
  CreateEvaluationResponse,
} from "../types/evaluation"
import { type DashboardMetrics } from "../types/dashboard"

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

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const response = await api.get<DashboardMetrics>("api/evaluations/dashboard/metrics");
  return response.data;
};
