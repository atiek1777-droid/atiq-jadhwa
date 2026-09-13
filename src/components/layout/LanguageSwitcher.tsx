"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;
    const rest = pathname.split("/").slice(2).join("/");
    router.push(`/${next}${rest ? `/${rest}` : ""}`);
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      <button
        onClick={() => switchTo("ar")}
        aria-current={locale === "ar"}
        className={locale === "ar" ? "text-ink font-semibold" : "text-muted hover:text-ink"}
      >
        عربي
      </button>
      <span className="text-border">/</span>
      <button
        onClick={() => switchTo("en")}
        aria-current={locale === "en"}
        className={locale === "en" ? "text-ink font-semibold" : "text-muted hover:text-ink"}
      >
        EN
      </button>
    </div>
  );
}
