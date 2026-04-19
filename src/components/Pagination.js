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
        className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <p className="text-sm text-gray-600" aria-live="polite">
        {total > 0
          ? `Showing ${start}-${end} of ${total.toLocaleString()}`
          : "No results"}
      </p>
      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
