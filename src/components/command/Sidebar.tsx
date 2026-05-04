import { Battery, Wifi, MapPin, Cpu, Activity, ShieldCheck } from "lucide-react";
import { Sparkline } from "./Sparkline";
import { RiskGauge } from "./RiskGauge";

export const CommandSidebar = ({ riskScore }: { riskScore: number }) => {
  return (
    <aside className="w-72 shrink-0 glass-strong border-r border-border/60 flex flex-col h-full">
      {/* Brand */}
      <div className="p-5 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center glow-primary">
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
          <div>
            <p className="font-bold tracking-tight leading-none">SENTINEL-X</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
              Command Center
            </p>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="p-5 space-y-5 overflow-y-auto scrollbar-thin flex-1">
        <SectionTitle>System Health</SectionTitle>

        <StatusRow
          icon={<Battery className="w-4 h-4" />}
          label="Drone Battery"
          value="78%"
          tone="success"
          bar={78}
        />
        <StatusRow
          icon={<Wifi className="w-4 h-4" />}
          label="VLM Status"
          value="ONLINE"
          tone="success"
          dot
        />
        <StatusRow
          icon={<Cpu className="w-4 h-4" />}
          label="Inference"
          value="42 ms"
          tone="primary"
        />
        <StatusRow
          icon={<MapPin className="w-4 h-4" />}
          label="Patrol Zone"
          value="SECTOR-7"
          tone="primary"
        />

        <SectionTitle>Telemetry</SectionTitle>
        <div className="glass rounded-xl p-3 space-y-3">
          <TelemetryItem label="Altitude" unit="m" value={124} color="hsl(var(--primary))" />
          <TelemetryItem label="Speed" unit="m/s" value={8.4} color="hsl(var(--accent))" />
        </div>

        <SectionTitle>Threat Level</SectionTitle>
        <RiskGauge score={riskScore} />

        <SectionTitle>Live Status</SectionTitle>
        <div className="glass rounded-xl p-3 flex items-center gap-3">
          <Activity className="w-4 h-4 text-success animate-blink" />
          <span className="text-xs font-mono text-muted-foreground">
            Streaming • 28 fps
          </span>
        </div>
      </div>

      <div className="p-4 border-t border-border/60">
        <p className="text-[10px] font-mono text-muted-foreground text-center">
          v2.4.1 • AIR-GAPPED
        </p>
      </div>
    </aside>
  );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
    {children}
  </p>
);

const toneClasses = {
  success: "text-success",
  primary: "text-primary",
  warning: "text-warning",
  critical: "text-critical",
} as const;

const StatusRow = ({
  icon,
  label,
  value,
  tone,
  bar,
  dot,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: keyof typeof toneClasses;
  bar?: number;
  dot?: boolean;
}) => (
  <div className="glass rounded-xl p-3">
    <div className="flex items-center justify-between mb-1.5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className={toneClasses[tone]}>{icon}</span>
        <span className="text-xs">{label}</span>
      </div>
      <div className={`flex items-center gap-1.5 text-xs font-mono font-semibold ${toneClasses[tone]}`}>
        {dot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-blink" />}
        {value}
      </div>
    </div>
    {bar !== undefined && (
      <div className="h-1 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-success to-primary rounded-full transition-all`}
          style={{ width: `${bar}%` }}
        />
      </div>
    )}
  </div>
);

const TelemetryItem = ({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) => (
  <div>
    <div className="flex items-center justify-between text-xs mb-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-semibold" style={{ color }}>
        {value} <span className="text-muted-foreground text-[10px]">{unit}</span>
      </span>
    </div>
    <Sparkline color={color} />
  </div>
);
