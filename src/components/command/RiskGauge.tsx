export const RiskGauge = ({ score }: { score: number }) => {
  const pct = Math.max(0, Math.min(100, score));
  const tone =
    pct >= 75 ? "critical" : pct >= 50 ? "high" : pct >= 25 ? "medium" : "low";
  const color = `hsl(var(--${tone}))`;
  const label = tone === "critical" ? "CRITICAL" : tone.toUpperCase();

  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <div className="glass rounded-xl p-4 flex items-center gap-4">
      <div className="relative">
        <svg width="90" height="90" viewBox="0 0 90 90" className="-rotate-90">
          <circle cx="45" cy="45" r={r} stroke="hsl(var(--secondary))" strokeWidth="6" fill="none" />
          <circle
            cx="45"
            cy="45"
            r={r}
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.8s ease-out, stroke 0.4s" }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-mono font-bold text-lg" style={{ color }}>
            {pct}
          </span>
        </div>
        {pct >= 75 && (
          <span
            className="absolute inset-0 rounded-full animate-pulse-ring pointer-events-none"
            style={{ ["--tw-shadow" as never]: color }}
          />
        )}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Risk Score
        </p>
        <p className="font-bold text-base mt-0.5" style={{ color }}>
          {label}
        </p>
      </div>
    </div>
  );
};
