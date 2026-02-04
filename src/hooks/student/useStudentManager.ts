import { useState, useEffect } from "react";
import axios from "axios";
import type { StudentPerformance } from "@/types/StudentPerformance";

export function useStudentManager() {
  const [alunos, setAlunos] = useState<StudentPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAluno, setSelectedAluno] = useState<StudentPerformance | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAlunos = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8085/api/admin-panel/students");
      setAlunos(response.data);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewPeriod = async () => {
    try {
      const payload = {
        stepName: "PRIMEIRO", 
        year: new Date().getFullYear()
      };

      await axios.post(
        "http://localhost:8085/api/admin-panel/evaluation-periods/start",
        payload
      );

      await fetchAlunos(); 
      return { success: true, message: "Ciclo atualizado com sucesso!" };

    } catch (error: any) {
      const backendMsg = error.response?.data?.message || error.response?.data;
      const msg = typeof backendMsg === 'string'
        ? backendMsg
        : "Erro ao avançar bimestre. Verifique se o período já existe.";

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

      await axios.put(`http://localhost:8085/api/performance/student/${dados.id}`, payload);

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
  }, []);

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