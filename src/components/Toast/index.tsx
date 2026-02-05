import styles from "./Toast.module.css";

type ToastProps = {
  message: string;
  isOpen: boolean;
};

export default function Toast({ message, isOpen }: ToastProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.toast}>
      {message}
    </div>
  );
}
