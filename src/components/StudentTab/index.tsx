import type { StudentPerformance } from "@/types/StudentPerformance";
import styles from "./StudentTab.module.css";

type StudentTabProps = {
  alunos: StudentPerformance[];
  onEdit: (aluno: StudentPerformance) => void;
};

export default function StudentTab({ alunos, onEdit }: StudentTabProps) {
  return (
    <div className={styles.cardsGrid}>
      {alunos.map((aluno, index) => (
        <div key={aluno.id || index} className={styles.card}>
          <div className={styles.cardInfo}>

            <div className={`${styles.infoItem} ${styles.flexDouble}`}>
              <span className={styles.label}>Nome</span>
              <span className={styles.value} title={aluno.name}>
                {aluno.name || `Aluno ${index + 1}`}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>I.R.A</span>
              <span className={styles.value}>
                {Number(aluno.ira || 0).toFixed(2).replace('.', ',')}
              </span>
            </div>
            <div className={`${styles.infoItem} ${styles.flexMedium}`}>
              <span className={styles.label}>Matrícula</span>
              <span
                className={`${styles.value} ${styles.registrationValue}`}
                title={aluno.registration} 
              >
                {aluno.registration && aluno.registration.length > 8
                  ? `${aluno.registration.substring(0, 8)}...`
                  : aluno.registration || "..."}
              </span>
            </div>
            <div className={`${styles.infoItem} ${styles.flexDouble}`}>
              <span className={styles.label}>Curso</span>
              <span className={`${styles.value} ${styles.courseValue}`} title={aluno.classId}>
                {aluno.classId || "Não encontrado"}
              </span>
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