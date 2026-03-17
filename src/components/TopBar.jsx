import { useRef } from 'react'
import { APPS } from '../data/index'

export default function TopBar({
  platform,
  setPlatform,
  selectedApps,
  toggleApp,
  showFavourites,
  toggleShowFavourites,
  onExport,
  onImport,
}) {
  const importRef = useRef(null)

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

  return (
    <header className="top-bar">
      {/* ── Row 1: platform toggle + utility buttons ── */}
      <div className="top-bar__controls">
        {/* Mac / Win toggle */}
        <div className="platform-toggle" role="group" aria-label="Platform">
          <button
            className={`platform-btn ${platform === 'mac' ? 'platform-btn--active' : ''}`}
            onClick={() => setPlatform('mac')}
            aria-pressed={platform === 'mac'}
          >
            🍎 Mac
          </button>
          <button
            className={`platform-btn ${platform === 'win' ? 'platform-btn--active' : ''}`}
            onClick={() => setPlatform('win')}
            aria-pressed={platform === 'win'}
          >
            ⊞ Win
          </button>
        </div>

        <div className="top-bar__actions">
          {/* Favourites filter */}
          <button
            className={`icon-btn ${showFavourites ? 'icon-btn--active' : ''}`}
            onClick={toggleShowFavourites}
            title={showFavourites ? 'Showing favourites only — click to show all' : 'Show favourites only'}
            aria-pressed={showFavourites}
          >
            ⭐
          </button>

          {/* Export */}
          <button
            className="icon-btn"
            onClick={onExport}
            title="Export progress & overrides as JSON"
          >
            ⬇️
          </button>

          {/* Import */}
          <button
            className="icon-btn"
            onClick={() => importRef.current?.click()}
            title="Import a previously exported JSON backup"
          >
            ⬆️
          </button>
          <input
            ref={importRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImportFile}
          />
        </div>
      </div>

      {/* ── Row 2: app filter chips (wrappable) ── */}
      <div className="app-filters" role="group" aria-label="Filter by app">
        <button
          className={`app-chip ${selectedApps.length === 0 ? 'app-chip--active' : ''}`}
          onClick={() => {
            // Deselect all — handled by passing empty array upstream
            // We fire toggleApp for each selected to clear, or use a dedicated clearApps.
            // Simplest: just rely on parent clearing via setSelectedApps([]).
            // Since we only have toggleApp, clicking 'All' when something is selected
            // should clear. We implement a small workaround here:
            if (selectedApps.length > 0) {
              selectedApps.forEach((id) => toggleApp(id))
            }
          }}
        >
          All
        </button>
        {APPS.map((app) => (
          <button
            key={app.id}
            className={`app-chip ${selectedApps.includes(app.id) ? 'app-chip--active' : ''}`}
            onClick={() => toggleApp(app.id)}
          >
            {app.icon} {app.label}
          </button>
        ))}
      </div>
    </header>
  )
}
