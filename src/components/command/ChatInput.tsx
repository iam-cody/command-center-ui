import { Send } from "lucide-react";
import { useState, KeyboardEvent } from "react";

export const ChatInput = ({ onSend, disabled }: { onSend: (msg: string) => void; disabled?: boolean }) => {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="glass-strong rounded-2xl p-2 flex items-end gap-2 focus-within:border-primary/60 focus-within:glow-primary transition-all">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKey}
        rows={1}
        placeholder="Query the AI Security Analyst..."
        className="flex-1 bg-transparent resize-none outline-none px-3 py-2 text-sm placeholder:text-muted-foreground max-h-32"
        disabled={disabled}
      />
      <button
        onClick={submit}
        disabled={!value.trim() || disabled}
        className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground grid place-items-center disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-transform glow-primary"
        aria-label="Send"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
};
