import styles from "./FiltersClasse.module.css";

type Props = {
  filterCurso: string;
  setFilterCurso: (value: string) => void;

  filterAno: string;
  setFilterAno: (value: string) => void;

  filterTurno: "Matutino" | "Vespertino" | "Noturno" | "";
  setFilterTurno: (value: "Matutino" | "Vespertino" | "Noturno" | "") => void;

  filterAlunos: "maior" | "menor" | "";
  setFilterAlunos: (value: "maior" | "menor" | "") => void;

  onApply: () => void;
};

export default function FiltersClasses({
  filterCurso,
  setFilterCurso,
  filterAno,
  setFilterAno,
  filterTurno,
  setFilterTurno,
  filterAlunos,
  setFilterAlunos,
  onApply,
}: Props) {
  return (
    <div className={styles.filterContent_course}>
      <select
        value={filterCurso}
        onChange={(e) => setFilterCurso(e.target.value)}
      >
        <option value="">Curso</option>
        <option value="Informática">Informática</option>
        <option value="Apicultura">Apicultura</option>
        <option value="Alimentos">Alimentos</option>
        <option value="Química">Química</option>
        <option value="Agroindústria">Agroindústria</option>
      </select>

      <input
        type="number"
        value={filterAno}
        placeholder="Ano de ingresso"
        onChange={(e) => setFilterAno(e.target.value)}
      />

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
        <option value="">Alunos</option>
        <option value="maior">Maior quantidade</option>
        <option value="menor">Menor quantidade</option>
      </select>

      <button className={styles.applyFilterButton_course} onClick={onApply}>
        Aplicar
      </button>
    </div>
  );
}
