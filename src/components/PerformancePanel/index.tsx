import { useMemo, useState } from "react";
import styles from "./PerformancePanel.module.css";

import InfoCard from "../InfoCard";
import PerformanceBarChart, { type BarItem } from "../PerformanceBarChart";

import PhoneIcon from "../../assets/logo-phone.png";
import ParticipationIcon from "../../assets/participation-icon.png";
import PerformanceIcon from "../../assets/perfomance-icon.png";
import FrequencyIcon from "../../assets/frequency-icon.png";
import UniformIcon from "../../assets/uniform-icon.png";
import BehaviorIcon from "../../assets/behavior-icon.png";

export default function PerformancePanel() {
  const [order, setOrder] = useState<"maior" | "menor">("maior");

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
    <InfoCard title="Visão geral do desempenho das turmas ">
      <div className={styles.panelSingle}>

        <div className={styles.right}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitleWrap}>
              <h4 className={styles.chartTitle}>Gráfico de Desempenho de critérios das turmas</h4>
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
