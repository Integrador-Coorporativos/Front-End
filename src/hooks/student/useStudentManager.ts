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
      // Nova URL do Controller de Painel de Controle
      const response = await axios.get("http://localhost:8085/api/admin-panel/students");
      
      // LOG DE DIAGNÓSTICO: Abra o F12 no navegador para ver o que o Java está enviando
      console.log("Dados recebidos do Java:", response.data);
      
      setAlunos(response.data); 
    } catch (error) {
      console.error("Erro ao carregar do novo painel:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (dadosAtualizados: StudentPerformance) => {
    try {
      // Verifique se o ID existe antes de tentar o PUT
      if (!dadosAtualizados.id) {
        console.error("Não é possível salvar: ID do aluno não encontrado.");
        return;
      }

      console.log("Enviando atualização para o ID:", dadosAtualizados.id);
      
      // Enviando para o endpoint de performance (verifique se este ainda é o caminho correto)
      await axios.put(`http://localhost:8085/api/performance/student/${dadosAtualizados.id}`, dadosAtualizados);
      
      setIsModalOpen(false);
      await fetchAlunos(); // Recarrega a lista para mostrar os dados atualizados
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  const handleEdit = (aluno: StudentPerformance) => {
    console.log("Editando aluno:", aluno);
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
    refreshAlunos: fetchAlunos // Caso precise atualizar manualmente
  };
}