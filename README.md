# Books remote (`BooksApp`)

Micro-frontend child app for [micro-frontend-host](https://github.com/rk4rohankumar/micro-frontend-host). Searches the Google Books API with a debounced query, paging, result caching and rate-limit aware error handling. CRA 5 + CRACO 7 + webpack Module Federation, React 19, Tailwind 3, axios, framer-motion.

Deployed at <https://books-child-app.vercel.app/>.

## Data source

`GET https://www.googleapis.com/books/v1/volumes?q=…&startIndex=…&maxResults=21`

Anonymous requests are rate-limited hard by Google (HTTP 429). The app mitigates this by:

- caching every page in memory and `sessionStorage`, keyed `${query}|${startIndex}`, so re-renders, back-navigation and repeated searches never refetch;
- de-duplicating in-flight requests (StrictMode double effects fire one request);
- not searching for queries shorter than 2 characters, with a 400 ms debounce;
- detecting 429 specifically, showing a dedicated message and an escalating Retry cooldown (15 s → 30 s → 60 s) instead of auto-retrying.

### Optional API key

Set `REACT_APP_GOOGLE_BOOKS_KEY` (see `.env.example`) and it is appended as `&key=…` to every request, which lifts the anonymous quota. Create a key in Google Cloud Console with the Books API enabled. The key is baked into the bundle at build time, so restrict it by HTTP referrer.

```bash
cp .env.example .env.local   # then paste your key
```

## Run / build

```bash
npm install
npm start          # http://localhost:3000, standalone
npm run build      # production build in build/ (publicPath 'auto')
```

## How the host consumes it

- Scope name: `BooksApp`
- Remote entry: `https://books-child-app.vercel.app/remoteEntry.js`
- Exposed module: `./BooksApp` → `src/App` (default export, a self-contained React component)

The host injects `remoteEntry.js` at runtime, calls `container.init(__webpack_share_scopes__.default)` and then `container.get('./BooksApp')`.

### Shared singletons

`react`, `react-dom`, `framer-motion` and `axios` are declared `singleton: true` with `requiredVersion` from `package.json`, so the host's copies are used when loaded as a remote. Nothing is `eager`; `src/index.js` is an async boundary (`import('./bootstrap')`) so the shared modules resolve before the standalone app renders.
