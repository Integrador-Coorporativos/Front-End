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
  // Inicializamos o estado com o aluno recebido
  const [localAluno, setLocalAluno] = useState<StudentPerformance>(aluno);
  const [isDirty, setIsDirty] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- SINCRONIZAÇÃO DE DADOS (IMPORTANTE) ---
  useEffect(() => {
    if (isOpen && aluno) {
      // Sincroniza o I.R.A: Se o Java mandou averageScore, usamos ele como IRA.
      const valorIra = aluno.averageScore !== undefined ? aluno.averageScore : (aluno.ira ?? 0);
      
      setLocalAluno({
        ...aluno,
        ira: valorIra,
        averageScore: valorIra, // Mantém os dois iguais para o Java entender
        name: aluno.name || ""  // Garante que o nome não seja undefined
      });
      setIsDirty(false);
    }
  }, [isOpen, aluno]);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen || !localAluno) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de I.R.A
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
          <button className={styles.closeX} onClick={onClose} aria-label="Fechar">&times;</button>
        </header>

        {isDirty && (
          <div className={styles.alertWarning}>
            <span className={styles.h2_alert_message}>
              Existem alterações não salvas neste formulário.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Campo: Nome */}
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
            {/* Campo: I.R.A */}
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.inputLabel}>
                I.R.A
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  className={styles.mainInput}
                  value={localAluno.ira} 
                  onChange={(e) => {
                    const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                    setLocalAluno({ 
                      ...localAluno, 
                      ira: val, 
                      averageScore: val 
                    });
                    setIsDirty(true);
                  }}
                />
              </label>
            </div>

            {/* Campo: Matrícula (Leitura apenas) */}
            <div className={styles.formGroup} style={{ flex: 2 }}>
              <label className={styles.inputLabel}>
                MATRÍCULA
                <input
                  type="text"
                  readOnly
                  className={`${styles.mainInput} ${styles.readOnlyInput}`}
                  value={localAluno.registration || "N/A"}
                />
              </label>
            </div>
          </div>

          {/* Campo: Curso / Turma */}
          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>
              CURSO / TURMA
              <div className={styles.selectWrapper} ref={dropdownRef}>
                <div 
                  className={`${styles.customSelect} ${isDropdownOpen ? styles.activeSelect : ""}`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {localAluno.classId || "Selecione o curso"}
                </div>
                
                {isDropdownOpen && (
                  <div className={styles.optionsList}>
                    {cursos.map((curso) => (
                      <div
                        key={curso}
                        className={`${styles.optionItem} ${localAluno.classId === curso ? styles.selectedOption : ""}`}
                        onClick={() => handleSelectCurso(curso)}
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