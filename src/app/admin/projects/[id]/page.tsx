"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";
import { AdminLoading, AdminError } from "@/components/admin/AdminStates";
import ProjectImagesManager from "@/components/admin/ProjectImagesManager";
import { Trash2 } from "lucide-react";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

const CATEGORIES = [
  "business-development",
  "branding",
  "digital",
  "web",
  "marketing",
  "restaurant",
  "operations",
  "systems",
  "ai",
];

function toCsv(arr: string[] | null | undefined) {
  return (arr ?? []).join(", ");
}
function fromCsv(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function ProjectEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<ProjectRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setProject(data);
        setLoading(false);
      });
  }, [id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!project) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("projects")
      .update({
        title_ar: project.title_ar,
        title_en: project.title_en,
        slug: project.slug,
        category: project.category,
        industry: project.industry,
        short_description_ar: project.short_description_ar,
        short_description_en: project.short_description_en,
        role: project.role,
        services: project.services,
        cover_image: project.cover_image,
        external_url: project.external_url,
        challenge: project.challenge,
        approach: project.approach,
        solution: project.solution,
        outcome: project.outcome,
        tools: project.tools,
        featured: project.featured,
        published: project.published,
      })
      .eq("id", id);
    setSaving(false);
    if (error) setError(error.message);
  }

  async function deleteProject() {
    if (!confirm("Delete this project permanently?")) return;
    const supabase = createClient();
    await supabase.from("projects").delete().eq("id", id);
    router.push("/admin/projects");
  }

  if (loading) return <AdminLoading />;
  if (error && !project) return <AdminError message={error} />;
  if (!project) return <AdminError message="Project not found." />;

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-arabic-display text-2xl">{project.title_en || "Untitled project"}</h1>
        <button onClick={deleteProject} className="flex items-center gap-1 text-sm text-secondary">
          <Trash2 size={14} /> Delete
        </button>
      </div>

      {error && <div className="mb-4"><AdminError message={error} /></div>}

      <form onSubmit={save} className="flex flex-col gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title (Arabic)">
            <input
              value={project.title_ar}
              onChange={(e) => setProject({ ...project, title_ar: e.target.value })}
              className="admin-input"
              dir="rtl"
            />
          </Field>
          <Field label="Title (English)">
            <input
              value={project.title_en}
              onChange={(e) => setProject({ ...project, title_en: e.target.value })}
              className="admin-input"
            />
          </Field>
        </div>

        <Field label="Slug">
          <input
            value={project.slug}
            onChange={(e) => setProject({ ...project, slug: e.target.value })}
            className="admin-input"
          />
        </Field>

        <Field label="Categories">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const active = project.category.includes(c);
              return (
                <button
                  type="button"
                  key={c}
                  onClick={() =>
                    setProject({
                      ...project,
                      category: active
                        ? project.category.filter((x) => x !== c)
                        : [...project.category, c],
                    })
                  }
                  className={`rounded-full border px-3 py-1 text-xs ${
                    active ? "border-primary bg-primary/10 text-primary" : "border-border text-muted"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Short description (Arabic)">
            <textarea
              value={project.short_description_ar ?? ""}
              onChange={(e) => setProject({ ...project, short_description_ar: e.target.value })}
              className="admin-input"
              rows={3}
              dir="rtl"
            />
          </Field>
          <Field label="Short description (English)">
            <textarea
              value={project.short_description_en ?? ""}
              onChange={(e) => setProject({ ...project, short_description_en: e.target.value })}
              className="admin-input"
              rows={3}
            />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="External URL">
            <input
              value={project.external_url ?? ""}
              onChange={(e) => setProject({ ...project, external_url: e.target.value })}
              className="admin-input"
            />
          </Field>
          <Field label="Cover image URL">
            <input
              value={project.cover_image ?? ""}
              onChange={(e) => setProject({ ...project, cover_image: e.target.value })}
              className="admin-input"
            />
          </Field>
        </div>

        <Field label="Role">
          <input
            value={project.role ?? ""}
            onChange={(e) => setProject({ ...project, role: e.target.value })}
            className="admin-input"
          />
        </Field>

        <Field label="Services (comma separated)">
          <input
            value={toCsv(project.services)}
            onChange={(e) => setProject({ ...project, services: fromCsv(e.target.value) })}
            className="admin-input"
          />
        </Field>

        <Field label="Tools (comma separated)">
          <input
            value={toCsv(project.tools)}
            onChange={(e) => setProject({ ...project, tools: fromCsv(e.target.value) })}
            className="admin-input"
          />
        </Field>

        {/* Only real, verified content belongs here — leave blank if unknown. */}
        {(["challenge", "approach", "solution", "outcome"] as const).map((field) => (
          <Field key={field} label={field.charAt(0).toUpperCase() + field.slice(1)}>
            <textarea
              value={project[field] ?? ""}
              onChange={(e) => setProject({ ...project, [field]: e.target.value })}
              className="admin-input"
              rows={3}
              placeholder="Leave blank unless this is confirmed, real information"
            />
          </Field>
        ))}

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={project.published}
              onChange={(e) => setProject({ ...project, published: e.target.checked })}
            />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={project.featured}
              onChange={(e) => setProject({ ...project, featured: e.target.checked })}
            />
            Featured
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-fit rounded-full bg-primary px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>

      <div className="mt-12 border-t border-border/50 pt-8">
        <ProjectImagesManager projectId={project.id} />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted">{label}</label>
      {children}
    </div>
  );
}
