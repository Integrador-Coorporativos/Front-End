import styles from "./DashboardHeaderRow.module.css";

type Props = { title: string };

export default function DashboardHeaderRow({ title }: Props) {
  return (
    <div className={styles.row}>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
}
