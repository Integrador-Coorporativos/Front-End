import React from 'react';
import styles from './PeriodModal.module.css';

interface NewPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function NewPeriodModal({ isOpen, onClose, onConfirm }: NewPeriodModalProps) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Iniciar Novo Período</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <div className={styles.modalBody}>
          <p>
            <strong>Atenção</strong>: Ao confirmar essa opção você encerrará o período avaliativo atual e automaticamente iniciará o próximo bimestre para o ano de 2026.
          </p>
          <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
            Esta ação atualizará as métricas de desempenho de todos os alunos.
          </p>
        </div>
        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.btnCancel_modal_period}>
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={styles.btnConfirm_modal_period}
          >
            Encerrar bimestre
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewPeriodModal;