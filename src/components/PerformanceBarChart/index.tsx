import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Cell,
} from "recharts";

export type BarTone = "green" | "yellow" | "red";

export type BarItem = {
  label: string;
  value: number;
  tone: BarTone;
};

function toneToColor(tone: BarTone) {
  if (tone === "green") return "#22c55e";
  if (tone === "yellow") return "#f59e0b";
  return "#ef4444";
}

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ payload: BarItem }>;
};

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0].payload;

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e6eaee",
        borderRadius: 8,
        padding: "8px 10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        fontSize: 12,
        lineHeight: 1.2,
      }}
    >
      <div style={{ fontWeight: 700, color: "#101828" }}>{item.label}</div>

      <div style={{ color: "#667085", marginTop: 6 }}>
        Média: <strong style={{ color: "#101828" }}>{item.value}</strong>
      </div>
    </div>
  );
}

export default function PerformanceBarChart({ items }: { items: BarItem[] }) {
  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={items} barCategoryGap="35%" barGap={0}>
          <XAxis hide />

          <Tooltip
            cursor={{ fill: "transparent" }}
            content={<CustomTooltip />}
          />

          <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={26}>
            {items.map((it) => (
              <Cell key={it.label} fill={toneToColor(it.tone)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
