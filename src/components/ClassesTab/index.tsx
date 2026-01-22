import type { Classes } from "@/types/Classes";
import styles from "./ClassesTab.module.css";

type ClassesTabProps = {
  turmas: Classes[];
  onEdit: (turma: Classes) => void;
};

export default function ClassesTab({ turmas, onEdit }: ClassesTabProps) {
  return (
    <div className={styles.cardsGrid_classes}>
      {turmas.map((turma, index) => (
        <div key={index} className={styles.card_classes}>
          <div className={styles.cardInfo_classes}>
            <div className={styles.infoItem_classes}>
              <span className={styles.label_classes}>Curso</span>
              <span className={styles.value_classes}>{turma.curso}</span>
            </div>

            <div className={styles.infoItem_classes}>
              <span className={styles.label_classes}>Ano de Ingresso</span>
              <span className={styles.value_classes}>{turma.anoIngresso}</span>
            </div>

            <div className={styles.infoItem_classes}>
              <span className={styles.label_classes}>Turno</span>
              <span className={styles.value_classes}>{turma.turno}</span>
            </div>

            <div className={styles.infoItem_classes}>
              <span className={styles.label_classes}>Alunos</span>
              <span className={styles.value_classes}>{turma.alunos}</span>
            </div>

            <div className={styles.infoItem_classes}>
              <span className={styles.label_classes}>Repetentes</span>
              <span className={styles.value_classes}>{turma.repetentes}</span>
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
