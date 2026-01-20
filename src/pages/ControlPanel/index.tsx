import { useRef, useState } from "react";
import Header from "../../components/Header";
import BreadCrumb from "../../components/BreadCrumb";
import Footer from "../../components/Footer";
import Pagination from "../../components/Pagination";
import styles from "./ControlPanel.module.css";
import SadtIcon from "../../assets/logo-if.png";

const ITEMS_PER_PAGE = 8;

const alunos = Array.from({ length: 201 }).map((_, index) => ({
  nome: `Aluno ${index + 1}`,
  ira: "61,22", // IRA fixo para todos
  matricula: "20241094040001", // matrícula fixa
  curso: "Informática",
}));

export default function ControlPanel() {
  const [activeTab, setActiveTab] = useState<
    "alunos" | "professores" | "turmas" | "cursos"
  >("alunos");

  const [currentPage, setCurrentPage] = useState(1);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalPages = Math.ceil(alunos.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentAlunos = alunos.slice(
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
    link.href = "/path/to/modelo.xlsx"; // Atualize para o caminho real
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
          <button
            className={`${styles.tab} ${
              activeTab === "alunos" ? styles.active : ""
            }`}
            onClick={() => {
              setActiveTab("alunos");
              setCurrentPage(1);
            }}
          >
            Alunos
          </button>

          <button
            className={`${styles.tab} ${
              activeTab === "professores" ? styles.active : ""
            }`}
            onClick={() => {
              setActiveTab("professores");
              setCurrentPage(1);
            }}
          >
            Professores
          </button>

          <button
            className={`${styles.tab} ${
              activeTab === "turmas" ? styles.active : ""
            }`}
            onClick={() => {
              setActiveTab("turmas");
              setCurrentPage(1);
            }}
          >
            Turmas
          </button>

          <button
            className={`${styles.tab} ${
              activeTab === "cursos" ? styles.active : ""
            }`}
            onClick={() => {
              setActiveTab("cursos");
              setCurrentPage(1);
            }}
          >
            Cursos
          </button>
        </div>
      </div>

      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.headerContainer_content}>
            <div className={styles.left_cont_cp}>
              <img className={styles.logo} src={SadtIcon} alt="Logo do IF" />
              <span className={styles.title}>SADT</span>
            </div>

            <div className={styles.right_cont_cp}>
              <button className={styles.importButton} onClick={handleButtonClick}>
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
                placeholder="Buscar Aluno..."
                className={styles.searchInput}
              />

              <button className={styles.filterButton}>Personalizado</button>
            </div>
          </div>

          <div className={styles.filterInfo}>
            Filtrado por:{" "}
            <span className={styles.filterItem}>Alunos</span> &gt;{" "}
            <span className={styles.filterItem}>Todos os Cursos</span> &gt;{" "}
            <span className={styles.filterItem}>Mais recentes</span>
          </div>

          {activeTab === "alunos" && (
            <div className={styles.tabContent}>
              <div className={styles.cardsGrid}>
                {currentAlunos.map((aluno, index) => (
                  <div key={index} className={styles.card}>
                    <div className={styles.cardInfo}>
                      <div className={styles.infoItem}>
                        <span className={styles.label}>Nome</span>
                        <span className={styles.value}>{aluno.nome}</span>
                      </div>

                      <div className={styles.infoItem}>
                        <span className={styles.label}>I.R.A</span>
                        <span className={styles.value}>{aluno.ira}</span>
                      </div>

                      <div className={styles.infoItem}>
                        <span className={styles.label}>Matrícula</span>
                        <span className={styles.value}>{aluno.matricula}</span>
                      </div>

                      <div className={styles.infoItem}>
                        <span className={styles.label}>Curso</span>
                        <span className={styles.value}>{aluno.curso}</span>
                      </div>
                    </div>

                    <button className={styles.editButton}>Editar</button>
                  </div>
                ))}
              </div>
              

              <div className={styles.paginationWrapper}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />

                <button
                  className={styles.downloadButton}
                  onClick={handleDownloadModelo}
                >
                  Baixar modelo
                </button>

                
              </div>
            </div>
          )}

          {activeTab === "professores" && (
            <div className={styles.tabContent}>
              <h2>Professores</h2>
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
