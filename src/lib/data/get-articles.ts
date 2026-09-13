import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type Article = Database["public"]["Tables"]["articles"]["Row"];

/**
 * Server-side read of published articles. Returns an empty array (never
 * fabricated content) when Supabase isn't configured yet or the table is
 * empty — the Insights page renders an honest empty state in that case.
 */
export async function getPublishedArticles(): Promise<Article[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const supabase = createServerSupabase();
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = createServerSupabase();
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();
    return data ?? null;
  } catch {
    return null;
  }
}
