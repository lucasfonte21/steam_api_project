# Social Steam Stats Tracker

Personal resume project. Users log in with Steam, sync their library and playtime, view their own stats, and (later) compare with friends. Polish matters more than feature count.

## Stack
- `server/`: Node, Express 5, Mongoose (MongoDB), passport-steam, node-cron. CommonJS.
- `client/`: React 19, Vite, Tailwind v4 (`@tailwindcss/vite`), React Router, TanStack Query, Recharts, `motion`, lucide-react. Plain JS (no TypeScript).
- Dev: server on `:5000`, client on `:5173`. Session cookie auth, CORS with credentials.

## Code style
- Server: 4-space indent, single quotes, semicolons, `const` arrow functions, async/await with try/catch, `module.exports` at the bottom. Layered folders: `config/ models/ routes/ services/ jobs/ scripts/`.
- Client: 2-space indent, single quotes, semicolons, function components, one component per file in `components/` or `pages/`. Use Tailwind classes plus the theme tokens in `src/index.css`; avoid ad-hoc hex colors.
- Comments sparse; explain why, not what. Short plain commit messages.
- Commit often: one commit per logical feature or fix, after build and lint pass. Do not push unless asked.

## Design direction
- Steam colors (navy/slate backgrounds, light-blue accent), inspired by stats.fm. Minimal and clean, with a subtle glow on accents and hover states.
- Dark mode only for now. One consistent color scheme, no per-game theming.
- Sharp edges: no border radius. Cozy but clean font (Figtree).
- Left sidebar on desktop; bottom tab bar on mobile. Build responsive from the start.
- Game grid uses Steam header images (`https://cdn.akamai.steamstatic.com/steam/apps/{appId}/header.jpg`), Nike-store-style cover grid.
- List pages show little data, mostly rankings. Dense data lives on the individual game page.
- Subtle animations only; charts animate in.
- Main view: most-played games, time-range dropdown (default last 2 weeks), sortable.

## Charts (planned)
- Playtime over time (per game / total): line/area chart, stock-style, with range selector.
- Top games: ranked horizontal bars.
- Recent activity (2 weeks): bar chart by day.
- Playtime by time of day / weekday: heatmap.
- Library breakdown (played vs unplayed backlog): donut.
- Compare with friend (later): dual-line chart and side-by-side bars.

## Product decisions
- Profile existence is public. Stats are toggleable between public and friends-only.
- Friends: auto-link Steam friends who already have accounts; invite links for those who don't.
- Own stats first; head-to-head page and per-game friend rankings later.
- Low priority for now: achievements, year-in-review, badges, personality summary.

## Known issues / todo
- Sessions use the in-memory store (logout on restart); switch to connect-mongo.
- Sync does per-game writes; move to `bulkWrite`. Snapshots are written on every sync; consider writing only on change.
- `failureRedirect: '/'` in `routes/auth.js` points at the server root, not the client.
- Need read endpoints: library, per-game history, top games by range.
