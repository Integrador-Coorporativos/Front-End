import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from "recharts";

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

export default function PerformanceBarChart({ items }: { items: BarItem[] }) {
  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={items}
          barCategoryGap="35%"
          barGap={0}
        >
          <XAxis hide />

          <Tooltip cursor={{ fill: "transparent" }} />

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
