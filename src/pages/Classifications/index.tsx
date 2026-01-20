import { useState } from "react";
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

const ITEMS_PER_PAGE = 10;

export default function Classifications() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const cards = [
    { title: "Uso do Celular", icon: Phone },
    { title: "Participação", icon: Participation },
    { title: "Desempenho", icon: Performance },
    { title: "Frequência", icon: Frequency },
    { title: "Fardamento", icon: Uniform },
    { title: "Comportamento", icon: Behavior },
  ];

  const totalItems = 200;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const data = Array.from({ length: totalItems }).map((_, index) => ({
    id: index + 1,
    curso: "Informática",
    turno: "Vespertino",
    periodo: "4º",
    notas: {
      frequencia: "5.0",
      fardamento: "5.0",
      participacao: "5.0",
      desempenho: "5.0",
      celular: "5.0",
      comportamento: "5.0",
      total: "5.0",
    },
  }));

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = data.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div>
      <Header />

      <div style={{ width: "100%", padding: "3px 0" }}>
        <BreadCrumb
          items={[{ label: "Página Inicial", to: "/" }]}
        />
      </div>

      <div className={styles.highlightsContainer}>
        <h2 className={styles.title}>Destaques</h2>

        <div className={styles.grid}>
          {cards.map((item, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardHeader}>
                <img
                  src={item.icon}
                  alt={`${item.title}-icon`}
                  className={styles.cardIcon}
                />
                <strong className={styles.cardTitle}>
                  {item.title}
                </strong>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.cardSubtitle}>
                  Informática 4 Vespertino
                </span>
                <span className={styles.cardNota}>5.0</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.classificationContainer}>
        <div className={styles.box}>
          <h2 className={styles.sectionTitle}>Classificações</h2>

          <div className={styles.topBar}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Buscar por turmas..."
            />

            <div className={styles.filters}>
              <span className={styles.filterLabel}>
                Filtrar por:
              </span>

              <FilterButton text="Curso" />
              <FilterButton text="Período" />
            </div>
          </div>

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
                  onClick={() =>
                    navigate(`/classificacao/${item.id}`)
                  }
                >
                  <td>{startIndex + idx + 1}</td>
                  <td>{item.curso}</td>
                  <td>{item.turno}</td>
                  <td>{item.periodo}</td>
                  <td>{item.notas.frequencia}</td>
                  <td>{item.notas.fardamento}</td>
                  <td>{item.notas.participacao}</td>
                  <td>{item.notas.desempenho}</td>
                  <td>{item.notas.celular}</td>
                  <td>{item.notas.comportamento}</td>
                  <td>{item.notas.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.pagination}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
