import { useEffect, useState } from "react";
import type { Student } from "@/types/Student";
import styles from "./EditModal.module.css";

type EditModalProps = {
  aluno: Student;
  cursos: string[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (aluno: Student) => void;
};

export default function EditModal({
  aluno,
  cursos,
  isOpen,
  onClose,
  onSave,
}: EditModalProps) {
  const [localAluno, setLocalAluno] = useState<Student>(aluno);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLocalAluno(aluno);
    setIsDirty(false);
  }, [aluno]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const iraValue = parseFloat(localAluno.ira.replace(",", "."));
    if (iraValue < 0.01 || iraValue > 99.99 || isNaN(iraValue)) {
      alert("IRA deve estar entre 0,01 e 99,99");
      return;
    }

    onSave(localAluno);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.h2_edit_modal}>Editar Aluno</h2>

        {isDirty && (
          <div className={styles.alertWarning}>
           
            <h2 className={styles.h2_alert_message}>
              Existem alterações não salvas.
            </h2>
          </div>
        )}

        <form onChange={() => setIsDirty(true)} onSubmit={handleSubmit}>
          <label>
            Aluno
            <input
              type="text"
              value={localAluno.nome}
              onChange={(e) =>
                setLocalAluno({ ...localAluno, nome: e.target.value })
              }
            />
          </label>

          <label>
            IRA
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="99.99"
              value={localAluno.ira}
              onChange={(e) =>
                setLocalAluno({ ...localAluno, ira: e.target.value })
              }
            />
          </label>

          <label>
            Matrícula
            <input
              type="text"
              value={localAluno.matricula}
              onChange={(e) =>
                setLocalAluno({ ...localAluno, matricula: e.target.value })
              }
            />
          </label>

          <label>
            Curso
            <div className={styles.selectWrapper}>
              <input
                readOnly
                className={styles.customSelect}
                value={localAluno.curso}
              />
              <div className={styles.optionsList}>
                {cursos.map((curso) => (
                  <div
                    key={curso}
                    className={styles.optionItem}
                    onClick={() =>
                      setLocalAluno({ ...localAluno, curso })
                    }
                  >
                    {curso}
                  </div>
                ))}
              </div>
            </div>
          </label>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.saveButton}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
