import { useRef, useState } from "react";
import Header from "../../components/Header";
import BreadCrumb from "../../components/BreadCrumb";
import Footer from "../../components/Footer";
import Pagination from "../../components/Pagination";
import StudentTab from "@/components/StudentTab";
import ProfessorTab from "../../components/ProfessorTab";
import EditModal from "../../components/EditModalStudent";
import EditModalProfessor from "../../components/EditModalProfessor";
import type { Student } from "@/types/Student";
import type { Professor } from "@/types/Professor";
import styles from "./ControlPanel.module.css";
import SadtIcon from "../../assets/logo-if.png";
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

  const cursosDisponiveisTeste = [
    "Informática",
    "Apicultura",
    "Alimentos",
    "Analise e Desenvolvimento de Sistemas",
    "Química",
    "Agroindustria",
  ];

  const [isAlunoModalOpen, setIsAlunoModalOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState<Student | null>(null);

  const [isProfessorModalOpen, setIsProfessorModalOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading, success } = useUploadPlanilha();
  const { download, isDownloading, error } = useDownloadTemplate();

  const totalPages =
    activeTab === "alunos"
      ? Math.ceil(alunos.length / ITEMS_PER_PAGE)
      : Math.ceil(professores.length / ITEMS_PER_PAGE);

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
                {isUploading ? "Processando..." : "Importar dados"}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".xlsx"
                onChange={handleFileChange}
              />
              {success && <p style={{ color: 'green' }}>Importação concluída!</p>}
              <input
                type="text"
                placeholder="Buscar..."
                className={styles.searchInput}
              />
              <button className={styles.filterButton}>Personalizado</button>
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
              <h2>Turmas</h2>
            </div>
          )}
          {activeTab === "cursos" && (
            <div className={styles.tabContent}>
              <h2>Cursos</h2>
            </div>
          )}
          <div className={styles.paginationWrapper}>
            <div className={styles.downloadWrapper}>
              <button 
                onClick={() => download('modelo_planilha.xlsx')}
                disabled={isDownloading}
              >
                {isDownloading ? 'Gerando Planilha...' : 'Baixar Modelo'}
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
      <Footer />
    </div>
  );
}
