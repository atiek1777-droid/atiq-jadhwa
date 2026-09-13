"use client";

import { useState } from "react";
import { useSupabaseCollection } from "@/lib/hooks/useSupabaseCollection";
import type { Database } from "@/lib/supabase/types";
import { AdminEmpty, AdminLoading } from "@/components/admin/AdminStates";
import { Trash2 } from "lucide-react";

type ImageRow = Database["public"]["Tables"]["project_images"]["Row"];

/**
 * Media assignment for a single project. This is the mechanism PRD §17/§42
 * requires: images are never auto-assigned by guessing — an admin pastes the
 * URL (from Supabase Storage, or the GitHub asset repo once verified) and
 * sets orientation/alt text explicitly.
 */
export default function ProjectImagesManager({ projectId }: { projectId: string }) {
  const { rows, loading, create, remove } = useSupabaseCollection<ImageRow>(
    "project_images",
    { column: "sort_order", ascending: true }
  );
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [orientation, setOrientation] = useState<"landscape" | "portrait" | "square">("landscape");

  const projectImages = rows.filter((r) => r.project_id === projectId);

  async function addImage(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    await create({
      project_id: projectId,
      image_url: url.trim(),
      alt_text: alt.trim() || null,
      orientation,
      sort_order: projectImages.length,
    } as Partial<ImageRow>);
    setUrl("");
    setAlt("");
  }

  return (
    <div>
      <h3 className="text-sm font-semibold">Gallery images</h3>
      <p className="mt-1 text-xs text-muted">
        Paste a confirmed image URL (Supabase Storage or the verified GitHub asset repo). Never
        guess which image belongs here.
      </p>

      <form onSubmit={addImage} className="mt-4 grid gap-2 md:grid-cols-[1fr_1fr_auto_auto]">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Image URL"
          className="rounded-lg border border-border/60 px-3 py-2 text-sm"
        />
        <input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Alt text"
          className="rounded-lg border border-border/60 px-3 py-2 text-sm"
        />
        <select
          value={orientation}
          onChange={(e) => setOrientation(e.target.value as typeof orientation)}
          className="rounded-lg border border-border/60 px-3 py-2 text-sm"
        >
          <option value="landscape">Landscape</option>
          <option value="portrait">Portrait</option>
          <option value="square">Square</option>
        </select>
        <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm text-white">
          Add
        </button>
      </form>

      {loading && <AdminLoading />}
      {!loading && projectImages.length === 0 && (
        <div className="mt-4">
          <AdminEmpty message="No images assigned yet." />
        </div>
      )}

      {!loading && projectImages.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {projectImages.map((img) => (
            <div key={img.id} className="group relative overflow-hidden rounded-lg border border-border/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.image_url} alt={img.alt_text ?? ""} className="h-28 w-full object-cover" />
              <button
                onClick={() => remove(img.id)}
                className="absolute end-1 top-1 rounded-full bg-ink/70 p-1 text-canvas opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
