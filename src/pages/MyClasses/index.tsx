import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import styles from "./MyClasses.module.css";
import ListClassCard from "../../components/ListClassCard";
import Pagination from "../../components/Pagination";
import Footer from "../../components/Footer";
import BreadCrumb from "@/components/BreadCrumb";
import { X } from "lucide-react"; 
import { useMyClasses } from "@/hooks/classes/useMyClasses";
import { LoadingState, ErrorState } from "@/components/FeedbackStates/FeedbackStates";
const ITEMS_PER_PAGE = 9;

export default function SelecionarTurmas() {
const [currentPage, setCurrentPage] = useState(1);
  
  // 1. Fallback garantido: se classes vier undefined/null, vira []
  const { classes: rawClasses, loading, error } = useMyClasses();
  const classes = Array.isArray(rawClasses) ? rawClasses : [];
  
  const [filterTurno, setFilterTurno] = useState<string>("");
  const [filterCurso, setFilterCurso] = useState<string>("");

  // Agora o .map não quebra mais, pois classes é SEMPRE um array
  const turnosDisponiveis = useMemo(() => {
    return Array.from(new Set(classes.map(t => t.shift))).filter(Boolean).sort();
  }, [classes]);

  const cursosDisponiveis = useMemo(() => {
    return Array.from(new Set(classes.map(t => t.course?.name))).filter(Boolean).sort();
  }, [classes]);

  const filteredClasses = useMemo(() => {
    return classes.filter((turma) => {
      const matchTurno = filterTurno ? turma.shift === filterTurno : true;
      const matchCurso = filterCurso ? turma.course.name === filterCurso : true;
      return matchTurno && matchCurso;
    });
  }, [classes, filterTurno, filterCurso]);

  const hasClasses = filteredClasses.length > 0;
  const totalPages = Math.ceil(filteredClasses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredClasses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const isListEmpty = classes.length === 0;

  const clearFilters = () => {
    setFilterTurno("");
    setFilterCurso("");
    setCurrentPage(1);
  };

 return (
    <div className={styles.container}>
      <Header />
      <BreadCrumb items={[{ label: "Página Inicial", to: "/" }, { label: "Minhas turmas", to: "/minhas-turmas" }]} />

      <main className={styles.mainContent}>
        {loading ? (
          <LoadingState message="Carregando Turmas..." />
        ) : error ? (
          <ErrorState 
            message={error || "Erro ao carregar Turmas."} 
            onRetry={() => window.location.reload()} 
          />
        ) : (
        <>
          <div className={styles.pageHeader}>
            <h2 className={styles.title}>Minhas Turmas</h2>
            <h3 className={styles.subtitle}>Semestre: 2026.1</h3>
          </div>

          <div className={styles.containerList}>
            {/* 2. Se a lista original for vazia (API 204), mostra o botão de selecionar */}
            {isListEmpty ? (
              <div className={styles.emptyState} style={{ textAlign: 'center', padding: '3rem' }}>
                <p>Você ainda não possui turmas vinculadas para este semestre.</p>
                <Link to="/selecionar-turmas" className={styles.addBtn} style={{ textDecoration: 'none', display: 'inline-block' }}>
                  Selecionar Minhas Turmas
                </Link>
              </div>
            ) : (
              <>
                <div className={styles.filterBar}>
                  <div className={styles.activeFilters}>
                    <span className={styles.filterLabel}>Filtrado por:</span>
                    <div className={styles.filterTextGroup}>
                      {!filterTurno && !filterCurso ? (
                        <span className={styles.filterValue}>Todas as turmas</span>
                      ) : (
                        <>
                          <span className={styles.filterValue}>
                            {filterCurso || "Cursos"}
                            {filterTurno && ` > ${filterTurno}`}
                          </span>
                          <button onClick={clearFilters} className={styles.clearBtn}>
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className={styles.containerFilters}>
                    <select 
                      className={styles.selectFilter}
                      value={filterTurno}
                      onChange={(e) => {setFilterTurno(e.target.value); setCurrentPage(1);}}
                    >
                      <option value="">Filtrar Turno</option>
                      {turnosDisponiveis.map(turno => (
                        <option key={turno} value={turno}>{turno}</option>
                      ))}
                    </select>
                    <select 
                      className={styles.selectFilter}
                      value={filterCurso}
                      onChange={(e) => {setFilterCurso(e.target.value); setCurrentPage(1);}}
                    >
                      <option value="">Filtrar Curso</option>
                      {cursosDisponiveis.map(curso => (
                        <option key={curso} value={curso}>{curso}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {hasClasses ? (
                  <>
                    <div className={styles.containerCards}>
                      {currentItems.map((turma, index) => (
                        <Link to={`${turma.id}`} key={turma.id || index} className={styles.cardLink}>
                          <ListClassCard
                            anoReferencia={turma.classId.match(/^\d{4}/)?.[0] || "N/A"}
                            ano={turma.semester}
                            curso={turma.course.name}
                            turno={turma.shift}
                          />
                        </Link>
                      ))}
                    </div>
                    <div className={styles.paginationWrapper}>
                      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </div>
                  </>
                ) : (
                  <div className={styles.emptyState}>
                    <p>Nenhuma turma encontrada para os filtros selecionados.</p>
                    <button onClick={clearFilters} className={styles.addBtn}>Ver todas as turmas</button>
                  </div>
                )}
              </>
            )}
          </div>
        </>
        )}
      </main>
      <Footer />
    </div>
  );
}