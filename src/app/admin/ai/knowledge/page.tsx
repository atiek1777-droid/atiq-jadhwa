"use client";

import { useState } from "react";
import { useSupabaseCollection } from "@/lib/hooks/useSupabaseCollection";
import type { Database } from "@/lib/supabase/types";
import AdminToolbar from "@/components/admin/AdminToolbar";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/AdminStates";
import { Trash2 } from "lucide-react";

type KnowledgeRow = Database["public"]["Tables"]["ai_knowledge"]["Row"];

const DOMAINS = [
  "profile",
  "services",
  "restaurant_solutions",
  "projects",
  "nextra_ai",
  "policies",
  "assistant_rules",
] as const;

/**
 * Structured AI knowledge editor (PRD §34): each row is one fact/policy
 * scoped to a domain + key, editable independently — never one giant
 * hardcoded prompt. src/lib/ai/knowledge.ts should merge these rows into
 * buildSystemPrompt() once Supabase is connected, alongside the verified
 * local fallback content already in that file.
 */
export default function AdminAiKnowledgePage() {
  const { rows, loading, error, create, update, remove } = useSupabaseCollection<KnowledgeRow>(
    "ai_knowledge",
    { column: "domain", ascending: true }
  );
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState<string>("all");

  const filtered = rows.filter(
    (r) =>
      (domainFilter === "all" || r.domain === domainFilter) &&
      `${r.key} ${r.content_ar ?? ""} ${r.content_en ?? ""}`.toLowerCase().includes(search.toLowerCase())
  );

  async function addNew() {
    await create({
      domain: "profile",
      key: `fact-${Date.now()}`,
      content_ar: "",
      content_en: "",
    } as Partial<KnowledgeRow>);
  }

  return (
    <div>
      <AdminToolbar title="AI Knowledge" search={search} onSearchChange={setSearch} onCreate={addNew} />

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setDomainFilter("all")}
          className={`rounded-full border px-3 py-1 text-xs ${domainFilter === "all" ? "border-primary text-primary" : "border-border text-muted"}`}
        >
          all
        </button>
        {DOMAINS.map((d) => (
          <button
            key={d}
            onClick={() => setDomainFilter(d)}
            className={`rounded-full border px-3 py-1 text-xs ${domainFilter === d ? "border-primary text-primary" : "border-border text-muted"}`}
          >
            {d}
          </button>
        ))}
      </div>

      {loading && <AdminLoading />}
      {error && <AdminError message={error} />}
      {!loading && filtered.length === 0 && <AdminEmpty message="No knowledge entries match." />}

      <div className="flex flex-col gap-3">
        {filtered.map((row) => (
          <div key={row.id} className="rounded-xl border border-border/50 bg-paper p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <select
                  value={row.domain}
                  onChange={(e) => update(row.id, { domain: e.target.value as KnowledgeRow["domain"] })}
                  className="admin-input w-auto text-xs"
                >
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <input
                  value={row.key}
                  onChange={(e) => update(row.id, { key: e.target.value } as Partial<KnowledgeRow>)}
                  className="admin-input w-auto text-xs"
                />
              </div>
              <button onClick={() => remove(row.id)} aria-label="Delete" className="text-muted hover:text-secondary">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <textarea
                dir="rtl"
                className="admin-input"
                rows={3}
                value={row.content_ar ?? ""}
                onChange={(e) => update(row.id, { content_ar: e.target.value } as Partial<KnowledgeRow>)}
                placeholder="Content (Arabic)"
              />
              <textarea
                className="admin-input"
                rows={3}
                value={row.content_en ?? ""}
                onChange={(e) => update(row.id, { content_en: e.target.value } as Partial<KnowledgeRow>)}
                placeholder="Content (English)"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
