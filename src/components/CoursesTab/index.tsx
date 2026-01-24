import type { Courses } from "@/types/Courses";
import styles from "./CoursesTab.module.css";

type CoursesTabProps = {
  cursos: Courses[];
  onEdit: (curso: Courses) => void;
};

export default function CoursesTab({ cursos, onEdit }: CoursesTabProps) {
  return (
    <div className={styles.cardsGrid_courses}>
      {cursos.map((curso, index) => (
        <div key={index} className={styles.card_courses}>
          <div className={styles.cardInfo_courses}>
            <div className={styles.infoItem_courses}>
              <span className={styles.label_courses}>Curso</span>
              <span
                className={styles.value_courses}
                title={curso.course}
              >
                {curso.course}
              </span>
            </div>

            <div className={styles.infoItem_courses}>
              <span className={styles.label_courses}>Turmas</span>
              <span className={styles.value_courses}>
                {curso.quantClasses}
              </span>
            </div>

            <div className={styles.infoItem_courses}>
              <span className={styles.label_courses}>Turno</span>
              <span className={styles.value_courses}>
                {curso.shift}
              </span>
            </div>

            <div className={styles.infoItem_courses}>
              <span className={styles.label_courses}>Alunos</span>
              <span className={styles.value_courses}>
                {curso.quantStudent}
              </span>
            </div>
          </div>

          <button
            className={styles.editButton_courses}
            onClick={() => onEdit(curso)}
          >
            Editar
          </button>
        </div>
      ))}
    </div>
  );
}
