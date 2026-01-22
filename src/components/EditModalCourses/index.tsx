import { useEffect, useState } from "react";
import type { Courses } from "@/types/Courses";
import styles from "./EditModalCourses.module.css";

type EditModalCoursesProps = {
  curso: Courses;
  isOpen: boolean;
  onClose: () => void;
  onSave: (cursoAtualizado: Courses) => void;
};

export default function EditModalCourses({
  curso,
  isOpen,
  onClose,
  onSave,
}: EditModalCoursesProps) {
  const [localCurso, setLocalCurso] = useState<Courses>(curso);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLocalCurso(curso);
    setIsDirty(false);
  }, [curso]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (localCurso.quantiTurmas < 0 || localCurso.quantiAlunos < 0) {
      alert("Valores inválidos");
      return;
    }

    onSave(localCurso);
  };

  return (
    <div className={styles.modalOverlay_courses}>
      <div className={styles.modal_courses}>
        <h2 className={styles.h2_edit_modal_courses}>Editar Curso</h2>

        {isDirty && (
          <div className={styles.alertWarning_courses}>
            <h2 className={styles.h2_alert_message_courses}></h2>
            <span>Existem alterações não salvas.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} onChange={() => setIsDirty(true)}>
          <label>
            Curso
            <input
              type="text"
              value={localCurso.curso}
              onChange={(e) =>
                setLocalCurso({ ...localCurso, curso: e.target.value })
              }
            />
          </label>

          <label>
            Quantidade de Turmas
            <input
              type="number"
              min={0}
              value={localCurso.quantiTurmas}
              onChange={(e) =>
                setLocalCurso({
                  ...localCurso,
                  quantiTurmas: Number(e.target.value),
                })
              }
            />
          </label>

          <label>
            Turno
            <input
              type="text"
              value={localCurso.turno}
              onChange={(e) =>
                setLocalCurso({ ...localCurso, turno: e.target.value })
              }
            />
          </label>

          <label>
            Quantidade de Alunos
            <input
              type="number"
              min={0}
              value={localCurso.quantiAlunos}
              onChange={(e) =>
                setLocalCurso({
                  ...localCurso,
                  quantiAlunos: Number(e.target.value),
                })
              }
            />
          </label>

          <div className={styles.modalActions_courses}>
            <button
              type="button"
              className={styles.cancelButton_courses}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.saveButton_courses}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
