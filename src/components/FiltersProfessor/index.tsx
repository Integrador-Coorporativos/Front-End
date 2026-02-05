import React, { useState } from "react";
import styles from "./FiltersProfessor.module.css";

type Props = {
  filterNome: "asc" | "desc" | "";
  setFilterNome: (value: "asc" | "desc" | "") => void;

  filterTurmas: "maior" | "menor" | "";
  setFilterTurmas: (value: "maior" | "menor" | "") => void;

  onApply: () => void;
  onClear: () => void;
};

export default function FiltersProfessor({
  filterNome,
  setFilterNome,
  filterTurmas,
  setFilterTurmas,
  onApply,
  onClear,
}: Props) {
  return (
    <div className={styles.filterContent_professor}>
      <div className={styles.filterField}>
        <label className={styles.filterLabel}>Ordenar por Nome</label>
        <select 
          value={filterNome} 
          onChange={(e) => setFilterNome(e.target.value as any)}
        >
          <option value="">Selecionar</option>
          <option value="asc">A - Z (Crescente)</option>
          <option value="desc">Z - A (Decrescente)</option>
        </select>
      </div>

      <div className={styles.filterField}>
        <label className={styles.filterLabel}>Quantidade de Turmas</label>
        <select 
          value={filterTurmas} 
          onChange={(e) => setFilterTurmas(e.target.value as any)}
        >
          <option value="">Selecionar</option>
          <option value="maior">Maior quantidade</option>
          <option value="menor">Menor quantidade</option>
        </select>
      </div>

      <div className={styles.buttonGroup}>
        <button className={styles.clearFilterButton_professor} onClick={onClear}>
          Limpar
        </button>
        <button className={styles.applyFilterButton_professor} onClick={onApply}>
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
}