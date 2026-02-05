import api from "../api"
import type {
  ClassPerformanceResponse,
  ClassPerformanceByYearResponse,
  Bimestre,
} from "../types/performance"

export const getAllClassPerformance = async (): Promise<ClassPerformanceResponse[]> => {
  console.log("BASE URL:", import.meta.env.VITE_API_BASE_URL)
  const response = await api.get<ClassPerformanceResponse[]>("/api/performance/class/all")
  return response.data
}

export const getClassPerformanceByYear = async (
  classId: number,
  year: number,
  bimestre: Bimestre
): Promise<ClassPerformanceByYearResponse> => {
  const response = await api.get<ClassPerformanceByYearResponse>(
    `/api/performance/class/${classId}/${year}/bimestre/${bimestre}`
  )
  return response.data
}
