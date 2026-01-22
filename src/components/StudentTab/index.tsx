import type { Student } from "@/types/Student";
import styles from "./StudentTab.module.css";

type StudentTabProps = {
  alunos: Student[];
  onEdit: (aluno: Student) => void;
};

export default function StudentTab({ alunos, onEdit }: StudentTabProps) {
  return (
    <div className={styles.cardsGrid}>
      {alunos.map((aluno, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.cardInfo}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Nome</span>
              <span className={styles.value}>{aluno.nome}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>I.R.A</span>
              <span className={styles.value}>{aluno.ira}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Matrícula</span>
              <span className={styles.value}>{aluno.matricula}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Curso</span>
              <span className={styles.value}>{aluno.curso}</span>
            </div>
          </div>

          <button
            className={styles.editButton}
            onClick={() => onEdit(aluno)}
          >
            Editar
          </button>
        </div>
      ))}
    </div>
  );
}
