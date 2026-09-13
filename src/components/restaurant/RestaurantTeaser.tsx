import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import Button from "@/components/ui/Button";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

export default function RestaurantTeaser({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="border-t border-border/50 bg-ink py-20 text-canvas">
      <div className="mx-auto max-w-content px-6">
        <p className="text-sm text-accent">
          {locale === "ar" ? "تخصص رئيسي" : "A core specialty"}
        </p>
        <h2 className="mt-4 max-w-2xl font-arabic-display text-3xl md:text-4xl">
          {dict.restaurant.titleAr}
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-canvas/70">{dict.restaurant.intro}</p>

        <div className="mt-8 flex flex-wrap gap-3 text-xs">
          {dict.restaurant.framework.map((stage, i) => (
            <span
              key={stage}
              className="rounded-full border border-canvas/25 px-4 py-2 text-canvas/80"
            >
              {stage}
              {i < dict.restaurant.framework.length - 1 ? "" : ""}
            </span>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button href={`/${locale}/services/restaurant-business-solutions`} variant="accent">
            {dict.restaurant.cta}
          </Button>
          <Button href={buildWhatsAppUrl()} variant="text" className="text-canvas">
            {dict.nav.whatsapp}
          </Button>
        </div>
      </div>
    </section>
  );
}
