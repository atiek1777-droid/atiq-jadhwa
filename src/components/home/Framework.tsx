import type { Dictionary } from "@/lib/i18n/get-dictionary";

const keys = ["build", "improve", "grow"] as const;

export default function Framework({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-t border-border/50 bg-paper py-20">
      <div className="mx-auto max-w-content px-6">
        <h2 className="font-arabic-display text-3xl md:text-4xl">{dict.framework.title}</h2>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border/50 bg-border/40 md:grid-cols-3">
          {keys.map((key, i) => (
            <div key={key} className="bg-paper p-8 md:p-10">
              <span className="font-arabic-accent text-5xl text-primary/90">{i + 1}</span>
              <h3 className="mt-4 font-arabic-display text-2xl">{dict.framework[key].label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{dict.framework[key].desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
