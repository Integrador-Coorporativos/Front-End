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

const ITEMS_PER_PAGE = 10;

export default function Classifications() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { data: performance, loading, error, refresh } = useAllClassPerformance();

  useEffect(() => {
    console.log("[Classifications] loading:", loading);
    console.log("[Classifications] error:", error);
    console.log("[Classifications] performance length:", performance?.length);
    console.log("[Classifications] performance sample:", performance?.[0]);
  }, [loading, error, performance]);

  const cards = [
    { title: "Uso do Celular", icon: Phone, key: "celular" as const },
    { title: "Participação", icon: Participation, key: "participacao" as const },
    { title: "Desempenho", icon: Performance, key: "desempenho" as const },
    { title: "Frequência", icon: Frequency, key: "frequencia" as const },
    { title: "Fardamento", icon: Uniform, key: "fardamento" as const },
    { title: "Comportamento", icon: Behavior, key: "comportamento" as const },
  ];

  const formatScore = (v: unknown) => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n.toFixed(1) : "-";
  };

  const normalized = useMemo(() => {
    const text = search.trim().toLowerCase();

    const arr = (performance ?? []).map((item: any) => ({
      id: item.classId,
      curso: item.courseName ?? "-",
      turno: item.shift ?? "-",
      periodo: item.gradleLevel ?? "-",
      notas: {
        frequencia: item.frequencyScore,
        fardamento: item.unifirmScore,
        participacao: item.participationScore,
        desempenho: item.performanceScore,
        celular: item.cellPhoneUseScore,
        comportamento: item.behaviorScore,
        total: item.averageScore,
      },
    }));

    const filtered = !text
      ? arr
      : arr.filter((x) => {
          return (
            String(x.curso).toLowerCase().includes(text) ||
            String(x.turno).toLowerCase().includes(text) ||
            String(x.periodo).toLowerCase().includes(text)
          );
        });

    filtered.sort((a, b) => {
      const ta = Number(a.notas.total);
      const tb = Number(b.notas.total);
      if (!Number.isFinite(tb) && !Number.isFinite(ta)) return 0;
      if (!Number.isFinite(tb)) return -1;
      if (!Number.isFinite(ta)) return 1;
      return tb - ta;
    });

    return filtered;
  }, [performance, search]);

  const totalItems = normalized.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = normalized.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const highlights = useMemo(() => {
    if (!normalized.length) return null;

    const pickBest = (key: keyof typeof normalized[number]["notas"]) => {
      return [...normalized].sort((a, b) => {
        const va = Number(a.notas[key]);
        const vb = Number(b.notas[key]);
        if (!Number.isFinite(vb) && !Number.isFinite(va)) return 0;
        if (!Number.isFinite(vb)) return -1;
        if (!Number.isFinite(va)) return 1;
        return vb - va;
      })[0];
    };

    return {
      celular: pickBest("celular"),
      participacao: pickBest("participacao"),
      desempenho: pickBest("desempenho"),
      frequencia: pickBest("frequencia"),
      fardamento: pickBest("fardamento"),
      comportamento: pickBest("comportamento"),
    };
  }, [normalized]);

  return (
    <div>
      <Header />

      <div style={{ width: "100%", padding: "3px 0" }}>
        <BreadCrumb items={[{ label: "Página Inicial", to: "/" }]} />
      </div>

      <div className={styles.highlightsContainer}>
        <h2 className={styles.title}>Destaques</h2>

        {loading && <p>Carregando destaques...</p>}

        {error && (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <p style={{ margin: 0 }}>{error}</p>
            <button onClick={refresh}>Tentar novamente</button>
          </div>
        )}

        {!loading && !error && normalized.length === 0 && (
          <p>Sem dados de performance para exibir.</p>
        )}

        {!loading && !error && highlights && (
          <div className={styles.grid}>
            {cards.map((item) => {
              const best = highlights[item.key];

              const scoreByKey: Record<(typeof item.key), unknown> = {
                celular: best.notas.celular,
                participacao: best.notas.participacao,
                desempenho: best.notas.desempenho,
                frequencia: best.notas.frequencia,
                fardamento: best.notas.fardamento,
                comportamento: best.notas.comportamento,
              };

              const score = scoreByKey[item.key];

              return (
                <div
                  key={item.title}
                  className={styles.card}
                  onClick={() => navigate(`/classificacao/${best.id}`)}
                  style={{ cursor: "pointer" }}
                  title="Clique para ver detalhes"
                >
                  <div className={styles.cardHeader}>
                    <img
                      src={item.icon}
                      alt={`${item.title}-icon`}
                      className={styles.cardIcon}
                    />
                    <strong className={styles.cardTitle}>{item.title}</strong>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.cardSubtitle}>
                      {best.curso} {best.periodo} {best.turno}
                    </span>
                    <span className={styles.cardNota}>{formatScore(score)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.classificationContainer}>
        <div className={styles.box}>
          <h2 className={styles.sectionTitle}>Classificações</h2>

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

          {loading && <p>Carregando ranking...</p>}

          {error && (
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <p style={{ margin: 0 }}>{error}</p>
              <button onClick={refresh}>Tentar novamente</button>
            </div>
          )}

          {!loading && !error && (
            <>
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
                  {currentItems.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={styles.clickableRow}
                      onClick={() => navigate(`/classificacao/${item.id}`)}
                      title="Clique para ver detalhes"
                    >
                      <td>{startIndex + idx + 1}</td>
                      <td>{item.curso}</td>
                      <td>{item.turno}</td>
                      <td>{item.periodo}</td>
                      <td>{formatScore(item.notas.frequencia)}</td>
                      <td>{formatScore(item.notas.fardamento)}</td>
                      <td>{formatScore(item.notas.participacao)}</td>
                      <td>{formatScore(item.notas.desempenho)}</td>
                      <td>{formatScore(item.notas.celular)}</td>
                      <td>{formatScore(item.notas.comportamento)}</td>
                      <td>{formatScore(item.notas.total)}</td>
                    </tr>
                  ))}

                  {currentItems.length === 0 && (
                    <tr>
                      <td colSpan={11} style={{ textAlign: "center" }}>
                        {search.trim()
                          ? "Nenhum resultado encontrado."
                          : "Sem dados para exibir."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className={styles.pagination}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
