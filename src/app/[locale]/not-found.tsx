import Link from "next/link";
import { defaultLocale } from "@/lib/i18n/config";

// Locale-aware not-found for anything under /[locale]/... — the [locale]
// layout (Nav/Footer/AI launcher) still wraps this since it's nested inside it.
export default function LocaleNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-content flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-arabic-display text-3xl">الصفحة غير موجودة</h1>
      <p className="text-muted">الرابط الذي وصلت إليه غير متاح.</p>
      <Link href={`/${defaultLocale}`} className="underline underline-offset-4">
        العودة للرئيسية
      </Link>
    </div>
  );
}
