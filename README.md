# Movie It

A small React app for browsing movies, TV shows and people using [TMDB](https://www.themoviedb.org/).

Stack: React 19, Vite 7, Tailwind CSS 4, React Router 7.

## Setup

1. Copy the env file and add your TMDB **read access token**
   (TMDB → Settings → API → "API Read Access Token"):

   ```bash
   cp .env.example .env
   ```

   Then set `VITE_TMDB_TOKEN` in `.env`.

2. Install dependencies and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint over the project |

## Notes

- `.env` is git-ignored. Never commit your TMDB token.
- Auth is a demo-only mock: accounts are stored in `localStorage`. Do not
  reuse it as real authentication.
