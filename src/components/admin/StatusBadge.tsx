export default function StatusBadge({ active, onLabel, offLabel }: { active: boolean; onLabel: string; offLabel: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        active ? "bg-primary/10 text-primary" : "bg-border/30 text-muted"
      }`}
    >
      {active ? onLabel : offLabel}
    </span>
  );
}
