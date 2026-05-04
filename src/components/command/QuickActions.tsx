import { CalendarClock, Moon, Car, Sparkles } from "lucide-react";

export type QuickAction = {
  label: string;
  icon: React.ReactNode;
  prompt: string;
  tool: string;
};

const actions: QuickAction[] = [
  { label: "Summarize Today", icon: <Sparkles className="w-3.5 h-3.5" />, prompt: "Generate a 24-hour executive summary of all security events.", tool: "summarize_video_feed(24)" },
  { label: "Midnight Patrol", icon: <Moon className="w-3.5 h-3.5" />, prompt: "Check the 00:00 - 05:00 window for any anomalies.", tool: "query_timeline('00:00','05:00')" },
  { label: "Identify Vehicles", icon: <Car className="w-3.5 h-3.5" />, prompt: "Show me all vehicle detections from the patrol logs.", tool: "search_frames('vehicle')" },
  { label: "Today's Timeline", icon: <CalendarClock className="w-3.5 h-3.5" />, prompt: "Build a chronological timeline of today's notable events.", tool: "query_timeline('today')" },
];

export const QuickActions = ({ onPick }: { onPick: (a: QuickAction) => void }) => (
  <div className="flex flex-wrap gap-2">
    {actions.map((a) => (
      <button
        key={a.label}
        onClick={() => onPick(a)}
        className="group glass hover:border-primary/60 hover:bg-primary/10 transition-all rounded-full px-3.5 py-1.5 flex items-center gap-2 text-xs font-medium"
      >
        <span className="text-primary group-hover:scale-110 transition-transform">{a.icon}</span>
        {a.label}
      </button>
    ))}
  </div>
);
