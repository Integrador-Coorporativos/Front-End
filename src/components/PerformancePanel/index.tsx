import { useMemo, useState } from "react";
import styles from "./PerformancePanel.module.css";

import InfoCard from "../InfoCard";
import FilterButtons, { type FilterItem } from "../FilterButtons";
import PerformanceBarChart, { type BarItem } from "../PerformanceBarChart";

import PhoneIcon from "../../assets/logo-phone.png";
import ParticipationIcon from "../../assets/participation-icon.png";
import PerformanceIcon from "../../assets/perfomance-icon.png";
import FrequencyIcon from "../../assets/frequency-icon.png";
import UniformIcon from "../../assets/uniform-icon.png";
import BehaviorIcon from "../../assets/behavior-icon.png";

type MetricKey = "cell" | "part" | "perf" | "freq" | "uni" | "beh";

export default function PerformancePanel() {
  const [selectedKey, setSelectedKey] = useState<MetricKey>("perf");
  const [order, setOrder] = useState<"maior" | "menor">("maior");

  const filterItems: FilterItem[] = [
    { key: "cell", label: "Uso de Celular", icon: PhoneIcon },
    { key: "part", label: "Participação", icon: ParticipationIcon },
    { key: "perf", label: "Desempenho", icon: PerformanceIcon },
    { key: "freq", label: "Frequência", icon: FrequencyIcon },
    { key: "uni", label: "Fardamento", icon: UniformIcon },
    { key: "beh", label: "Comportamento", icon: BehaviorIcon },
  ];

  const baseBars: BarItem[] = [
    { label: "Uso Celular", value: 32, tone: "red" },
    { label: "Participação", value: 58, tone: "yellow" },
    { label: "Desempenho", value: 78, tone: "green" },
    { label: "Frequência", value: 62, tone: "yellow" },
    { label: "Fardamento", value: 85, tone: "green" },
    { label: "Comportamento", value: 66, tone: "yellow" },
  ];

  const bars = useMemo(() => {
    const sorted = [...baseBars].sort((a, b) => b.value - a.value);
    return order === "maior" ? sorted : sorted.reverse();
  }, [order]);

  return (
    <InfoCard title="Visão geral do desempenho dos alunos e distribuição de resultados">
      <div className={styles.panel}>
        <div className={styles.left}>
          <div className={styles.breadcrumb}>
            <span className={styles.crumbMuted}>Dashboard</span>
            <span className={styles.sep}>›</span>
            <span className={styles.crumbMuted}>Turmas</span>
            <span className={styles.sep}>›</span>
            <span className={styles.crumbActive}>3º Ano B</span>
          </div>

          <FilterButtons
            items={filterItems}
            selectedKey={selectedKey}
            onSelect={(key) => setSelectedKey(key as MetricKey)}
          />
        </div>

        <div className={styles.right}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitleWrap}>
              <h4 className={styles.chartTitle}>Gráfico de Desempenho</h4>
              <span className={styles.chartSubtitle}>
                Filtro selecionado:{" "}
                <strong>{filterItems.find((f) => f.key === selectedKey)?.label}</strong>
              </span>
            </div>

            <select
              className={styles.select}
              value={order}
              onChange={(e) => setOrder(e.target.value as "maior" | "menor")}
            >
              <option value="maior">Maior Desemp.</option>
              <option value="menor">Menor Desemp.</option>
            </select>
          </div>

          <PerformanceBarChart items={bars} />

          <div className={styles.iconRow}>
            <img src={PhoneIcon} alt="Uso de Celular" />
            <img src={ParticipationIcon} alt="Participação" />
            <img src={PerformanceIcon} alt="Desempenho" />
            <img src={FrequencyIcon} alt="Frequência" />
            <img src={UniformIcon} alt="Fardamento" />
            <img src={BehaviorIcon} alt="Comportamento" />
          </div>
        </div>
      </div>
    </InfoCard>
  );
}
