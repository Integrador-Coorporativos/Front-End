import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import InfoCard from "../InfoCard";
import styles from "./AcademicPieCard.module.css";

// Definimos o que o componente precisa receber
interface AcademicPieCardProps {
  greenValue: number;  // Qtd ou % de alunos OK
  yellowValue: number; // Qtd ou % de alunos Alerta
  redValue: number;    // Qtd ou % de alunos Críticos
}

export default function AcademicPieCard({ greenValue, yellowValue, redValue }: AcademicPieCardProps) {
  
  // Montamos o array do Recharts dinamicamente com as props
  const chartData = [
    {
      name: "Ótimo",
      value: greenValue || 0,
      color: "#22c55e",
      description: "Estão em ótima situação.",
    },
    {
      name: "Bom",
      value: yellowValue || 0,
      color: "#f59e0b",
      description: "Precisa de atenção em relação aos critérios.",
    },
    {
      name: "Ruim",
      value: redValue || 0,
      color: "#ef4444",
      description: "Situação crítica, alvo de mudanças.",
    },
  ];

  return (
    <InfoCard title="Situação Acadêmica">
      <div className={styles.layout}>
        <div className={styles.chartBox}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={75}
                startAngle={90}
                endAngle={-270}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.legend}>
          {chartData.map((item) => (
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