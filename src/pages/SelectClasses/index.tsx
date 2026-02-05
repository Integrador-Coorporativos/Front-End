import { useState, useEffect } from "react";
import { LoadingState, ErrorState } from "@/components/FeedbackStates/FeedbackStates";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "./SelectClasses.module.css";
import FilterButton from "../../components/FilterButton";
import ClassCard from "../../components/ClassCard";
import Pagination from "../../components/Pagination";
import { useClasses } from "@/hooks/classes/useAllClasses";
import { useLinkClass } from "@/hooks/classes/useLinkClass";

const ITEMS_PER_PAGE = 9;

export default function SelecionarTurmas() {
  const [currentPage, setCurrentPage] = useState(1);
  const { classes, loading, error } = useClasses();
  const { link } = useLinkClass();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [selectedTurno, setSelectedTurno] = useState<string | null>(null);
  const [selectedCurso, setSelectedCurso] = useState<string | null>(null);

  const [showTurnoMenu, setShowTurnoMenu] = useState(false);
  const [showCourseMenu, setShowCourseMenu] = useState(false);

  const [tempTurno, setTempTurno] = useState<string | null>(null);
  const [tempCourse, setTempCourse] = useState<string | null>(null);

  const courses = Array.from(new Set(classes?.map(c => c.course.name) || []));
  const turnos = ["Matutino", "Vespertino", "Noturno"];

  useEffect(() => {
    if (classes) {
      const idsJaVinculados = classes
        .filter((t) => t.teacherLinked)
        .map((t) => t.id);
      setSelectedIds(idsJaVinculados);
    }
  }, [classes]);

  const filteredItems = (classes || []).filter((turma) => {
    const matchTurno = !selectedTurno || turma.shift === selectedTurno;
    const matchCurso = !selectedCurso || turma.course.name === selectedCurso;
    return matchTurno && matchCurso;
  });

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const resetFilters = () => {
    setSelectedTurno(null);
    setSelectedCurso(null);
    setTempTurno(null);
    setTempCourse(null);
    setCurrentPage(1);
  };

  const toggleSelection = async (id: number) => {
    const isAlreadySelected = selectedIds.includes(id);
    setSelectedIds((prev) =>
      isAlreadySelected ? prev.filter((item) => item !== id) : [...prev, id]
    );

    try {
      await link(id);
    } catch (err) {
      setSelectedIds((prev) =>
        isAlreadySelected ? [...prev, id] : prev.filter((item) => item !== id)
      );
      alert("Erro ao sincronizar com o servidor.");
    }
  };

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.containerSelect}>
        {loading ? (
          <LoadingState message="Buscando turmas disponíveis..." />
        ) : error ? (
          <ErrorState
            message={error || "Não foi possível carregar as turmas."}
            onRetry={() => window.location.reload()}
          />
        ) : (
          <>
            <section className={styles.containerText}>
              <h2 className={styles.title}>Selecione suas turmas desse período</h2>
              <h3 className={styles.subtitle}>
                Semestre: <span>2026.1</span>
              </h3>
            </section>

            <section className={styles.filterSection}>
              <div className={styles.breadcrumbs}>
                <span>Filtrado por:</span>
                <button className={styles.filterTag} onClick={resetFilters}>
                  {!selectedTurno && !selectedCurso ? "Padrão" : "Limpar"}
                </button>
                {selectedCurso && <span className={styles.activeFilter}> {">"} {selectedCurso}</span>}
                {selectedTurno && <span className={styles.activeFilter}> {">"} {selectedTurno}</span>}
              </div>

              <div className={styles.containerTurno}>
                <div className={styles.dropdownWrapper}>
                  <FilterButton text="Turno" onClick={() => {
                    setTempTurno(selectedTurno);
                    setShowTurnoMenu(!showTurnoMenu);
                    setShowCourseMenu(false);
                  }} />
                  {showTurnoMenu && (
                    <div className={styles.dropdownMenu}>
                      <span className={styles.filterTitle}>Filtrar por Turno</span>
                      <select
                        className={styles.filterSelect}
                        value={tempTurno || ""}
                        onChange={(e) => setTempTurno(e.target.value || null)}
                      >
                        <option value="">Todos os Turnos</option>
                        {turnos.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <div className={styles.buttonGroup}>
                        <button className={styles.clearFilterButton} onClick={() => {
                          setSelectedTurno(null);
                          setTempTurno(null);
                          setShowTurnoMenu(false);
                        }}>Limpar</button>
                        <button className={styles.applyFilterButton} onClick={() => {
                          setSelectedTurno(tempTurno);
                          setShowTurnoMenu(false);
                          setCurrentPage(1);
                        }}>Aplicar</button>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.dropdownWrapper}>
                  <FilterButton text="Curso" onClick={() => {
                    setTempCourse(selectedCurso);
                    setShowCourseMenu(!showCourseMenu);
                    setShowTurnoMenu(false);
                  }} />
                  {showCourseMenu && (
                    <div className={styles.dropdownMenu}>
                      <span className={styles.filterTitle}>Filtrar por Curso</span>
                      <select
                        className={styles.filterSelect}
                        value={tempCourse || ""}
                        onChange={(e) => setTempCourse(e.target.value || null)}
                      >
                        <option value="">Todos os Cursos</option>
                        {courses.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <div className={styles.buttonGroup}>
                        <button className={styles.clearFilterButton} onClick={() => {
                          setSelectedCurso(null);
                          setTempCourse(null);
                          setShowCourseMenu(false);
                        }}>Limpar</button>
                        <button className={styles.applyFilterButton} onClick={() => {
                          setSelectedCurso(tempCourse);
                          setShowCourseMenu(false);
                          setCurrentPage(1);
                        }}>Aplicar</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <div className={styles.containerCards}>
              {currentItems.length > 0 ? (
                currentItems.map((turma) => (
                  <ClassCard
                    key={turma.id}
                    anoReferencia={turma.classId?.toString().slice(0, 4) || "N/A"}
                    ano={turma.semester}
                    curso={turma.course.name}
                    turno={turma.shift}
                    isSelected={selectedIds.includes(turma.id)}
                    onSelect={() => toggleSelection(turma.id)}
                  />
                ))
              ) : (
                <div className={styles.noDataWrapper}>
                  <p className={styles.noData}>Nenhuma turma encontrada para os filtros selecionados.</p>
                </div>
              )}
            </div>

            <footer className={styles.paginationWrapper}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </footer>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}