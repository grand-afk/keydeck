# KeyDeck Upgrade — Implementation Guide

All files in this folder are **drop-in replacements** for your existing repo.
Copy each file to the matching path and you're done. No new dependencies required.

---

## Files included and what they change

| File | Status | What changed |
|------|--------|-------------|
| `src/data/chrome.json` | ✅ NEW | 44 Google Chrome shortcuts across Tabs, Navigation, Page, Developer, Bookmarks |
| `src/data/index.js` | ✅ REPLACE | Imports Chrome, applies in-browser overrides, exports `getAllShortcuts()` |
| `src/hooks/useProgress.js` | ✅ REPLACE | Adds `toggleFavourite`, `toggleNeedsEdit`, `exportData`, `importData` |
| `src/hooks/useSettings.js` | ✅ REPLACE | Adds `showFavourites` / `toggleShowFavourites` setting |
| `src/App.jsx` | ✅ REPLACE | Wires up new views and props; passes new hooks to all views |
| `src/components/TopBar.jsx` | ✅ REPLACE | ⭐ fav filter, ⬇️ export, ⬆️ import, wrapping app chips |
| `src/components/BottomNav.jsx` | ✅ REPLACE | Adds **Study** tab (📋) |
| `src/components/FlashCard.jsx` | ✅ REPLACE | ⭐/🚩/🖊️ buttons; blurred shortcut preview on card front |
| `src/components/StudyView.jsx` | ✅ NEW | Tabular daily study session (10 due cards, click-to-reveal) |
| `src/components/DiscoverView.jsx` | ✅ REPLACE | Converted to tabular layout (same UX as StudyView) |
| `src/components/EditModal.jsx` | ✅ NEW | In-browser shortcut editor (saves to `keydeck:overrides` in localStorage) |
| `src/index.css` | ✅ REPLACE | Full rewrite: mobile responsive, wrapping chips, table styles, modal styles |
| `vite.config.js` | ✅ REPLACE | Adds `base: '/keyboard-shortcuts-trainer/'` for GitHub Pages |
| `index.html` | ✅ REPLACE | Adds mobile viewport meta, PWA meta tags |
| `.github/workflows/deploy.yml` | ✅ NEW | GitHub Actions: auto-deploy to Pages on every push to `main` |

---

## Feature checklist

### ✅ 1. Mac / Win toggle button
Already existed — now it's more prominent in the TopBar with a pill toggle.
Nothing extra needed.

### ✅ 2. Daily Study mode (tabular, 10 shortcuts)
New **Study** tab (📋) in the bottom nav. Shows up to 10 shortcuts due today in a table:

```
App | Category | Function | Shortcut (click Reveal ▶) | Again / Hard / Good / Easy
```

Once all rows are rated, a "Next batch →" button loads the next 10.

### ✅ 3. Favourite flag
- ⭐ button on every FlashCard and every table row.
- Clicking toggles `favourite: true/false` in `keydeck:progress`.
- ⭐ button in the TopBar filters the whole app to show only favourited shortcuts.

### ✅ 4. Needs-edit flag
- 🚩 button on every FlashCard and every table row.
- Clicking toggles `needsEdit: true/false` in `keydeck:progress`.
- To see all flagged shortcuts, use the Search view and they'll appear with the flag lit.
  *(Optional next step: add a "Flagged" filter toggle to TopBar alongside ⭐.)*

### ✅ 5. Google Chrome shortcuts
`src/data/chrome.json` — 44 shortcuts covering Tabs, Navigation, Page, Developer, Bookmarks.
The Chrome app chip (🟡 Chrome) appears automatically in the TopBar.

### ✅ 6. Click shortcut combo to reveal
In **FlashCard**: the shortcut is shown blurred on the card front. Clicking it (or tapping the card as before) reveals the answer.

In **Study / Discover**: every row shows a "Reveal ▶" button; clicking it reveals the shortcut `<kbd>` and unlocks the rating buttons.

### ✅ 7. Export / import data
- **Export** (⬇️ in TopBar): downloads `keydeck-backup-YYYY-MM-DD.json` containing your full SM-2 progress AND any in-browser edits.
- **Import** (⬆️ in TopBar): pick a `.json` backup to merge back in.
- To move progress to GitHub: commit the JSON file anywhere in the repo (e.g. `backups/`) so it's safe. It doesn't need to be read by the app.

### ✅ 8. In-browser editing
🖊️ button on every card/row opens an **EditModal** where you can change:
- Function / Action text
- Mac shortcut keys
- Win shortcut keys
- Category
- Context note

Edits are saved in `localStorage` under `keydeck:overrides` and are applied at runtime. They're included in exports so nothing is lost. To share edits with others, export → commit the backup → others import.

### ✅ 9. Wrapping app buttons
`src/index.css` `.app-filters` now has `flex-wrap: wrap`. Narrow the window as much as you like.

### ✅ 10. GitHub Pages hosting + mobile optimisation

#### Enable GitHub Pages (one-time setup)
1. Push all these files to your `main` branch.
2. Go to **Settings → Pages** in your repo.
3. Under *Source*, select **GitHub Actions**.
4. The workflow (`.github/workflows/deploy.yml`) will fire automatically.
5. Your app will be live at: `https://grand-afk.github.io/keyboard-shortcuts-trainer/`

#### Add to iPhone home screen
On Safari: Share → **Add to Home Screen** → it opens as a full-screen PWA.

#### Mobile optimisations included
- `viewport` meta tag with `width=device-width` and `viewport-fit=cover`
- PWA meta tags for iOS
- Rate buttons wrap to 2×2 grid below 480 px
- Category column hidden on narrow screens
- Nav labels hidden on very small screens (icons only)
- Blurred shortcut preview scales well on touch

### ✅ 11. Discover as tabular view
`DiscoverView.jsx` is now the same table layout as StudyView. Each batch draws from unseen shortcuts first, then random. "🔀 New batch" shuffles in a fresh set.

---

## Quick-start after copying files

```bash
npm install        # no new packages needed
npm run dev        # test locally
npm run build      # verify production build is clean
git add .
git commit -m "feat: all 11 KeyDeck upgrades"
git push           # triggers GitHub Pages deploy automatically
```

Your live URL: **https://grand-afk.github.io/keyboard-shortcuts-trainer/**

---

## Notes on `SearchView.jsx`

The existing `SearchView.jsx` was not replaced — it will continue to work as-is.
To give it the ⭐/🚩 icons too, pass `toggleFavourite` and `toggleNeedsEdit` props
(already wired in the new `App.jsx`) and add icon buttons to your search result cards.

---

## Data schema reminder

If you edit `chrome.json` or add shortcuts to other JSON files, the schema is:

```json
{
  "id": "unique-kebab-id",
  "cat": "Category name",
  "action": "What the shortcut does",
  "mac": "⌘⇧K",
  "win": "Ctrl+Shift+K",
  "priority": 2,
  "isSequence": false,
  "context": "Optional hint shown on card"
}
```

Priority: `1` = Essential · `2` = Useful · `3` = Advanced
