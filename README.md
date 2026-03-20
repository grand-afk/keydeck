# ⌨️ KeyDeck — Keyboard Shortcut Trainer

A spaced-repetition flashcard app for building genuine muscle memory around keyboard shortcuts — covering **Mac and Windows** across a wide range of productivity apps.

Built with React + Vite. Runs entirely in the browser. No backend, no account needed.

---

## Apps covered

### Google Workspace
| App | Key |
|-----|-----|
| 📧 Gmail | `G` |
| 📹 Google Meet | `0M` |
| 💬 Google Chat | `C` |
| 📅 Google Calendar | `0C` |
| 💾 Google Drive | `D` |
| 📄 Google Docs | `0D` |
| 📊 Google Sheets | `S` |
| 📽️ Google Slides | `0S` |
| ✅ Google Tasks | `T` |
| 🟡 Google Keep | `K` |
| ✨ Gemini | `0G` |
| 📓 NotebookLM | `N` |

### Microsoft 365
| App | Key |
|-----|-----|
| 📗 Excel | `X` |
| 📕 PowerPoint | `P` |
| 📘 Word | `0W` |
| 📨 Outlook | `O` |
| 👥 Teams | `0T` |
| ⚙️ PowerToys | `0P` |
| 🪟 Desktop / macOS | `Z` |

### Other
| App | Key |
|-----|-----|
| 💼 Slack | `L` |
| 🌐 Vimium | `V` |
| 🔮 Obsidian | `0O` |
| 🌐 Chrome | `R` |
| 🤖 Claude | `U` |
| 🔖 Bookmarks (custom) | `B` |

The "Key" column shows the keyboard shortcut that toggles that app's filter chip. Single letters activate immediately; two-char keys (e.g. `0M`) require pressing `0` first, then the letter.

---

## Views

### ⌨️ Shortcuts
A paginated, sortable table of every shortcut. Each row lets you rate, star, flag, or edit a shortcut inline. Use **+ Add** to create new shortcuts stored in your browser.

Columns are sortable (App, Category, Function, Shortcut, Rating). 10 items per page. The rate column can be hidden via Settings.

### 📖 Practise
Your SM-2 daily review queue. Shows up to 10 shortcuts that are due for review today. Rate each one — the algorithm reschedules it automatically. When the queue is empty you're done for the day.

### 🎲 Discover
A random batch of 20 shortcuts drawn from the full library, prioritising ones you've never seen. Rate a shortcut in Discover and it's automatically added to your Practise deck. Hit **🎲 New batch** to reshuffle.

### ❓ Help
In-app documentation.

### ⚙️ Settings
Configure app visibility, remap keyboard shortcuts, switch platform, toggle dark/light mode, and show/hide the rate column.

---

## How the learning algorithm works

KeyDeck uses the **SM-2 algorithm** — the same one that powers Anki — to schedule each shortcut at the optimal interval for long-term retention.

After each shortcut, rate your recall honestly:

| Rating | Meaning | Effect |
|--------|---------|--------|
| **Again** | Complete blank / wrong key | Resets the card to day 1 |
| **Hard** | Got it with significant effort | Small interval increase |
| **Good** | Correct after a brief pause | Normal SM-2 interval growth |
| **Easy** | Instant, effortless recall | Larger interval jump |

The algorithm tracks an **ease factor** per card. Cards you find easy get longer and longer review intervals; cards that trip you up stay in the short-term rotation until they stick.

---

## Keyboard shortcuts

### Global
| Key | Action |
|-----|--------|
| `/` | Open inline search bar |
| `Esc` | Close search / cancel pending prefix / close modal |
| `M` | Switch to Mac shortcuts |
| `W` | Switch to Windows shortcuts |
| `A` | Show all apps (clear filter) |
| `F` | Toggle Favourites filter |
| `1` | Go to Shortcuts view |
| `2` | Go to Practise view |
| `3` | Go to Discover view |
| `4` | Go to Help view |
| `5` | Go to Settings view |

### App filter chips
Each app has a single-letter shortcut that toggles its filter chip. Apps whose natural letter conflicts with a reserved system key use a two-key `0`+letter sequence. For example, `G` = Gmail, `0M` = Meet (since `M` = Mac platform). The full key map is shown in the filter bar itself and on each chip. Keys can be remapped in Settings.

---

## Top bar

| Control | Function |
|---------|----------|
| **Mac / Win toggle** | Switch which platform's shortcuts are displayed (`M` / `W`) |
| **App chips (Row 2)** | Tap or press the chip key to filter by app; multi-select is supported; tap **All** or press `A` to reset |
| **🔍** | Open/close the inline search bar (`/`) |
| **⭐** | Toggle Favourites filter — shows only starred shortcuts (`F`) |
| **🚩** | Open the Flagged shortcuts modal — review everything you've marked for editing |
| **☀️ / 🌙** | Toggle dark/light mode |
| **⬇️** | Export all progress and key overrides as a JSON backup file |
| **⬆️** | Import a previously exported JSON backup (merges into existing progress) |

---

## Per-row actions

Every row in Shortcuts, Practise, and Discover has three icon buttons:

- **⭐** — Toggle favourite. Starred shortcuts can be isolated using the Favourites filter.
- **🚩** — Flag for editing. Flagged shortcuts appear in the 🚩 Flagged modal (top bar) for review.
- **🖊️** — Edit the shortcut inline. Changes are saved to `localStorage` as overrides and included in exports. The original bundled data is not modified.

---

## Settings

### App visibility
Show or hide individual apps from the filter bar. Hidden apps disappear from Shortcuts, Practise, and Discover entirely. Use **Show all** to restore everything at once.

### App keyboard shortcuts
Each app chip has an assignable keyboard shortcut. Click any key badge to open the A–Z picker — the grid shows which letters are free, which are taken, and which are reserved (`A`, `M`, `W`, `F`). You can also just press a letter key while the picker is open. Click the **↺** reset button on any row to restore the default key.

### Preferences
- **Platform** — sets the default platform displayed (Mac or Windows).
- **Theme** — toggle dark / light mode.
- **Rate column** — show or hide the rating buttons in all table views.

---

## Search

Press `/` or click 🔍 to open the inline search bar. Search is full-text across:
- Shortcut action / description
- Category
- Mac key combo
- Windows key combo
- Context notes

Results appear in the Shortcuts table in real time. Press `Esc` or click 🔍 again to close.

---

## Adding and editing shortcuts

### Add a new shortcut (in-browser)
Click **+ Add** in the Shortcuts view header. Fill in the app, category, action description, Mac/Win key combos, and an optional context note. The shortcut is saved to `localStorage` under `keydeck:custom` and included in exports.

### Add shortcuts via JSON
Edit `src/data/custom.json` before building. Each entry follows this schema:

```json
{
  "id":        "unique-kebab-id",
  "cat":       "Category name",
  "action":    "What the shortcut does",
  "mac":       "⌘⇧K",
  "win":       "Ctrl+Shift+K",
  "priority":  2,
  "context":   "Optional hint shown on hover"
}
```

**Priority levels:**
- `1` — Essential (learn these first)
- `2` — Useful (everyday power-user shortcuts)
- `3` — Advanced (edge cases, rarely used)

### Edit an existing shortcut
Click 🖊️ on any row. Your changes are saved as an override in `localStorage` and survive page reloads. They are included in the JSON export so nothing is lost if you clear the cache. The original bundled data is never mutated.

---

## Export & import

Use **⬇️** to download a timestamped JSON file containing your full SM-2 progress and any key overrides. Use **⬆️** to import it back — the import merges with any existing progress (newer data wins on conflicts).

The export file format:

```json
{
  "exportedAt": "2025-06-01T10:00:00.000Z",
  "progress": { "<shortcut-id>": { "repetitions": 3, "interval": 4, "easeFactor": 2.5, "nextReview": "...", "favourite": false, "needsEdit": false } },
  "overrides": { "<shortcut-id>": { "action": "...", "mac": "...", "win": "..." } }
}
```

---

## Data & privacy

All progress, overrides, custom shortcuts, and settings are stored in `localStorage` on your device. Nothing leaves your browser. localStorage keys used:

| Key | Contents |
|-----|----------|
| `keydeck:progress` | SM-2 card state (repetitions, interval, ease, next review, favourites, flags) |
| `keydeck:custom` | User-created shortcuts added via the + Add modal |
| `keydeck:overrides` | In-browser edits to bundled shortcuts |
| `keydeck:settings` | Platform, dark mode, hidden apps, rate column visibility, key overrides |

---

## Mobile support

The app is designed to work on touch devices. iOS Safari viewport-zoom is suppressed when inputs receive focus (enforced via a `max(16px, 1em)` font-size rule and a temporary `maximum-scale=1` viewport injection), and snaps back immediately after the keyboard dismisses. Inactive app-chip hover states are neutralised on coarse-pointer devices so taps don't leave chips in a visually "stuck" state.

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

## Project structure

```
src/
├── data/
│   ├── excel.json
│   ├── powerpoint.json
│   ├── word.json
│   ├── outlook.json
│   ├── teams.json
│   ├── powertoys.json
│   ├── windows.json
│   ├── gmail.json
│   ├── google-meet.json
│   ├── google-chat.json
│   ├── google-calendar.json
│   ├── google-drive.json
│   ├── google-docs.json
│   ├── google-sheets.json
│   ├── google-slides.json
│   ├── google-tasks.json
│   ├── google-keep.json
│   ├── gemini.json
│   ├── notebooklm.json
│   ├── slack.json
│   ├── vimium.json
│   ├── obsidian.json
│   ├── chrome.json
│   ├── claude.json
│   ├── custom.json          ← static custom shortcuts (edit before build)
│   └── index.js             ← imports, tags, and exports all shortcut data
├── utils/
│   └── sm2.js               ← SM-2 spaced repetition algorithm
├── hooks/
│   ├── useProgress.js       ← localStorage-backed SM-2 state, export/import
│   └── useSettings.js       ← platform, app filter, hidden apps, key overrides
├── components/
│   ├── TopBar.jsx            ← platform toggle, app chips, search, utility buttons
│   ├── BottomNav.jsx         ← tab bar (Shortcuts / Practise / Discover / Help / Settings)
│   ├── ShortcutsView.jsx     ← sortable shortcut table with Add button
│   ├── StudyView.jsx         ← SM-2 daily review queue
│   ├── DiscoverView.jsx      ← random-batch explorer
│   ├── HelpView.jsx          ← in-app documentation
│   ├── SettingsView.jsx      ← app visibility, key remapping, preferences
│   ├── FlashCard.jsx         ← individual card component (used in Practise/Discover)
│   ├── EditModal.jsx         ← inline shortcut editor (saves to localStorage overrides)
│   ├── AddShortcutModal.jsx  ← create new browser-stored shortcuts
│   ├── FlaggedModal.jsx      ← review all 🚩-flagged shortcuts
│   ├── RateColumn.jsx        ← Again / Hard / Good / Easy rating controls
│   └── AppIcon.jsx           ← renders app icon (brand CDN URL or emoji fallback)
├── App.jsx                   ← root component, global keyboard handler, view router
├── main.jsx
└── index.css                 ← all styles (dark + light theme, responsive, mobile)
```

---

## Contributing

PRs welcome! To add or correct shortcuts, edit the relevant JSON file in `src/data/`. Keep entries accurate for **both** `mac` and `win` keys and assign a sensible `priority`. For new apps, add a new JSON file, import it in `index.js`, and add an entry to the `APPS` array with an appropriate filter key.
