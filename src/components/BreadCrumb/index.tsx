import { Link } from "react-router-dom";
import styles from "./BreadCrumb.module.css";

interface BreadcrumbProps {
  items: { label: string; to?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className={styles.wrapper_breadcrumb}>
      <div className={styles.container_breadcrumb}>
        {items.map((item, index) => (
          <span key={index} className={styles.item_breadcrumb}>
            {item.to ? (
              <Link to={item.to} className={styles.link_breadcrumb}>
                {item.label}
              </Link>
            ) : (
              <span className={styles.current_breadcrumb}>{item.label}</span>
            )}

            {index < items.length - 1 && (
              <span className={styles.separator_breadcrumb}>{">"}</span>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}

