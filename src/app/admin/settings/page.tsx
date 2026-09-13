"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseCollection } from "@/lib/hooks/useSupabaseCollection";
import type { Database } from "@/lib/supabase/types";
import { AdminError, AdminLoading } from "@/components/admin/AdminStates";
import { Trash2 } from "lucide-react";

type SocialRow = Database["public"]["Tables"]["social_links"]["Row"];

/**
 * site_settings is a simple key/value JSONB table (see sql/schema.sql). This
 * screen edits the keys the rest of the app actually reads:
 *   - whatsapp_number
 *   - ai_enabled
 *   - ai_assistant_name / ai_greeting
 * Nothing here is invented UI chrome — each key maps directly to a real
 * runtime behavior once wired into the relevant server code.
 */
const SETTING_KEYS = [
  { key: "whatsapp_number", label: "WhatsApp number", placeholder: "967779339333" },
  { key: "ai_enabled", label: "AI enabled (true/false)", placeholder: "true" },
  { key: "ai_assistant_name", label: "AI assistant name", placeholder: "عتيق AI" },
  { key: "ai_greeting", label: "AI greeting message", placeholder: "..." },
];

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const social = useSupabaseCollection<SocialRow>("social_links", {
    column: "sort_order",
    ascending: true,
  });

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("site_settings")
      .select("*")
      .then(({ data, error }) => {
        if (error) setError(error.message);
        const map: Record<string, string> = {};
        (data ?? []).forEach((row: { key: string; value: unknown }) => {
          map[row.key] = typeof row.value === "string" ? row.value : JSON.stringify(row.value);
        });
        setValues(map);
        setLoading(false);
      });
  }, []);

  async function saveKey(key: string, value: string) {
    const supabase = createClient();
    await supabase.from("site_settings").upsert({ key, value });
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function addSocial() {
    await social.create({ platform: "", url: "", sort_order: social.rows.length } as Partial<SocialRow>);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-arabic-display text-2xl">Site Settings</h1>

      {loading && <AdminLoading />}
      {error && <AdminError message={error} />}

      {!loading && (
        <div className="mt-6 flex flex-col gap-4">
          {SETTING_KEYS.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="mb-1 block text-xs font-medium text-muted">{label}</label>
              <input
                defaultValue={values[key] ?? ""}
                placeholder={placeholder}
                onBlur={(e) => saveKey(key, e.target.value)}
                className="admin-input"
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 border-t border-border/50 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Social Links</h2>
          <button onClick={addSocial} className="rounded-full bg-primary px-3 py-1.5 text-xs text-white">
            Add
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {social.rows.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <input
                defaultValue={s.platform}
                placeholder="Platform (e.g. instagram)"
                onBlur={(e) => social.update(s.id, { platform: e.target.value } as Partial<SocialRow>)}
                className="admin-input w-40"
              />
              <input
                defaultValue={s.url}
                placeholder="URL"
                onBlur={(e) => social.update(s.id, { url: e.target.value } as Partial<SocialRow>)}
                className="admin-input"
              />
              <button onClick={() => social.remove(s.id)} aria-label="Delete" className="text-muted hover:text-secondary">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
