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

import type { Student } from "@/types/Student";
import type { Professor } from "@/types/Professor";
import type { Classes } from "@/types/Classes"; 
import type { Courses } from "@/types/Courses";

import styles from "./ControlPanel.module.css";
import TooltipIcon from "../../assets/tooltip-icon.png";

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

  const turmas: Classes[] = [
    {
      curso: "Informática",
      anoIngresso: 2023,
      turno: "Vespertino",
      alunos: 34,
      repetentes: 3,
    },
    {
      curso: "Química",
      anoIngresso: 2022,
      turno: "Matutino",
      alunos: 28,
      repetentes: 1,
    },
  ];

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

  const [selectedCurso, setSelectedCurso] = useState<Courses | null>(null);
  const [isCursoModalOpen, setIsCursoModalOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);

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


  const totalPages =
    activeTab === "alunos"
      ? Math.ceil(alunos.length / ITEMS_PER_PAGE)
      : activeTab === "professores"
      ? Math.ceil(professores.length / ITEMS_PER_PAGE)
      : activeTab === "cursos"
      ? Math.ceil(courses.length / ITEMS_PER_PAGE)
      : 1;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const currentAlunos = alunos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const currentProfessores = professores.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const currentCourses = courses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Arquivo selecionado:", file.name);
    }
  };

  const handleDownloadModelo = () => {
    const link = document.createElement("a");
    link.href = "/path/to/modelo.xlsx";
    link.download = "modelo.xlsx";
    link.click();
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
              className={`${styles.tab} ${
                activeTab === tab ? styles.active : ""
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
              </span>
            </div>
            <div className={styles.right_cont_cp}>
              <button
                className={styles.importButton}
                onClick={handleButtonClick}
              >
                Importar dados
              </button>
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
              />

              <div className={styles.filterWrapper} ref={filterRef}>
                <button
                  className={styles.filterButton}
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                >
                  Personalizado
                </button>

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
              <ClassesTab
                turmas={turmas}
                onEdit={(turma) => {
                  setSelectedTurma(turma);
                  setIsTurmaModalOpen(true);
                }}
              />
            </div>
          )}
          {activeTab === "cursos" && (
            <div className={styles.tabContent}>
              <CoursesTab
                cursos={currentCourses}
                onEdit={(curso) => {
                  setSelectedCurso(curso);
                  setIsCursoModalOpen(true);
                }}
              />
            </div>
          )}

          <div className={styles.paginationWrapper}>
            <div className={styles.downloadWrapper}>
              <button
                className={styles.downloadButton}
                onClick={handleDownloadModelo}
              >
                Baixar modelo
              </button>
              <div className={styles.tooltip}>
                <img
                  className={styles.tooltip_icon}
                  src={TooltipIcon}
                  alt="Ícone"
                />
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
          onSave={(turmaAtualizada) => {
            console.log("Turma salva:", turmaAtualizada);
            setIsTurmaModalOpen(false);
          }}
        />
      )}

      <Footer />
    </div>
  );
}
