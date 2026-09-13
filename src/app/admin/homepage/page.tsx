"use client";

import { useSupabaseCollection } from "@/lib/hooks/useSupabaseCollection";
import type { Database } from "@/lib/supabase/types";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/AdminStates";

type SectionRow = Database["public"]["Tables"]["homepage_sections"]["Row"];

const KNOWN_SECTIONS = [
  "hero",
  "framework",
  "capabilities",
  "featured_work",
  "restaurant_teaser",
  "nextra_teaser",
];

/**
 * Homepage sections are stored as free-form JSON per section_key (see
 * sql/schema.sql: homepage_sections). Editing raw JSON here is intentional —
 * the shape of each section's content should match the dictionary shape in
 * src/lib/i18n/dictionaries/*.json, so this is the escape hatch for editing
 * homepage copy without a code deploy once the team is comfortable with it.
 */
export default function AdminHomepagePage() {
  const { rows, loading, error, create, update } = useSupabaseCollection<SectionRow>(
    "homepage_sections",
    { column: "sort_order", ascending: true }
  );

  async function ensureSection(key: string) {
    if (rows.some((r) => r.section_key === key)) return;
    await create({
      section_key: key,
      content: {},
      sort_order: rows.length,
      visible: true,
    } as unknown as Partial<SectionRow>);
  }

  return (
    <div>
      <h1 className="font-arabic-display text-2xl">Homepage</h1>
      <p className="mt-1 text-sm text-muted">
        Toggle visibility and edit raw JSON content per section. Content defaults to the
        dictionary files (src/lib/i18n/dictionaries) until overridden here.
      </p>

      {loading && <AdminLoading />}
      {error && <AdminError message={error} />}

      <div className="mt-6 flex flex-col gap-3">
        {KNOWN_SECTIONS.map((key) => {
          const row = rows.find((r) => r.section_key === key);
          return (
            <div key={key} className="rounded-xl border border-border/50 bg-paper p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{key}</span>
                {row ? (
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={row.visible}
                      onChange={(e) => update(row.id, { visible: e.target.checked } as Partial<SectionRow>)}
                    />
                    Visible
                  </label>
                ) : (
                  <button onClick={() => ensureSection(key)} className="text-xs text-primary">
                    Enable override
                  </button>
                )}
              </div>

              {row && (
                <textarea
                  className="admin-input mt-3 font-mono text-xs"
                  rows={4}
                  defaultValue={JSON.stringify(row.content, null, 2)}
                  onBlur={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      update(row.id, { content: parsed } as unknown as Partial<SectionRow>);
                    } catch {
                      alert("Invalid JSON — change not saved.");
                    }
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {!loading && rows.length === 0 && (
        <div className="mt-6">
          <AdminEmpty message="No overrides yet — the homepage is using the default dictionary content." />
        </div>
      )}
    </div>
  );
}
