import styles from "./FiltersCourse.module.css"; 

type Props = {
  filterTurmas: "maior" | "menor" | "";
  setFilterTurmas: (value: "maior" | "menor" | "") => void;

  filterAlunos: "maior" | "menor" | "";
  setFilterAlunos: (value: "maior" | "menor" | "") => void;

  onApply: () => void;
  onClear: () => void;
};

export default function CourseFilters({
  filterTurmas,
  setFilterTurmas,
  filterAlunos,
  setFilterAlunos,
  onApply,
  onClear,
}: Props) {
  return (
    <div className={styles.filterContent_course}>
  <div className={styles.filterField}>
    <label className={styles.filterLabel}>Turmas</label>
    <select
      value={filterTurmas}
      onChange={(e) => setFilterTurmas(e.target.value as any)}
    >
      <option value="padrao">Padrão</option>
      <option value="maior">Maior quantidade</option>
      <option value="menor">Menor quantidade</option>
    </select>
  </div>

  <div className={styles.filterField}>
    <label className={styles.filterLabel}>Alunos</label>
    <select
      value={filterAlunos}
      onChange={(e) => setFilterAlunos(e.target.value as any)}
    >
      <option value="padrao">Padrão</option>
      <option value="maior">Maior quantidade</option>
      <option value="menor">Menor quantidade</option>
    </select>
  </div>

  <div className={styles.buttonGroup}>
    <button className={styles.clearFilterButton_course} onClick={onClear}>
      Limpar
    </button>
    <button className={styles.applyFilterButton_course} onClick={onApply}>
      Aplicar Filtros
    </button>
  </div>
</div>
  );
}