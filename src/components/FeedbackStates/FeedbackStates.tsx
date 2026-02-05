import { Loader2, AlertCircle } from "lucide-react";
import styles from "./loading.module.css"; // Importando o CSS Module

export const LoadingState = ({ message = "Carregando..." }) => {
  return (
    <div className={styles.stateContainer}>
      <Loader2 
        size={48} 
        className={styles.spinner} 
      />
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export const ErrorState = ({ message, onRetry }: { message: string, onRetry?: () => void }) => (
  <div className={styles.stateContainer}>
    <AlertCircle size={40} color="#d9534f" />
    <p className={styles.errorMessage}>{message}</p>
    {onRetry && (
      <button 
        className={styles.retryButton}
        onClick={onRetry}
      >
        Tentar novamente
      </button>
    )}
  </div>
);