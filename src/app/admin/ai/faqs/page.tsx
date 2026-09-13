"use client";

import { useSupabaseCollection } from "@/lib/hooks/useSupabaseCollection";
import type { Database } from "@/lib/supabase/types";
import AdminToolbar from "@/components/admin/AdminToolbar";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/AdminStates";
import StatusBadge from "@/components/admin/StatusBadge";
import { Trash2 } from "lucide-react";
import { useState } from "react";

type FaqRow = Database["public"]["Tables"]["ai_faqs"]["Row"];

export default function AdminAiFaqsPage() {
  const { rows, loading, error, create, update, remove } = useSupabaseCollection<FaqRow>(
    "ai_faqs",
    { column: "sort_order", ascending: true }
  );
  const [search, setSearch] = useState("");

  const filtered = rows.filter((f) =>
    `${f.question_ar} ${f.question_en}`.toLowerCase().includes(search.toLowerCase())
  );

  async function addNew() {
    await create({
      question_ar: "",
      question_en: "",
      answer_ar: "",
      answer_en: "",
      published: false,
      sort_order: rows.length,
    } as Partial<FaqRow>);
  }

  return (
    <div>
      <AdminToolbar title="AI FAQs" search={search} onSearchChange={setSearch} onCreate={addNew} />

      {loading && <AdminLoading />}
      {error && <AdminError message={error} />}
      {!loading && filtered.length === 0 && <AdminEmpty message="No FAQs yet." />}

      <div className="flex flex-col gap-4">
        {filtered.map((faq) => (
          <div key={faq.id} className="rounded-xl border border-border/50 bg-paper p-4">
            <div className="mb-3 flex items-center justify-between">
              <button onClick={() => update(faq.id, { published: !faq.published } as Partial<FaqRow>)}>
                <StatusBadge active={faq.published} onLabel="Published" offLabel="Draft" />
              </button>
              <button onClick={() => remove(faq.id)} aria-label="Delete" className="text-muted hover:text-secondary">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                dir="rtl"
                className="admin-input"
                value={faq.question_ar}
                onChange={(e) => update(faq.id, { question_ar: e.target.value } as Partial<FaqRow>)}
                placeholder="Question (Arabic)"
              />
              <input
                className="admin-input"
                value={faq.question_en}
                onChange={(e) => update(faq.id, { question_en: e.target.value } as Partial<FaqRow>)}
                placeholder="Question (English)"
              />
              <textarea
                dir="rtl"
                className="admin-input"
                rows={2}
                value={faq.answer_ar}
                onChange={(e) => update(faq.id, { answer_ar: e.target.value } as Partial<FaqRow>)}
                placeholder="Answer (Arabic)"
              />
              <textarea
                className="admin-input"
                rows={2}
                value={faq.answer_en}
                onChange={(e) => update(faq.id, { answer_en: e.target.value } as Partial<FaqRow>)}
                placeholder="Answer (English)"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
