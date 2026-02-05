import type { Professor } from "@/types/Professor";
import styles from "./ProfessorTab.module.css";

type ProfessorTabProps = {
  professores: Professor[];
  onEdit: (professor: Professor) => void;
};

export default function ProfessorTab({ professores, onEdit }: ProfessorTabProps) {
  return (
    <div className={styles.cardsGrid}>
      {professores.map((professor, index) => (
        <div key={professor.registration || index} className={styles.card}>
          <div className={styles.cardInfo}>

            <div className={`${styles.infoItem} ${styles.colName}`}>
              <span className={styles.label}>Nome</span>
              <span className={styles.value} title={professor.name}>
                {professor.name}
              </span>
            </div>

            <div className={`${styles.infoItem} ${styles.colEmail}`}>
              <span className={styles.label}>E-mail</span>
              <span className={styles.value} title={professor.email}>
                {professor.email}
              </span>
            </div>

            <div className={`${styles.infoItem} ${styles.colRegistration}`}>
              <span className={styles.label}>Matrícula</span>
              <span className={styles.value} title={professor.registration}>
                {professor.registration}
              </span>
            </div>

            <div className={`${styles.infoItem} ${styles.colStats}`}>
              <span className={styles.label}>Turmas</span>
              <span className={styles.value}>
                {professor.quantityClass}
              </span>
            </div>

          </div>

          <button
            className={styles.editButton_student}
            onClick={() => onEdit(professor)}
          >
            Editar
          </button>
        </div>
      ))}
    </div>
  );
}