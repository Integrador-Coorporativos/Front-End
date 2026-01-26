import { useRef, useState, useEffect } from "react";
import Header from "../../components/Header";
import BreadCrumb from "../../components/BreadCrumb";
import Pagination from "../../components/Pagination";
import Footer from "../../components/Footer";

import StudentTab from "@/components/StudentTab";
import ProfessorTab from "../../components/ProfessorTab";
import ClassesTab from "@/components/ClassesTab";
import CoursesTab from "@/components/CoursesTab";

import EditModal from "../../components/EditModalStudent";
import EditModalProfessor from "../../components/EditModalProfessor";
import EditModalCourses from "@/components/EditModalCourses";
import EditModalClasses from "@/components/EditModalClasses";

import FiltersCourse from "../../components/FiltersCourse";
import FiltersClasse from "../../components/FiltersClasse";

import type { Student } from "@/types/Student";
import type { Professor } from "@/types/Professor";
import type { Classes } from "@/types/Classes";
import type { Courses } from "@/types/Courses";

import styles from "./ControlPanel.module.css";
import TooltipIcon from "../../assets/tooltip-icon.png";
import { useDownloadTemplate } from "@/hooks/processing/useDownloadTemplate";
import { useUploadPlanilha } from "@/hooks/processing/useUploadPlanilha";

const ITEMS_PER_PAGE = 8;

export default function ControlPanel() {
  const [activeTab, setActiveTab] = useState<
    "alunos" | "professores" | "turmas" | "cursos"
  >("alunos");

  const alunos: Student[] = Array.from({ length: 201 }).map((_, index) => ({
    nome: `Aluno ${index + 1}`,
    ira: "61,22",
    matricula: "20241094040001",
    curso: "Informática",
  }));

  const professores: Professor[] = Array.from({ length: 40 }).map(
    (_, index) => ({
      nome: `Professor ${index + 1}`,
      anoIngresso: 2019,
      turno: "Vespertino",
      alunos: 34,
    })
  );

  const [classes, setClasses] = useState<Classes[]>([]);

  const [courses, setCourses] = useState<Courses[]>([]);

  useEffect(() => {
    fetch("http://localhost:8085/api/courses")
      .then(async (res) => {
        console.log("STATUS:", res.status);

        const text = await res.text();
        console.log("BODY:", text);

        if (res.status === 204) return [];

        if (!res.ok) {
          throw new Error(`Erro HTTP ${res.status}`);
        }

        return JSON.parse(text);
      })
      .then((data) => {
        const mapped = data.map((c: any) => ({
          id: c.id,
          course: c.name,
          quantClasses: 0,
          quantStudent: 0,
          shift: "—",
        }));

        setCourses(mapped);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8085/api/classes")
      .then(async (res) => {
        if (!res.ok) throw new Error("Erro ao buscar turmas");
        return res.json();
      })
      .then((data) => {
        const mapped = data.map((t: any) => ({
          id: t.id,
          name: t.name,
          shift: t.shift,
          course: t.course
            ? { id: t.course.id, name: t.course.name }
            : null,
        }));

        setClasses(mapped);
      })
      .catch(console.error);
  }, []);

  const cursosDisponiveisTeste = [
    "Informática",
    "Apicultura",
    "Alimentos",
    "Analise e Desenvolvimento de Sistemas",
    "Química",
    "Agroindustria",
  ];

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [isAlunoModalOpen, setIsAlunoModalOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState<Student | null>(null);

  const [isProfessorModalOpen, setIsProfessorModalOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(
    null
  );

  const [selectedTurma, setSelectedTurma] = useState<Classes | null>(null);
  const [isTurmaModalOpen, setIsTurmaModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading, success } = useUploadPlanilha();
  const { download, isDownloading, error } = useDownloadTemplate();

  const [selectedCurso, setSelectedCurso] = useState<Courses | null>(null);
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

  const handleSaveCourse = async (cursoAtualizado: Courses) => {
    try {
      const response = await fetch(
        `http://localhost:8085/api/courses/${cursoAtualizado.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: cursoAtualizado.course,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao salvar curso: ${response.status}`);
      }

      setCourses((oldCourses) =>
        oldCourses.map((c) =>
          c.id === cursoAtualizado.id ? cursoAtualizado : c
        )
      );

      setIsCursoModalOpen(false);
      console.log("Curso salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar curso:", error);
    }
  };

  const handleSaveClasses = async (turmaAtualizada: Classes) => {
    try {
      const response = await fetch(
        `http://localhost:8085/api/classes/${turmaAtualizada.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(turmaAtualizada),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao salvar turma");
      }

      const updated = await response.json();

      setClasses((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );

      setIsTurmaModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar turma:", error);
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

  const hasCourseFilters =
    appliedFilterTurmas !== "" ||
    appliedFilterTurno !== "" ||
    appliedFilterAlunos !== "";

  const filteredCourses = courses
    .filter((course) =>
      course.course.toLowerCase().includes(search.toLowerCase())
    )
    .filter((course) => {
      if (appliedFilterTurmas === "maior") return course.quantClasses >= 1;
      if (appliedFilterTurmas === "menor") return course.quantClasses <= 0;
      return true;
    })
    .filter((course) => {
      if (appliedFilterAlunos === "maior") return course.quantStudent >= 1;
      if (appliedFilterAlunos === "menor") return course.quantStudent <= 0;
      return true;
    })
    .filter((course) => {
      if (!appliedFilterTurno) return true;
      return course.shift === appliedFilterTurno;
    });

  const filteredClasses = classes.filter((t) => {
    const query = search.toLowerCase();

    const nomeTurma = t.name?.toLowerCase() ?? "";
    const turno = t.shift?.toLowerCase() ?? "";
    const nomeCurso = t.course?.name?.toLowerCase() ?? "";

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
                      filterTurno={filterTurno}
                      setFilterTurno={setFilterTurno}
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
                onEdit={(aluno) => {
                  setSelectedAluno(aluno);
                  setIsAlunoModalOpen(true);
                }}
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
              {filteredClasses.length === 0 ? (
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
                  classes={currentClasses}
                  onEdit={(turma) => {
                    setSelectedTurma(turma);
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
              <button  onClick={() => download('modelo_planilha.xlsx')} disabled={isDownloading}>
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
          aluno={selectedAluno}
          cursos={cursosDisponiveisTeste}
          isOpen={isAlunoModalOpen}
          onClose={() => setIsAlunoModalOpen(false)}
          onSave={(alunoAtualizado) => {
            console.log("Aluno salvo:", alunoAtualizado);
            setIsAlunoModalOpen(false);
          }}
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
      <Footer />
    </div>
  );
}
