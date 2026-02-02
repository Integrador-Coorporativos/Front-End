import { useState, useEffect } from "react";
import axios from "axios";
import type { StudentPerformance } from "@/types/StudentPerformance";

export function useStudentManager() {
  const [alunos, setAlunos] = useState<StudentPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAluno, setSelectedAluno] = useState<StudentPerformance | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Busca a lista de alunos
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

  // Salva as alterações
  const handleSave = async (dados: StudentPerformance) => {
    try {
      if (!dados.id) {
        alert("Erro: ID do aluno não encontrado.");
        return;
      }

      /**
       * LIMPEZA DE PAYLOAD (Para evitar Erro 500 no Java)
       * Enviamos apenas o que o banco precisa atualizar. 
       * Campos como 'status' ou 'studentId' (UUID) costumam travar o JPA/Hibernate no PUT.
       */
      const payload = {
        id: dados.id,
        name: dados.name,
        ira: dados.ira,
        classId: dados.classId,
        attendenceRate: dados.attendenceRate,
        averageScore: dados.averageScore,
        registration: dados.registration // Apenas se o Java permitir
      };

      console.log("Enviando atualização para ID:", dados.id, payload);

      await axios.put(
        `http://localhost:8085/api/performance/student/${dados.id}`, 
        payload
      );
      
      setIsModalOpen(false);
      await fetchAlunos(); // Atualiza a tabela/cards
      alert("Aluno atualizado com sucesso!");

    } catch (error: any) {
      console.error("Erro ao salvar:");
      if (error.response) {
        // O servidor respondeu com um erro (500, 400, etc)
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