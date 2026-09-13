import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { projects } from "@/lib/data/projects";

const staticRoutes = [
  "",
  "/about",
  "/services",
  "/services/restaurant-business-solutions",
  "/work",
  "/insights",
  "/contact",
  "/nextra-ai",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${base}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
      });
    }
    for (const project of projects) {
      entries.push({
        url: `${base}/${locale}/work/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
      });
    }
  }

  return entries;
}
