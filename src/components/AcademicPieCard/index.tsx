import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import InfoCard from "../InfoCard";
import styles from "./AcademicPieCard.module.css";

type Slice = {
  name: "Verde" | "Amarelo" | "Vermelho";
  value: number;
  color: string;
  description: string;
};

const data: Slice[] = [
  {
    name: "Verde",
    value: 50,
    color: "#22c55e",
    description: "Estão em ótima situação.",
  },
  {
    name: "Amarelo",
    value: 33,
    color: "#f59e0b",
    description: "Precisa de atenção em relação aos critérios.",
  },
  {
    name: "Vermelho",
    value: 17,
    color: "#ef4444",
    description: "Situação crítica, alvo de mudanças.",
  },
];

export default function AcademicPieCard() {
  return (
    <InfoCard title="Situação Acadêmica">
      <div className={styles.layout}>
        <div className={styles.chartBox}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={75}
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip
                
              />
            </PieChart>
          </ResponsiveContainer>

        </div>

        <div className={styles.legend}>
          {data.map((item) => (
            <div key={item.name} className={styles.legendRow}>
              <div
                className={styles.badge}
                style={{ background: item.color }}
              >
                {item.value}%
              </div>

              <div className={styles.legendText}>
                <strong className={styles.legendTitle}>
                  {item.name}:
                </strong>
                <span className={styles.legendDesc}>
                  {item.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </InfoCard>
  );
}
