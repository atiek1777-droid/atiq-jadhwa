"use client";

import { useState } from "react";
import { useSupabaseCollection } from "@/lib/hooks/useSupabaseCollection";
import type { Database } from "@/lib/supabase/types";
import AdminToolbar from "@/components/admin/AdminToolbar";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/AdminStates";
import StatusBadge from "@/components/admin/StatusBadge";
import { Trash2 } from "lucide-react";

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];

export default function AdminArticlesPage() {
  const { rows, loading, error, create, update, remove } = useSupabaseCollection<ArticleRow>(
    "articles",
    { column: "created_at", ascending: false }
  );
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = rows.filter((a) =>
    `${a.title_ar} ${a.title_en}`.toLowerCase().includes(search.toLowerCase())
  );

  async function addNew() {
    const slug = `article-${Date.now()}`;
    const { data } = await create({
      slug,
      title_ar: "مقال جديد",
      title_en: "New article",
      excerpt_ar: "",
      excerpt_en: "",
      body_ar: "",
      body_en: "",
      published: false,
    } as Partial<ArticleRow>);
    if (data) setEditingId(data.id);
  }

  return (
    <div>
      <AdminToolbar title="Insights / Articles" search={search} onSearchChange={setSearch} onCreate={addNew} />

      {loading && <AdminLoading />}
      {error && <AdminError message={error} />}
      {!loading && filtered.length === 0 && <AdminEmpty message="No articles yet." />}

      <div className="flex flex-col gap-3">
        {filtered.map((article) => {
          const isEditing = editingId === article.id;
          return (
            <div key={article.id} className="rounded-xl border border-border/50 bg-paper p-4">
              <div className="flex items-center justify-between gap-3">
                <button onClick={() => setEditingId(isEditing ? null : article.id)} className="text-start font-medium">
                  {article.title_en}
                </button>
                <div className="flex items-center gap-3">
                  <button onClick={() => update(article.id, { published: !article.published } as Partial<ArticleRow>)}>
                    <StatusBadge active={article.published} onLabel="Published" offLabel="Draft" />
                  </button>
                  <button onClick={() => remove(article.id)} aria-label="Delete" className="text-muted hover:text-secondary">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {isEditing && (
                <div className="mt-4 flex flex-col gap-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      className="admin-input"
                      dir="rtl"
                      value={article.title_ar}
                      onChange={(e) => update(article.id, { title_ar: e.target.value } as Partial<ArticleRow>)}
                      placeholder="Title (Arabic)"
                    />
                    <input
                      className="admin-input"
                      value={article.title_en}
                      onChange={(e) => update(article.id, { title_en: e.target.value } as Partial<ArticleRow>)}
                      placeholder="Title (English)"
                    />
                  </div>
                  <input
                    className="admin-input"
                    value={article.slug}
                    onChange={(e) => update(article.id, { slug: e.target.value } as Partial<ArticleRow>)}
                    placeholder="Slug"
                  />
                  <div className="grid gap-3 md:grid-cols-2">
                    <textarea
                      className="admin-input"
                      dir="rtl"
                      rows={2}
                      value={article.excerpt_ar ?? ""}
                      onChange={(e) => update(article.id, { excerpt_ar: e.target.value } as Partial<ArticleRow>)}
                      placeholder="Excerpt (Arabic)"
                    />
                    <textarea
                      className="admin-input"
                      rows={2}
                      value={article.excerpt_en ?? ""}
                      onChange={(e) => update(article.id, { excerpt_en: e.target.value } as Partial<ArticleRow>)}
                      placeholder="Excerpt (English)"
                    />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <textarea
                      className="admin-input"
                      dir="rtl"
                      rows={8}
                      value={article.body_ar ?? ""}
                      onChange={(e) => update(article.id, { body_ar: e.target.value } as Partial<ArticleRow>)}
                      placeholder="Body (Arabic, Markdown)"
                    />
                    <textarea
                      className="admin-input"
                      rows={8}
                      value={article.body_en ?? ""}
                      onChange={(e) => update(article.id, { body_en: e.target.value } as Partial<ArticleRow>)}
                      placeholder="Body (English, Markdown)"
                    />
                  </div>
                  <input
                    className="admin-input"
                    value={article.cover_image ?? ""}
                    onChange={(e) => update(article.id, { cover_image: e.target.value } as Partial<ArticleRow>)}
                    placeholder="Cover image URL"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
