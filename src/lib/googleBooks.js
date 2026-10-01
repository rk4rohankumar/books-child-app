import axios from "axios";

export const API_URL = "https://www.googleapis.com/books/v1/volumes";
export const PAGE_SIZE = 21;
export const MIN_QUERY_LENGTH = 2;

const STORAGE_PREFIX = "books-app:";
const API_KEY = process.env.REACT_APP_GOOGLE_BOOKS_KEY;

export const hasApiKey = Boolean(API_KEY);

const memoryCache = new Map();
const inflight = new Map();

export class RateLimitError extends Error {
  constructor() {
    super(
      hasApiKey
        ? "Google Books is rate-limiting requests right now. Try again in a minute."
        : "Google Books is rate-limiting anonymous requests right now. Try again in a minute."
    );
    this.name = "RateLimitError";
    this.status = 429;
  }
}

const cacheKey = (query, startIndex) => `${query}|${startIndex}`;

const readSession = (key) => {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeSession = (key, value) => {
  try {
    window.sessionStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable; the in-memory cache still works.
  }
};

export const normalizeThumbnail = (url) => {
  if (!url) return null;
  try {
    const u = new URL(url.replace(/^http:\/\//, "https://"));
    u.protocol = "https:";
    u.searchParams.delete("edge");
    u.searchParams.set("zoom", "1");
    return u.toString();
  } catch {
    return null;
  }
};

const slimBook = (item) => {
  const info = item?.volumeInfo ?? {};
  return {
    id: item?.id ?? info.title,
    title: info.title ?? "Untitled",
    authors: info.authors?.join(", ") ?? "Unknown",
    description: info.description ?? "No description available.",
    thumbnail: normalizeThumbnail(info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail),
    infoLink: info.infoLink ?? null,
  };
};

export const getCachedBooks = (query, startIndex) => {
  const key = cacheKey(query, startIndex);
  if (memoryCache.has(key)) return memoryCache.get(key);
  const stored = readSession(key);
  if (stored) memoryCache.set(key, stored);
  return stored;
};

export const fetchBooks = (query, startIndex) => {
  const cached = getCachedBooks(query, startIndex);
  if (cached) return Promise.resolve(cached);

  const key = cacheKey(query, startIndex);
  if (inflight.has(key)) return inflight.get(key);

  const params = { q: query, startIndex, maxResults: PAGE_SIZE };
  if (API_KEY) params.key = API_KEY;

  const request = axios
    .get(API_URL, { params })
    .then(({ data }) => {
      const result = {
        items: (data?.items ?? []).map(slimBook),
        totalItems: data?.totalItems ?? 0,
      };
      memoryCache.set(key, result);
      writeSession(key, result);
      return result;
    })
    .catch((err) => {
      if (err?.response?.status === 429) throw new RateLimitError();
      throw err;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, request);
  return request;
};
