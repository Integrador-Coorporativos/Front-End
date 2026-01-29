import type { ClassListItem } from "@/api/types/classListItem";
import styles from "./ClassesTab.module.css";
import { useClassesPanel } from "../../hooks/classes/useClassesPanel";

// Tipo das props do componente ClassesTab
export type ClassesTabProps = {
  classes: ClassListItem[];
  onEdit: (turma: ClassListItem) => void;
};

// Componente wrapper que busca as turmas
export function ClassesPanelWrapper() {
  const { classes, loading, error } = useClassesPanel();

  if (loading) return <p>Carregando turmas...</p>;
  if (error) return <p>{error}</p>;

  // Mapear ClassPanel para ClassListItem
  const mappedClasses: ClassListItem[] = classes.map((c) => ({
    id: c.id,
    name: c.name,
    shift: c.shift,
    course:
      c.courseId && c.courseName
        ? { id: c.courseId, name: c.courseName }
        : null,
  }));

  return (
    <ClassesTab
      classes={mappedClasses}
      onEdit={(turma: ClassListItem) => console.log(turma)}
    />
  );
}

// Componente que renderiza a lista de turmas
export default function ClassesTab({ classes, onEdit }: ClassesTabProps) {
  return (
    <div className={styles.cardsGrid_classes}>
      {classes.map((turma, index) => (
        <div key={index} className={styles.card_classes}>
          <div className={styles.cardInfo_classes}>
            <div className={styles.infoItem_classes}>
              <span className={styles.label_classes}>Curso</span>
              <span className={styles.value_classes}>
                {turma.course?.name || "-"}
              </span>
            </div>

            <div className={styles.infoItem_classes}>
              <span className={styles.label_classes}>Ano de Ingresso</span>
              {/* <span className={styles.value_classes}>{turma.year || "-"}</span> */}
            </div>

            <div className={styles.infoItem_classes}>
              <span className={styles.label_classes}>Turno</span>
              <span className={styles.value_classes}>{turma.shift || "-"}</span>
            </div>

            <div className={styles.infoItem_classes}>
              <span className={styles.label_classes}>Alunos</span>
              {/* <span className={styles.value_classes}>{turma.students ?? "-"}</span> */}
            </div>
          </div>

          <button
            className={styles.editButton_classes}
            onClick={() => onEdit(turma)}
          >
            Editar
          </button>
        </div>
      ))}
    </div>
  );
}
