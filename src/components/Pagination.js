const Pagination = ({ page, pageSize, total, onPrev, onNext }) => {
  const start = total === 0 ? 0 : page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, total);
  const hasPrev = page > 0;
  const hasNext = end < total;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-4 mt-8"
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={!hasPrev}
        className="px-4 py-2 rounded-md bg-[var(--mfe-surface,#ffffff)] border border-[color:var(--mfe-border,#e2e8f0)] text-[color:var(--mfe-muted,#475569)] hover:bg-[var(--mfe-sunken,#f8fafc)] focus:outline-none focus:ring-2 focus:ring-[color:var(--mfe-accent,#047857)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <p className="text-sm text-[color:var(--mfe-muted,#475569)]" aria-live="polite">
        {total > 0
          ? `Showing ${start}-${end} of ${total.toLocaleString()}`
          : "No results"}
      </p>
      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        className="px-4 py-2 rounded-md bg-[var(--mfe-surface,#ffffff)] border border-[color:var(--mfe-border,#e2e8f0)] text-[color:var(--mfe-muted,#475569)] hover:bg-[var(--mfe-sunken,#f8fafc)] focus:outline-none focus:ring-2 focus:ring-[color:var(--mfe-accent,#047857)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
