import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import Button from "@/components/ui/Button";

export default function NextraTeaser({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-content px-6">
        <div className="grid gap-8 rounded-2xl border border-border/50 bg-paper p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12">
          <div>
            <h2 className="font-arabic-display text-2xl md:text-3xl">{dict.nextra.title}</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{dict.nextra.body}</p>
            <div className="mt-4 flex flex-col gap-1 text-xs text-muted md:flex-row md:gap-6">
              <span>{dict.nextra.roles.atiq}</span>
              <span>{dict.nextra.roles.nextra}</span>
            </div>
          </div>
          <Button href={`/${locale}/nextra-ai`} variant="secondary">
            {dict.nextra.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
