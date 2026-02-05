import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import BreadCrumb from "../../components/BreadCrumb";
import FilterButton from "../../components/FilterButton";
import Pagination from "../../components/Pagination";
import Footer from "../../components/Footer";
import styles from "./Classification.module.css";
import Phone from "../../assets/logo-phone.png";
import Participation from "../../assets/participation-icon.png";
import Performance from "../../assets/perfomance-icon.png";
import Frequency from "../../assets/frequency-icon.png";
import Uniform from "../../assets/uniform-icon.png";
import Behavior from "../../assets/behavior-icon.png";
import { useAllClassPerformance } from "@/hooks/performance/useAllClassPerformance";
import { LoadingState, ErrorState } from "@/components/FeedbackStates/FeedbackStates";

const ITEMS_PER_PAGE = 8;

const CRITERIA = [
  { title: "Uso do Celular", icon: Phone, key: "cellPhoneUseScore" },
  { title: "Participação", icon: Participation, key: "participationScore" },
  { title: "Desempenho", icon: Performance, key: "performanceScore" },
  { title: "Frequência", icon: Frequency, key: "frequencyScore" },
  { title: "Fardamento", icon: Uniform, key: "unifirmScore" },
  { title: "Comportamento", icon: Behavior, key: "behaviorScore" },
] as const;

type PerfItem = {
  classId: string | number;
  courseName?: string;
  shift?: string;
  gradleLevel?: string | number;
  averageScore?: number | string;
  frequencyScore?: number | string;
  unifirmScore?: number | string;
  participationScore?: number | string;
  performanceScore?: number | string;
  cellPhoneUseScore?: number | string;
  behaviorScore?: number | string;
};

type Row = PerfItem & { __empty?: true };

const toNumber = (v: unknown) => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
};

const formatScore = (v: unknown) => {
  const n = toNumber(v);
  return n === null ? "-" : n.toFixed(1);
};

const fillToPageSize = (rows: Row[], page: number) => {
  const out = [...rows];
  for (let i = out.length; i < ITEMS_PER_PAGE; i++) {
    out.push({ classId: `empty-${page}-${i}`, __empty: true });
  }
  return out;
};

export default function Classifications() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showCourseMenu, setShowCourseMenu] = useState(false);
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);
  
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  
  const [tempCourse, setTempCourse] = useState<string | null>(null);
  const [tempPeriod, setTempPeriod] = useState<string | null>(null);

  const { data, loading, error, refresh } = useAllClassPerformance();

  const courses = useMemo(() => {
    const all = (data as PerfItem[] | undefined)?.map(item => item.courseName).filter(Boolean) || [];
    return Array.from(new Set(all)) as string[];
  }, [data]);

  const periods = useMemo(() => {
    const arr = (data ?? []) as PerfItem[];
    const source = selectedCourse ? arr.filter(x => x.courseName === selectedCourse) : arr;
    const all = source.map(item => String(item.gradleLevel)).filter(Boolean);
    return Array.from(new Set(all)).sort();
  }, [data, selectedCourse]);

  const normalized = useMemo(() => {
    let filtered = (data ?? []) as PerfItem[];

    if (selectedCourse) {
      filtered = filtered.filter(x => x.courseName === selectedCourse);
    }
    if (selectedPeriod) {
      filtered = filtered.filter(x => String(x.gradleLevel) === selectedPeriod);
    }
    if (search.trim()) {
      const text = search.toLowerCase();
      filtered = filtered.filter(x =>
        String(x.courseName ?? "").toLowerCase().includes(text) ||
        String(x.shift ?? "").toLowerCase().includes(text) ||
        String(x.gradleLevel ?? "").toLowerCase().includes(text)
      );
    }

    return [...filtered].sort((a, b) => (toNumber(b.averageScore) ?? -Infinity) - (toNumber(a.averageScore) ?? -Infinity));
  }, [data, search, selectedCourse, selectedPeriod]);

  const totalPages = Math.max(1, Math.ceil(normalized.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = normalized.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const rowsToRender = useMemo(() => fillToPageSize(pageItems, currentPage), [pageItems, currentPage]);

  const highlights = useMemo(() => {
    if (!normalized.length) return null;
    const bestByKey = (key: (typeof CRITERIA)[number]["key"]) => {
      return [...normalized].sort((a, b) => (toNumber((b as any)[key]) ?? -Infinity) - (toNumber((a as any)[key]) ?? -Infinity))[0];
    };
    const map: Record<string, PerfItem> = {};
    for (const c of CRITERIA) map[c.key] = bestByKey(c.key);
    return map;
  }, [normalized]);

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.container}>
        <div style={{ width: "100%", padding: "3px 0" }}>
          <BreadCrumb items={[{ label: "Página Inicial", to: "/" }]} />
        </div>

        <div className={styles.sectionWrapper}>
          <h2 className={styles.title}>Destaques</h2>
          {loading && <LoadingState message="Carregando destaques..." />}
          {error && <ErrorState message={error} onRetry={refresh} />}
          {!loading && !error && highlights && (
            <div className={styles.grid}>
              {CRITERIA.map(({ title, icon, key }) => {
                const best = highlights[key];
                return (
                  <div key={key} className={styles.card} onClick={() => navigate(`/classificacao/${best.classId}`)}>
                    <div className={styles.cardHeader}>
                      <img src={icon} alt={title} className={styles.cardIcon} />
                      <strong className={styles.cardTitle}>{title}</strong>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.cardSubtitle}>
                        {best.courseName} {best.gradleLevel} {best.shift}
                      </span>
                      <span className={styles.cardNota}>{formatScore((best as any)[key])}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={`${styles.sectionWrapper} ${styles.classificationBox}`}>
          <h2 className={styles.title}>Classificações</h2>
          <div className={styles.topBar}>
            <div className={styles.filterStatus}>
              <span className={styles.filterLabel}>Filtrado por:</span>
              <span className={styles.filterValue}>
                {selectedCourse ? `Curso: ${selectedCourse}` : ""}
                {selectedPeriod ? ` > Período: ${selectedPeriod}º` : ""}
                {search.trim() ? ` > Busca: "${search}"` : ""}
                {!selectedCourse && !selectedPeriod && !search.trim() && "Padrão"}
              </span>
            </div>

            <div className={styles.actions}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Buscar por turmas..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
              <div className={styles.filters}>
                <div className={styles.dropdownWrapper}>
                  <FilterButton text="Curso" onClick={() => { 
                    setTempCourse(selectedCourse);
                    setShowCourseMenu(!showCourseMenu); 
                    setShowPeriodMenu(false); 
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
                        <button className={styles.clearFilterButton_student} onClick={() => { 
                          setSelectedCourse(null); 
                          setTempCourse(null);
                          setShowCourseMenu(false); 
                        }}>
                          Limpar
                        </button>
                        <button className={styles.applyFilterButton_student} onClick={() => { 
                          setSelectedCourse(tempCourse);
                          setShowCourseMenu(false); 
                          setCurrentPage(1); 
                        }}>
                          Aplicar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.dropdownWrapper}>
                  <FilterButton text="Período" onClick={() => { 
                    setTempPeriod(selectedPeriod);
                    setShowPeriodMenu(!showPeriodMenu); 
                    setShowCourseMenu(false); 
                  }} />
                  {showPeriodMenu && (
                    <div className={styles.dropdownMenu}>
                      <span className={styles.filterTitle}>Filtrar por Período</span>
                      <select
                        className={styles.filterSelect}
                        value={tempPeriod || ""}
                        onChange={(e) => setTempPeriod(e.target.value || null)}
                      >
                        <option value="">Todos os Períodos</option>
                        {periods.map(p => (
                          <option key={p} value={p}>{p}º Período</option>
                        ))}
                      </select>

                      <div className={styles.buttonGroup}>
                        <button
                          className={styles.clearFilterButton_student}
                          onClick={() => { 
                            setSelectedPeriod(null); 
                            setTempPeriod(null);
                            setShowPeriodMenu(false); 
                          }}
                        >
                          Limpar
                        </button>
                        <button
                          className={styles.applyFilterButton_student}
                          onClick={() => { 
                            setSelectedPeriod(tempPeriod);
                            setShowPeriodMenu(false); 
                            setCurrentPage(1); 
                          }}
                        >
                          Aplicar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {loading && <LoadingState message="Carregando ranking..." />}
          {error && <ErrorState message={error} onRetry={refresh} />}

          {!loading && !error && (
            <>
              <div className={styles.tableShell}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Curso</th>
                      <th>Turno</th>
                      <th>Período</th>
                      <th>Frequência</th>
                      <th>Fardamento</th>
                      <th>Participação</th>
                      <th>Desempenho</th>
                      <th>Celular</th>
                      <th>Comportamento</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowsToRender.map((row, idx) => {
                      const empty = row.__empty;
                      return (
                        <tr key={String(row.classId)} className={!empty ? styles.clickableRow : styles.emptyRow} onClick={() => !empty && navigate(`/classificacao/${row.classId}`)}>
                          <td>{!empty ? startIndex + idx + 1 : ""}</td>
                          <td>{!empty ? row.courseName : "-"}</td>
                          <td>{!empty ? row.shift : "-"}</td>
                          <td>{!empty ? `${row.gradleLevel}` : "-"}</td>
                          <td>{!empty ? formatScore(row.frequencyScore) : "-"}</td>
                          <td>{!empty ? formatScore(row.unifirmScore) : "-"}</td>
                          <td>{!empty ? formatScore(row.participationScore) : "-"}</td>
                          <td>{!empty ? formatScore(row.performanceScore) : "-"}</td>
                          <td>{!empty ? formatScore(row.cellPhoneUseScore) : "-"}</td>
                          <td>{!empty ? formatScore(row.behaviorScore) : "-"}</td>
                          <td>{!empty ? formatScore(row.averageScore) : "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className={styles.pagination}>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}