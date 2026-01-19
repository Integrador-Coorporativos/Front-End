import { useState } from "react";
import Header from "../../components/Header";
import styles from "./MyClasses.module.css";
import FilterButton from "../../components/FilterButton";
import ListClassCard from "../../components/ListClassCard";
import Pagination from "../../components/Pagination";

const ITEMS_PER_PAGE = 9;

const turmas = Array.from({ length: 201 }).map(() => ({
  anoReferencia: "2022",
  ano: "4º",
  curso: "Informática",
  turno: "Vespertino",
}));

export default function SelecionarTurmas() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(turmas.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = turmas.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.containerList}>
        <div className={styles.containerText}>
          <h2 className={styles.title}>Minhas Turmas</h2>
          <h3 className={styles.subtitle}>Semestre: 2026.1</h3>
        </div>

        <div className={styles.containerTurno}>
          <FilterButton text="Turno" />
          <FilterButton text="Curso" />
        </div>

        <div className={styles.containerCards}>
          {currentItems.map((turma, index) => (
            <ListClassCard
              key={index}
              anoReferencia={turma.anoReferencia}
              ano={turma.ano}
              curso={turma.curso}
              turno={turma.turno}
            />
          ))}
        </div>

        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
