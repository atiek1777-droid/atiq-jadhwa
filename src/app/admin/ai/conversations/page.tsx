"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/AdminStates";

type Session = Database["public"]["Tables"]["ai_sessions"]["Row"];
type Message = Database["public"]["Tables"]["ai_messages"]["Row"];

/**
 * Read-only viewer for ai_sessions/ai_messages. Per PRD §46, this must apply
 * privacy controls — it never exposes anything beyond what the admin's RLS
 * policy already permits (see sql/policies.sql: ai_sessions_admin_read /
 * ai_messages_admin_read), and retention is a Supabase-side concern (e.g. a
 * scheduled job trimming old sessions) left to the operator to configure.
 */
export default function AdminConversationsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    supabase
      .from("ai_sessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setSessions(data ?? []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selected) return;
    const supabase = createClient();
    supabase
      .from("ai_messages")
      .select("*")
      .eq("session_id", selected)
      .order("created_at", { ascending: true })
      .then(({ data }) => setMessages(data ?? []));
  }, [selected]);

  return (
    <div>
      <h1 className="font-arabic-display text-2xl">AI Conversations</h1>

      {loading && <AdminLoading />}
      {error && <AdminError message={error} />}
      {!loading && sessions.length === 0 && <AdminEmpty message="No conversations recorded yet." />}

      <div className="mt-6 grid gap-6 md:grid-cols-[280px_1fr]">
        <div className="flex flex-col gap-1">
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelected(s.id)}
              className={`rounded-lg px-3 py-2 text-start text-sm ${
                selected === s.id ? "bg-primary/10 text-primary" : "hover:bg-paper"
              }`}
            >
              {new Date(s.created_at).toLocaleString()} · {s.locale}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-border/50 bg-paper p-4">
          {!selected && <p className="text-sm text-muted">Select a session to view its messages.</p>}
          {selected && (
            <div className="flex flex-col gap-2">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                    m.role === "user" ? "ms-auto bg-primary text-white" : "bg-canvas"
                  }`}
                >
                  {m.content}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
