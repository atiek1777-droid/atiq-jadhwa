"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

const NAV_GROUPS: { label: string; items: { href: string; label: string }[] }[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard" }],
  },
  {
    label: "Portfolio",
    items: [
      { href: "/admin/projects", label: "Projects" },
      { href: "/admin/media", label: "Media Library" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/services", label: "Services" },
      { href: "/admin/restaurant-solutions", label: "Restaurant Solutions" },
      { href: "/admin/articles", label: "Insights / Articles" },
      { href: "/admin/homepage", label: "Homepage" },
    ],
  },
  {
    label: "Atiq AI",
    items: [
      { href: "/admin/ai/knowledge", label: "Knowledge" },
      { href: "/admin/ai/faqs", label: "FAQs" },
      { href: "/admin/ai/conversations", label: "Conversations" },
    ],
  },
  {
    label: "Growth",
    items: [{ href: "/admin/leads", label: "Leads" }],
  },
  {
    label: "System",
    items: [{ href: "/admin/settings", label: "Site Settings" }],
  },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, configured } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return <>{children}</>;

  if (!configured) {
    return (
      <div dir="ltr" className="flex min-h-screen items-center justify-center bg-ink px-6 text-canvas">
        <div className="max-w-md text-center text-sm">
          <p className="font-arabic-display text-2xl text-canvas">Admin not connected</p>
          <p className="mt-3 text-canvas/70">
            Add NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY, run{" "}
            <code>sql/schema.sql</code> + <code>sql/policies.sql</code>, and create an admin user
            with a matching row in <code>profiles</code>.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div dir="ltr" className="flex min-h-screen items-center justify-center text-sm text-muted">Loading…</div>;
  }

  if (!user) return null; // useAdminAuth already redirected to /admin/login

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <div dir="ltr" className="flex min-h-screen bg-canvas text-ink">
      <aside className="hidden w-60 shrink-0 border-e border-border/50 bg-paper p-5 md:block">
        <p className="font-arabic-display text-lg">عتيق الجذوة</p>
        <p className="text-xs text-muted">Admin</p>

        <nav className="mt-8 flex flex-col gap-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                {group.label}
              </p>
              <div className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                      pathname === item.href
                        ? "bg-primary text-white"
                        : "text-ink/80 hover:bg-canvas"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <button
          onClick={signOut}
          className="mt-10 flex items-center gap-2 text-sm text-muted hover:text-secondary"
        >
          <LogOut size={14} /> Sign out
        </button>
      </aside>

      <div className="flex-1 overflow-x-hidden p-6 md:p-10">{children}</div>
    </div>
  );
}
