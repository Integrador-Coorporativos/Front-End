import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import styles from "./MyClasses.module.css";
import FilterButton from "../../components/FilterButton";
import ListClassCard from "../../components/ListClassCard";
import Pagination from "../../components/Pagination";
import Footer from "../../components/Footer";
import { useClasses } from "@/hooks/classes/useAllClasses"; //Atenção: Endpoint de turmas de um professor ainda não foi feito

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
            <Link 
              to={`/turma/${turma.id}`}
              key={turma.id || index} 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
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
