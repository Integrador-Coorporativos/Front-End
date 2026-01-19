import { Link } from "react-router-dom";
import styles from "./BreadCrumb.module.css";

interface BreadcrumbProps {
  items: { label: string; to?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className={styles.container}>
      {items.map((item, index) => (
        <span key={index} style={{ display: "flex", alignItems: "center" }}>
          {item.to ? (
            <Link to={item.to} className={styles.link}>
              {item.label}
            </Link>
          ) : (
            <span className={styles.current}>{item.label}</span>
          )}

          {index < items.length - 1 && (
            <span className={styles.separator}>{">"}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
