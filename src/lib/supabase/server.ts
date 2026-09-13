import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

/**
 * Server component / route handler client — reads the user's session from
 * cookies, still governed by RLS. Use this for anything rendered on the
 * server that needs the current admin's identity.
 */
export function createServerSupabase() {
  const cookieStore = cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: () => {
          /* no-op in server components; middleware handles refresh */
        },
        remove: () => {},
      },
    }
  );
}

/**
 * Service-role client — bypasses RLS entirely. Server-only, never imported
 * into any file that ships to the browser. Used exclusively for:
 *   - writing ai_sessions / ai_messages from the chat API route
 *   - admin server actions that need elevated access after verifying the
 *     caller's session server-side first
 */
export function createServiceRoleClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local (server-side only, never NEXT_PUBLIC_)."
    );
  }
  const { createClient } = require("@supabase/supabase-js");
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
