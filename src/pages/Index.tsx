import { useEffect, useRef, useState } from "react";
import { Trash2, Download, Radio } from "lucide-react";
import { CommandSidebar } from "@/components/command/Sidebar";
import { AlertPie } from "@/components/command/AlertPie";
import { QuickActions, type QuickAction } from "@/components/command/QuickActions";
import { ChatMessage, type ChatMessageData } from "@/components/command/ChatMessage";
import { ChatInput } from "@/components/command/ChatInput";
import type { ReasoningStep } from "@/components/command/ReasoningChain";
import { toast } from "sonner";

const seedMessages: ChatMessageData[] = [
  {
    id: "seed-1",
    role: "agent",
    timestamp: "06:00:12",
    content:
      "**Sentinel-AI online.** Drone telemetry nominal. Patrol sector SECTOR-7 secured.\n\nAsk me anything about the surveillance feed or use a quick action below.",
  },
];

const mockResponse = (query: string): ReasoningStep[] => {
  const lower = query.toLowerCase();
  if (lower.includes("midnight") || lower.includes("00:00")) {
    return [
      { type: "thought", content: "Operator wants a deep scan of the 00:00–05:00 patrol window. I should query the timeline DB for that range." },
      { type: "action", content: "query_timeline(start='00:00', end='05:00', zone='SECTOR-7')" },
      { type: "observation", content: "Returned 3 events: 1 vehicle (unknown plate, 02:14, parked 15min near Main Gate), 2 wildlife signatures (low priority)." },
      { type: "answer", content: "🚨 One **suspicious vehicle** was detected at 02:14 near the Main Gate, idling for ~15 minutes before leaving. Plate could not be resolved. Two wildlife sightings logged as routine. Recommending review of Gate cam feed at the timestamp." },
    ];
  }
  if (lower.includes("vehicle")) {
    return [
      { type: "thought", content: "Need to filter all object detections labeled 'vehicle' from today's frames." },
      { type: "action", content: "search_frames(label='vehicle', range='24h')" },
      { type: "observation", content: "12 vehicle detections — 9 authorized (badge match), 2 delivery, 1 unknown." },
      { type: "answer", content: "Found **12 vehicles** in the last 24h: 9 authorized, 2 deliveries, and **1 unknown** (02:14 incident, see Midnight Patrol). All others cleared." },
    ];
  }
  if (lower.includes("summar")) {
    return [
      { type: "thought", content: "Aggregate today's events into an executive briefing across all severity tiers." },
      { type: "action", content: "summarize_video_feed(window_hours=24)" },
      { type: "observation", content: "46 events processed: 3 critical, 7 high, 14 medium, 22 low. Risk score peaked at 78 around 02:14." },
      { type: "answer", content: "**24-hour Briefing**\n\n- **3 CRITICAL** events (1 perimeter breach attempt at 02:14)\n- **7 HIGH** (motion in restricted zones)\n- **14 MEDIUM**, **22 LOW** routine flags\n\nOverall posture: **ELEVATED**. Recommend reinforcing east perimeter overnight." },
    ];
  }
  return [
    { type: "thought", content: "Parsing the operator's natural-language query and matching it to the appropriate tool." },
    { type: "action", content: `vlm_query("${query}")` },
    { type: "observation", content: "Visual-language model returned a confidence-weighted response with 2 supporting frame references." },
    { type: "answer", content: `Analyzing "${query}"... All scanned frames are within nominal parameters. No threats matched the query criteria. Sector remains **SECURE**.` },
  ];
};

const Index = () => {
  const [messages, setMessages] = useState<ChatMessageData[]>(seedMessages);
  const [thinking, setThinking] = useState(false);
  const [riskScore, setRiskScore] = useState(34);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const now = () =>
    new Date().toLocaleTimeString("en-GB", { hour12: false }).slice(0, 8);

  const send = (content: string) => {
    const userMsg: ChatMessageData = {
      id: `u-${Date.now()}`,
      role: "user",
      content,
      timestamp: now(),
    };
    setMessages((m) => [...m, userMsg]);
    setThinking(true);

    setTimeout(() => {
      const steps = mockResponse(content);
      setMessages((m) => [
        ...m,
        { id: `a-${Date.now()}`, role: "agent", steps, timestamp: now() },
      ]);
      setThinking(false);
      const isCritical = steps.some((s) => s.content.toLowerCase().includes("critical") || s.content.includes("🚨"));
      setRiskScore(isCritical ? 82 : Math.floor(Math.random() * 30) + 25);
    }, 1400);
  };

  const handleQuickAction = (a: QuickAction) => send(a.prompt);

  const clearLogs = () => {
    setMessages(seedMessages);
    setRiskScore(34);
    toast.success("Session reset", { description: "Chat history cleared." });
  };

  const downloadLogs = () => {
    const data = JSON.stringify(messages, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sentinel-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Logs exported", { description: "Reasoning chain downloaded as JSON." });
  };

  return (
    <div className="h-screen w-full flex overflow-hidden grid-bg">
      <CommandSidebar riskScore={riskScore} />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="glass-strong border-b border-border/60 px-6 py-3 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-bold tracking-tight flex items-center gap-2">
              AI Security Analyst
              <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/30">
                <Radio className="w-2.5 h-2.5 animate-blink" /> LIVE
              </span>
            </h1>
            <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
              Deployment: <span className="text-primary">AIR-GAPPED</span> · Model: VLM-7B-Tactical
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={downloadLogs}
              className="glass hover:border-primary/60 hover:text-primary transition-all rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download Logs
            </button>
            <button
              onClick={clearLogs}
              className="glass hover:border-destructive/60 hover:text-destructive transition-all rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        </header>

        {/* Conversation + side panel */}
        <div className="flex-1 flex min-h-0">
          <div className="flex-1 flex flex-col min-w-0">
            <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-6 py-6 space-y-5">
              {messages.map((m) => (
                <ChatMessage key={m.id} message={m} />
              ))}
              {thinking && (
                <div className="flex gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center glow-primary">
                    <Radio className="w-4 h-4 text-primary-foreground animate-blink" />
                  </div>
                  <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-blink" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-blink" style={{ animationDelay: "200ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-blink" style={{ animationDelay: "400ms" }} />
                    <span className="text-xs font-mono text-muted-foreground ml-2">
                      Sentinel reasoning...
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 pb-5 pt-2 space-y-3 border-t border-border/40">
              <QuickActions onPick={handleQuickAction} />
              <ChatInput onSend={send} disabled={thinking} />
            </div>
          </div>

          {/* Right rail: Visualizations */}
          <aside className="w-80 shrink-0 border-l border-border/60 p-5 space-y-5 overflow-y-auto scrollbar-thin glass-strong hidden xl:block">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
              Intel Overview
            </p>
            <AlertPie />
            <div className="glass rounded-xl p-4 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                Recent Detections
              </p>
              {[
                { t: "02:14", l: "Unknown vehicle", tone: "critical" },
                { t: "01:48", l: "Wildlife signature", tone: "low" },
                { t: "00:32", l: "Authorized patrol", tone: "low" },
                { t: "23:55", l: "Motion · Zone B", tone: "medium" },
              ].map((e, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: `hsl(var(--${e.tone}))` }}
                    />
                    <span>{e.l}</span>
                  </div>
                  <span className="font-mono text-muted-foreground">{e.t}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Index;
