import { useEffect, useState } from "react";
import type { Classes } from "@/types/Classes";
import styles from "./EditModalClasses.module.css";
import type { EditableClass } from "@/types/EditableClass";

type EditModalClassesProps = {
  turma: Classes;
  isOpen: boolean;
  onClose: () => void;
  onSave: (turmaAtualizada: EditableClass) => void;
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
  onSave(localTurma as any); 
};

  return (
    <div className={styles.modalOverlay_classes} onClick={onClose}>
      <div
        className={styles.modal_classes}
        onClick={(e) => e.stopPropagation()}
      >
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
            Nome
            <input
              type="text"
              value={localTurma.name}
              onChange={(e) =>
                setLocalTurma({ ...localTurma, name: e.target.value })
              }
            />
          </label>

          <label>
            Turno
            <input
              type="text"
              value={localTurma.shift}
              onChange={(e) =>
                setLocalTurma({ ...localTurma, shift: e.target.value })
              }
            />
          </label>

          <label>
  Curso (nome)
  <input
    type="text"
    readOnly // Evita que o usuário tente editar algo que o backend não vai salvar por aqui
    className={styles.inputReadOnly} // Opcional: um estilo cinza
    value={localTurma.course?.name ?? ""}
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
