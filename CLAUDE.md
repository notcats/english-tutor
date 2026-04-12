# CLAUDE.md

This file provides guidance for AI assistants working with the english-tutor codebase.

## Project Overview

AI Language Tutor is a single-page web application that helps users learn foreign languages through AI-powered exercises, vocabulary management, and interactive practice modes. The entire frontend lives in a single `index.html` file with no build process.

## Repository Structure

```
english-tutor/
└── index.html    # The entire application (HTML + embedded CSS + JavaScript)
```

There is no `package.json`, no build tooling, no TypeScript, and no test suite. All changes are made directly to `index.html`.

## Architecture

### Single-File SPA Pattern

The app is structured as a single HTML file with three sections:

1. **`<head>`** — Google Fonts imports, Google OAuth script, and all `<style>` blocks
2. **`<body>`** — A single `<div id="app"></div>` mount point
3. **`<script>`** — All application logic (state, rendering, API calls, event handlers)

### State Management

Global state is stored in a single object `S`. The UI is re-rendered by calling `render()`, which sets `document.getElementById('app').innerHTML`. This is a direct DOM manipulation pattern — no virtual DOM, no framework.

Key state fields:
```javascript
S = {
  scr: 'ob' | 'main',          // 'ob' = onboarding, 'main' = app
  step: 1 | 2 | 3,             // Onboarding step
  nl: string,                   // Native language code (e.g. 'ru')
  ll: string,                   // Learning language code (e.g. 'en')
  user: object | null,          // Authenticated user
  tok: string | null,           // JWT auth token (persisted in localStorage)
  tab: string,                  // Active tab: 'dict'|'practice'|'history'|'progress'|'groups'
  words: [],                    // User's vocabulary list
  hist: [],                     // Saved reading/story history
  grps: [],                     // Teacher groups
  sess: object,                 // Current practice session state
  pm: null | 'flash' | 'fill' | 'read' | 'text',  // Active practice mode
  prof: boolean,                // Profile modal open
  lp: string | false,           // Language picker modal (which picker is open)
  add: boolean,                 // Add word modal open
  addTab: 'manual' | 'photo' | 'list',  // Add word modal tab
  det: object | null,           // Word detail view
  filt: string,                 // Dictionary filter (level: A1–C2 or 'hard')
  srch: string,                 // Dictionary search query
  ho: boolean                   // Hard words only filter
}
```

### Rendering Pattern

```javascript
function render() {
  document.getElementById('app').innerHTML = S.scr === 'ob' ? renderOnboarding() : renderMain();
}
```

All UI functions return HTML strings. Event handlers are attached via `onclick`, `onchange`, etc. attributes in the HTML strings, calling global functions defined in `<script>`.

### API Communication

All API calls go through a helper function `api(method, path, body)` which:
- Adds the `Authorization: Bearer <token>` header when `S.tok` is set
- Returns parsed JSON
- Throws on non-OK HTTP responses

Backend endpoints (relative paths, same origin):

| Endpoint | Purpose |
|---|---|
| `POST /api/auth/google` | Google OAuth sign-in |
| `POST /api/auth/email` | Email/password auth |
| `GET /api/auth/me` | Fetch current user |
| `PATCH /api/auth/lang` | Update language preferences |
| `GET/POST/DELETE /api/words` | Vocabulary CRUD |
| `GET /api/stats` | User statistics |
| `GET/POST/DELETE /api/history` | Reading/story history |
| `GET/POST/DELETE /api/groups` | Teacher groups |
| `POST /api/ai/word` | Get word info (translation, level, examples) |
| `POST /api/ai/bulk` | Process multiple words at once |
| `POST /api/ai/image` | Extract words from a photo (OCR) |
| `POST /api/ai/exercise` | Generate fill-in-the-blank exercises |
| `POST /api/ai/text` | Generate reading comprehension text |
| `POST /api/ai/generate` | Generate a story using user's words |
| `POST /api/ai/extras` | Get synonyms and additional examples |

### Authentication

- JWT tokens stored in `localStorage` under the key `tok`
- Google OAuth2 client ID: `1071970252736-hnlmo0ikjrmm9r8ap9tkicdgdv1accl0.apps.googleusercontent.com`
- User roles: `student`, `teacher`, `admin`
- Daily AI request quota tracked per user (default: 50/day)

## Supported Languages

**Native languages (15):** Russian, Spanish, French, German, Chinese, Arabic, Portuguese, Turkish, Italian, Korean, Japanese, Polish, Ukrainian, Dutch, Hindi

**Learning languages (8):** English, German, French, Spanish, Italian, Chinese, Japanese, Korean

## UI/Styling Conventions

### Design System

- **Theme:** Dark UI with neon accents
- **Mobile-first:** Max content width 430px, centered on desktop
- **Fonts:** "Syne" (headings) + "DM Sans" (body) from Google Fonts

### CSS Variables (defined in `:root`)

Key color tokens:
- `--bg` — Main background (dark)
- `--surface` — Card/panel surface
- `--accent` — Primary accent: `#5effc4` (green)
- `--accent2` — Secondary accent: `#7c6fff` (purple)
- `--accent3` — Tertiary accent: `#ff6b9d` (pink)
- `--text` — Primary text
- `--muted` — Secondary/muted text

### CSS Architecture

All styles are inline in `<style>` tags within `index.html`. When adding styles:
- Use existing CSS variables rather than hardcoded colors
- Follow the BEM-ish class naming already in use (e.g. `.card`, `.card-title`, `.btn`, `.btn-primary`)
- Keep mobile viewport in mind — avoid layouts that break below 430px

## Key Application Flows

### Onboarding (3 steps)
1. Select native language
2. Select learning language
3. Sign in (Google OAuth or email/password) or register

### Dictionary Tab
- Words displayed as cards with translation, level badge, transcription
- Filter by CEFR level (A1–C2) or "hard words"
- Search by word text
- Add words via: manual entry, photo upload, or bulk list import
- AI enriches each word with: translation, transcription, example sentences, grammar notes, difficulty level

### Practice Modes
- **Flashcards (`flash`):** Flip cards to reveal translation
- **Fill the Blank (`fill`):** AI generates sentences with gaps
- **AI Reading (`read`):** AI generates a text; tap words for definitions
- **Generate Story (`text`):** AI writes a story incorporating the user's words

### Teacher Mode
- Create and manage student groups
- Generate invite codes for students
- View per-member vocabulary statistics

## Development Workflow

### Making Changes

Since there is no build step, editing `index.html` directly is all that's needed:

1. Edit `/home/user/english-tutor/index.html`
2. Test in a browser (open the file directly or serve with any static file server)
3. Commit and push

### Git Workflow

- Main branch: `main`
- Development branch convention: `claude/<description>` for AI-authored changes
- Commits use simple messages (historically: "Add files via upload")

### No Test Suite

There are no automated tests. Manual browser testing is the only verification method. When making changes:
- Test all affected UI states (loading, error, empty, populated)
- Test on a mobile viewport (430px width)
- Verify API calls in browser DevTools Network tab

## Important Conventions

1. **Do not introduce a build process** unless explicitly requested. Keep the project as a single HTML file.
2. **Do not add npm/Node.js dependencies.** All code must be vanilla JS runnable in the browser.
3. **Maintain the `render()` pattern.** All UI updates go through the single render function by mutating `S` then calling `render()`.
4. **Use the existing `api()` helper** for all fetch calls — don't use `fetch` directly.
5. **Keep the mobile-first layout.** The app is designed for 430px width; do not break this with wide fixed-width elements.
6. **Avoid localStorage keys beyond `tok`.** Session and UI state lives in `S` (in memory only).
7. **No inline `<script>` tags inside rendered HTML strings.** All JS logic belongs in the main `<script>` block.
8. **Token security:** Never log `S.tok` or embed it in URLs.
