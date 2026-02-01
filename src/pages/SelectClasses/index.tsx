import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "./SelectClasses.module.css";
import FilterButton from "../../components/FilterButton";
import ClassCard from "../../components/ClassCard";
import Pagination from "../../components/Pagination";
import { useClasses } from "@/hooks/classes/useAllClasses";
import { useLinkClass } from "@/hooks/classes/useLinkClass";

const ITEMS_PER_PAGE = 9;

export default function SelecionarTurmas() {
const [currentPage, setCurrentPage] = useState(1);
  const { classes, loading, error } = useClasses();
  const { link } = useLinkClass();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // AJUSTE 1: Sincronizar o estado inicial quando as classes carregarem
  useEffect(() => {
    if (classes) {
      console.log(classes);
      const idsJaVinculados = classes
      
        .filter(t => t.teacherLinked) // Use o nome exato do campo do seu JSON
        .map(t => t.id);
      setSelectedIds(idsJaVinculados);
    }
  }, [classes]);

  const totalPages = Math.ceil((classes?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = classes?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || [];

  const toggleSelection = async (id: number) => {
    const isAlreadySelected = selectedIds.includes(id);

    // Update UI Otimista
    setSelectedIds((prev) =>
      isAlreadySelected ? prev.filter((item) => item !== id) : [...prev, id]
    );

    try {
      await link(id);
    } catch (err) {
      // Rollback
      setSelectedIds((prev) =>
        isAlreadySelected ? [...prev, id] : prev.filter((item) => item !== id)
      );
      alert("Erro ao sincronizar.");
    }
  };

  if (loading) return (
    <div className={styles.container}>
      <Header />
      <div className={styles.loading}>Carregando turmas...</div>
      <Footer />
    </div>
  );

  if (error) return (
    <div className={styles.container}>
      <Header />
      <div className={styles.error}>{error}</div>
      <Footer />
    </div>
  );

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.containerSelect}>
        <section className={styles.containerText}>
          <h2 className={styles.title}>Selecione suas turmas desse período</h2>
          <h3 className={styles.subtitle}>Semestre: 2026.1</h3>
        </section>

        <section className={styles.containerTurno}>
          <FilterButton text="Turno" />
          <FilterButton text="Curso" />
          
        </section>

        <div className={styles.containerCards}>
          {currentItems.map((turma) => (
            <ClassCard
              key={turma.id}
              anoReferencia={turma.classId.match(/^\d{4}/)?.[0] || "N/A"}
              ano={turma.semester}
              curso={turma.course.name}
              turno={turma.shift}
          
              isSelected={selectedIds.includes(turma.id)} 
              
              onSelect={() => toggleSelection(turma.id)}
            />
          ))}
        </div>

        <footer className={styles.paginationWrapper}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </footer>
      </main>

      <Footer />
    </div>
  );
}