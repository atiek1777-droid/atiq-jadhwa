import { NextRequest, NextResponse } from "next/server";
import { getChatCompletion, AIProviderError, type ChatMessage } from "@/lib/ai/providers";
import { buildSystemPrompt } from "@/lib/ai/knowledge";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// ── In-memory rate limiter ───────────────────────────────
// Adequate for a single-instance deployment; swap for a Redis/Upstash-backed
// limiter before scaling to multiple serverless regions/instances.
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const windowMs = Number(process.env.AI_RATE_LIMIT_WINDOW_SECONDS ?? 60) * 1000;
  const maxRequests = Number(process.env.AI_RATE_LIMIT_MAX_REQUESTS ?? 10);
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > maxRequests;
}

interface ChatRequestBody {
  sessionId?: string;
  locale?: string;
  messages: { role: "user" | "assistant"; content: string }[];
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const locale = isLocale(body.locale ?? "") ? (body.locale as Locale) : defaultLocale;
  const maxLen = Number(process.env.AI_MAX_MESSAGE_LENGTH ?? 1000);
  const maxMessages = Number(process.env.AI_MAX_MESSAGES_PER_SESSION ?? 30);

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: "missing_messages" }, { status: 400 });
  }
  if (body.messages.length > maxMessages) {
    return NextResponse.json({ error: "session_limit_reached" }, { status: 400 });
  }
  const lastUserMessage = body.messages[body.messages.length - 1];
  if (typeof lastUserMessage?.content !== "string" || lastUserMessage.content.length > maxLen) {
    return NextResponse.json({ error: "message_too_long" }, { status: 400 });
  }

  // Basic prompt-injection guardrail: strip any attempt to relay
  // instruction-looking content claiming to be a system role.
  const sanitized: ChatMessage[] = body.messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, maxLen) }));

  const conversation: ChatMessage[] = [
    { role: "system", content: buildSystemPrompt(locale) },
    ...sanitized,
  ];

  try {
    const { content, provider } = await getChatCompletion(conversation);

    // Persist session + messages when Supabase is configured. Uses the
    // service-role client because this is a trusted server context and the
    // anon key intentionally has no write policy on these tables.
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const supabase = createServiceRoleClient();
        let sessionId = body.sessionId;
        if (!sessionId) {
          const { data } = await supabase
            .from("ai_sessions")
            .insert({ locale, source: "website" })
            .select("id")
            .single();
          sessionId = data?.id;
        }
        let assistantMessageId: string | undefined;
        if (sessionId) {
          await supabase.from("ai_messages").insert({
            session_id: sessionId,
            role: "user",
            content: lastUserMessage.content,
          });
          const { data: assistantRow } = await supabase
            .from("ai_messages")
            .insert({ session_id: sessionId, role: "assistant", content })
            .select("id")
            .single();
          assistantMessageId = assistantRow?.id;
        }
        return NextResponse.json({ content, provider, sessionId, messageId: assistantMessageId });
      } catch {
        // Persistence failures must never block the chat response itself.
        return NextResponse.json({ content, provider });
      }
    }

    return NextResponse.json({ content, provider });
  } catch (err) {
    if (err instanceof AIProviderError) {
      return NextResponse.json(
        { error: "provider_unavailable", providersTried: err.providersTried },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "unknown_error" }, { status: 500 });
  }
}
