import api from "../api";
import { type StudentPerformance } from "@/types/StudentPerformance";

export const studentService = {
  getAll: () => api.get<StudentPerformance[]>("/api/admin-panel/students"),
  update: (id: number, data: Partial<StudentPerformance>) => 
    api.put(`/api/performance/student/${id}`, data)
};

// Tipagem para os payloads
interface EvaluationPeriodPayload {
  stepName: string;
  year: number;
}

interface UpdatePerformancePayload {
  studentId: string;
  classId: string;
  averageScore: number;
  attendenceRate: number;
  failedSubjects: number;
  status: string;
}

export const adminPanelService = {
  // Busca todos os alunos
  getAllStudents: async (): Promise<StudentPerformance[]> => {
    const response = await api.get<StudentPerformance[]>('/api/admin-panel/students');
    return response.data;
  },

  // Inicia um novo período de avaliação
  startNewPeriod: async (payload: EvaluationPeriodPayload): Promise<void> => {
    await api.post('/api/admin-panel/evaluation-periods/start', payload);
  },

  // Atualiza a performance de um aluno específico
  updateStudentPerformance: async (id: number | string, payload: UpdatePerformancePayload): Promise<void> => {
    await api.put(`/api/performance/student/${id}`, payload);
  }
};