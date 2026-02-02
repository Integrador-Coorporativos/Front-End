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
        <header className={styles.modalHeader}>
          <h2 className={styles.h2_edit_modal}>Editar Aluno</h2>
          <button className={styles.closeX} onClick={onClose}>&times;</button>
        </header>

        {isDirty && (
          <div className={styles.alertWarning}>
            <span className={styles.h2_alert_message}>Existem alterações não salvas neste formulário.</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>
              NOME DO ALUNO
              <input
                type="text"
                className={styles.mainInput}
                value={localAluno.name || ""} 
                onChange={(e) => {
                  setLocalAluno({ ...localAluno, name: e.target.value });
                  setIsDirty(true);
                }}
              />
            </label>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.inputLabel}>
                I.R.A
                <input
                  type="number"
                  step="0.01"
                  className={styles.mainInput}
                  value={localAluno.ira || 0} 
                  onChange={(e) => {
                    setLocalAluno({ ...localAluno, ira: parseFloat(e.target.value) });
                    setIsDirty(true);
                  }}
                />
              </label>
            </div>

            <div className={styles.formGroup} style={{ flex: 2 }}>
              <label className={styles.inputLabel}>
                MATRÍCULA (SISTEMA)
                <input
                  type="text"
                  readOnly
                  className={`${styles.mainInput} ${styles.readOnlyInput}`}
                  value={aluno.registration || "N/A"}
                  title="A matrícula é um identificador único e não pode ser alterada."
                />
              </label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>
              CURSO / TURMA
              <div className={styles.selectWrapper} ref={dropdownRef}>
                <input
                  readOnly
                  className={`${styles.customSelect} ${isDropdownOpen ? styles.activeSelect : ""}`}
                  value={localAluno.classId || "Selecione o curso"}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />
                {isDropdownOpen && (
                  <div className={styles.optionsList}>
                    {cursos.map((curso) => (
                      <div
                        key={curso}
                        className={`${styles.optionItem} ${localAluno.classId === curso ? styles.selectedOption : ""}`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectCurso(curso);
                        }}
                      >
                        {curso}
                        {localAluno.classId === curso && <span className={styles.checkIcon}>✓</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </label>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveButton}>
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}