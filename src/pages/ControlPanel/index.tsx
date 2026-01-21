import { useRef, useState } from "react";
import Header from "../../components/Header";
import BreadCrumb from "../../components/BreadCrumb";
import Footer from "../../components/Footer";
import Pagination from "../../components/Pagination";
import styles from "./ControlPanel.module.css";
import SadtIcon from "../../assets/logo-if.png";
import TooltipIcon from "../../assets/tooltip-icon.png";
import AlertIcon from "../../assets/alert-icon-message.png";

const ITEMS_PER_PAGE = 8;

export default function ControlPanel() {
  const [activeTab, setActiveTab] = useState<
    "alunos" | "professores" | "turmas" | "cursos"
  >("alunos");

  const alunos = Array.from({ length: 201 }).map((_, index) => ({
  nome: `Aluno ${index + 1}`,
  ira: "61,22", 
  matricula: "20241094040001", 
  curso: "Informática",
}));

type Aluno = {
  nome: string;
  ira: string;
  matricula: string;
  curso: string;
};

const cursosDisponiveisTeste = [
  "Informática",
  "Apicultura",
  "Alimentos",
  "Analise e Desenvolvimento de Sistemas",
  "Química",
  "Agroindustria"
];

const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
const [isDirty, setIsDirty] = useState(false);

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

                    <button
                        className={styles.editButton}
                        onClick={() => {
                          setSelectedAluno(aluno);
                          setIsModalOpen(true);
                          setIsDirty(false);
                        }}
                      >
                        Editar
                    </button>
                  </div>
                ))}
              </div>
              

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

      {isModalOpen && selectedAluno && (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <h2 className={styles.h2_edit_modal}>Editar Aluno</h2>

      {isDirty && (
        <div className={styles.alertWarning}>
          <img className={styles.alert_icon} src={AlertIcon} alt="icon-alert-message" />
          <h2 className={styles.h2_alert_message}>Existem alterações não salvas.</h2>
        </div>
      )}

      <form
        onChange={() => setIsDirty(true)}
        onSubmit={(e) => {
          e.preventDefault();

          const iraValue = parseFloat(selectedAluno.ira.replace(",", "."));

          if (iraValue < 0.01 || iraValue > 99.99 || isNaN(iraValue)) {
            alert("IRA deve estar entre 0,01 e 99,99");
            return;
          }

          setIsModalOpen(false);
        }}
      >
        <label>
          Aluno
          <input
            type="text"
            value={selectedAluno.nome}
            onChange={(e) =>
              setSelectedAluno({ ...selectedAluno, nome: e.target.value })
            }
          />
        </label>

        <label>
          IRA
          <input
            type="number"
            step="0.01"
            min="0.01"
            max="99.99"
            value={selectedAluno.ira}
            onChange={(e) =>
              setSelectedAluno({ ...selectedAluno, ira: e.target.value })
            }
          />
        </label>

        <label>
          Matrícula
          <input
            type="text"
            value={selectedAluno.matricula}
            onChange={(e) =>
              setSelectedAluno({
                ...selectedAluno,
                matricula: e.target.value,
              })
            }
          />
        </label>

        <label>
  Curso
  <div className={styles.selectWrapper}>
    <input
      readOnly
      className={styles.customSelect}
      value={selectedAluno.curso}
      placeholder="-- Selecione um curso --"
    />
    <div className={styles.optionsList}>
      {cursosDisponiveisTeste.map((curso) => (
        <div
          key={curso}
          className={styles.optionItem}
          onClick={() => {
            setSelectedAluno({ ...selectedAluno, curso: curso });
            setIsDirty(true);
          }}
        >
          {curso}
        </div>
      ))}
    </div>
  </div>
</label>

        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => setIsModalOpen(false)}
          >
            Cancelar
          </button>

          <button type="submit" className={styles.saveButton}>
            Salvar
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      <Footer />
    </div> 
  );
}
