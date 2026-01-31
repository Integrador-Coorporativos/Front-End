import type { Professor } from "@/types/Professor";
import styles from "./ProfessorTab.module.css";

type ProfessorTabProps = {
  professores: Professor[];
  onEdit: (professor: Professor) => void;
};

export default function ProfessorTab({
  professores,
  onEdit,
}: ProfessorTabProps) {
  return (
    <div className={styles.cardsGrid}>
      {professores.map((professor, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.cardInfo}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Nome</span>
              <span className={styles.value}>{professor.nome}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>E-mail</span>
              <span className={styles.value}>
                {professor.anoIngresso}
              </span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Matricula</span>
              <span className={styles.value}>{professor.turno}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Alunos - remove</span>
              <span className={styles.value}>{professor.alunos}</span>
            </div>
          </div>

          <button
            className={styles.editButton}
            onClick={() => onEdit(professor)}
          >
            Editar
          </button>
        </div>
      ))}
    </div>
  );
}
