import type { ReactNode } from "react";
import styles from "./Infocard.module.css";

type Props = {
  title: string;
  rightIcon?: "info" | "none";
  children: ReactNode;
};

export default function InfoCard({ title, rightIcon = "none", children }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>

        {rightIcon === "info" && (
          <span className={styles.info} title="Informações">
            i
          </span>
        )}
      </div>

      <div className={styles.body}>{children}</div>
    </div>
  );
}
