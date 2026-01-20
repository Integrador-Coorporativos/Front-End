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

type CustomTooltipProps = {
  active?: boolean
  payload?: {
    payload: ChartData
  }[]
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  const { label, value } = payload[0].payload

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e0e0e0",
        borderRadius: 6,
        color: "#359830",
        padding: "8px 12px",
        fontSize: 14,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <strong>{label}</strong>
      <div>Nota: {value.toFixed(1)}</div>
    </div>
  )
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
          <PolarRadiusAxis
            domain={[1, 5]}
            tick={false}
            axisLine={false}
          />

          <Radar
            dataKey="value"
            stroke="#359830"
            fill="#359830"
            fillOpacity={0.7}
          />

          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
