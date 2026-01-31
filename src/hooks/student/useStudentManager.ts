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
      const response = await axios.get("http://localhost:8085/api/performance/student/all");
      console.log("Dados recebidos do Java:", response.data);
      setAlunos(response.data); 
    } catch (error) {
      console.error("Erro na API (Porta 8085):", error);
      
      setAlunos([
        {
          id: 1,
          name: "Aluno de Teste",
          studentId: "20240001",
          classId: "Informatica",
          ira: 75.5,
          averageScore: 75.5,
          attendenceRate: 90,
          failedSubjects: 0,
          status: 'BOM'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (dadosAtualizados: StudentPerformance) => {
    try {
      await axios.put(`http://localhost:8085/api/performance/class/${dadosAtualizados.id}`, dadosAtualizados);
      
      setIsModalOpen(false);
      fetchAlunos(); 
    } catch (error) {
      console.error("Erro ao salvar:", error);
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
    handleSave
  };
}