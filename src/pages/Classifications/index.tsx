import { useState } from "react";

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

  const data = Array.from({ length: totalItems });

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
          items={[
            { label: "Página Inicial", to: "/" },
            { label: "Classificações", to: "/classificacoes" },
          ]}
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
              {currentItems.map((_, idx) => (
                <tr key={idx}>
                  <td>{startIndex + idx + 1}</td>
                  <td>Informática</td>
                  <td>Vespertino</td>
                  <td>4º</td>
                  <td>5.0</td>
                  <td>5.0</td>
                  <td>5.0</td>
                  <td>5.0</td>
                  <td>5.0</td>
                  <td>5.0</td>
                  <td>5.0</td>
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
