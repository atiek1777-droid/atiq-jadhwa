import type { Dictionary } from "@/lib/i18n/get-dictionary";

/**
 * Visual "Diagnose -> Cost -> Control -> Organize -> Improve -> Grow" flow.
 * This IS a genuine sequence (each stage feeds the next), so numbering here
 * is justified per the design brief — unlike the general capabilities grid.
 */
export default function RestaurantFramework({ dict }: { dict: Dictionary }) {
  const stages = dict.restaurant.framework;

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max gap-0 border-y border-border/50">
        {stages.map((stage, i) => (
          <div key={stage} className="flex items-center">
            <div className="flex flex-col items-center px-8 py-10">
              <span className="font-arabic-accent text-3xl text-secondary/80">{i + 1}</span>
              <span className="mt-2 whitespace-nowrap text-sm font-medium">{stage}</span>
            </div>
            {i < stages.length - 1 && <div className="h-px w-10 bg-border/60 md:w-16" />}
          </div>
        ))}
      </div>
    </div>
  );
}
