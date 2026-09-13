"use client";

import { useRef, useState } from "react";
import { Send, X, Sparkles, ThumbsUp, ThumbsDown } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

interface Message {
  role: "user" | "assistant";
  content: string;
  /** Only assistant messages get one, once persisted server-side. */
  messageId?: string;
  feedback?: 1 | -1;
}

type ChatStatus = "idle" | "loading" | "error" | "rate_limited";

export default function AIChat({
  locale,
  dict,
  onClose,
}: {
  locale: Locale;
  dict: Dictionary;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [sessionId, setSessionId] = useState<string | undefined>();
  const scrollRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || status === "loading") return;

    const nextMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setStatus("loading");

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, locale, messages: nextMessages }),
      });

      if (res.status === 429) {
        setStatus("rate_limited");
        return;
      }
      if (!res.ok) {
        setStatus("error");
        return;
      }

      const data = await res.json();
      if (data.sessionId) setSessionId(data.sessionId);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content, messageId: data.messageId },
      ]);
      setStatus("idle");
      queueMicrotask(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }));
    } catch {
      setStatus("error");
    }
  }

  async function rate(index: number, rating: 1 | -1) {
    const message = messages[index];
    if (!message.messageId) return; // feedback needs a persisted message (Supabase configured)
    setMessages((prev) => prev.map((m, i) => (i === index ? { ...m, feedback: rating } : m)));
    try {
      await fetch("/api/ai/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: message.messageId, rating }),
      });
    } catch {
      // Non-critical — the UI already reflects the choice; a failed write
      // here shouldn't interrupt the conversation.
    }
  }

  const whatsappMessage =
    messages.length > 0
      ? messages[messages.length - 1]?.content.slice(0, 200)
      : undefined;

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
            <Sparkles size={16} />
          </span>
          <span className="font-medium">{dict.ai.name}</span>
        </div>
        <button onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <div className="max-w-[85%] rounded-2xl rounded-ss-sm bg-canvas px-4 py-2 text-sm">
          {dict.ai.greeting}
        </div>

        {messages.map((m, i) => (
          <div key={i}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                m.role === "user"
                  ? "ms-auto rounded-se-sm bg-primary text-white"
                  : "rounded-ss-sm bg-canvas"
              }`}
            >
              {m.content}
            </div>
            {m.role === "assistant" && m.messageId && (
              <div className="mt-1 flex gap-2">
                <button
                  onClick={() => rate(i, 1)}
                  aria-label="Helpful"
                  aria-pressed={m.feedback === 1}
                  className={m.feedback === 1 ? "text-primary" : "text-border hover:text-muted"}
                >
                  <ThumbsUp size={13} />
                </button>
                <button
                  onClick={() => rate(i, -1)}
                  aria-label="Not helpful"
                  aria-pressed={m.feedback === -1}
                  className={m.feedback === -1 ? "text-secondary" : "text-border hover:text-muted"}
                >
                  <ThumbsDown size={13} />
                </button>
              </div>
            )}
          </div>
        ))}

        {status === "loading" && (
          <div className="max-w-[60%] rounded-2xl rounded-ss-sm bg-canvas px-4 py-2 text-sm text-muted">
            …
          </div>
        )}
        {status === "error" && (
          <div className="rounded-xl bg-secondary/10 px-4 py-2 text-sm text-secondary">
            {dict.ai.error}
          </div>
        )}
        {status === "rate_limited" && (
          <div className="rounded-xl bg-secondary/10 px-4 py-2 text-sm text-secondary">
            {dict.ai.rateLimited}
          </div>
        )}

        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {dict.ai.quickActions.slice(0, 4).map((qa) => (
              <button
                key={qa}
                onClick={() => send(qa)}
                className="rounded-full border border-border/60 px-3 py-1.5 text-xs hover:border-ink"
              >
                {qa}
              </button>
            ))}
          </div>
        )}

        {messages.length > 0 && (
          <a
            href={buildWhatsAppUrl(whatsappMessage)}
            className="mt-2 inline-block text-xs text-accent underline underline-offset-4"
          >
            {dict.ai.whatsappHandoff}
          </a>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-border/50 p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={dict.ai.placeholder}
          maxLength={1000}
          className="flex-1 rounded-full border border-border/60 bg-canvas px-4 py-2 text-sm outline-none focus-visible:border-primary"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          aria-label="Send"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white disabled:opacity-50"
        >
          <Send size={16} className="rtl:-scale-x-100" />
        </button>
      </form>
    </div>
  );
}
