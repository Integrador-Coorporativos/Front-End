import styles from "./Button.module.css";

interface AuthButtonProps {
  text: string;
  type?: "button" | "submit" | "reset";
}

export default function AuthButton({ text, type = "submit" }: AuthButtonProps) {
  return (
    <button className={styles.button} type={type}>
      {text}
    </button>
  );
}
