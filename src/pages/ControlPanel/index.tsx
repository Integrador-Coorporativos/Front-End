import { useRef, useState, useEffect } from "react";
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

const ITEMS_PER_PAGE = 8;

export default function ControlPanel() {

  const { coursesPanel } = useCoursesPanel();
  const { executeUpdate } = useUpdateCourse();

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");


  const [activeTab, setActiveTab] = useState<
    "alunos" | "professores" | "turmas" | "cursos"
  >("alunos");

  const professores: Professor[] = Array.from({ length: 40 }).map(
    (_, index) => ({
      nome: `Professor ${index + 1}`,
      anoIngresso: 2019,
      turno: "Vespertino",
      alunos: 34,
    })
  );

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
        alert("Erro: ID da turma inválido.");
        return;
      }

      const updatePayload = {
        name: String(turmaAtualizada.name || selectedTurma?.name || ""),
        shift: String(turmaAtualizada.shift || selectedTurma?.shift || ""),
        semester: String(turmaAtualizada.semester || (selectedTurma as any)?.semester || "2024.1"),
        classId: String(turmaAtualizada.classId || (selectedTurma as any)?.classId || "ID-GERADO")
      };

      console.log("Enviando ID:", idParaUrl);
      console.log("Enviando Body:", updatePayload);

      await executeUpdateClasses(idParaUrl, updatePayload as any);

      setIsTurmaModalOpen(false);
      setToastMessage("Turma atualizada com sucesso!");
      setShowSuccessToast(true);

    } catch (err: any) {
      console.error("Erro detalhado no Backend:", err.response?.data);
    }
  };



  const [localClasses, setLocalClasses] = useState<ClassPanel[]>([]);

  function mapResponseToPanel(updated: import('@/api/types/classes').ClassResponse): ClassPanel {
    return {
      id: updated.id,
      name: updated.name,
      shift: updated.shift,
      courseId: updated.course.id,
      courseName: updated.course.name,
    };
  }

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
    .filter((course) => {
      if (appliedFilterTurmas === "maior") return course.totalClasses >= 1;
      if (appliedFilterTurmas === "menor") return course.totalClasses <= 0;
      return true;
    })
    .filter((course) => {
      if (appliedFilterAlunos === "maior") return course.totalStudents >= 1;
      if (appliedFilterAlunos === "menor") return course.totalStudents <= 0;
      return true;
    });

  const filteredClasses = localClasses.filter((t) => {
    const query = search.toLowerCase();

    const nomeTurma = t.name?.toLowerCase() ?? "";
    const turno = t.shift?.toLowerCase() ?? "";
    const nomeCurso = t.courseName?.toLowerCase() ?? "";

    return (
      nomeTurma.includes(query) ||
      turno.includes(query) ||
      nomeCurso.includes(query)
    );
  });

  useEffect(() => {
    const hasFilter =
      appliedFilterTurmas !== "" ||
      appliedFilterTurno !== "" ||
      appliedFilterAlunos !== "";

    setFiltersApplied(hasFilter);
  }, [appliedFilterTurmas, appliedFilterTurno, appliedFilterAlunos]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const currentAlunos = alunos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const currentProfessores = professores.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
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
    course: t.courseId && t.courseName ? { id: t.courseId, name: t.courseName } : null,
  }));

  const totalPages =
    activeTab === "alunos"
      ? Math.ceil(alunos.length / ITEMS_PER_PAGE)
      : activeTab === "professores"
        ? Math.ceil(professores.length / ITEMS_PER_PAGE)
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

                {isFilterOpen && activeTab === "alunos" && (
                  <div className={styles.filterDropdown}>
                    <div className={styles.filterContent}>
                      <select>
                        <option value="">Curso</option>
                        {cursosDisponiveisTeste.map((curso) => (
                          <option key={curso} value={curso}>
                            {curso}
                          </option>
                        ))}
                      </select>

                      <select>
                        <option value="">Turno</option>
                        <option value="Matutino">Matutino</option>
                        <option value="Vespertino">Vespertino</option>
                      </select>

                      <select>
                        <option value="">Período</option>
                        <option value="1">1º</option>
                        <option value="2">2º</option>
                        <option value="3">3º</option>
                      </select>

                      <select>
                        <option value="">Ano de Ingresso</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                      </select>

                      <button className={styles.applyFilterButton}>
                        Aplicar
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {activeTab === "alunos" && (
            <div className={styles.tabContent}>
              <StudentTab
                alunos={currentAlunos}
                onEdit={handleEdit}
              />
            </div>
          )}
          {activeTab === "professores" && (
            <div className={styles.tabContent}>
              <ProfessorTab
                professores={currentProfessores}
                onEdit={(professor) => {
                  setSelectedProfessor(professor);
                  setIsProfessorModalOpen(true);
                }}
              />
            </div>
          )}

          {activeTab === "turmas" && (
            <div className={styles.tabContent}>
              {classesLoading ? (
                <p>Carregando turmas...</p>
              ) : classesError ? (
                <p>{classesError}</p>
              ) : filteredClasses.length === 0 ? (
                <div className={styles.emptyMessage_filter}>
                  <p>Desculpe, nenhuma turma encontrada com base na sua pesquisa.</p>

                  {hasSearchOnClasses && (
                    <button
                      className={styles.clearButton_filtred}
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
              {filteredCourses.length === 0 ? (
                <div className={styles.emptyMessage_filter}>
                  <p>Desculpe, nenhum curso encontrado com base na sua pesquisa.</p>
                  {hasSearch && (
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
