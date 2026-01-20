import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

type ChartData = {
  label: string
  value: number
}

type RadarPerformanceChartProps = {
  data: ChartData[]
}

export default function RadarPerformanceChart({
  data,
}: RadarPerformanceChartProps) {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="label" />

          <PolarRadiusAxis domain={[1, 5]} tickCount={5} />

          <Radar
            dataKey="value"
            stroke="#359830"
            fill="#359830"
            fillOpacity={0.7}
          />

          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
