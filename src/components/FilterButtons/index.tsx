import styles from "./FilterButtons.module.css";

export type FilterItem = {
  key: string;
  label: string;
  icon: string;
};

export type FilterButtonsProps = {
  items: FilterItem[];
  selectedKey: string;
  onSelect: (key: string) => void;
};

export default function FilterButtons({
  items,
  selectedKey,
  onSelect,
}: FilterButtonsProps) {
  return (
    <div className={styles.list}>
      {items.map((item) => {
        const active = item.key === selectedKey;

        return (
          <button
            key={item.key}
            type="button"
            className={`${styles.btn} ${active ? styles.active : ""}`}
            onClick={() => onSelect(item.key)}
          >
            <img className={styles.icon} src={item.icon} alt={item.label} />
            <span className={styles.text}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
