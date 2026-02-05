import styles from "./FiltersClasse.module.css";
import type { CoursePanel } from "@/types/coursesPanel";

type Props = {
  cursos: CoursePanel[]; 
  
  filterCurso: string;
  setFilterCurso: (value: string) => void;

  filterAno: string;
  setFilterAno: (value: string) => void;

  filterTurno: "Matutino" | "Vespertino" | "Noturno" | "";
  setFilterTurno: (value: "Matutino" | "Vespertino" | "Noturno" | "") => void;

  filterAlunos: "maior" | "menor" | "";
  setFilterAlunos: (value: "maior" | "menor" | "") => void;

  onApply: () => void;
  onClear: () => void; 
};

export default function FiltersClasses({
  cursos, // Recebemos a prop aqui
  filterCurso, setFilterCurso,
  filterAno, setFilterAno,
  filterTurno, setFilterTurno,
  filterAlunos, setFilterAlunos,
  onApply,
  onClear, 
}: Props) {
  return (
    <div className={styles.filterContent_course}>
      <div className={styles.filterField}>
        <label className={styles.filterLabel}>Curso</label>
        <select 
          value={filterCurso} 
          onChange={(e) => setFilterCurso(e.target.value)}
        >
          <option value="">Todos os Cursos</option>
          {/* Agora usamos 'cursos' que vem das props */}
          {cursos.map((course: CoursePanel) => (
            <option key={course.courseId} value={course.courseName}>
              {course.courseName}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterField}>
        <label className={styles.filterLabel}>Turno</label>
        <select value={filterTurno} onChange={(e) => setFilterTurno(e.target.value as any)}>
          <option value="">Todos</option>
          <option value="Matutino">Matutino</option>
          <option value="Vespertino">Vespertino</option>
          <option value="Noturno">Noturno</option>
        </select>
      </div>

      <div className={styles.filterField}>
        <label className={styles.filterLabel}>Ordenar por Alunos</label>
        <select value={filterAlunos} onChange={(e) => setFilterAlunos(e.target.value as any)}>
          <option value="">Selecionar</option>
          <option value="maior">Maior quantidade</option>
          <option value="menor">Menor quantidade</option>
        </select>
      </div>

      <div className={styles.buttonGroup}>
        <button className={styles.clearFilterButton_classes} onClick={onClear}>
          Limpar
        </button>
        <button className={styles.applyFilterButton_course} onClick={onApply}>
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
}