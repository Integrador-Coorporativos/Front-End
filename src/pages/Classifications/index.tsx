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
const ITEMS_PER_PAGE = 10;

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

const fillToTen = (rows: Row[], page: number) => {
  const out = [...rows];
  for (let i = out.length; i < ITEMS_PER_PAGE; i++) {
    out.push({ classId: `empty-${page}-${i}`, __empty: true });
  }
  return out;
};

export default function Classifications() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { data, loading, error, refresh } = useAllClassPerformance();

  const normalized = useMemo(() => {
    const text = search.trim().toLowerCase();
    const arr = (data ?? []) as PerfItem[];

    const filtered = !text
      ? arr
      : arr.filter((x) => {
          const c = String(x.courseName ?? "").toLowerCase();
          const s = String(x.shift ?? "").toLowerCase();
          const p = String(x.gradleLevel ?? "").toLowerCase();
          return c.includes(text) || s.includes(text) || p.includes(text);
        });

    return [...filtered].sort((a, b) => (toNumber(b.averageScore) ?? -Infinity) - (toNumber(a.averageScore) ?? -Infinity));
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(normalized.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = normalized.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const rowsToRender = useMemo(() => fillToTen(pageItems, currentPage), [pageItems, currentPage]);

  const highlights = useMemo(() => {
    if (!normalized.length) return null;

    const bestByKey = (key: (typeof CRITERIA)[number]["key"]) => {
      return [...normalized].sort((a, b) => (toNumber((b as any)[key]) ?? -Infinity) - (toNumber((a as any)[key]) ?? -Infinity))[0];
    };

    const map: Record<string, PerfItem> = {};
    for (const c of CRITERIA) map[c.key] = bestByKey(c.key);
    return map;
  }, [normalized]);

  const showEmpty = !loading && !error && normalized.length === 0;
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

          {error && (
            <ErrorState 
              message={error} 
              onRetry={refresh} 
            />
          )}

          {showEmpty && <p>Sem dados de performance para exibir.</p>}

          {!loading && !error && highlights && (
            <div className={styles.grid}>
              {CRITERIA.map(({ title, icon, key }) => {
                const best = highlights[key];
                return (
                  <div
                    key={key}
                    className={styles.card}
                    onClick={() => navigate(`/classificacao/${best.classId}`)}
                    style={{ cursor: "pointer" }}
                    title="Clique para ver detalhes"
                  >
                    <div className={styles.cardHeader}>
                      <img src={icon} alt={`${title}-icon`} className={styles.cardIcon} />
                      <strong className={styles.cardTitle}>{title}</strong>
                    </div>

                    <div className={styles.infoRow}>
                      <span className={styles.cardSubtitle}>
                        {best.courseName ?? "-"} {best.gradleLevel ?? "-"} {best.shift ?? "-"}
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
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Buscar por turmas..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

            <div className={styles.filters}>
              <span className={styles.filterLabel}>Filtrar por:</span>
              <FilterButton text="Curso" />
              <FilterButton text="Período" />
            </div>
          </div>

          {loading && <LoadingState message="Carregando ranking..." />}

          {error && (
            <ErrorState 
              message={error} 
              onRetry={refresh} 
            />
          )}

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
                      const to = empty ? undefined : `/classificacao/${row.classId}`;

                      return (
                        <tr
                          key={String(row.classId)}
                          className={!empty ? styles.clickableRow : styles.emptyRow}
                          onClick={() => {
                            if (to) navigate(to);
                          }}
                          title={!empty ? "Clique para ver detalhes" : ""}
                        >
                          <td>{!empty ? startIndex + idx + 1 : ""}</td>
                          <td>{!empty ? row.courseName ?? "-" : "-"}</td>
                          <td>{!empty ? row.shift ?? "-" : "-"}</td>
                          <td>{!empty ? row.gradleLevel ?? "-" : "-"}</td>
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
  )
}