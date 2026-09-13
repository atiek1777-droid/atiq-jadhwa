import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import Button from "@/components/ui/Button";
import Portrait from "./Portrait";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

export default function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="mx-auto max-w-content px-6 pb-16 pt-10 md:pb-24 md:pt-16">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="animate-reveal-up">
          <p className="text-sm text-secondary">{dict.hero.eyebrow}</p>
          <h1 className="mt-4 font-arabic-display text-4xl leading-[1.15] md:text-5xl lg:text-6xl">
            {dict.hero.headline}
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted md:text-lg">{dict.hero.sub}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href={`/${locale}/work`} variant="primary">
              {dict.hero.ctaPrimary}
            </Button>
            <Button
              href={buildWhatsAppUrl()}
              variant="secondary"
            >
              {dict.hero.ctaSecondary}
            </Button>
          </div>
        </div>

        <Portrait />
      </div>
    </section>
  );
}
