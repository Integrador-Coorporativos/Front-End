import { useMemo, useState } from "react";

export const useControlPanelData = (alunos: any[], professores: any[], classes: any[], cursos: any[], search: string, activeTab: string) => {
  const [filters, setFilters] = useState({
    alunoSituacao: "",
    profNome: "" as "asc" | "desc" | "",
    profTurmas: "" as "maior" | "menor" | "",
    curso: "",
    ano: "",
    turno: "",
    alunosQtde: "" as "maior" | "menor" | "",
    turmasQtde: "" as "maior" | "menor" | ""
  });

  const filteredAlunos = useMemo(() => {
    return (alunos || [])
      .filter(a => (!search || a.studentId.toLowerCase().includes(search.toLowerCase())) && 
                   (!filters.alunoSituacao || a.status === filters.alunoSituacao))
      .sort((a, b) => b.attendenceRate - a.attendenceRate);
  }, [alunos, search, filters.alunoSituacao]);

  const filteredProfessores = useMemo(() => {
    return (professores || [])
      .filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (filters.profTurmas === "maior") return (b.quantityClass || 0) - (a.quantityClass || 0);
        if (filters.profNome === "asc") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [professores, search, filters.profTurmas, filters.profNome]);

  const filteredClasses = useMemo(() => {
    return (classes || []).filter(t => {
      const matchSearch = t.name?.toLowerCase().includes(search.toLowerCase()) || t.courseName?.toLowerCase().includes(search.toLowerCase());
      const matchCurso = !filters.curso || t.courseName === filters.curso;
      return matchSearch && matchCurso;
    }).sort((a, b) => filters.alunosQtde === "maior" ? b.totalStudents - a.totalStudents : 0);
  }, [classes, search, filters.curso, filters.alunosQtde]);

  const filteredCourses = useMemo(() => {
    return (cursos || []).filter(c => c.courseName.toLowerCase().includes(search.toLowerCase()));
  }, [cursos, search]);

  return {
    filteredAlunos,
    filteredProfessores,
    filteredClasses,
    filteredCourses,
    filters,
    setFilters
  };
};