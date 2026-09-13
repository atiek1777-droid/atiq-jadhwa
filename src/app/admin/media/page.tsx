"use client";

import { useMemo, useState } from "react";
import { useSupabaseCollection } from "@/lib/hooks/useSupabaseCollection";
import type { Database } from "@/lib/supabase/types";
import AdminToolbar from "@/components/admin/AdminToolbar";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/AdminStates";
import { Trash2 } from "lucide-react";

type MediaRow = Database["public"]["Tables"]["media"]["Row"];
type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

/**
 * General Media Library — PRD §17/§42/§64: for the 113 supplied assets whose
 * project relationship isn't confirmed (no network access to inspect them
 * visually), each one lands here unassigned rather than being guessed onto a
 * project. An admin pastes the real URL once uploaded to Supabase Storage,
 * then assigns it to a project from this screen when the relationship is
 * actually known.
 */
export default function MediaLibraryPage() {
  const media = useSupabaseCollection<MediaRow>("media", { column: "created_at", ascending: false });
  const projects = useSupabaseCollection<ProjectRow>("projects", { column: "title_en", ascending: true });
  const [search, setSearch] = useState("");
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");

  const filtered = useMemo(
    () => media.rows.filter((m) => (m.alt_text ?? m.url).toLowerCase().includes(search.toLowerCase())),
    [media.rows, search]
  );

  async function addMedia(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    await media.create({
      url: url.trim(),
      alt_text: alt.trim() || null,
      source_note: "unassigned: image relationship not yet confirmed",
    } as Partial<MediaRow>);
    setUrl("");
    setAlt("");
  }

  async function assign(id: string, projectId: string) {
    await media.update(id, { assigned_project_id: projectId || null } as Partial<MediaRow>);
  }

  return (
    <div>
      <AdminToolbar title="Media Library" search={search} onSearchChange={setSearch} />

      <form onSubmit={addMedia} className="mb-8 grid gap-2 rounded-xl border border-border/50 bg-paper p-4 md:grid-cols-[1fr_1fr_auto]">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Image URL (Supabase Storage or verified source)"
          className="admin-input"
        />
        <input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Alt text"
          className="admin-input"
        />
        <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm text-white">
          Add to library
        </button>
      </form>

      {media.loading && <AdminLoading />}
      {media.error && <AdminError message={media.error} />}
      {!media.loading && filtered.length === 0 && (
        <AdminEmpty message="No media uploaded yet. Add image URLs above as they're confirmed." />
      )}

      {!media.loading && filtered.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {filtered.map((item) => (
            <div key={item.id} className="rounded-xl border border-border/40 bg-paper p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.alt_text ?? ""} className="h-28 w-full rounded-lg object-cover" />
              <p className="mt-2 truncate text-xs text-muted">{item.alt_text || "No alt text"}</p>
              <select
                value={item.assigned_project_id ?? ""}
                onChange={(e) => assign(item.id, e.target.value)}
                className="admin-input mt-2 text-xs"
              >
                <option value="">Unassigned</option>
                {projects.rows.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title_en}
                  </option>
                ))}
              </select>
              <button
                onClick={() => media.remove(item.id)}
                className="mt-2 flex items-center gap-1 text-xs text-secondary"
              >
                <Trash2 size={12} /> Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
