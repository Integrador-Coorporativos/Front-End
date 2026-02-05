import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import styles from "./MyClasses.module.css";
import ListClassCard from "../../components/ListClassCard";
import Pagination from "../../components/Pagination";
import Footer from "../../components/Footer";
import BreadCrumb from "@/components/BreadCrumb";
import { X, Plus } from "lucide-react";
import { useClasses } from "@/hooks/classes/useAllClasses";
import FilterButton from "@/components/FilterButton";

const ITEMS_PER_PAGE = 9;

export default function SelecionarTurmas() {
  const [currentPage, setCurrentPage] = useState(1);
  const { classes, loading, error } = useClasses();

  const [showTurnoMenu, setShowTurnoMenu] = useState(false);
  const [showCourseMenu, setShowCourseMenu] = useState(false);
  const [tempTurno, setTempTurno] = useState<string>("");
  const [tempCourse, setTempCourse] = useState<string>("");

  const [filterTurno, setFilterTurno] = useState<string>("");
  const [filterCurso, setFilterCurso] = useState<string>("");

  const turnosDisponiveis = useMemo(() => {
    const turnos = classes?.map(t => t.shift) || [];
    return Array.from(new Set(turnos)).filter(Boolean).sort();
  }, [classes]);

  const cursosDisponiveis = useMemo(() => {
    const nomes = classes?.map(t => t.course.name) || [];
    return Array.from(new Set(nomes)).filter(Boolean).sort();
  }, [classes]);

  const filteredClasses = useMemo(() => {
    return (classes || []).filter((turma) => {
      const matchTurno = filterTurno ? turma.shift === filterTurno : true;
      const matchCurso = filterCurso ? turma.course.name === filterCurso : true;
      return matchTurno && matchCurso;
    });
  }, [classes, filterTurno, filterCurso]);

  const hasClasses = filteredClasses.length > 0;
  const totalPages = Math.ceil(filteredClasses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredClasses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const clearFilters = () => {
    setFilterTurno("");
    setFilterCurso("");
    setTempTurno("");
    setTempCourse("");
    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      <Header />
      <BreadCrumb items={[{ label: "Página Inicial", to: "/" }, { label: "Minhas turmas", to: "/minhas-turmas" }]} />

      <main className={styles.mainContent}>
        <div className={styles.containerList}>
          <div className={styles.pageHeader}>
            <h2 className={styles.title}>Minhas Turmas</h2>
            <h3 className={styles.subtitle}>Semestre: <span>2026.1</span></h3>
          </div>

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
              <div className={styles.dropdownWrapper}>
                <FilterButton
                  text="Turno"
                  onClick={() => {
                    setTempTurno(filterTurno);
                    setShowTurnoMenu(!showTurnoMenu);
                    setShowCourseMenu(false);
                  }}
                />
                {showTurnoMenu && (
                  <div className={styles.dropdownMenu}>
                    <span className={styles.filterTitle}>Filtrar por Turno</span>
                    <select
                      className={styles.filterSelect}
                      value={tempTurno || ""}
                      onChange={(e) => setTempTurno(e.target.value || "")}
                    >
                      <option value="">Todos os Turnos</option>
                      {turnosDisponiveis.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <div className={styles.buttonGroup}>
                      <button className={styles.clearFilterButton} onClick={() => {
                        setFilterTurno("");
                        setTempTurno("");
                        setShowTurnoMenu(false);
                      }}>Limpar</button>
                      <button className={styles.applyFilterButton} onClick={() => {
                        setFilterTurno(tempTurno);
                        setShowTurnoMenu(false);
                        setCurrentPage(1);
                      }}>Aplicar</button>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.dropdownWrapper}>
                <FilterButton
                  text="Curso"
                  onClick={() => {
                    setTempCourse(filterCurso);
                    setShowCourseMenu(!showCourseMenu);
                    setShowTurnoMenu(false);
                  }}
                />
                {showCourseMenu && (
                  <div className={styles.dropdownMenu}>
                    <span className={styles.filterTitle}>Filtrar por Curso</span>
                    <select
                      className={styles.filterSelect}
                      value={tempCourse || ""}
                      onChange={(e) => setTempCourse(e.target.value || "")}
                    >
                      <option value="">Todos os Cursos</option>
                      {cursosDisponiveis.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className={styles.buttonGroup}>
                      <button className={styles.clearFilterButton} onClick={() => {
                        setFilterCurso("");
                        setTempCourse("");
                        setShowCourseMenu(false);
                      }}>Limpar</button>
                      <button className={styles.applyFilterButton} onClick={() => {
                        setFilterCurso(tempCourse);
                        setShowCourseMenu(false);
                        setCurrentPage(1);
                      }}>Aplicar</button>
                    </div>
                  </div>
                )}
              </div>
              <Link to="/selecionar-turmas" className={styles.addPageBtn}>
                <Plus size={18} />
                Adicionar Turmas
              </Link>
            </div>
          </div>

          {hasClasses ? (
            <>
              <div className={styles.containerCards}>
                {currentItems.map((turma, index) => (
                  <Link to={`/turma/${turma.id}`} key={turma.id || index} className={styles.cardLink}>
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
        </div>
      </main>
      <Footer />
    </div>
  );
}