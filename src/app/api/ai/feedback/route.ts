import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const FeedbackSchema = z.object({
  messageId: z.string().uuid(),
  rating: z.union([z.literal(1), z.literal(-1)]),
  note: z.string().max(500).optional(),
});

/**
 * Thumbs up/down on an assistant reply (ai_feedback table). Written via the
 * service-role client for the same reason as ai_messages: the anon key has
 * no write policy on this table by design (sql/policies.sql), so feedback
 * must go through a trusted server route rather than a direct client insert.
 */
export async function POST(req: NextRequest) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = FeedbackSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("ai_feedback").insert({
      message_id: parsed.data.messageId,
      rating: parsed.data.rating,
      note: parsed.data.note ?? null,
    });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }
}
