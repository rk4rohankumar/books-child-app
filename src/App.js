import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import 'tailwindcss/tailwind.css';

import BookCard from "./components/BookCard";
import Loader from "./components/Loader";
import ErrorState from "./components/ErrorState";
import EmptyState from "./components/EmptyState";
import Pagination from "./components/Pagination";
import useDebouncedValue from "./hooks/useDebouncedValue";

const PAGE_SIZE = 21;
const DEFAULT_QUERY = "art";

const BooksPage = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const debouncedQuery = useDebouncedValue(query, 300);
  const effectiveQuery = (debouncedQuery.trim() || DEFAULT_QUERY);

  useEffect(() => {
    setPage(0);
  }, [debouncedQuery]);

  useEffect(() => {
    let cancelled = false;
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "https://www.googleapis.com/books/v1/volumes",
          {
            params: {
              q: effectiveQuery,
              startIndex: page * PAGE_SIZE,
              maxResults: PAGE_SIZE,
            },
          }
        );
        if (cancelled) return;
        setBooks(response.data?.items ?? []);
        setTotal(response.data?.totalItems ?? 0);
      } catch (err) {
        if (cancelled) return;
        setError("Failed to fetch book data.");
        setBooks([]);
        setTotal(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchBooks();
    return () => {
      cancelled = true;
    };
  }, [effectiveQuery, page, reloadKey]);

  const handleRetry = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  const handlePrev = useCallback(() => {
    setPage((p) => Math.max(0, p - 1));
  }, []);

  const handleNext = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Books Collection
      </h1>

      <form
        role="search"
        onSubmit={handleSubmit}
        className="mb-6 flex justify-center"
      >
        <label htmlFor="book-search" className="sr-only">
          Search books
        </label>
        <input
          id="book-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search books (default: ${DEFAULT_QUERY})`}
          className="w-full max-w-md px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          autoComplete="off"
        />
      </form>

      <p className="text-sm text-gray-600 text-center mb-4" aria-live="polite">
        {loading
          ? "Searching..."
          : total > 0
          ? `${total.toLocaleString()} result${total === 1 ? "" : "s"} for "${effectiveQuery}"`
          : `No results for "${effectiveQuery}"`}
      </p>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorState message={error} onRetry={handleRetry} />
      ) : books.length === 0 ? (
        <EmptyState query={effectiveQuery} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </>
      )}
    </main>
  );
};

export default BooksPage;
