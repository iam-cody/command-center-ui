import { Brain, Wrench, Eye, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export type ReasoningStep = {
  type: "thought" | "action" | "observation" | "answer";
  content: string;
};

const config = {
  thought: { icon: Brain, label: "Thought", color: "text-accent", bg: "bg-accent/10", border: "border-accent/30" },
  action: { icon: Wrench, label: "Action", color: "text-primary", bg: "bg-primary/10", border: "border-primary/30", mono: true },
  observation: { icon: Eye, label: "Observation", color: "text-warning", bg: "bg-warning/10", border: "border-warning/30" },
  answer: { icon: CheckCircle2, label: "Final Answer", color: "text-success", bg: "bg-success/10", border: "border-success/30" },
} as const;

export const ReasoningChain = ({ steps }: { steps: ReasoningStep[] }) => {
  const [open, setOpen] = useState(true);
  const reasoning = steps.filter((s) => s.type !== "answer");
  const answer = steps.find((s) => s.type === "answer");

  return (
    <div className="space-y-3">
      {reasoning.length > 0 && (
        <div className="glass rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(!open)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="flex items-center gap-2">
              <Brain className="w-3.5 h-3.5" />
              REASONING CHAIN · {reasoning.length} steps
            </span>
            <span className="font-mono">{open ? "−" : "+"}</span>
          </button>
          {open && (
            <div className="px-3 pb-3 space-y-2 border-t border-border/60 pt-3">
              {reasoning.map((step, i) => {
                const c = config[step.type];
                const Icon = c.icon;
                const mono = "mono" in c && c.mono;
                return (
                  <div
                    key={i}
                    className={`flex gap-2.5 p-2.5 rounded-lg border ${c.border} ${c.bg} animate-fade-in`}
                    style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}
                  >
                    <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${c.color}`} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-[10px] uppercase tracking-wider font-bold ${c.color}`}>
                        {c.label}
                      </p>
                      <p className={`text-xs mt-0.5 break-words ${mono ? "font-mono" : ""}`}>
                        {step.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      {answer && (
        <div className="flex gap-2.5 items-start animate-fade-in">
          <CheckCircle2 className="w-4 h-4 mt-0.5 text-success shrink-0" />
          <p className="text-sm leading-relaxed">{answer.content}</p>
        </div>
      )}
    </div>
  );
};
