import type { Classes } from "@/types/Classes";
import styles from "./ClassesTab.module.css";

type ClassesTabProps = {
  classes: Classes[];
  onEdit: (turma: Classes) => void;
};

export default function ClassesTab({ classes, onEdit }: ClassesTabProps) {
  return (
    <div className={styles.cardsGrid_classes}>
      {classes.map((classes, index) => (
        <div key={index} className={styles.card_classes}>
          <div className={styles.cardInfo_classes}>
            <div className={styles.infoItem_classes}>
              <span className={styles.label_classes}>Curso</span>
              <span className={styles.value_classes}>-</span>
            </div>

            <div className={styles.infoItem_classes}>
              <span className={styles.label_classes}>Ano de Ingresso</span>
              <span className={styles.value_classes}>-</span>
            </div>

            <div className={styles.infoItem_classes}>
              <span className={styles.label_classes}>Turno</span>
              <span className={styles.value_classes}>{classes.shift}</span>
            </div>

            <div className={styles.infoItem_classes}>
              <span className={styles.label_classes}>Alunos</span>
              <span className={styles.value_classes}>-</span>
            </div>

            <div className={styles.infoItem_classes}>
              <span className={styles.label_classes}>Repetentes</span>
              <span className={styles.value_classes}>-</span>
            </div>
          </div>

          <button
            className={styles.editButton_classes}
            onClick={() => onEdit(classes)}
          >
            Editar
          </button>
        </div>
      ))}
    </div>
  );
}
