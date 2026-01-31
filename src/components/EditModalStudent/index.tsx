import { useEffect, useState, useRef } from "react";
import type { StudentPerformance } from "@/types/StudentPerformance"; 
import styles from "./EditModal.module.css";

type EditModalProps = {
  aluno: StudentPerformance;
  cursos: string[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (aluno: StudentPerformance) => void;
};

export default function EditModal({
  aluno,
  cursos,
  isOpen,
  onClose,
  onSave,
}: EditModalProps) {
  const [localAluno, setLocalAluno] = useState<StudentPerformance>(aluno);
  const [isDirty, setIsDirty] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalAluno(aluno);
    setIsDirty(false);
  }, [aluno]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localAluno.ira < 0 || localAluno.ira > 100) {
      alert("O IRA deve estar entre 0 e 100");
      return;
    }
    onSave(localAluno);
  };

  const handleSelectCurso = (curso: string) => {
    setLocalAluno({ ...localAluno, classId: curso });
    setIsDropdownOpen(false);
    setIsDirty(true);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.h2_edit_modal}>Editar Aluno</h2>

        {isDirty && (
          <div className={styles.alertWarning}>
            <h2 className={styles.h2_alert_message}>Existem alterações não salvas.</h2>
          </div>
        )}

        <form onChange={() => setIsDirty(true)} onSubmit={handleSubmit}>
          <label>
  Aluno
  <input
    type="text"
    value={localAluno.name || ""} 
    onChange={(e) => setLocalAluno({ ...localAluno, name: e.target.value })}
  />
</label>

<label>
  IRA
  <input
    type="number"
    value={localAluno.ira || 0} 
    onChange={(e) => setLocalAluno({ ...localAluno, ira: parseFloat(e.target.value) })}
  />
</label>
          <label>
            Matrícula
            <input
              type="text"
              readOnly
              value={localAluno.studentId}
            />
          </label>

          <label>
            Curso / Turma
            <div className={styles.selectWrapper} ref={dropdownRef}>
              <input
                readOnly
                className={styles.customSelect}
                value={localAluno.classId}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
              />
              {isDropdownOpen && (
                <div className={styles.optionsList}>
                  {cursos.map((curso) => (
                    <div
                      key={curso}
                      className={styles.optionItem}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelectCurso(curso);
                      }}
                    >
                      {curso}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </label>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
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