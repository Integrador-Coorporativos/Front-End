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

import FiltersCourse from "../../components/FiltersCourse";
import FiltersClasse from "../../components/FiltersClasse";
import FiltersProfessor from "@/components/FiltersProfessor";

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

const ITEMS_PER_PAGE = 8;

export default function ControlPanel() {

  const { coursesPanel, loading: coursesLoading } = useCoursesPanel();
  const { executeUpdate } = useUpdateCourse();
  const [filterProfNome, setFilterProfNome] = useState<"asc" | "desc" | "">("");
  const [filterProfTurmas, setFilterProfTurmas] = useState<"maior" | "menor" | "">("");

  const [filterCurso, setFilterCurso] = useState("");
  const [filterAno, setFilterAno] = useState("");

  const [appliedFilterCurso, setAppliedFilterCurso] = useState("");
  const [appliedFilterAno, setAppliedFilterAno] = useState("");

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { professores, loading: professorsLoading } = useProfessorManager();

  const [activeTab, setActiveTab] = useState<
    "alunos" | "professores" | "turmas" | "cursos"
  >("alunos");

  const { alunos, handleEdit, isModalOpen, setIsModalOpen, selectedAluno,
    handleSave
  } = useStudentManager();

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

  const cursosDisponiveisTeste = [
    "Informática",
    "Apicultura",
    "Alimentos",
    "Analise e Desenvolvimento de Sistemas",
    "Química",
    "Agroindustria",
  ];

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

  const [ordemProfessores, setOrdemProfessores] = useState({
    ordemAlfabetica: "",
    ordemTurmas: ""
  });

  const professoresOrdenados = [...professores].sort((a, b) => {
    if (ordemProfessores.ordemTurmas === "maior") return (b.quantityClass || 0) - (a.quantityClass || 0);
    if (ordemProfessores.ordemTurmas === "menor") return (a.quantityClass || 0) - (b.quantityClass || 0);

    if (ordemProfessores.ordemAlfabetica === "asc") return a.name.localeCompare(b.name);
    if (ordemProfessores.ordemAlfabetica === "desc") return b.name.localeCompare(a.name);

    return 0;
  });

  const [selectedCurso, setSelectedCurso] = useState<CoursePanel | null>(null);
  const [isCursoModalOpen, setIsCursoModalOpen] = useState(false);

  const getFilterLabel = () => {
    const parts: string[] = [];

    if (search) parts.push(`Busca: "${search}"`);

    if (activeTab === "cursos") {
      if (appliedFilterTurmas) {
        parts.push(
          appliedFilterTurmas === "maior"
            ? "Maior quantidade de turmas"
            : "Menor quantidade de turmas"
        );
      }

      if (appliedFilterTurno) {
        parts.push(appliedFilterTurno);
      }

      if (appliedFilterAlunos) {
        parts.push(
          appliedFilterAlunos === "maior"
            ? "Maior quantidade de alunos"
            : "Menor quantidade de alunos"
        );
      }
    }

    if (activeTab === "turmas") {
      if (appliedFilterCurso) {
        parts.push(`Curso: ${appliedFilterCurso}`);
      }
      if (appliedFilterTurno) {
        parts.push(`Turno: ${appliedFilterTurno}`);
      }
      if (appliedFilterAlunos) {
        parts.push(appliedFilterAlunos === "maior" ? "Maior quantidade de alunos" : "Menor quantidade de alunos");
      }
      if (appliedFilterAno) {
        parts.push(`Ano: ${appliedFilterAno}`);
      }
    }

    return parts.length ? parts.join(" > ") : null;
  };

  const [search, setSearch] = useState("");
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

  const [localClasses, setLocalClasses] = useState<ClassPanel[]>([]);

  useEffect(() => {
    if (classes) setLocalClasses(classes);
  }, [classes]);


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

  const hasCourseFilters =
    appliedFilterTurmas !== "" ||
    appliedFilterTurno !== "" ||
    appliedFilterAlunos !== "";

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

  const filteredClasses = localClasses
    .filter((t) => {
      const query = search.toLowerCase();
      const nomeTurma = t.name?.toLowerCase() ?? "";
      const turnoTurma = t.shift?.toLowerCase() ?? "";
      const nomeCurso = t.courseName?.toLowerCase() ?? "";

      const matchesSearch =
        nomeTurma.includes(query) ||
        turnoTurma.includes(query) ||
        nomeCurso.includes(query);

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

  const filteredProfessors = (professores || []).filter((prof) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;

    const nameMatch = (prof.name || "").toLowerCase().includes(query);
    const emailMatch = (prof.email || "").toLowerCase().includes(query);
    const regMatch = (prof.registration || "").toLowerCase().includes(query);

    return nameMatch || emailMatch || regMatch;
  });

  console.log("Busca:", search, "Encontrados:", filteredProfessors.length);

  useEffect(() => {
    const hasFilter =
      appliedFilterTurmas !== "" ||
      appliedFilterTurno !== "" ||
      appliedFilterAlunos !== "";

    setFiltersApplied(hasFilter);
  }, [appliedFilterTurmas, appliedFilterTurno, appliedFilterAlunos]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const currentAlunos = alunos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const currentProfessores = filteredProfessors.slice(
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
      ? Math.ceil(alunos.length / ITEMS_PER_PAGE)
      : activeTab === "professores"
        ? Math.ceil(filteredProfessors.length / ITEMS_PER_PAGE)
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
              <button className={styles.importButton} onClick={handleButtonClick}>
                {isUploading ? "Processando..." : "Importar dados"}
              </button>
              <input type="file" ref={fileInputRef} style={{ display: "none" }} accept=".xlsx" onChange={handleFileChange} />
              <input type="text" placeholder="Buscar..." className={styles.searchInput} value={search} onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              />

              <div className={styles.filterWrapper} ref={filterRef}>
                <button
                  className={styles.filterButton}
                  onClick={() => setIsFilterOpen((prev) => !prev)}>
                  Personalizar
                </button>

                {isFilterOpen && activeTab === "cursos" && (
                  <div className={styles.filterDropdown}>
                    <FiltersCourse
                      filterTurmas={filterTurmas}
                      setFilterTurmas={setFilterTurmas}
                      filterAlunos={filterAlunos}
                      setFilterAlunos={setFilterAlunos}
                      onApply={() => {
                        setAppliedFilterTurmas(filterTurmas);
                        setAppliedFilterTurno(filterTurno);
                        setAppliedFilterAlunos(filterAlunos);

                        setCurrentPage(1);
                        setIsFilterOpen(false);
                        setFiltersApplied(true);
                      }}

                      onClear={() => {
                        setFilterTurmas("");
                        setFilterTurno("");
                        setFilterAlunos("");

                        setAppliedFilterTurmas("");
                        setAppliedFilterTurno("");
                        setAppliedFilterAlunos("");

                        setCurrentPage(1);
                      }}
                    />
                  </div>
                )}

                {isFilterOpen && activeTab === "professores" && (
                  <FiltersProfessor
                    filterNome={filterProfNome}
                    setFilterNome={setFilterProfNome}
                    filterTurmas={filterProfTurmas}
                    setFilterTurmas={setFilterProfTurmas}
                    onApply={() => setIsFilterOpen(false)}
                    onClear={() => {
                      setFilterProfNome("");
                      setFilterProfTurmas("");
                      setIsFilterOpen(false);
                    }}
                  />
                )}

                {isFilterOpen && activeTab === "alunos" && (
                  <div className={styles.filterDropdown}>
                    <div className={styles.filterContent}>
                      <select
                        value={filterTurmas}
                        onChange={(e) => setFilterTurmas(e.target.value as "maior" | "menor" | "")}
                      >
                        <option value="">Turmas</option>
                        <option value="maior">Maior quantidade</option>
                        <option value="menor">Menor quantidade</option>
                      </select>

                      <select
                        value={filterAlunos}
                        onChange={(e) => setFilterAlunos(e.target.value as "maior" | "menor" | "")}
                      >
                        <option value="">Alunos</option>
                        <option value="maior">Maior quantidade</option>
                        <option value="menor">Menor quantidade</option>
                      </select>

                      <select
                        value={filterTurno}
                        onChange={(e) => setFilterTurno(e.target.value as "Matutino" | "Vespertino" | "Noturno" | "")}
                      >
                        <option value="">Turno</option>
                        <option value="Matutino">Matutino</option>
                        <option value="Vespertino">Vespertino</option>
                        <option value="Noturno">Noturno</option>
                      </select>

                      <button
                        className={styles.applyFilterButton}
                        onClick={handleApplyFilters}
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                )}

                {isFilterOpen && activeTab === "turmas" && (
                  <div className={styles.filterDropdown}>
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
                  </div>
                )}

              </div>
            </div>
          </div>

          {activeTab === "alunos" && (
            <div className={styles.tabContent}>
              {alunos.length === 0 && professorsLoading ? (
                <p className={styles.emptyMessage_filter}>Carregando alunos do sistema...</p>
              ) : alunos.length === 0 ? (
                <div className={styles.emptyMessage_filter}>
                  <p>Desculpe, nenhum aluno encontrado.</p>
                  {search && (
                    <button
                      className={styles.clearButton_filter}
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
              ) : filteredProfessors.length === 0 ? (
                <div className={styles.emptyMessage_filter}>
                  <p>Desculpe, nenhum professor encontrado.</p>
                  {search && (
                    <button
                      className={styles.clearButton_filter}
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
                  <p>Desculpe, nenhuma turma encontrada.</p>
                  {(search || hasSearchOnClasses) && (
                    <button
                      className={styles.clearButton_filter}
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
                  <p>Desculpe, nenhum curso encontrado com base na sua pesquisa.</p>
                  {search && (
                    <button
                      className={styles.clearButton_filter}
                      onClick={() => {
                        setSearch("");
                        setCurrentPage(1);
                      }}
                    >
                      Limpar busca
                    </button>
                  )}

                  {!hasSearch && hasCourseFilters && (
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
          cursos={cursosDisponiveisTeste}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave as any}
        />
      )}

      {selectedProfessor && (
        <EditModalProfessor
          professor={selectedProfessor}
          isOpen={isProfessorModalOpen}
          onClose={() => setIsProfessorModalOpen(false)}
          onSave={(professorAtualizado) => {
            console.log("Professor salvo:", professorAtualizado);
            setIsProfessorModalOpen(false);
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
      <Toast message={toastMessage} isOpen={showSuccessToast} />
      <Footer />
    </div>
  );
}