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
      <select
        value={filterTurmas}
        onChange={(e) => setFilterTurmas(e.target.value as any)}
      >
        <option value="">Turmas</option>
        <option value="maior">Maior quantidade</option>
        <option value="menor">Menor quantidade</option>
      </select>
      <select
        value={filterAlunos}
        onChange={(e) => setFilterAlunos(e.target.value as any)}
      >
        <option value="">Aluno</option>
        <option value="maior">Maior quantidade</option>
        <option value="menor">Menor quantidade</option>
      </select>

      <button className={styles.applyFilterButton_course} onClick={onApply}>
        Aplicar
      </button>

      <button className={styles.clearFilterButton_course} onClick={onClear}>
        Remover filtros
      </button>
    </div>
  );
}
