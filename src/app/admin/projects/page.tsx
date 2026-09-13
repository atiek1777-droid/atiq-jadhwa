"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSupabaseCollection } from "@/lib/hooks/useSupabaseCollection";
import type { Database } from "@/lib/supabase/types";
import AdminToolbar from "@/components/admin/AdminToolbar";
import { AdminLoading, AdminError, AdminEmpty } from "@/components/admin/AdminStates";
import StatusBadge from "@/components/admin/StatusBadge";
import { createClient } from "@/lib/supabase/client";
import { ArrowUp, ArrowDown, Star, Trash2 } from "lucide-react";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

export default function AdminProjectsPage() {
  const { rows, loading, error, refresh, remove } = useSupabaseCollection<ProjectRow>(
    "projects",
    { column: "sort_order", ascending: true }
  );
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filtered = useMemo(
    () =>
      rows.filter((p) =>
        `${p.title_ar} ${p.title_en} ${p.slug}`.toLowerCase().includes(search.toLowerCase())
      ),
    [rows, search]
  );

  async function createDraft() {
    const supabase = createClient();
    const slug = `new-project-${Date.now()}`;
    const { data, error } = await supabase
      .from("projects")
      .insert({
        slug,
        title_ar: "مشروع جديد",
        title_en: "New Project",
        category: [],
        services: [],
        tools: [],
        published: false,
        featured: false,
        sort_order: rows.length,
      })
      .select("id")
      .single();
    if (!error && data) router.push(`/admin/projects/${data.id}`);
  }

  async function toggle(id: string, field: "published" | "featured", current: boolean) {
    const supabase = createClient();
    await supabase.from("projects").update({ [field]: !current }).eq("id", id);
    refresh();
  }

  async function move(id: string, direction: -1 | 1) {
    const index = filtered.findIndex((p) => p.id === id);
    const target = filtered[index + direction];
    if (!target) return;
    const current = filtered[index];
    const supabase = createClient();
    await Promise.all([
      supabase.from("projects").update({ sort_order: target.sort_order }).eq("id", current.id),
      supabase.from("projects").update({ sort_order: current.sort_order }).eq("id", target.id),
    ]);
    refresh();
  }

  return (
    <div>
      <AdminToolbar
        title="Projects"
        search={search}
        onSearchChange={setSearch}
        onCreate={createDraft}
        createLabel="New project"
      />

      {loading && <AdminLoading />}
      {error && <AdminError message={error} />}
      {!loading && !error && filtered.length === 0 && (
        <AdminEmpty message="No projects match your search." />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border/50 bg-paper">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-start text-xs text-muted">
                <th className="px-4 py-3 text-start">Title</th>
                <th className="px-4 py-3 text-start">Slug</th>
                <th className="px-4 py-3 text-start">Status</th>
                <th className="px-4 py-3 text-start">Featured</th>
                <th className="px-4 py-3 text-start">Order</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border/30 last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/projects/${p.id}`} className="font-medium hover:text-primary">
                      {p.title_en}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{p.slug}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggle(p.id, "published", p.published)}>
                      <StatusBadge active={p.published} onLabel="Published" offLabel="Draft" />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggle(p.id, "featured", p.featured)}>
                      <Star
                        size={16}
                        className={p.featured ? "fill-accent text-accent" : "text-border"}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => move(p.id, -1)} aria-label="Move up">
                        <ArrowUp size={14} />
                      </button>
                      <button onClick={() => move(p.id, 1)} aria-label="Move down">
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${p.title_en}"? This cannot be undone.`)) remove(p.id);
                      }}
                      className="text-muted hover:text-secondary"
                      aria-label="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
