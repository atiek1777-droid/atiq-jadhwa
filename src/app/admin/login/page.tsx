"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isSupabaseConfigured) {
    return (
      <div dir="ltr" className="flex min-h-screen items-center justify-center bg-ink px-6 text-canvas">
        <div className="max-w-sm text-center">
          <h1 className="font-arabic-display text-2xl">Admin not connected yet</h1>
          <p className="mt-3 text-sm text-canvas/70">
            Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment,
            run sql/schema.sql + sql/policies.sql, then create an admin user and add a matching
            row in the <code>profiles</code> table.
          </p>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/admin");
  }

  return (
    <div dir="ltr" className="flex min-h-screen items-center justify-center bg-ink px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-paper p-8">
        <h1 className="font-arabic-display text-2xl">Admin Login</h1>
        <div className="mt-6 flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-border/60 px-4 py-3 text-sm"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-border/60 px-4 py-3 text-sm"
          />
          {error && <p className="text-sm text-secondary">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? "…" : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
