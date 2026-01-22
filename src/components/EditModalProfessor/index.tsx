import { useEffect, useState } from "react";
import type { Professor } from "@/types/Professor";
import styles from "./EditModalProfessor.module.css";

type EditModalProfessorProps = {
  professor: Professor;
  isOpen: boolean;
  onClose: () => void;
  onSave: (professorAtualizado: Professor) => void;
};

export default function EditModalProfessor({
  professor,
  isOpen,
  onClose,
  onSave,
}: EditModalProfessorProps) {
  const [localProfessor, setLocalProfessor] = useState<Professor>(professor);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLocalProfessor(professor);
    setIsDirty(false);
  }, [professor]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localProfessor.anoIngresso < 1900 || localProfessor.anoIngresso > new Date().getFullYear()) {
      console.log("Ano de ingresso inválido");
      return;
    }

    onSave(localProfessor);
  };

  return (
    <div className={styles.modalOverlay_professor}>
      <div className={styles.modal_professor}>
        <h2 className={styles.h2_edit_modal_professor}>Editar Professor</h2>

        {isDirty && (
          <div className={styles.alertWarning_professor}>
            <h2 className={styles.h2_alert_message_professor}>
              Existem alterações não salvas.
            </h2>
          </div>
        )}

        <form onChange={() => setIsDirty(true)} onSubmit={handleSubmit}>
          <label>
            Nome
            <input
              type="text"
              value={localProfessor.nome}
              onChange={(e) =>
                setLocalProfessor({ ...localProfessor, nome: e.target.value })
              }
            />
          </label>
          <label>
            Ano de Ingresso
            <input
              type="number"
              value={localProfessor.anoIngresso}
              min={1900}
              max={new Date().getFullYear()}
              onChange={(e) =>
                setLocalProfessor({ ...localProfessor, anoIngresso: Number(e.target.value) })
              }
            />
          </label>
          <label>
            Turno
            <input
              type="text"
              value={localProfessor.turno}
              onChange={(e) =>
                setLocalProfessor({ ...localProfessor, turno: e.target.value })
              }
            />
          </label>
          <label>
            Número de alunos
            <input
              type="number"
              value={localProfessor.alunos}
              min={0}
              onChange={(e) =>
                setLocalProfessor({ ...localProfessor, alunos: Number(e.target.value) })
              }
            />
          </label>
          <div className={styles.modalActions_professor}>
            <button
              type="button"
              className={styles.cancelButton_professor}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.saveButton_professor}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
