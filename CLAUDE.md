# Movie It

React 19 + Vite 7 + Tailwind 4 + React Router 7 app that browses TMDB movies, TV shows and people.
Run: `npm run dev` · Check: `npm run lint && npm test && npm run build`

## Orchestration (model routing)

Two workers. Opus is the lead: it plans, owns every opinion-driven decision, and reviews DeepSeek's output.

| Work | Model | How |
|---|---|---|
| Planning, task breakdown, reviews, design opinions | **Opus 5.5** (`claudeAgent` / `claude-opus-5-5`) | the lead session itself |
| **All design and frontend UI**: layout, visual style, tokens, typography, color, components' look, responsive behavior, motion, empty/loading/error states, copy | **Opus 5.5** | the lead does it directly, or native `Agent` |
| Everything else: data/API layer, hooks, routing plumbing, bug fixes, lint fixes, refactors with no visual change, config, tests, docs | **DeepSeek V4.1 Flash Free** (`opencode` / `opencode/deepseek-v4.1-flash-free`, `variant: high`) | `delegate_task` with `role: "implementation"` |

Rules:
1. If a task touches how something **looks or feels**, it is Opus work, even if it is small. When unsure, it is Opus work.
2. DeepSeek briefs must be self-contained (it gets no history): files to touch, files **not** to touch (no visual/className changes), acceptance check (`npm run lint && npm run build`).
3. Opus reviews every DeepSeek result (read the diff, run lint + build) before building on it. Small fixes Opus makes itself.
4. Don't run DeepSeek and Opus on the same files at once. Order: DeepSeek foundation first, then Opus design on top (or split by file).
5. **Automatic fallback:** if a DeepSeek task fails or stops because of a rate limit, quota, "free tier" limit, 429, or provider-unavailable error, do not retry DeepSeek and do not ask. Re-run the *remaining* work (check `git diff` for what it already finished) with Opus — `delegate_task` on `claudeAgent` / `claude-opus-5-5`, or do it in the lead session. Tell the user in one line that the fallback happened.
6. Opus should volunteer opinions: when it sees a better design or product direction, it says so and proposes it, not just executes.

## Project conventions
- TMDB access goes through `src/api/tmdb.js`, which calls the same-origin `/api/tmdb/*` proxy (Vite proxy in dev, `api/tmdb.js` Vercel function in prod). The token is `TMDB_TOKEN` in `.env` / Vercel env and must never reach the browser.
- Check: `npm run lint && npm test && npm run build` (CI runs the same on GitHub Actions).
- Tailwind 4 with theme tokens in `src/index.css` (`@theme`). No raw `rgb(...)` colors in classNames.

## Design system (owned by Opus)
- Tokens live in `src/index.css` `@theme`: `night` (page bg), `ink` (raised), `panel` (inputs/placeholders), `line`, `paper` (text), `muted`, `bulb` (the single amber accent, from the logo), `danger`.
- Type: `font-display` = Big Shoulders Display (titles, names, headings); body = Instrument Sans.
- The details-page hero (backdrop + uppercase display title + billing block) is the one loud element. Keep browse pages, forms and cards quiet.
- Shared pieces: `BrowsePage` (search + URL-synced genre/sort filters), `Spotlight` (home lead), `MediaRow`, `PosterCard`, `PersonCard`, `TitleDetails`, `WatchlistButton`, `States` (skeleton/error/empty), `SearchField`, `AuthCard`, grid in `src/lib/grid.js`.
- README screenshots live in `docs/screenshots/*.webp` — retake them after visible UI changes.
