import { useState, useEffect, useCallback } from "react";
import { adminPanelService } from "@/api/services/adminPanelService";
import type { StudentPerformance } from "@/types/StudentPerformance";

export function useStudentManager() {
  const [alunos, setAlunos] = useState<StudentPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAluno, setSelectedAluno] = useState<StudentPerformance | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // UseCallback para poder ser usado no useEffect e retornado sem loop
  const fetchAlunos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminPanelService.getAllStudents();
      setAlunos(data);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleStartNewPeriod = async () => {
    try {
      const payload = {
        stepName: "PRIMEIRO",
        year: new Date().getFullYear()
      };

      await adminPanelService.startNewPeriod(payload);
      await fetchAlunos();
      return { success: true, message: "Ciclo atualizado com sucesso!" };
    } catch (error: any) {
      const msg = error.response?.data?.message || "Erro ao avançar bimestre.";
      return { success: false, message: msg };
    }
  };

  const handleSave = async (dados: StudentPerformance) => {
    try {
      if (!dados.id) throw new Error("O objeto de dados não tem um ID!");

      const payload = {
        studentId: dados.studentId,
        classId: dados.classId,
        averageScore: Number(dados.ira),
        attendenceRate: Number(dados.attendenceRate || 100),
        failedSubjects: Number(dados.failedSubjects || 0),
        status: dados.status
      };

      await adminPanelService.updateStudentPerformance(dados.id, payload);

      setIsModalOpen(false);
      await fetchAlunos();
      return { success: true, message: "Dados do aluno atualizados!" };
    } catch (error: any) {
      const msgErro = error.response?.data?.message || error.message;
      return { success: false, message: "Erro ao salvar: " + msgErro };
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, [fetchAlunos]);

  const handleEdit = (aluno: StudentPerformance) => {
    setSelectedAluno(aluno);
    setIsModalOpen(true);
  };

  return {
    alunos,
    loading,
    selectedAluno,
    isModalOpen,
    setIsModalOpen,
    handleEdit,
    handleSave,
    handleStartNewPeriod,
    refreshAlunos: fetchAlunos
  };
}