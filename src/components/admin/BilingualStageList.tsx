"use client";

import { useState } from "react";
import { useSupabaseCollection } from "@/lib/hooks/useSupabaseCollection";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/AdminStates";
import StatusBadge from "@/components/admin/StatusBadge";
import { Trash2 } from "lucide-react";

interface StageRow {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string | null;
  description_en: string | null;
  published: boolean;
  sort_order: number;
  [key: string]: unknown;
}

/**
 * Shared CMS list/editor for any table shaped like `services` or
 * `restaurant_solutions`: a bilingual title/description, a "stage/pillar"
 * enum, publish toggle, and sort order. Both admin screens are thin
 * instances of this component with different `stageField`/`stageOptions`.
 */
export default function BilingualStageList({
  table,
  stageField,
  stageOptions,
  title,
}: {
  table: string;
  stageField: string;
  stageOptions: string[];
  title: string;
}) {
  const { rows, loading, error, create, update, remove } = useSupabaseCollection<StageRow>(table, {
    column: "sort_order",
    ascending: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  async function addNew() {
    await create({
      title_ar: "عنوان جديد",
      title_en: "New item",
      description_ar: "",
      description_en: "",
      published: false,
      sort_order: rows.length,
      [stageField]: stageOptions[0],
    } as Partial<StageRow>);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-arabic-display text-2xl">{title}</h1>
        <button onClick={addNew} className="rounded-full bg-primary px-4 py-2 text-sm text-white">
          New
        </button>
      </div>

      {loading && <AdminLoading />}
      {error && <AdminError message={error} />}
      {!loading && rows.length === 0 && <AdminEmpty message="Nothing here yet." />}

      <div className="flex flex-col gap-3">
        {rows.map((row) => {
          const isEditing = editingId === row.id;
          return (
            <div key={row.id} className="rounded-xl border border-border/50 bg-paper p-4">
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setEditingId(isEditing ? null : row.id)}
                  className="text-start font-medium"
                >
                  {row.title_en}{" "}
                  <span className="text-xs text-muted">({String(row[stageField])})</span>
                </button>
                <div className="flex items-center gap-3">
                  <button onClick={() => update(row.id, { published: !row.published } as Partial<StageRow>)}>
                    <StatusBadge active={row.published} onLabel="Published" offLabel="Draft" />
                  </button>
                  <button onClick={() => remove(row.id)} aria-label="Delete" className="text-muted hover:text-secondary">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {isEditing && (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <input
                    className="admin-input"
                    dir="rtl"
                    value={row.title_ar}
                    onChange={(e) => update(row.id, { title_ar: e.target.value } as Partial<StageRow>)}
                    placeholder="Title (Arabic)"
                  />
                  <input
                    className="admin-input"
                    value={row.title_en}
                    onChange={(e) => update(row.id, { title_en: e.target.value } as Partial<StageRow>)}
                    placeholder="Title (English)"
                  />
                  <textarea
                    className="admin-input"
                    dir="rtl"
                    rows={3}
                    value={row.description_ar ?? ""}
                    onChange={(e) =>
                      update(row.id, { description_ar: e.target.value } as Partial<StageRow>)
                    }
                    placeholder="Description (Arabic)"
                  />
                  <textarea
                    className="admin-input"
                    rows={3}
                    value={row.description_en ?? ""}
                    onChange={(e) =>
                      update(row.id, { description_en: e.target.value } as Partial<StageRow>)
                    }
                    placeholder="Description (English)"
                  />
                  <select
                    className="admin-input"
                    value={String(row[stageField])}
                    onChange={(e) => update(row.id, { [stageField]: e.target.value } as Partial<StageRow>)}
                  >
                    {stageOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
