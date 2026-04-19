const EmptyState = ({ query }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <p className="text-lg font-semibold text-gray-700">
        No books found{query ? ` for "${query}"` : ""}.
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Try a different search term.
      </p>
    </div>
  );
};

export default EmptyState;
