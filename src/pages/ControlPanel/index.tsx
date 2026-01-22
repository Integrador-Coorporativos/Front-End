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
import SadtIcon from "../../assets/logo-if.png";
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

  const cursos: Courses[] = [
    {
      curso: "Informática",
      quantiTurmas: 8,
      turno: "Matutino e Vespertino",
      quantiAlunos: 91,
    },
    {
      curso: "Apicultura",
      quantiTurmas: 8,
      turno: "Matutino e Vespertino",
      quantiAlunos: 90,
    },
    {
      curso: "Alimentos",
      quantiTurmas: 8,
      turno: "Matutino e Vespertino",
      quantiAlunos: 89,
    },
    {
      curso: "Analise e Desenvolvimento de Sistemas",
      quantiTurmas: 4,
      turno: "Vespertino",
      quantiAlunos: 51,
    }
  ];

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

  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      filterRef.current &&
      !filterRef.current.contains(event.target as Node)
    ) {
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
      : 1;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const currentAlunos = alunos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const currentProfessores = professores.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

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
              <img
                className={styles.logoIcon_container}
                src={SadtIcon}
                alt="Logo do IF"
              />
              <span className={styles.title}>SADT</span>
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
          <div className={styles.filterInfo}>
            Filtrado por:{" "}
            <span className={styles.filterItem}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </span>
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
                cursos={cursos}
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
      {selectedCurso && (
      <EditModalCourses
        curso={selectedCurso}
        isOpen={isCursoModalOpen}
        onClose={() => setIsCursoModalOpen(false)}
        onSave={(cursoAtualizado) => {
          console.log("Curso salvo:", cursoAtualizado);
          setIsCursoModalOpen(false);
        }}
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
