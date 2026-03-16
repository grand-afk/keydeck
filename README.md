# ⌨️ KeyDeck — Keyboard Shortcut Trainer

A spaced-repetition flashcard app for building genuine muscle memory around keyboard shortcuts — on **Mac and Windows**.

Built with React + Vite. Runs entirely in the browser. No backend, no account needed.

---

## Apps covered

| App | Shortcuts |
|-----|-----------|
| 📊 Excel | Navigation, formulas, formatting, workbook management |
| 📽️ PowerPoint | Slides, text, objects, presenter mode |
| 🔵 Google Workspace | Docs, Sheets, Slides |
| 🖥️ Desktop | Windows snapping, virtual desktops, system shortcuts |
| 💬 Slack | Navigation, messaging, formatting, calls |
| 🌐 Vimium | Browser navigation, tabs, link hints, find mode |
| 🔮 Obsidian | Notes, editor, navigation, layout |
| 🔖 Bookmarks | Your custom shortcuts (edit `src/data/custom.json`) |

---

## How the learning algorithm works

KeyDeck uses the **SM-2 algorithm** — the same one that powers Anki — to schedule each shortcut at the optimal interval for long-term retention.

After revealing a card, rate your recall honestly:

| Rating | Meaning | Effect |
|--------|---------|--------|
| **Again** | Complete blank / wrong | Resets the card to day 1 |
| **Hard** | Got it with significant effort | Small interval increase |
| **Good** | Correct after a small pause | Normal interval growth |
| **Easy** | Instant, effortless recall | Larger interval jump |

The algorithm tracks an **ease factor** per card. Cards you find easy get longer and longer intervals; cards that trip you up stay in the short-term rotation until they stick.

---

## Modes

### 🃏 Practice
Your daily review queue. Shows only cards that are due today. When the queue is empty, you're done for the day. Come back tomorrow.

### 🎲 Discover
Random shortcuts drawn from the full library — prioritising ones you've never seen. Great for discovering shortcuts you didn't know existed. Rating a Discover card automatically adds it to your Practice deck.

### 🔍 Search
Full-text search across every shortcut. Filter by app. Useful when you need to look something up quickly without disrupting your practice session.

### 📖 Help
This document, rendered inside the app.

---

## Switching between Mac and Windows

Use the **🍎 / ⊞** toggle in the top bar. Your progress is stored against the shortcut ID, not the platform, so switching doesn't reset anything.

---

## Filtering by app

Tap any app chip in the top bar to practise only that application's shortcuts. Multi-select is supported. Tap **All** to return to the full deck.

---

## Getting started

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Deploy to GitHub Pages

1. Build: `npm run build`
2. Push the `dist/` folder to your `gh-pages` branch, or use the [gh-pages](https://www.npmjs.com/package/gh-pages) package:

```bash
npm install --save-dev gh-pages
# Add to package.json scripts: "deploy": "gh-pages -d dist"
npm run build && npm run deploy
```

---

## Adding your own shortcuts

Edit `src/data/custom.json`. Each shortcut follows this schema:

```json
{
  "id":        "unique-kebab-id",
  "cat":       "Category name",
  "action":    "What the shortcut does (shown on card front)",
  "mac":       "⌘⇧K",
  "win":       "Ctrl+Shift+K",
  "priority":  2,
  "isSequence": false
}
```

**Priority levels:**
- `1` — Essential (learn these first)
- `2` — Useful (everyday power-user shortcuts)
- `3` — Advanced (edge cases, rarely used)

---

## Project structure

```
src/
├── data/
│   ├── excel.json
│   ├── powerpoint.json
│   ├── google-workspace.json
│   ├── windows.json
│   ├── slack.json
│   ├── vimium.json
│   ├── obsidian.json
│   ├── custom.json          ← your shortcuts go here
│   └── index.js             ← imports & combines all data
├── utils/
│   └── sm2.js               ← SM-2 spaced repetition algorithm
├── hooks/
│   ├── useProgress.js       ← localStorage-backed SM-2 state
│   └── useSettings.js       ← platform + app filter preferences
├── components/
│   ├── TopBar.jsx
│   ├── BottomNav.jsx
│   ├── FlashCard.jsx
│   ├── PracticeView.jsx
│   ├── DiscoverView.jsx
│   ├── SearchView.jsx
│   └── HelpView.jsx
├── App.jsx
├── main.jsx
└── index.css
```

---

## Contributing

PRs welcome! To add or correct shortcuts, edit the relevant JSON file in `src/data/`. Please keep entries accurate for **both** `mac` and `win` keys, and assign a sensible `priority`.

---

## Data & privacy

All progress and settings are stored in `localStorage` on your device. Nothing leaves your browser.
