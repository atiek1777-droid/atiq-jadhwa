import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";

export function buildMetadata({
  title,
  description,
  locale,
  path,
}: {
  title: string;
  description?: string;
  locale: Locale;
  path: string;
}): Metadata {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const url = `${base}/${locale}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ar: `${base}/ar${path}`,
        en: `${base}/en${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      locale: locale === "ar" ? "ar_AR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
