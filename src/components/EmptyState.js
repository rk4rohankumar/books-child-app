const EmptyState = ({ query }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <p className="text-lg font-semibold text-[color:var(--mfe-muted,#475569)]">
        No books found{query ? ` for "${query}"` : ""}.
      </p>
      <p className="text-sm text-[color:var(--mfe-muted,#475569)] mt-2">
        Try a different search term.
      </p>
    </div>
  );
};

export default EmptyState;
