import { useState, useEffect } from "react";
import { studentService } from "@/api/services/adminPanelService";
import type { StudentPerformance } from "@/types/StudentPerformance";

export function useStudentManager() {
  const [alunos, setAlunos] = useState<StudentPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAluno, setSelectedAluno] = useState<StudentPerformance | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Busca a lista de alunos usando o Service
  const fetchAlunos = async () => {
    setLoading(true);
    try {
      const response = await studentService.getAll();
      setAlunos(response.data);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Salva as alterações usando o Service
  const handleSave = async (dados: StudentPerformance) => {
    try {
      if (!dados.id) {
        alert("Erro: ID do aluno não encontrado.");
        return;
      }

      /**
       * LIMPEZA DE PAYLOAD (Para evitar Erro 500 no Java)
       * Enviamos apenas o que o contrato do Service espera (Partial)
       */
      const payload: Partial<StudentPerformance> = {
        id: dados.id,
        name: dados.name,
        ira: dados.ira,
        classId: dados.classId,
        attendenceRate: dados.attendenceRate,
        averageScore: dados.averageScore,
        registration: dados.registration
      };

      await studentService.update(dados.id, payload);
      
      setIsModalOpen(false);
      await fetchAlunos(); // Atualiza a lista
      alert("Aluno atualizado com sucesso!");

    } catch (error: any) {
      console.error("Erro ao salvar:");
      if (error.response) {
        console.error("Dados do erro Java:", error.response.data);
        alert(`Erro no Servidor: ${error.response.data.message || "Erro Interno"}`);
      } else {
        alert("Erro de conexão com o servidor.");
      }
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
    refreshAlunos: fetchAlunos
  };
}