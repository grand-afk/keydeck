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
        {/* Mac / Win toggle — kbd hints: M / W (#4) */}
        <div className="platform-toggle" role="group" aria-label="Platform">
          <button
            className={`platform-btn ${platform === 'mac' ? 'platform-btn--active' : ''}`}
            onClick={() => setPlatform('mac')}
            aria-pressed={platform === 'mac'}
            title="Switch to Mac shortcuts [M]"
          >
            🍎 Mac<kbd className="kbd-hint">M</kbd>
          </button>
          <button
            className={`platform-btn ${platform === 'win' ? 'platform-btn--active' : ''}`}
            onClick={() => setPlatform('win')}
            aria-pressed={platform === 'win'}
            title="Switch to Windows shortcuts [W]"
          >
            ⊞ Win<kbd className="kbd-hint">W</kbd>
          </button>
        </div>

        <div className="top-bar__actions">
          <button
            className={`icon-btn ${showFavourites ? 'icon-btn--active' : ''}`}
            onClick={toggleShowFavourites}
            title="Toggle favourites filter [F]"
            aria-pressed={showFavourites}
          >
            ⭐<kbd className="kbd-hint">F</kbd>
          </button>
          <button className="icon-btn" onClick={onExport} title="Export data [E]">
            ⬇️<kbd className="kbd-hint">E</kbd>
          </button>
          <button className="icon-btn" onClick={() => importRef.current?.click()} title="Import backup">
            ⬆️
          </button>
          <input ref={importRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImportFile} />
        </div>
      </div>

      {/* ── Row 2: app filter chips ── */}
      <div className="app-filters" role="group" aria-label="Filter by app">
        <button
          className={`app-chip ${selectedApps.length === 0 ? 'app-chip--active' : ''}`}
          onClick={() => { if (selectedApps.length > 0) selectedApps.forEach((id) => toggleApp(id)) }}
        >
          All
        </button>
        {APPS.map((app) => (
          <button
            key={app.id}
            className={`app-chip ${selectedApps.includes(app.id) ? 'app-chip--active' : ''}`}
            onClick={() => toggleApp(app.id)}
            title={`Filter by ${app.label}${app.key ? ` [${app.key}]` : ''}`}
          >
            {app.icon} {app.label}{app.key && <kbd className="kbd-hint">{app.key}</kbd>}
          </button>
        ))}
      </div>
    </header>
  )
}
