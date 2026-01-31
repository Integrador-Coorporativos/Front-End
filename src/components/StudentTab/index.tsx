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
            
            <div className={styles.infoItem}>
              <span className={styles.label}>Nome</span>
              {/* O Java não envia 'nome', então usamos um placeholder fixo ou o ID */}
              <span className={styles.value}>Aluno {index + 1}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>I.R.A</span>
              {/* Garante 2 casas decimais como na foto */}
              <span className={styles.value}>
                {Number(aluno.ira || 0).toFixed(2).replace('.', ',')}
              </span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Matrícula</span>
              {/* No seu Java, a matrícula é o studentId */}
              <span className={styles.value}>{aluno.studentId}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Curso</span>
              {/* No seu Java, o curso/vínculo está vindo no classId */}
              <span className={styles.value}>{aluno.classId}</span>
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