import { useEffect, useState, useCallback, useRef } from "react";

import "tailwindcss/tailwind.css";

import BookCard from "./components/BookCard";
import Loader from "./components/Loader";
import ErrorState from "./components/ErrorState";
import EmptyState from "./components/EmptyState";
import Pagination from "./components/Pagination";
import useDebouncedValue from "./hooks/useDebouncedValue";
import {
  fetchBooks,
  getCachedBooks,
  PAGE_SIZE,
  MIN_QUERY_LENGTH,
  RateLimitError,
} from "./lib/googleBooks";

const DEFAULT_QUERY = "art";
const DEBOUNCE_MS = 400;
// Escalating cooldown after each consecutive 429 so Retry can't hammer the API.
const BACKOFF_MS = [15000, 30000, 60000];

const BooksPage = () => {
  const [query, setQuery] = useState("");
  // Page is scoped to the query it was set for, so a new query implicitly starts at page 0
  // without an extra render/fetch cycle.
  const [pageState, setPageState] = useState({ query: DEFAULT_QUERY, page: 0 });
  const [result, setResult] = useState({ items: [], totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryAfter, setRetryAfter] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const rateLimitHits = useRef(0);

  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);
  const trimmed = debouncedQuery.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < MIN_QUERY_LENGTH;
  const effectiveQuery = trimmed.length === 0 ? DEFAULT_QUERY : trimmed;
  const page = pageState.query === effectiveQuery ? pageState.page : 0;
  const startIndex = page * PAGE_SIZE;

  useEffect(() => {
    if (tooShort) return undefined;

    const cached = getCachedBooks(effectiveQuery, startIndex);
    if (cached) {
      setResult(cached);
      setError(null);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchBooks(effectiveQuery, startIndex)
      .then((data) => {
        if (cancelled) return;
        setResult(data);
        rateLimitHits.current = 0;
        setRetryAfter(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setResult({ items: [], totalItems: 0 });
        if (err instanceof RateLimitError) {
          const step = BACKOFF_MS[Math.min(rateLimitHits.current, BACKOFF_MS.length - 1)];
          rateLimitHits.current += 1;
          setRetryAfter(Date.now() + step);
          setError(err.message);
        } else {
          setError("Failed to fetch book data.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [effectiveQuery, startIndex, reloadKey, tooShort]);

  const handleRetry = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  const handlePrev = useCallback(() => {
    setPageState({ query: effectiveQuery, page: Math.max(0, page - 1) });
  }, [effectiveQuery, page]);

  const handleNext = useCallback(() => {
    setPageState({ query: effectiveQuery, page: page + 1 });
  }, [effectiveQuery, page]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const { items: books, totalItems: total } = result;

  let status;
  if (tooShort) {
    status = `Type at least ${MIN_QUERY_LENGTH} characters to search.`;
  } else if (loading) {
    status = "Searching...";
  } else if (error) {
    status = "Search unavailable.";
  } else if (total > 0) {
    status = `${total.toLocaleString()} result${total === 1 ? "" : "s"} for "${effectiveQuery}"`;
  } else {
    status = `No results for "${effectiveQuery}"`;
  }

  let content;
  if (tooShort) {
    content = null;
  } else if (loading) {
    content = <Loader />;
  } else if (error) {
    content = <ErrorState message={error} onRetry={handleRetry} retryAfter={retryAfter} />;
  } else if (books.length === 0) {
    content = <EmptyState query={effectiveQuery} />;
  } else {
    content = (
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
    );
  }

  return (
    <section aria-labelledby="books-heading" className="max-w-6xl mx-auto p-4">
      <h1 id="books-heading" className="text-3xl font-bold text-center mb-6">
        Books Collection
      </h1>

      <form role="search" onSubmit={handleSubmit} className="mb-6 flex justify-center">
        <label htmlFor="book-search" className="sr-only">
          Search books
        </label>
        <input
          id="book-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search books (default: ${DEFAULT_QUERY})`}
          aria-describedby="book-search-hint"
          className="w-full max-w-md px-4 py-2 rounded-md border border-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          autoComplete="off"
        />
        <p id="book-search-hint" className="sr-only">
          Results update as you type. Enter at least {MIN_QUERY_LENGTH} characters.
        </p>
      </form>

      <p className="text-sm text-gray-700 text-center mb-4" aria-live="polite">
        {status}
      </p>

      {content}
    </section>
  );
};

export default BooksPage;
