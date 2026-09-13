"use client";

interface AdminToolbarProps {
  title: string;
  search: string;
  onSearchChange: (v: string) => void;
  onCreate?: () => void;
  createLabel?: string;
}

export default function AdminToolbar({
  title,
  search,
  onSearchChange,
  onCreate,
  createLabel = "New",
}: AdminToolbarProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <h1 className="font-arabic-display text-2xl">{title}</h1>
      <div className="flex items-center gap-3">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search…"
          className="rounded-lg border border-border/60 bg-paper px-3 py-2 text-sm"
        />
        {onCreate && (
          <button
            onClick={onCreate}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            {createLabel}
          </button>
        )}
      </div>
    </div>
  );
}
