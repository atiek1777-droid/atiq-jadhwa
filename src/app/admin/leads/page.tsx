"use client";

import { useState } from "react";
import { useSupabaseCollection } from "@/lib/hooks/useSupabaseCollection";
import type { Database } from "@/lib/supabase/types";
import AdminToolbar from "@/components/admin/AdminToolbar";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/AdminStates";

type LeadRow = Database["public"]["Tables"]["ai_leads"]["Row"];
type ContactRow = Database["public"]["Tables"]["contact_submissions"]["Row"];

export default function AdminLeadsPage() {
  const leads = useSupabaseCollection<LeadRow>("ai_leads", { column: "created_at", ascending: false });
  const contacts = useSupabaseCollection<ContactRow>("contact_submissions", {
    column: "created_at",
    ascending: false,
  });
  const [search, setSearch] = useState("");

  const filteredLeads = leads.rows.filter((l) =>
    `${l.name ?? ""} ${l.phone ?? ""} ${l.summary ?? ""}`.toLowerCase().includes(search.toLowerCase())
  );
  const filteredContacts = contacts.rows.filter((c) =>
    `${c.name} ${c.email} ${c.message}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <AdminToolbar title="Leads" search={search} onSearchChange={setSearch} />

      <section className="mb-10">
        <h2 className="mb-3 text-sm font-semibold text-muted">Contact form submissions</h2>
        {contacts.loading && <AdminLoading />}
        {contacts.error && <AdminError message={contacts.error} />}
        {!contacts.loading && filteredContacts.length === 0 && (
          <AdminEmpty message="No contact form submissions yet." />
        )}
        <div className="flex flex-col gap-2">
          {filteredContacts.map((c) => (
            <div key={c.id} className="rounded-lg border border-border/50 bg-paper p-4 text-sm">
              <div className="flex justify-between text-xs text-muted">
                <span>{c.name} — {c.email}</span>
                <span>{new Date(c.created_at).toLocaleString()}</span>
              </div>
              <p className="mt-2">{c.message}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted">AI-qualified leads</h2>
        {leads.loading && <AdminLoading />}
        {leads.error && <AdminError message={leads.error} />}
        {!leads.loading && filteredLeads.length === 0 && (
          <AdminEmpty message="No AI leads captured yet." />
        )}
        <div className="flex flex-col gap-2">
          {filteredLeads.map((l) => (
            <div key={l.id} className="rounded-lg border border-border/50 bg-paper p-4 text-sm">
              <div className="flex justify-between text-xs text-muted">
                <span>{l.name || "Unnamed"} — {l.business_type || "—"}</span>
                <select
                  value={l.status}
                  onChange={(e) => leads.update(l.id, { status: e.target.value } as Partial<LeadRow>)}
                  className="admin-input w-auto text-xs"
                >
                  <option value="new">new</option>
                  <option value="contacted">contacted</option>
                  <option value="closed">closed</option>
                </select>
              </div>
              {l.summary && <p className="mt-2">{l.summary}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
