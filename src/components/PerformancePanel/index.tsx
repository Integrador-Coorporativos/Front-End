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
import { type DashboardMetrics } from "@/api/types/dashboard";

interface PerformancePanelProps {
  metrics: DashboardMetrics | undefined | null;
}

export default function PerformancePanel({ metrics }: PerformancePanelProps) {
  const [order, setOrder] = useState<"maior" | "menor">("maior");
  const getBarData = (value: number = 0, label: string): BarItem => {
    const percentage = Math.round(value * 20);
    let tone: "red" | "yellow" | "green" = "red";

    if (percentage >= 70) tone = "green";
    else if (percentage >= 40) tone = "yellow";

    return { label, value: percentage, tone };
  };

  const baseBars: BarItem[] = useMemo(() => {
    if (!metrics) return [];
    
    return [
      getBarData(metrics.cellPhoneUseScore, "Uso Celular"),
      getBarData(metrics.participationScore, "Participação"),
      getBarData(metrics.performanceScore, "Desempenho"),
      getBarData(metrics.frequencyScore, "Frequência"),
      getBarData(metrics.unifirmScore, "Fardamento"),
      getBarData(metrics.behaviorScore, "Comportamento"),
    ];
  }, [metrics]);

  const bars = useMemo(() => {
    const sorted = [...baseBars].sort((a, b) => b.value - a.value);
    return order === "maior" ? sorted : sorted.reverse();
  }, [baseBars, order]);
  if (!metrics) return null;


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
