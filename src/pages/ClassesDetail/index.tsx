import styles from "./ClassesDetail.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import StudentsDetail from "../../components/StudensDetail";
import FilterButton from "../../components/FilterButton";
import Pagination from "../../components/Pagination";
import { useState } from "react";
import { useClassDetails } from "@/hooks/courses/useClassDetails";
import { useParams } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

export default function ClassesDetail() {

  const { id } = useParams<{ id: string }>(); 
  const classId = id ? parseInt(id) : undefined;
  
  const { classData, loading, error } = useClassDetails(classId);
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) return <div className={styles.container}>Carregando dados da turma...</div>;
  if (error) return <div className={styles.container}>Erro: {error}</div>;
  if (!classData) return <div className={styles.container}>Turma não encontrada.</div>;

  const totalPages = Math.ceil(classData.students.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = classData.students.slice(
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
              nomeCompleto={student.name}
              indiceRendimentoAcademico={student.ira}
              matricula={student.registration}
              numReprovacoes={student.failedSubjects}
              frequencia={student.averageScore}
              situacao={student.status}
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
