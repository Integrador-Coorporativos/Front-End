import Footer from "../../components/Footer";
import { useState } from "react";
import Header from "../../components/Header";
import styles from "./SelectClasses.module.css";
import FilterButton from "../../components/FilterButton";
import ClassCard from "../../components/ClassCard";
import Pagination from "../../components/Pagination";
import { useClasses } from "@/hooks/classes/useAllClasses";

const ITEMS_PER_PAGE = 9;

export default function SelecionarTurmas() {

const [currentPage, setCurrentPage] = useState(1);
  const { classes, loading, error } = useClasses();
  const totalPages = Math.ceil(classes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = classes.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  if (loading) return <div className={styles.container}><Header /><p>Carregando turmas...</p></div>;
  if (error) return <div className={styles.container}><Header /><p>{error}</p></div>;

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.containerSelect}>
        <div className={styles.containerText}>
          <h2 className={styles.title}>Selecione suas turmas desse período</h2>
          <h3 className={styles.subtitle}>Semestre: 2026.1</h3>
        </div>

        <div className={styles.containerTurno}>
          <FilterButton text="Turno" />
          <FilterButton text="Curso" />
        </div>

        <div className={styles.containerCards}>
          {currentItems.map((turma, index) => (
            <ClassCard
              key={index}
              anoReferencia={turma.classId.match(/^\d{4}/)?.[0] || "N/A"}
              ano={turma.semester}
              curso={turma.course.name}
              turno={turma.shift}
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
      <Footer />
    </div>
  );
}
