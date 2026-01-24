import styles from "./FiltersCourse.module.css"; 

type Props = {
  filterTurmas: "maior" | "menor" | "";
  setFilterTurmas: (value: "maior" | "menor" | "") => void;

  filterTurno: "Matutino" | "Vespertino" | "Noturno" | "";
  setFilterTurno: (value: "Matutino" | "Vespertino" | "Noturno" | "") => void;

  filterAlunos: "maior" | "menor" | "";
  setFilterAlunos: (value: "maior" | "menor" | "") => void;

  onApply: () => void;
};

export default function CourseFilters({
  filterTurmas,
  setFilterTurmas,
  filterTurno,
  setFilterTurno,
  filterAlunos,
  setFilterAlunos,
  onApply,
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
        value={filterTurno}
        onChange={(e) => setFilterTurno(e.target.value as any)}
      >
        <option value="">Turno</option>
        <option value="Matutino">Matutino</option>
        <option value="Vespertino">Vespertino</option>
        <option value="Noturno">Noturno</option>
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
    </div>
  );
}
