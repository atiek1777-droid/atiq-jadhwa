import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const ContactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  message: z.string().min(1).max(4000),
  locale: z.enum(["ar", "en"]).default("ar"),
});

export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input", issues: parsed.error.issues }, { status: 400 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    // Supabase not configured yet — respond honestly rather than pretending
    // the message was stored somewhere.
    return NextResponse.json(
      { error: "not_configured", message: "Contact storage is not connected yet. Use WhatsApp." },
      { status: 503 }
    );
  }

  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("contact_submissions").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
      locale: parsed.data.locale,
      source: "contact_form",
    });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }
}
