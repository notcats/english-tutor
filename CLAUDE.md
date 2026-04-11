# CLAUDE.md — English Tutor Project Guide

This file gives AI assistants the context needed to work effectively on this codebase.

---

## Project Overview

English Tutor is a mobile-first, AI-powered vocabulary learning web app with a companion Chrome extension. Users add words (manually or via the browser extension), get AI-generated definitions/examples, and practice through multiple exercise modes. Teachers can create groups and track student progress.

**Live deployment:** Railway (`https://7b0b.up.railway.app`)

---

## Repository Structure

```
english-tutor/
├── server.js              # Express backend — all routes in one file
├── app.js                 # Frontend SPA — all UI logic in one file
├── index.html             # HTML shell served by Express
├── style.css              # All styles (CSS variables for theming)
├── server-1.js            # Legacy/backup server version (do not modify)
├── index-8.html           # Legacy/backup HTML (do not modify)
├── .env.example           # Required environment variables
├── package.json           # Node.js deps and scripts
└── chrome-extension/
    ├── manifest.json      # Manifest V3 extension config
    ├── popup.html/js      # Extension popup (login + user profile)
    ├── content.js/css     # In-page word selection → tooltip
    ├── background.js      # Service worker (minimal)
    └── generate-icons.js  # Utility to regenerate PNG icons
```

**Active files:** `server.js`, `app.js`, `style.css`, `index.html`, and everything under `chrome-extension/` (except `generate-icons.js` which is a one-off utility).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js + Express 4 |
| Database | PostgreSQL (via `pg` package) |
| Auth | JWT (`jsonwebtoken`) |
| AI | Groq API — model `llama-3.3-70b-versatile` |
| Frontend | Vanilla JS + CSS (no framework, no build step) |
| Browser Extension | Chrome Manifest V3 |
| Hosting | Railway |

---

## Development Setup

### Prerequisites
- Node.js (any recent LTS)
- PostgreSQL running locally

### Steps

```bash
npm install
cp .env.example .env   # fill in DB credentials, JWT_SECRET, GROQ_KEY
npm run dev            # starts server with --watch (auto-reload)
```

Open `http://localhost:3000`.

### Environment Variables (`.env`)

| Variable | Required | Notes |
|----------|----------|-------|
| `DB_HOST` | Yes | PostgreSQL host (default: `localhost`) |
| `DB_PORT` | Yes | PostgreSQL port (default: `5432`) |
| `DB_NAME` | Yes | Database name |
| `DB_USER` | Yes | Database user |
| `DB_PASS` | Yes | Database password |
| `JWT_SECRET` | Yes | Random secret for signing tokens |
| `GROQ_KEY` | Yes | Get free at https://console.groq.com |
| `PORT` | No | Server port (default: `3000`) |

The database schema is **auto-created on startup** — no migrations needed. All tables, indexes, and default data are initialized in `server.js` inside the `initDb()` function.

---

## npm Scripts

| Command | What it does |
|---------|-------------|
| `npm start` | `node server.js` — production |
| `npm run dev` | `node --watch server.js` — development with auto-reload |

There is **no build step** for the frontend. Static files are served directly by Express.

---

## Architecture

### Backend (`server.js`)

All routes live in one file, organized into sections separated by `─────` comment dividers:

1. **DB init** — `initDb()` creates all PostgreSQL tables and indexes on startup
2. **Auth middleware** — `auth` (required) and `optAuth` (optional, supports guest mode)
3. **Auth routes** — `/api/auth/*`
4. **Words routes** — `/api/words/*`
5. **Stats/streaks routes** — `/api/stats/*`
6. **History routes** — `/api/history/*`
7. **Groups routes** — `/api/groups/*`
8. **AI routes** — `/api/ai/*`
9. **Admin routes** — `/api/admin/*`
10. **Static serving** — serves `index.html` for all non-API routes (SPA fallback)

**Key design patterns:**
- No ORM — raw SQL queries via `pg` Pool
- `word_cache` table caches Groq responses to reduce API calls
- Daily AI limit per user tracked in `users.daily_ai_count` + `daily_ai_reset` date
- Rate limiting: AI routes capped at 30 req/min via `express-rate-limit`
- All AI calls go through `callGroq(prompt)` helper which returns parsed JSON

### Frontend (`app.js`)

Single-file SPA using a central state object `S` and a full re-render pattern:

```js
// State object — source of truth
const S = {
  screen, user, words, theme, langs, tab, modals, ...
};

// Re-render approach: change S, then call render functions
function rDict() { /* re-renders dictionary tab */ }
function rPrac() { /* re-renders practice tab */ }
// etc.
```

**UI flow:**
- Onboarding wizard: screens `ob1` → `ob5` (language select → account creation)
- Main app: five tabs — Dictionary, Practice, History, Progress, Groups
- Modals for word detail, language picker, profile, bulk upload

**Abbreviated naming is intentional** — `S` = state, `w` = word, `u` = user, `rDict` = render dictionary, `wli` = word list item (CSS class). Do not rename these.

### Chrome Extension

- Extension popup authenticates against the production API (`https://7b0b.up.railway.app`)
- `content.js` injects a tooltip on word selection anywhere on the web
- The manifest `host_permissions` is locked to the Railway production URL

---

## Database Schema

Tables created automatically in `initDb()`:

| Table | Purpose |
|-------|---------|
| `users` | Accounts, auth, language prefs, daily AI limits |
| `words` | User vocabulary words with practice stats |
| `streaks` | Daily learning streak tracking |
| `history` | Saved reading texts and activity log |
| `groups` | Teacher-managed student groups |
| `group_members` | Many-to-many: users ↔ groups |
| `group_words` | Words shared to a group |
| `sessions` | Learning session log |
| `word_cache` | Cached AI definitions keyed by `word + lang` |

**Column naming:** `snake_case` in DB, `camelCase` in JS (mapped manually in query results).

---

## API Reference

All routes are prefixed `/api/`. Auth routes accept `Authorization: Bearer <token>`.

### Auth
- `POST /api/auth/email` — register or login (email + password + optional lang prefs)
- `GET /api/auth/me` — current user profile
- `PATCH /api/auth/lang` — update language preferences

### Words
- `GET /api/words` — list user's words
- `POST /api/words` — add one word (triggers AI lookup)
- `POST /api/words/bulk` — add multiple words
- `PATCH /api/words/:id` — update practice stats (score, level)
- `DELETE /api/words/:id` — delete word

### AI (rate-limited, requires auth or optAuth)
- `POST /api/ai/word` — define a word (cached)
- `POST /api/ai/extras` — synonyms, more examples
- `POST /api/ai/exercise` — generate fill-in-blank exercise
- `POST /api/ai/text` — generate reading passage from words
- `POST /api/ai/generate` — generate story using word list
- `POST /api/ai/bulk` — batch define multiple words
- `POST /api/ai/analyze` — analyze text for vocab and grammar

### Stats
- `GET /api/stats` — user statistics + streak info
- `POST /api/stats/session` — record a completed learning session

### History
- `GET /api/history` — recent reading history
- `POST /api/history` — save text to history
- `DELETE /api/history/:id` — delete entry

### Groups
- `GET /api/groups` — list groups user belongs to
- `POST /api/groups` — create group (user becomes teacher)
- `POST /api/groups/join` — join group by invite code
- `GET /api/groups/:id/members` — member list with stats
- `POST /api/groups/:id/words` — push words to group

### Admin (role = `admin` required)
- `GET /api/admin/stats` — system-wide stats
- `PATCH /api/admin/user/:id` — change role / AI limits
- `GET /api/admin/cache` — view word cache
- `DELETE /api/admin/cache/:id` — clear cache entry

---

## CSS Conventions

`style.css` uses CSS custom properties for theming:

```css
/* Dark theme (default) */
--bg   /* page background */
--sur  /* surface / card background */
--ac   /* accent color */
--t    /* primary text */
--danger  /* red for errors/delete */

/* Applied via: */
[data-theme="light"] { --bg: ...; --ac: ...; }
```

Class naming uses short abbreviations: `wli` (word list item), `fcb` (flashcard back), `rb` (rounded box), `fab` (floating action button). Follow this pattern for any new classes.

Max-width is **430px** — this is a phone-sized app. Do not widen the layout.

---

## User Roles

| Role | Capabilities |
|------|-------------|
| `student` | Personal word list, practice, history |
| `teacher` | All student features + create/manage groups |
| `admin` | All features + admin dashboard |

---

## Language Support

**Native languages** (16): English, Russian, Spanish, French, German, Portuguese, Italian, Chinese, Japanese, Korean, Arabic, Turkish, Polish, Ukrainian, Dutch, Swedish.

**Learning languages** (8): English, Spanish, French, German, Italian, Portuguese, Japanese, Korean.

Language codes are stored in `users.native_lang` and `users.learn_lang`. The frontend `LANGS` and `LLANGS` objects map codes to display names. The `I18N` object provides UI string translations.

---

## Key Conventions & Gotchas

1. **No tests exist.** There is no test framework. Manual testing only.

2. **Single-file backend and frontend.** All backend logic is in `server.js`; all frontend logic is in `app.js`. Do not split into separate modules unless explicitly asked.

3. **No build/bundle step.** Changes to `app.js`, `style.css`, or `index.html` are served immediately. No transpilation, no minification.

4. **Abbreviated variable names in `app.js` are intentional.** `S`, `w`, `u`, etc. keep the file compact. Match this style for new code.

5. **AI responses are always JSON.** `callGroq()` on the backend always instructs the model to respond with JSON and parses it. New AI endpoints must follow the same pattern.

6. **Word cache is keyed by `word + lang`.** When adding new AI endpoints that look up words, check `word_cache` first and insert results after.

7. **Daily AI limits.** Each user has `daily_ai_count` and `daily_ai_reset`. The backend increments and enforces limits on every `/api/ai/*` call. Do not bypass this when adding new AI routes.

8. **Legacy files (`server-1.js`, `index-8.html`) are NOT active.** Do not modify them; they are historical snapshots.

9. **Chrome extension uses production URL.** The extension's `host_permissions` and hardcoded API base URL point to `https://7b0b.up.railway.app`. When testing the extension locally, you must temporarily change this URL.

10. **Database schema auto-migrates on startup.** The `initDb()` function uses `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS`, so adding new tables/columns should follow the same pattern (add to `initDb()`, not as separate migration files).

11. **Rate limiting is per-IP on AI routes** (30 req/min). Keep this in mind when adding new `/api/ai/*` endpoints.

12. **`optAuth` middleware** allows unauthenticated requests (guest mode). Use `auth` for routes that absolutely require a logged-in user.

---

## Git Workflow

- Development branch for AI-assisted work: `claude/add-claude-documentation-CQpPi`
- Main branch: `main`
- Commit messages are short and descriptive (see `git log` for style)
- No CI/CD pipeline is configured
