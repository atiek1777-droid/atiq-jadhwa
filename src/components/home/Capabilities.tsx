import type { Dictionary } from "@/lib/i18n/get-dictionary";

export default function Capabilities({ dict }: { dict: Dictionary }) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-content px-6">
        <h2 className="font-arabic-display text-3xl md:text-4xl">{dict.capabilities.title}</h2>

        <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {dict.capabilities.items.map((item) => (
            <div key={item.title} className="rule pt-6">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
