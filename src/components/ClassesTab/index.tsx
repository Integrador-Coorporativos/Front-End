import type { ClassListItem } from "@/api/types/classListItem";
import styles from "./ClassesTab.module.css";
import { useClassesPanel } from "../../hooks/classes/useClassesPanel";

export type ClassesTabProps = {
  classes: ClassListItem[];
  onEdit: (turma: ClassListItem) => void;
};

export function ClassesPanelWrapper() {
  const { classes, loading, error } = useClassesPanel();

  console.log("HOOK CLASSES:", classes);

  if (loading) return <p>Carregando turmas...</p>;
  if (error) return <p>{error}</p>;

  const mappedClasses: ClassListItem[] = (classes || []).map((c: any) => {
  console.log("Transformando item:", c); // <--- Adicione isso aqui temporariamente
  return {
    id: c.id,
    name: c.name,
    shift: c.shift,
    totalStudents: c.totalStudents ?? c.studentsCount ?? c.alunosCount ?? 0,
    course: c.courseId && c.courseName
      ? { id: c.courseId, name: c.courseName }
      : c.course
  };
});

  return (
    <ClassesTab
      classes={mappedClasses}
      onEdit={(turma: ClassListItem) => console.log(turma)}
    />
  );
}

export default function ClassesTab({ classes, onEdit }: ClassesTabProps) {
  return (
    <div className={styles.cardsGrid_classes}>
      {classes.map((turma, index) => (
        <div key={index} className={styles.card_classes}>
          <div className={styles.cardInfo_classes}>
            
            <div className={`${styles.infoItem_classes} ${styles.colCourse}`}>
              <span className={styles.label_classes}>Curso</span>
              <span className={styles.value_classes} title={turma.course?.name || "-"}>
                {turma.course?.name || "-"}
              </span>
            </div>

            <div className={`${styles.infoItem_classes} ${styles.colSmall}`}>
              <span className={styles.label_classes}>Ingresso</span>
              <span className={styles.value_classes}>2022</span>
            </div>

            <div className={`${styles.infoItem_classes} ${styles.colMedium}`}>
              <span className={styles.label_classes}>Turno</span>
              <span className={styles.value_classes}>
                {turma.shift || "-"}
              </span>
            </div>

            <div className={`${styles.infoItem_classes} ${styles.colStudents}`}>
              <span className={styles.label_classes}>Alunos</span>
              <span className={`${styles.value_classes} ${styles.studentCount}`}>
                {turma.totalStudents ?? 0}
              </span>
            </div>

          </div>

          <button
            className={styles.editButton_classes}
            onClick={() => onEdit(turma)}
          >
            <span className={styles.editIcon}></span> Editar
          </button>
        </div>
      ))}
    </div>
  );
}