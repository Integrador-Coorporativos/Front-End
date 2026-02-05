import styles from "./ClassesDetail.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import StudentsDetail from "../../components/StudensDetail";
import FilterButton from "../../components/FilterButton";
import Pagination from "../../components/Pagination";
import { useState, useMemo } from "react";
import { useClassDetails } from "@/hooks/courses/useClassDetails";
import { useParams } from "react-router-dom";
import AcademicPieCard from "@/components/AcademicPieCard";
import InfoCard from "@/components/InfoCard";
import StatTile from "@/components/StatTile";
import { LoadingState, ErrorState } from "@/components/FeedbackStates/FeedbackStates";
const ITEMS_PER_PAGE = 10;

export default function ClassesDetail() {
  const { id } = useParams<{ id: string }>();
  const classId = id ? parseInt(id) : undefined;
  
  const { classData, loading, error } = useClassDetails(classId);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string>("Todos");

  // --- 1. HOOKS SEMPRE NO TOPO ---
  // O useMemo deve vir ANTES de qualquer return condicional
  const classMetrics = useMemo(() => {
    if (!classData || !classData.students || classData.students.length === 0) {
      return null;
    }

    const students = classData.students;
    const total = students.length;

    const good = students.filter(s => s.status === "Ótimo").length;
    const alert = students.filter(s => s.status === "Bom").length;
    const critical = students.filter(s => s.status === "Ruim").length;

    const sumIra = students.reduce((acc, s) => acc + (s.ira || 0), 0);
    
    return {
      totalStudents: total,
      generalAverage: Number((sumIra / total).toFixed(1)),

      approvalRate: Number((((good + alert) / total) * 100).toFixed(1)),
      failureRate: Number(((critical / total) * 100).toFixed(1)),
      
      studentsGoodStatusPercentage: Number(((good / total) * 100).toFixed(1)),
      studentsAlertStatusPercentage: Number(((alert / total) * 100).toFixed(1)),
      studentsCriticalStatusPercentage: Number(((critical / total) * 100).toFixed(1)),
    };
  }, [classData]);

// --- 2. FILTRAGEM E PAGINAÇÃO ---
  const filteredStudents = useMemo(() => {
    if (!classData?.students) return [];
    if (selectedStatus === "Todos") return classData.students;
    
    // Filtra os alunos que têm o status exatamente igual ao selecionado
    return classData.students.filter(student => student.status === selectedStatus);
  }, [classData, selectedStatus]);

  const { totalPages, currentItems } = useMemo(() => {
    const total = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const items = filteredStudents.slice(start, start + ITEMS_PER_PAGE);
    
    return { totalPages: total, currentItems: items };
  }, [filteredStudents, currentPage]);

  

  return (
    <div className={styles.container}>
      <Header />

      {loading ? (
        <LoadingState message="Carregando Alunos..." />
      ) : error ? (
        <ErrorState 
          message={error || "Erro ao carregar Alunos."} 
          onRetry={() => window.location.reload()} 
        />
      ) : (
      <>
      <div className={styles.containerDetail}>
        <div className={styles.containerText}>
          <h2 className={styles.title}>{"Detalhes da Turma"}</h2>
        </div>

        <div className={styles.containerFiltro}>
          <h2 className={styles.title}>{classData?.course.name + " "+ classData?.gradleLevel +"° " + classData?.shift}</h2>
          <FilterButton 
            text={`Filtrar por: ${selectedStatus}`} 
            options={["Todos", "Ótimo", "Bom", "Ruim"]} 
            onSelect={(status) => {
              setSelectedStatus(status);
              setCurrentPage(1); 
            }}
          />
        </div>

        <section className={styles.topGrid}>
          <AcademicPieCard 
            greenValue={classMetrics?.studentsGoodStatusPercentage || 0} 
            yellowValue={classMetrics?.studentsAlertStatusPercentage || 0} 
            redValue={classMetrics?.studentsCriticalStatusPercentage || 0} 
          />

          <InfoCard title="Resumo Geral" rightIcon="info">
            <div className={styles.tilesGrid}>
              <StatTile
                icon="alunos"
                label="Total de Alunos"
                value={`${classMetrics?.totalStudents || 0} Alunos`}
              />

              <StatTile
                icon="aprovados"
                label="Aprovados"
                value={`${classMetrics?.approvalRate || 0}%`}
              />

              <StatTile
                icon="media"
                label="Média Geral"
                value={`${classMetrics?.generalAverage || 0}`}
              />

              <StatTile
                icon="reprovados"
                label="Reprovados"
                value={`${classMetrics?.failureRate || 0}%`}
              />
            </div>
          </InfoCard>
        </section>

        <div className={styles.studentsList}>
          {currentItems.map((student, index) => (
            <StudentsDetail
              key={student.studentId || index}
              nomeCompleto={student.name}
              indiceRendimentoAcademico={student.ira}
              matricula={student.registration}
              numReprovacoes={student.failedSubjects}
              frequencia={student.attendenceRate} // Mudei aqui, você estava usando averageScore para frequência
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
        </>
        )}
      <Footer />
    </div>
  );
}