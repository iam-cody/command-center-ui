import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "CRITICAL", value: 3, color: "hsl(var(--critical))" },
  { name: "HIGH", value: 7, color: "hsl(var(--high))" },
  { name: "MEDIUM", value: 14, color: "hsl(var(--medium))" },
  { name: "LOW", value: 22, color: "hsl(var(--low))" },
];

export const AlertPie = () => {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
          Event Severity (24h)
        </p>
        <span className="text-xs font-mono text-muted-foreground">{total} events</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-28 h-28 relative">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                innerRadius={32}
                outerRadius={52}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="text-center">
              <p className="text-[9px] uppercase text-muted-foreground tracking-wider">Total</p>
              <p className="font-mono font-bold">{total}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-1.5">
          {data.map((d) => (
            <div key={d.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm" style={{ background: d.color }} />
                <span className="text-muted-foreground">{d.name}</span>
              </div>
              <span className="font-mono font-semibold" style={{ color: d.color }}>
                {d.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
