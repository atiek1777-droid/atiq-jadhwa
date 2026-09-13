"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface Counts {
  projects: number;
  publishedProjects: number;
  leads: number;
  contactSubmissions: number;
  articles: number;
}

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();

    async function load() {
      const [projects, published, leads, contacts, articles] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("published", true),
        supabase.from("ai_leads").select("id", { count: "exact", head: true }),
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }),
        supabase.from("articles").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        projects: projects.count ?? 0,
        publishedProjects: published.count ?? 0,
        leads: leads.count ?? 0,
        contactSubmissions: contacts.count ?? 0,
        articles: articles.count ?? 0,
      });
    }
    load();
  }, []);

  const cards = [
    { label: "Projects", value: counts?.projects, href: "/admin/projects" },
    { label: "Published", value: counts?.publishedProjects, href: "/admin/projects" },
    { label: "AI Leads", value: counts?.leads, href: "/admin/leads" },
    { label: "Contact messages", value: counts?.contactSubmissions, href: "/admin/leads" },
    { label: "Articles", value: counts?.articles, href: "/admin/articles" },
  ];

  return (
    <div>
      <h1 className="font-arabic-display text-2xl">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Overview of the platform's content and activity.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-xl border border-border/50 bg-paper p-5 transition-colors hover:border-primary/40"
          >
            <p className="text-2xl font-semibold">{c.value ?? "—"}</p>
            <p className="mt-1 text-xs text-muted">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-border/50 bg-paper p-6 text-sm text-muted">
        Manage projects, restaurant solutions, AI knowledge, and leads from the sidebar. Every
        number above is a live count from Supabase — nothing here is a placeholder.
      </div>
    </div>
  );
}
