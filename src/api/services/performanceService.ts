
import api from "../api";
import type { ClassPerformanceResponse } from "../types/performance";

export const getAllClassPerformance = async (): Promise<ClassPerformanceResponse[]> => {
    console.log("BASE URL:", import.meta.env.VITE_API_BASE_URL);
  const response = await api.get<ClassPerformanceResponse[]>("/api/performance/class/all");
  return response.data;
};