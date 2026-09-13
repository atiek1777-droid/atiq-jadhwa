import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

export default function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-canvas">
      <div className="mx-auto max-w-content px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-arabic-display text-2xl">{dict.brand.name}</p>
            <p className="mt-3 max-w-sm text-sm text-muted">{dict.brand.tagline}</p>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <Link href={`/${locale}/services`} className="text-ink/80 hover:text-ink">
              {dict.nav.services}
            </Link>
            <Link href={`/${locale}/work`} className="text-ink/80 hover:text-ink">
              {dict.nav.work}
            </Link>
            <Link href={`/${locale}/nextra-ai`} className="text-ink/80 hover:text-ink">
              NEXTRA-AI
            </Link>
            <Link href={`/${locale}/insights`} className="text-ink/80 hover:text-ink">
              {dict.nav.insights}
            </Link>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <a href={buildWhatsAppUrl()} className="text-ink/80 hover:text-ink">
              {dict.nav.whatsapp}
            </a>
            <Link href={`/${locale}/contact`} className="text-ink/80 hover:text-ink">
              {dict.nav.contact}
            </Link>
            <Link href={`/${locale}/privacy`} className="text-ink/80 hover:text-ink">
              Privacy
            </Link>
            <Link href={`/${locale}/terms`} className="text-ink/80 hover:text-ink">
              Terms
            </Link>
          </div>
        </div>

        <div className="rule mt-10 flex flex-col gap-2 pt-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <span>
            © {year} {dict.brand.name} — {dict.footer.rights}
          </span>
          <span>{dict.footer.madeWith}</span>
        </div>
      </div>
    </footer>
  );
}
