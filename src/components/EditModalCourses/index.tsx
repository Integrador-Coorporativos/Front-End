import { useEffect, useState } from "react";
import type { CoursePanel } from "@/types/coursesPanel";
import styles from "./EditModalCourses.module.css";

type EditModalCoursesProps = {
  curso: CoursePanel;
  isOpen: boolean;
  onClose: () => void;
  onSave: (cursoAtualizado: CoursePanel) => void;
};

export default function EditModalCourses({
  curso,
  isOpen,
  onClose,
  onSave,
}: EditModalCoursesProps) {
  const [localCurso, setLocalCurso] = useState<CoursePanel>(curso);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLocalCurso(curso);
    setIsDirty(false);
  }, [curso]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localCurso);
    setIsDirty(false);
  };

  return (
    <div className={styles.modalOverlay_courses}>
      <form className={styles.modal_courses} onSubmit={handleSubmit}>
        {isDirty && (
          <div className={styles.alertWarning_courses}>
            <span>Existem alterações não salvas.</span>
          </div>
        )}

        <label>
          Curso
          <input
            type="text"
            value={localCurso.courseName}
            onChange={(e) => {
              setLocalCurso({
                ...localCurso,
                courseName: e.target.value,
              });
              setIsDirty(true);
            }}
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
  );
}
