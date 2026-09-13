export function AdminLoading() {
  return <p className="py-10 text-center text-sm text-muted">Loading…</p>;
}

export function AdminError({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-secondary/30 bg-secondary/5 px-4 py-3 text-sm text-secondary">
      {message}
    </p>
  );
}

export function AdminEmpty({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border/60 py-12 text-center text-sm text-muted">
      {message}
    </div>
  );
}
