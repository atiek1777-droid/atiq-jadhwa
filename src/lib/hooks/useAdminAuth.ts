"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

/**
 * Gates every /admin page. Three states matter:
 *  - Supabase isn't configured at all -> tell the admin plainly (not a spinner forever).
 *  - Configured but no session -> redirect to /admin/login.
 *  - Configured and authenticated -> render the dashboard.
 */
export function useAdminAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/admin/login");
      } else {
        setUser(data.user);
      }
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/admin/login");
      setUser(session?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, [router]);

  return { user, loading, configured: isSupabaseConfigured };
}
