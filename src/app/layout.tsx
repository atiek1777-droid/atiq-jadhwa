import type { Metadata } from "next";
import { headers } from "next/headers";
import { dir, defaultLocale, isLocale } from "@/lib/i18n/config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "عتيق الجذوة — Atiq Al-Jadhwa",
};

// True Next.js root layout: owns the single <html>/<body> pair for the
// whole app. The active locale is read from the `x-locale` header set by
// middleware.ts (derived from the URL), so lang/dir render correctly on the
// server with no client-side flash.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const headerLocale = headers().get("x-locale") ?? "";
  const locale = isLocale(headerLocale) ? headerLocale : defaultLocale;

  return (
    <html lang={locale} dir={dir[locale]}>
      <body className={locale === "ar" ? "font-arabic" : "font-latin"}>{children}</body>
    </html>
  );
}
