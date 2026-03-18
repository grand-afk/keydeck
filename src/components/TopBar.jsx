import { useRef, useEffect } from 'react'
import { APPS } from '../data/index'
import AppIcon from './AppIcon'

// Official brand icons via Google Favicon API
const APPLE_ICON = 'https://www.google.com/s2/favicons?domain=apple.com&sz=64'
const WIN_ICON   = 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=64'

export default function TopBar({
  platform,
  setPlatform,
  selectedApps,
  toggleApp,
  showFavourites,
  toggleShowFavourites,
  onExport,
  onImport,
  darkMode,
  onToggleDarkMode,
  searchOpen,
  searchQuery,
  onSearchChange,
  onToggleSearch,
  onOpenFlagged,
}) {
  const importRef = useRef(null)
  const searchRef = useRef(null)

  // Auto-focus the search input when it opens
  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus()
  }, [searchOpen])

  function handleImportFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const ok = onImport(ev.target.result, 'merge')
      alert(ok ? '✅ Data imported successfully!' : '❌ Import failed — check the file format.')
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  // Desktop chip icon and label change with the active platform
  function resolveApp(app) {
    if (app.id === 'windows') {
      return {
        ...app,
        iconUrl: platform === 'mac' ? APPLE_ICON : WIN_ICON,
        icon: null,
        label: platform === 'mac' ? 'macOS' : 'Desktop',
      }
    }
    return app
  }

  return (
    <header className="top-bar">
      {/* ── Row 1: platform toggle + utility buttons ── */}
      <div className="top-bar__controls">
        <div className="platform-toggle" role="group" aria-label="Platform">
          <button
            className={`platform-btn ${platform === 'mac' ? 'platform-btn--active' : ''}`}
            onClick={() => setPlatform('mac')}
            aria-pressed={platform === 'mac'}
            title="Switch to Mac shortcuts [M]"
          >
            <img src={APPLE_ICON} className="platform-icon" alt="" />
            Mac<kbd className="kbd-hint">M</kbd>
          </button>
          <button
            className={`platform-btn ${platform === 'win' ? 'platform-btn--active' : ''}`}
            onClick={() => setPlatform('win')}
            aria-pressed={platform === 'win'}
            title="Switch to Windows shortcuts [W]"
          >
            <img src={WIN_ICON} className="platform-icon" alt="" />
            Win<kbd className="kbd-hint">W</kbd>
          </button>
        </div>

        <div className="top-bar__actions">
          {/* Search */}
          <button
            className={`icon-btn ${searchOpen ? 'icon-btn--active' : ''}`}
            onClick={onToggleSearch}
            title="Search shortcuts [/]"
            aria-pressed={searchOpen}
          >
            🔍
          </button>

          {/* Favourites — left of the right-side cluster */}
          <button
            className={`icon-btn ${showFavourites ? 'icon-btn--active' : ''}`}
            onClick={toggleShowFavourites}
            title="Toggle favourites filter [F]"
            aria-pressed={showFavourites}
          >
            ⭐<kbd className="kbd-hint">F</kbd>
          </button>

          {/* Flagged shortcuts */}
          <button className="icon-btn" onClick={onOpenFlagged} title="View flagged shortcuts">
            🚩
          </button>

          {/* Dark / light mode */}
          <button
            className="icon-btn"
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Export */}
          <button className="icon-btn" onClick={onExport} title="Export / backup your data">
            ⬇️
          </button>

          {/* Import */}
          <button className="icon-btn" onClick={() => importRef.current?.click()} title="Import backup">
            ⬆️
          </button>
          <input ref={importRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImportFile} />
        </div>
      </div>

      {/* ── Row 2: active app chips (only shown when apps are selected in Settings) ── */}
      {selectedApps.length > 0 && (
        <div className="app-filters" role="group" aria-label="Active app filters">
          {selectedApps.map((id) => {
            const app = APPS.find((a) => a.id === id)
            if (!app) return null
            const resolved = resolveApp(app)
            return (
              <button
                key={id}
                className="app-chip app-chip--active"
                onClick={() => toggleApp(id)}
                title={`Remove ${resolved.label} filter [${app.key}]`}
              >
                <AppIcon app={resolved} />
                {' '}{resolved.label}
                <span className="app-chip__remove" aria-hidden="true">✕</span>
              </button>
            )
          })}
        </div>
      )}

      {/* ── Row 3: inline search bar ── */}
      {searchOpen && (
        <div className="search-bar-row">
          <span className="search-bar-icon">🔍</span>
          <input
            ref={searchRef}
            className="search-bar-input"
            type="search"
            placeholder="Search shortcuts, apps, categories, key combos…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Escape') onToggleSearch() }}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {searchQuery && (
            <button className="search-bar-clear" onClick={() => onSearchChange('')} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>
      )}
    </header>
  )
}
