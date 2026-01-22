import { useEffect, useState, useRef } from "react";
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
    const iraValue = parseFloat(localAluno.ira.replace(",", "."));
    if (iraValue < 0.01 || iraValue > 99.99 || isNaN(iraValue)) {
      alert("IRA deve estar entre 0,01 e 99,99");
      return;
    }
    onSave(localAluno);
  };

  const handleSelectCurso = (curso: string) => {
    setLocalAluno({ ...localAluno, curso });
    setIsDropdownOpen(false);
    setIsDirty(true);
  };

  return (
    <div 
      className={styles.modalOverlay} 
      onClick={onClose}
    >
      <div 
        className={styles.modal} 
        onClick={(e) => e.stopPropagation()}
      >
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
            <div className={styles.selectWrapper} ref={dropdownRef}>
              <input
                readOnly
                className={styles.customSelect}
                value={localAluno.curso}
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