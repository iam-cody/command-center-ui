import ReactMarkdown from "react-markdown";
import { User, Bot } from "lucide-react";
import { ReasoningChain, type ReasoningStep } from "./ReasoningChain";

export type ChatMessageData = {
  id: string;
  role: "user" | "agent";
  content?: string;
  steps?: ReasoningStep[];
  timestamp: string;
};

export const ChatMessage = ({ message }: { message: ChatMessageData }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 animate-slide-up ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-8 h-8 rounded-lg shrink-0 grid place-items-center ${
          isUser
            ? "bg-secondary border border-border"
            : "bg-gradient-to-br from-primary to-accent glow-primary"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-muted-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-primary-foreground" />
        )}
      </div>

      <div className={`max-w-[78%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
          <span>{isUser ? "Operator" : "Sentinel-AI"}</span>
          <span>•</span>
          <span>{message.timestamp}</span>
        </div>

        {isUser ? (
          <div className="bg-secondary/80 border border-border rounded-2xl rounded-tr-sm px-4 py-2.5">
            <p className="text-sm">{message.content}</p>
          </div>
        ) : (
          <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 w-full">
            {message.steps ? (
              <ReasoningChain steps={message.steps} />
            ) : (
              <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-strong:text-primary">
                <ReactMarkdown>{message.content || ""}</ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
