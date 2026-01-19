import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type PageItem = number | "...";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages: PageItem[] = getVisiblePages(currentPage, totalPages);

  return (
    <div className={styles.pagination}>
      <button
        className={styles.nav}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ‹
      </button>

      {pages.map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className={styles.ellipsis}>
            …
          </span>
        ) : (
          <button
            key={page}
            className={`${styles.page} ${
              page === currentPage ? styles.active : ""
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        className={styles.nav}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        ›
      </button>
    </div>
  );
}

function getVisiblePages(
  current: number,
  total: number
): PageItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, 4, "...", total];
  }

  if (current >= total - 2) {
    return [1, "...", total - 3, total - 2, total - 1, total];
  }

  return [
    1,
    "...",
    current - 1,
    current,
    current + 1,
    "...",
    total,
  ];
}
