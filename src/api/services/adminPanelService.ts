import api from "../api";
import { type StudentPerformance } from "@/types/StudentPerformance";

export const studentService = {
  getAll: () => api.get<StudentPerformance[]>("/api/admin-panel/students"),
  update: (id: number, data: Partial<StudentPerformance>) => 
    api.put(`/api/performance/student/${id}`, data)
};