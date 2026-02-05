import { useRef, useState, useEffect, useMemo } from "react";
import Header from "../../components/Header";
import BreadCrumb from "../../components/BreadCrumb";
import Pagination from "../../components/Pagination";
import Footer from "../../components/Footer";

import StudentTab from "@/components/StudentTab";
import ProfessorTab from "../../components/ProfessorTab";
import ClassesTab from "@/components/ClassesTab";
import CoursesTab from "@/components/CoursesTab";
import Toast from "@/components/Toast";

import EditModal from "../../components/EditModalStudent";
import EditModalProfessor from "../../components/EditModalProfessor";
import EditModalCourses from "@/components/EditModalCourses";
import EditModalClasses from "@/components/EditModalClasses";
import NewPeriodModal from "@/components/PeriodModal"

import FiltersCourse from "../../components/FiltersCourse";
import FiltersClasse from "../../components/FiltersClasse";
import FiltersProfessor from "@/components/FiltersProfessor";
import axios from "axios";

import type { Student } from "@/types/Student";
import type { Professor } from "@/types/Professor";
import type { ClassPanel } from "@/api/types/classPanel";
import type { Classes } from "@/api/types/classes";
import type { Courses } from "@/types/Courses";
import type { CoursePanel } from "@/types/coursesPanel";
import type { ClassListItem } from "@/api/types/classListItem";
import type { EditableClass } from "@/types/EditableClass";
import type { ClassUpdateRequest } from '@/api/types/classUpdate';

import styles from "./ControlPanel.module.css";
import TooltipIcon from "../../assets/tooltip-icon.png";
import { useDownloadTemplate } from "@/hooks/processing/useDownloadTemplate";
import { useUploadPlanilha } from "@/hooks/processing/useUploadPlanilha";
import { useCoursesPanel } from "@/hooks/courses/useCoursesPanel";
import { useUpdateCourse } from "@/hooks/courses/useUpdateCourse";
import { useClassesPanel } from "@/hooks/classes/useClassesPanel";
import { useUpdateClass } from "@/hooks/classes/useUpdateClass";
import { useStudentManager } from "@/hooks/student/useStudentManager";
import { useProfessorManager } from "@/hooks/professor/useProfessorManager";
import { useAcademicCycle } from "@/hooks/processing/useAcademicCycle";

const ITEMS_PER_PAGE = 8;

export default function ControlPanel() {

  const { coursesPanel, loading: coursesLoading } = useCoursesPanel();
  const { executeUpdate } = useUpdateCourse();
  const [filterProfNome, setFilterProfNome] = useState<"asc" | "desc" | "">("");
  const [filterProfTurmas, setFilterProfTurmas] = useState<"maior" | "menor" | "">("");
  const [appliedProfNome, setAppliedProfNome] = useState<"asc" | "desc" | "">("");
  const [appliedProfTurmas, setAppliedProfTurmas] = useState<"maior" | "menor" | "">("");
  const [filterAlunoStatus, setFilterAlunoStatus] = useState("");
  const [filterAlunoSituacao, setFilterAlunoSituacao] = useState("");
  const [appliedAlunoStatus, setAppliedAlunoStatus] = useState("");
  const [appliedAlunoSituacao, setAppliedAlunoSituacao] = useState("");
  const [search, setSearch] = useState("");
  const [filterCurso, setFilterCurso] = useState("");
  const [filterAno, setFilterAno] = useState("");
  const [appliedFilterCurso, setAppliedFilterCurso] = useState("");
  const [appliedFilterAno, setAppliedFilterAno] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { professores, loading: professorsLoading } = useProfessorManager();
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [selectedBimestre, setSelectedBimestre] = useState("1");

  const [activeTab, setActiveTab] = useState<
    "alunos" | "professores" | "turmas" | "cursos"
  >("alunos");

  const { alunos, handleEdit, isModalOpen, setIsModalOpen, selectedAluno, handleSave, handleStartNewPeriod: executeStartPeriod, refreshAlunos } = useStudentManager();

  useEffect(() => {
    if (alunos && alunos.length > 0) {
      setStudentsLoading(false);
    }
    const timer = setTimeout(() => setStudentsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, [alunos]);

  const { classes, loading: classesLoading, error: classesError } =
    useClassesPanel();
  const { executeUpdate: executeUpdateClasses } = useUpdateClass();

  const [localCoursesPanel, setLocalCoursesPanel] = useState<CoursePanel[]>([]);

  useEffect(() => {
    setLocalCoursesPanel(coursesPanel);
  }, [coursesPanel]);

  const handleSaveCourse = async (curso: CoursePanel) => {
    try {
      await executeUpdate(curso.courseId, { name: curso.courseName });

      setLocalCoursesPanel(prev =>
        prev.map(c =>
          c.courseId === curso.courseId
            ? { ...c, courseName: curso.courseName }
            : c
        )
      );

      setIsCursoModalOpen(false);

      setToastMessage("Curso alterado com sucesso!");
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 5500);
    } catch (err) {
      console.error("Erro ao salvar curso:", err);
    }
  };

  const alunosFiltrados = useMemo(() => {
    const filtrados = (alunos || []).filter((aluno) => {
      const matchesSearch = !search || aluno.studentId.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = !appliedAlunoSituacao || aluno.status === appliedAlunoSituacao;

      return matchesSearch && matchesStatus;
    });

    return [...filtrados].sort((a, b) => {
      return b.attendenceRate - a.attendenceRate;
    });
  }, [alunos, search, appliedAlunoSituacao]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isProfessorModalOpen, setIsProfessorModalOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(
    null
  );
  const [selectedTurma, setSelectedTurma] =
    useState<EditableClass | null>(null);
  const [isTurmaModalOpen, setIsTurmaModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading, success } = useUploadPlanilha();
  const { download, isDownloading, error } = useDownloadTemplate();
  const [selectedCurso, setSelectedCurso] = useState<CoursePanel | null>(null);
  const [isCursoModalOpen, setIsCursoModalOpen] = useState(false);
  const getFilterLabel = () => {
    const parts: string[] = [];

    if (search) parts.push(`Busca: "${search}"`);

    if (activeTab === "alunos") {
      if (appliedAlunoSituacao) {
        parts.push(`Situação: ${appliedAlunoSituacao}`);
      }
    }

    if (activeTab === "professores") {
      if (appliedProfNome) {
        parts.push(appliedProfNome === "asc" ? "Nome (A-Z)" : "Nome (Z-A)");
      }
      if (appliedProfTurmas) {
        parts.push(appliedProfTurmas === "maior" ? "Mais Turmas" : "Menos Turmas");
      }
    }

    if (activeTab === "turmas") {
      if (appliedFilterCurso) parts.push(`Curso: ${appliedFilterCurso}`);
      if (appliedFilterTurno) parts.push(`Turno: ${appliedFilterTurno}`);
      if (appliedFilterAlunos) {
        parts.push(appliedFilterAlunos === "maior" ? "Mais Alunos" : "Menos Alunos");
      }
      if (appliedFilterAno) parts.push(`Ano: ${appliedFilterAno}`);
    }

    if (activeTab === "cursos") {
      if (appliedFilterTurmas) {
        parts.push(appliedFilterTurmas === "maior" ? "Mais Turmas" : "Menos Turmas");
      }
      if (appliedFilterTurno) parts.push(appliedFilterTurno);
      if (appliedFilterAlunos) {
        parts.push(appliedFilterAlunos === "maior" ? "Mais Alunos" : "Menos Alunos");
      }
    }

    return parts.length ? parts.join(" > ") : null;
  };

  const filterRef = useRef<HTMLDivElement>(null);
  const hasSearchOnClasses =
    activeTab === "turmas" && search.trim().length > 0;
  const hasSearch = search.trim().length > 0;

  function convertToAPIClass(turma: Classes): import('@/api/types/classes').Classes {
    if (!turma.course) {
      throw new Error("Curso inválido!");
    }
    return {
      id: turma.id,
      name: turma.name,
      shift: turma.shift,
      course: {
        id: turma.course.id,
        name: turma.course.name,
      },
    };
  }

  const handleSaveClasses = async (turmaAtualizada: any) => {
    try {
      const idParaUrl = Number(turmaAtualizada.id || selectedTurma?.id || 0);
      if (idParaUrl === 0) {
        return;
      }

      const updatePayload = {
        name: String(turmaAtualizada.name || selectedTurma?.name || ""),
        shift: String(turmaAtualizada.shift || selectedTurma?.shift || ""),
        semester: String(turmaAtualizada.semester || (selectedTurma as any)?.semester || "2024.1"),
        classId: String(turmaAtualizada.classId || (selectedTurma as any)?.classId || "ID-GERADO")
      };
      await executeUpdateClasses(idParaUrl, updatePayload as any);

      setIsTurmaModalOpen(false);
      setToastMessage("Turma atualizada com sucesso!");
      setShowSuccessToast(true);

    } catch (err: any) {
      console.error("Erro detalhado no Backend:", err.response?.data);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }

    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  const [appliedFilterTurmas, setAppliedFilterTurmas] = useState<"maior" | "menor" | "">("");
  const [appliedFilterTurno, setAppliedFilterTurno] = useState<"Matutino" | "Vespertino" | "Noturno" | "">("");
  const [appliedFilterAlunos, setAppliedFilterAlunos] = useState<"maior" | "menor" | "">("");
  const [filterTurmas, setFilterTurmas] = useState<"maior" | "menor" | "">("");
  const [filterTurno, setFilterTurno] = useState<"Matutino" | "Vespertino" | "Noturno" | "">("");
  const [filterAlunos, setFilterAlunos] = useState<"maior" | "menor" | "">("");
  const [filtersApplied, setFiltersApplied] = useState(false);

  const filteredCourses = localCoursesPanel
    .filter((course) =>
      course.courseName.toLowerCase().includes(search.toLowerCase())
    )

    .sort((a, b) => {
      if (appliedFilterAlunos === "maior") {
        return b.totalStudents - a.totalStudents;
      }
      if (appliedFilterAlunos === "menor") {
        return a.totalStudents - b.totalStudents;
      }
      if (appliedFilterTurmas === "maior") {
        return b.totalClasses - a.totalClasses;
      }
      return 0;
    });

  const filteredClasses = useMemo(() => {
    return (classes || []).filter((t) => {
      const query = search.toLowerCase();
      const matchesSearch =
        t.name?.toLowerCase().includes(query) ||
        t.shift?.toLowerCase().includes(query) ||
        t.courseName?.toLowerCase().includes(query);

      const matchesCurso = appliedFilterCurso === "" || t.courseName === appliedFilterCurso;
      const matchesTurno = appliedFilterTurno === "" || t.shift === appliedFilterTurno;
      const matchesAno = appliedFilterAno === "" || t.name.includes(appliedFilterAno);

      return matchesSearch && matchesCurso && matchesTurno && matchesAno;
    })
      .sort((a, b) => {
        if (appliedFilterAlunos === "maior") return b.totalStudents - a.totalStudents;
        if (appliedFilterAlunos === "menor") return a.totalStudents - b.totalStudents;
        return 0;
      });
  }, [classes, search, appliedFilterCurso, appliedFilterTurno, appliedFilterAno, appliedFilterAlunos]);

  const professoresOrdenados = useMemo(() => {
    const filtrados = (professores || []).filter((prof) => {
      const query = search.toLowerCase().trim();
      if (!query) return true;
      return (
        (prof.name || "").toLowerCase().includes(query) ||
        (prof.email || "").toLowerCase().includes(query) ||
        (prof.registration || "").toLowerCase().includes(query)
      );
    });

    return [...filtrados].sort((a, b) => {
      if (appliedProfTurmas === "maior") return (b.quantityClass || 0) - (a.quantityClass || 0);
      if (appliedProfTurmas === "menor") return (a.quantityClass || 0) - (b.quantityClass || 0);

      if (appliedProfNome === "asc") return a.name.localeCompare(b.name);
      if (appliedProfNome === "desc") return b.name.localeCompare(a.name);

      return 0;
    });
  }, [professores, search, appliedProfNome, appliedProfTurmas]);

  useEffect(() => {
    const hasFilter =
      appliedFilterTurmas !== "" ||
      appliedFilterTurno !== "" ||
      appliedFilterAlunos !== "";

    setFiltersApplied(hasFilter);
  }, [appliedFilterTurmas, appliedFilterTurno, appliedFilterAlunos]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const currentAlunos = alunosFiltrados.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const currentProfessores = professoresOrdenados.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    ((currentPage - 1) * ITEMS_PER_PAGE) + ITEMS_PER_PAGE
  );

  const currentCourses = filteredCourses.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const currentClasses = filteredClasses.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );;

  const currentClassesListItems: ClassListItem[] = currentClasses.map((t) => ({
    id: t.id,
    name: t.name,
    shift: t.shift,
    totalStudents: t.totalStudents,
    course: t.courseId && t.courseName ? { id: t.courseId, name: t.courseName } : null,
  }));

  const totalPages =
    activeTab === "alunos"
      ? Math.ceil(alunosFiltrados.length / ITEMS_PER_PAGE)
      : activeTab === "professores"
        ? Math.ceil(professoresOrdenados.length / ITEMS_PER_PAGE)
        : activeTab === "turmas"
          ? Math.ceil(filteredClasses.length / ITEMS_PER_PAGE)
          : Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      upload(file);
      console.log("Arquivo selecionado:", file.name);
    }
  };

  const handleApplyFilters = () => {
    setAppliedFilterTurmas(filterTurmas);
    setAppliedFilterTurno(filterTurno);
    setAppliedFilterAlunos(filterAlunos);
    setAppliedFilterCurso(filterCurso);
    setAppliedFilterAno(filterAno);
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  const handleConfirmNewPeriod = async () => {
    try {
      const result = await executeStartPeriod();

      setToastMessage(result.message);
      setShowSuccessToast(true);

      if (result && result.success) {
        setIsPeriodModalOpen(false);
        refreshAlunos();
      }
    } catch (err) {
      setToastMessage("Falha na comunicação com o servidor.");
      setShowSuccessToast(true);
    } finally {
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  const onSaveStudent = async (dados: any) => {
    const result = await handleSave(dados);

    setToastMessage(result.message);
    setShowSuccessToast(true);

    if (result.success) {
      setIsModalOpen(false);
    }
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  return (
    <div>
      <Header />
      <BreadCrumb
        items={[
          { label: "Página Inicial", to: "/" },
          { label: "Painel de Controle", to: "/painel_controle" },
        ]}
      />
      <div className={styles.h1_content_controlpanel_nav}>
        <h1 className={styles.h1_content_controlpanel}>Painel de controle</h1>
        <div className={styles.tabs}>
          {["alunos", "professores", "turmas", "cursos"].map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.active : ""
                }`}
              onClick={() => {
                setActiveTab(tab as any);
                setCurrentPage(1);
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.headerContainer_content}>
            <div className={styles.left_cont_cp}>
              Filtrado por:{" "}
              <span className={styles.filterItem}>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                {getFilterLabel() && (
                  <>
                    {" "}
                    <span className={styles.filterDivider}>&gt;</span>{" "}
                    {getFilterLabel()}
                  </>
                )}
              </span>
            </div>
            <div className={styles.right_cont_cp}>
              <div className={styles.actionContainer}>
                <button
                  className={styles.actionsMainButton}
                  onClick={() => setShowActions(!showActions)}
                >
                  Ações <span className={styles.arrow}>{showActions ? '▲' : '▼'}</span>
                </button>

                {showActions && (
                  <div className={styles.actionMenu}>
                    <button
                      className={styles.menuItem}
                      onClick={() => {
                        handleButtonClick();
                        setShowActions(false);
                      }}
                    >
                      📊 Importar Dados (.xlsx)
                    </button>

                    <button
                      className={styles.menuItem}
                      onClick={() => {
                        setIsPeriodModalOpen(true);
                        setShowActions(false);
                      }}
                    >
                      🗓️ Iniciar Novo Período
                    </button>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".xlsx"
                onChange={handleFileChange}
              />
              <input
                type="text"
                placeholder="Buscar..."
                className={styles.searchInput}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <div className={styles.filterWrapper} ref={filterRef}>
                <button
                  className={styles.filterButton}
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                >
                  Personalizar
                </button>
                {isFilterOpen && (
                  <div className={activeTab === "alunos" ? styles.filterDropdown_student : styles.filterDropdown}>
                    {activeTab === "cursos" && (
                      <FiltersCourse
                        filterTurmas={filterTurmas}
                        setFilterTurmas={setFilterTurmas}
                        filterAlunos={filterAlunos}
                        setFilterAlunos={setFilterAlunos}
                        onApply={() => {
                          setAppliedFilterTurmas(filterTurmas);
                          setAppliedFilterAlunos(filterAlunos);
                          setCurrentPage(1);
                          setIsFilterOpen(false);
                          setFiltersApplied(true);
                        }}
                        onClear={() => {
                          setFilterTurmas("");
                          setFilterAlunos("");
                          setAppliedFilterTurmas("");
                          setAppliedFilterAlunos("");
                          setCurrentPage(1);
                          setFiltersApplied(false);
                          setIsFilterOpen(false);
                        }}
                      />
                    )}
                    {activeTab === "professores" && (
                      <FiltersProfessor
                        filterNome={filterProfNome}
                        setFilterNome={setFilterProfNome}
                        filterTurmas={filterProfTurmas}
                        setFilterTurmas={setFilterProfTurmas}
                        onApply={() => {
                          setAppliedProfNome(filterProfNome);
                          setAppliedProfTurmas(filterProfTurmas);
                          setIsFilterOpen(false);
                          setCurrentPage(1);
                        }}
                        onClear={() => {
                          setFilterProfNome("");
                          setFilterProfTurmas("");
                          setAppliedProfNome("");
                          setAppliedProfTurmas("");
                          setIsFilterOpen(false);
                        }}
                      />
                    )}
                    {activeTab === "alunos" && (
                      <div className={styles.filterContent_student}>
                        <div className={styles.filterField}>
                          <label className={styles.filterLabel_student}>SITUAÇÃO DO ALUNO</label>
                          <select
                            value={filterAlunoSituacao}
                            onChange={(e) => setFilterAlunoSituacao(e.target.value)}
                          >
                            <option value="">Todos os Status</option>
                            <option value="Ótimo">Ótimo</option>
                            <option value="Bom">Bom</option>
                            <option value="Ruim">Ruim</option>
                          </select>
                        </div>
                        <div className={styles.buttonGroup}>
                          <button
                            className={styles.clearFilterButton_student}
                            onClick={() => {
                              setFilterAlunoSituacao("");
                              setAppliedAlunoSituacao("");
                              setIsFilterOpen(false);
                              setCurrentPage(1);
                            }}
                          >
                            Limpar
                          </button>
                          <button
                            className={styles.applyFilterButton_student}
                            onClick={() => {
                              setAppliedAlunoSituacao(filterAlunoSituacao);
                              setIsFilterOpen(false);
                              setCurrentPage(1);
                            }}
                          >
                            Aplicar
                          </button>
                        </div>
                      </div>
                    )}
                    {activeTab === "turmas" && (
                      <FiltersClasse
                        cursos={localCoursesPanel}
                        filterCurso={filterCurso}
                        setFilterCurso={setFilterCurso}
                        filterAno={filterAno}
                        setFilterAno={setFilterAno}
                        filterTurno={filterTurno}
                        setFilterTurno={setFilterTurno}
                        filterAlunos={filterAlunos}
                        setFilterAlunos={setFilterAlunos}
                        onApply={handleApplyFilters}
                        onClear={() => {
                          setFilterCurso("");
                          setFilterAno("");
                          setFilterTurno("");
                          setFilterAlunos("");
                          setAppliedFilterCurso("");
                          setAppliedFilterAno("");
                          setAppliedFilterTurno("");
                          setAppliedFilterAlunos("");
                          setCurrentPage(1);
                          setIsFilterOpen(false);
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
            {isPeriodModalOpen && (
              <NewPeriodModal
                isOpen={isPeriodModalOpen}
                onClose={() => setIsPeriodModalOpen(false)}
                onConfirm={handleConfirmNewPeriod}
              />
            )}
          </div>
          {activeTab === "alunos" && (
            <div className={styles.tabContent}>
              {studentsLoading ? (
                <div className={styles.loadingMessage}>
                  <p>Carregando alunos do sistema...</p>
                </div>
              ) : alunosFiltrados.length === 0 ? (
                <div className={styles.noResults}>
                  <div className={styles.noResultsContent}>
                    <p className={styles.emptyMessage_filter}>
                      Desculpe, Nenhum aluno encontrado com <strong>"{search}"</strong>
                    </p>
                    {search && (
                      <button
                        onClick={() => {
                          setSearch("");
                          setCurrentPage(1);
                        }}
                        className={styles.clearButton_filter_search}
                      >
                        Limpar busca
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <StudentTab
                  alunos={currentAlunos}
                  onEdit={handleEdit}
                />
              )}
            </div>
          )}
          {activeTab === "professores" && (
            <div className={styles.tabContent}>
              {professorsLoading ? (
                <p className={styles.emptyMessage_filter}>Carregando professores do sistema...</p>
              ) : professoresOrdenados.length === 0 ? (
                <div className={styles.emptyMessage_filter}>
                  <p className={styles.emptyMessage_filter}>Desculpe, Nenhum professor encontrado com <strong>"{search}"</strong></p>
                  {search && (
                    <button
                      className={styles.clearButton_filter_search}
                      onClick={() => {
                        setSearch("");
                        setCurrentPage(1);
                      }}
                    >
                      Limpar busca
                    </button>
                  )}
                </div>
              ) : (
                <ProfessorTab
                  professores={currentProfessores}
                  onEdit={(professor) => {
                    setSelectedProfessor(professor);
                    setIsProfessorModalOpen(true);
                  }}
                />
              )}
            </div>
          )}
          {activeTab === "turmas" && (
            <div className={styles.tabContent}>
              {classesLoading ? (
                <p className={styles.loadingMessage}>Carregando turmas do sistema...</p>
              ) : classesError ? (
                <div className={styles.emptyMessage_filter}>
                  <p>Erro ao carregar turmas. Verifique a conexão com o servidor.</p>
                </div>
              ) : filteredClasses.length === 0 ? (
                <div className={styles.emptyMessage_filter}>
                  <p className={styles.emptyMessage_filter}>Desculpe, Nenhum turma encontrada com <strong>"{search}"</strong></p>
                  {(search || hasSearchOnClasses) && (
                    <button
                      className={styles.clearButton_filter_search}
                      onClick={() => {
                        setSearch("");
                        setCurrentPage(1);
                      }}
                    >
                      Limpar busca
                    </button>
                  )}
                </div>
              ) : (
                <ClassesTab
                  classes={currentClassesListItems}
                  onEdit={(turma: ClassListItem) => {
                    const turmaParaModal: EditableClass = {
                      id: turma.id,
                      name: turma.name,
                      shift: turma.shift,
                      semester: (turma as any).semester || "2024.1",
                      classId: (turma as any).classId || "ID-TURMA",
                      course: turma.course ? {
                        id: turma.course.id,
                        name: turma.course.name,
                      } : null,
                    };

                    setSelectedTurma(turmaParaModal);
                    setIsTurmaModalOpen(true);
                  }}
                />
              )}
            </div>
          )}
          {activeTab === "cursos" && (
            <div className={styles.tabContent}>
              {coursesLoading ? (
                <div className={styles.loadingMessage}>
                  <p>Carregando cursos do sistema...</p>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className={styles.emptyMessage_filter}>
                  <p className={styles.emptyMessage_filter}>Desculpe, Nenhum curso encontrado com <strong>"{search}"</strong></p>
                  {search && (
                    <button
                      className={styles.clearButton_filter_search}
                      onClick={() => {
                        setSearch("");
                        setCurrentPage(1);
                      }}
                    >
                      Limpar busca
                    </button>
                  )}
                  {!hasSearch && filteredCourses && (
                    <button
                      className={styles.clearButton_filtred}
                      onClick={() => {
                        setFilterTurmas("");
                        setFilterTurno("");
                        setFilterAlunos("");
                        setAppliedFilterTurmas("");
                        setAppliedFilterTurno("");
                        setAppliedFilterAlunos("");
                        setCurrentPage(1);
                      }}
                    >
                      Limpar filtros
                    </button>
                  )}
                </div>
              ) : (
                <CoursesTab
                  cursos={currentCourses}
                  onEdit={(curso) => {
                    setSelectedCurso(curso);
                    setIsCursoModalOpen(true);
                  }}
                />
              )}
            </div>
          )}
          <div className={styles.paginationWrapper}>
            <div className={styles.downloadWrapper}>
              <button onClick={() => download('modelo_planilha.xlsx')} disabled={isDownloading} className={styles.downloadButton}>
                {isDownloading ? 'Gerando Planilha...' : 'Baixar Modelo'}
              </button>
              <div className={styles.tooltip}>
                <img className={styles.tooltip_icon} src={TooltipIcon} alt="Ícone" />
                <span className={styles.tooltip_text}>
                  Baixe o modelo da planilha para preencher e importar os dados.
                </span>
              </div>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </main>
      {selectedAluno && (
        <EditModal
          aluno={selectedAluno as any}
          cursos={localCoursesPanel.map(c => c.courseName)}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={onSaveStudent}
        />
      )}
      {selectedProfessor && (
        <EditModalProfessor
          professor={selectedProfessor}
          isOpen={isProfessorModalOpen}
          onClose={() => setIsProfessorModalOpen(false)}
          onSave={(_) => {
            setToastMessage("Professor atualizado com sucesso!");
            setShowSuccessToast(true);
            setIsProfessorModalOpen(false);
            setTimeout(() => setShowSuccessToast(false), 4000);
          }}
        />
      )}
      {selectedCurso && isCursoModalOpen && (
        <EditModalCourses
          curso={selectedCurso}
          isOpen={isCursoModalOpen}
          onClose={() => setIsCursoModalOpen(false)}
          onSave={handleSaveCourse}
        />
      )}
      {selectedTurma && (
        <EditModalClasses
          turma={selectedTurma}
          isOpen={isTurmaModalOpen}
          onClose={() => setIsTurmaModalOpen(false)}
          onSave={handleSaveClasses}
        />
      )}
      <NewPeriodModal
        isOpen={isPeriodModalOpen}
        onClose={() => setIsPeriodModalOpen(false)}
        onConfirm={handleConfirmNewPeriod}
      />
      <Toast message={toastMessage} isOpen={showSuccessToast} />
      <Footer />
    </div>
  );
}