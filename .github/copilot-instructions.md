## Repo quick orientation

- Purpose: A small React + Express demo platform implementing casino games (blackjack currently).
- Top-level layout: `frontend/` (Vite + React UI), `backend/` (Express API + game logic), `docs/`, and `tests/`.

## Quick start (what an AI agent needs to run locally)

- Frontend: `cd frontend && npm install && npm run dev` — Vite dev server (default origin: `http://localhost:5173`).
- Backend: there is no `start` script in `backend/package.json`; run with `cd backend && node server.js` (server listens on PORT or 5001). The backend uses `dotenv` so agents should respect `.env` if present.

## Architecture & important files

- frontend: `frontend/src/BlackjackGame.jsx` — UI fetches backend endpoints and expects JSON shapes returned by the server.
- backend: `backend/server.js` — Express API, CORS configured for the dev frontend origin. In-memory `games` map stores ephemeral game state keyed by UUID.
- game logic: `backend/game-logic/blackjack.js` — single `Blackjack` class implementing deck, deal, hit, stand, and hand-value logic. Export: `module.exports = { Blackjack }`.

## API contract & example

- POST /api/blackjack/start
  - Request: no payload required.
  - Response: { playerId, playerHand, dealerHand: [firstDealerCard], playerValue }

- POST /api/blackjack/action
  - Request body: { playerId, action }
  - Supported `action` values (server-side): `"hit"`, `"stand"`.
  - Response: { playerHand, dealerHand, playerValue, gameOver, winner }

Example: frontend calls `/api/blackjack/start` then uses returned `playerId` for further `/api/blackjack/action` calls. See `frontend/src/BlackjackGame.jsx` for concrete fetch usage patterns.

NOTABLE MISMATCH: UI includes a "double" button but backend `server.js` does not handle `action === 'double'`. Agents should either implement `double` server-side or remove UI usage.

## Project-specific conventions and patterns

- Backend uses CommonJS (`require`, `module.exports`); frontend is ESM (`import`). Keep module-style consistent when editing either area.
- State is ephemeral on the server (an in-memory `games` object). Any long-running or multi-instance work must replace this with a persistent store or a shared cache.
- Error handling: `server.js` returns JSON errors and logs to console. Follow that pattern when adding endpoints.

## Tests & CI

- There are no runnable test scripts in `backend/package.json`. The `frontend/package.json` contains lint and build scripts but CI/tests are not configured here. Look for `tests/` or `backend/game-logic` for small unit-test candidates (e.g., `blackjack` logic).

## Integration points & dependencies

- CORS: configured in `backend/server.js` for `http://localhost:5173`—update when changing the dev origin.
- Env: uses `dotenv` in backend; environment variables (e.g., PORT) control server behavior.
- Third-party libs used: `express`, `cors`, `dotenv`, `uuid` (backend); `vite`, `react`, `gh-pages` (frontend).

## Safe small tasks an AI agent can do immediately

- Add a `start` script to `backend/package.json` and/or add a `dev` script using `nodemon` for faster local iteration.
- Implement `double` action in `backend/server.js` (follow `playerHit()` then end round with dealer play) or remove the button from the UI.
- Add unit tests for `backend/game-logic/blackjack.js` (tests can live under `backend/tests` or top-level `tests/`).

## Where to look for examples

- API & state flow: `backend/server.js`
- Game rules & edge cases: `backend/game-logic/blackjack.js` (aces handling, dealer rules <17)
- Frontend integration: `frontend/src/BlackjackGame.jsx` (fetch patterns, UI expectations)

If anything here is unclear or you want the instructions to emphasize a different area (deploy, tests, feature backlog), tell me which section to expand or correct and I'll update the file.
