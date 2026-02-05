import { useState, useMemo } from "react";

export const useControlPanelFilters = (alunos: any[], professores: any[], classes: any[], localCoursesPanel: any[], search: string) => {
  const [appliedAlunoSituacao, setAppliedAlunoSituacao] = useState("");
  
  const [appliedProfNome, setAppliedProfNome] = useState<"asc" | "desc" | "">("");
  const [appliedProfTurmas, setAppliedProfTurmas] = useState<"maior" | "menor" | "">("");

  const [appliedFilterCurso, setAppliedFilterCurso] = useState("");
  const [appliedFilterAno, setAppliedFilterAno] = useState("");
  const [appliedFilterTurmas, setAppliedFilterTurmas] = useState<"maior" | "menor" | "">("");
  const [appliedFilterTurno, setAppliedFilterTurno] = useState("");
  const [appliedFilterAlunos, setAppliedFilterAlunos] = useState<"maior" | "menor" | "">("");

  const filteredAlunos = useMemo(() => {
    const filtrados = (alunos || []).filter((aluno) => {
      const matchesSearch = !search || aluno.studentId.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !appliedAlunoSituacao || aluno.status === appliedAlunoSituacao;
      return matchesSearch && matchesStatus;
    });
    return [...filtrados].sort((a, b) => b.attendenceRate - a.attendenceRate);
  }, [alunos, search, appliedAlunoSituacao]);

  const filteredProfessores = useMemo(() => {
    const filtrados = (professores || []).filter((prof) => {
      const query = search.toLowerCase().trim();
      return !query || (prof.name || "").toLowerCase().includes(query) || (prof.registration || "").toLowerCase().includes(query);
    });
    return [...filtrados].sort((a, b) => {
      if (appliedProfTurmas === "maior") return (b.quantityClass || 0) - (a.quantityClass || 0);
      if (appliedProfNome === "asc") return a.name.localeCompare(b.name);
      return 0;
    });
  }, [professores, search, appliedProfNome, appliedProfTurmas]);

  return {
    filteredAlunos,
    filteredProfessores,
  };
};