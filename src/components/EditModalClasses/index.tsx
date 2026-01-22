import { useEffect, useState } from "react";
import type { Classes } from "@/types/Classes"; 
import styles from "./EditModalClasses.module.css";

type EditModalClassesProps = {
  turma: Classes;
  isOpen: boolean;
  onClose: () => void;
  onSave: (turmaAtualizada: Classes) => void;
};

export default function EditModalTurma({
  turma,
  isOpen,
  onClose,
  onSave,
}: EditModalClassesProps) {
  const [localTurma, setLocalTurma] = useState<Classes>(turma);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLocalTurma(turma);
    setIsDirty(false);
  }, [turma]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localTurma.anoIngresso < 1900 || localTurma.anoIngresso > new Date().getFullYear()) {
      alert("Ano de ingresso inválido");
      return;
    }
    onSave(localTurma);
  };

  return (
    <div className={styles.modalOverlay_classes}>
      <div className={styles.modal_classes}>
        <h2 className={styles.h2_edit_modal_classes}>Editar Turma</h2>

        {isDirty && (
          <div className={styles.alertWarning_classes}>
            <h2 className={styles.h2_alert_message_classes}>
              Existem alterações não salvas.
            </h2>
          </div>
        )}

        <form onChange={() => setIsDirty(true)} onSubmit={handleSubmit}>
          <label>
            Curso
            <input
              type="text"
              value={localTurma.curso}
              onChange={(e) =>
                setLocalTurma({ ...localTurma, curso: e.target.value })
              }
            />
          </label>

          <label>
            Ano de Ingresso
            <input
              type="number"
              value={localTurma.anoIngresso}
              min={1900}
              max={new Date().getFullYear()}
              onChange={(e) =>
                setLocalTurma({ ...localTurma, anoIngresso: Number(e.target.value) })
              }
            />
          </label>

          <label>
            Turno
            <input
              type="text"
              value={localTurma.turno}
              onChange={(e) =>
                setLocalTurma({ ...localTurma, turno: e.target.value })
              }
            />
          </label>

          <label>
            Número de alunos
            <input
              type="number"
              value={localTurma.alunos}
              min={0}
              onChange={(e) =>
                setLocalTurma({ ...localTurma, alunos: Number(e.target.value) })
              }
            />
          </label>

          <label>
            Repetentes
            <input
              type="number"
              value={localTurma.repetentes}
              min={0}
              onChange={(e) =>
                setLocalTurma({ ...localTurma, repetentes: Number(e.target.value) })
              }
            />
          </label>

          <div className={styles.modalActions_classes}>
            <button
              type="button"
              className={styles.cancelButton_classes}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.saveButton_classes}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
