import styles from "./ClassesDetail.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import StudentsDetail from "../../components/StudensDetail";
import FilterButton from "../../components/FilterButton";
import Pagination from "../../components/Pagination";
import { useState } from "react";

const ITEMS_PER_PAGE = 10;

const turmas = Array.from({ length: 201 }).map(() => ({
    nomeCompleto: "Josiel Orlando Texas",
    indiceRendimentoAcademico: 61.22,
    matricula: "20241094040001",
    numReprovacoes: 5,
    frequencia: 40.1,
    situacao: "Ruim" as const,
}));

export default function ClassesDetail() {
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

      <div className={styles.containerDetail}>
        <div className={styles.containerText}>
          <h2 className={styles.title}>Informática 4º Vespertino</h2>
        </div>

        <div className={styles.containerFiltro}>
          <FilterButton text="Filtrar por" />
        </div>

        <div className={styles.studentsList}>
          {currentItems.map((student, index) => (
            <StudentsDetail
              key={index}
              nomeCompleto={student.nomeCompleto}
              indiceRendimentoAcademico={student.indiceRendimentoAcademico}
              matricula={student.matricula}
              numReprovacoes={student.numReprovacoes}
              frequencia={student.frequencia}
              situacao={student.situacao}
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
