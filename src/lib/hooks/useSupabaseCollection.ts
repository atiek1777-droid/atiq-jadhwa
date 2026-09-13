"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Generic CRUD hook shared by every /admin resource screen (projects,
 * services, restaurant_solutions, articles, ai_knowledge, ai_faqs,
 * social_links...). Table-specific typing comes from the generic <T>; the
 * shape itself is enforced by src/lib/supabase/types.ts at the call site.
 *
 * This is intentionally the ONE place that talks to Supabase for admin
 * list/create/update/delete, so RLS errors, loading, and empty states are
 * handled consistently everywhere instead of once per page.
 */
export function useSupabaseCollection<T extends { id: string }>(
  table: string,
  orderBy: { column: string; ascending?: boolean } = { column: "created_at", ascending: false }
) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order(orderBy.column, { ascending: orderBy.ascending ?? false });

    if (error) {
      setError(error.message);
      setRows([]);
    } else {
      setRows((data ?? []) as T[]);
    }
    setLoading(false);
  }, [table, orderBy.column, orderBy.ascending]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function create(values: Partial<T>) {
    const supabase = createClient();
    const { data, error } = await supabase.from(table).insert(values).select().single();
    if (error) return { error: error.message };
    await refresh();
    return { data: data as T };
  }

  async function update(id: string, values: Partial<T>) {
    const supabase = createClient();
    const { error } = await supabase.from(table).update(values).eq("id", id);
    if (error) return { error: error.message };
    await refresh();
    return {};
  }

  async function remove(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return { error: error.message };
    await refresh();
    return {};
  }

  return { rows, loading, error, refresh, create, update, remove };
}
