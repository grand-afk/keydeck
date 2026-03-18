import { useState, useEffect } from 'react'
import { APPS } from '../data/index'
import AppIcon from './AppIcon'

// Keys that are reserved for system-level shortcuts and cannot be remapped
const RESERVED_KEYS = new Set(['M', 'F', '/', '1', '2', '3', '4', '5'])
const RESERVED_LABEL = 'M (Mac platform), F (Favourites), / (Search), 1–5 (tabs)'

export default function SettingsView({
  hiddenApps,
  toggleHideApp,
  platform,
  setPlatform,
  darkMode,
  toggleDarkMode,
  showRateCol,
  toggleRateCol,
  keyOverrides = {},
  setKeyOverride,
  resetKeyOverride,
}) {
  // Custom (Bookmarks) shortcuts are managed via Add Shortcut — exclude from grids
  const filterableApps = APPS.filter((a) => a.id !== 'custom')
  const visibleCount   = filterableApps.length - hiddenApps.length

  // ── Key remapping state ─────────────────────────────────────────────────
  const [remappingId, setRemappingId] = useState(null)

  // Capture the next keypress when in remap mode
  useEffect(() => {
    if (!remappingId) return

    function handleKey(e) {
      e.preventDefault()
      e.stopPropagation()
      const key = e.key.toUpperCase()

      if (e.key === 'Escape') { setRemappingId(null); return }

      // Single A–Z letters only; reject reserved keys
      if (!/^[A-Z]$/.test(key)) return   // ignore Shift, Enter, etc. without cancelling
      if (RESERVED_KEYS.has(key)) {
        setRemappingId(null)
        return
      }

      setKeyOverride(remappingId, key)
      setRemappingId(null)
    }

    // capture: true ensures this fires before the global App.jsx handler
    window.addEventListener('keydown', handleKey, { capture: true })
    return () => window.removeEventListener('keydown', handleKey, { capture: true })
  }, [remappingId, setKeyOverride])

  // Click anywhere outside to cancel remap
  useEffect(() => {
    if (!remappingId) return
    function handleClick() { setRemappingId(null) }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [remappingId])

  return (
    <div className="settings-view">
      <h2 className="settings-title">⚙️ Settings</h2>

      {/* ── App visibility ─────────────────────────────────────── */}
      <section className="settings-section">
        <div className="settings-section-header">
          <div>
            <h3 className="settings-section-title">Apps</h3>
            <p className="settings-hint">
              Hide apps you don't use to keep the filter bar tidy.
              Hidden apps won't appear in the filter bar, Shortcuts, Practise or Discover.{' '}
              {hiddenApps.length > 0
                ? `${visibleCount} of ${filterableApps.length} shown.`
                : 'All apps shown.'}
            </p>
          </div>
          {hiddenApps.length > 0 && (
            <button
              className="btn-secondary"
              onClick={() => hiddenApps.forEach((id) => toggleHideApp(id))}
            >
              Show all
            </button>
          )}
        </div>

        <div className="settings-app-grid">
          {filterableApps.map((app) => {
            const hidden = hiddenApps.includes(app.id)
            return (
              <button
                key={app.id}
                className={`settings-app-card ${hidden ? 'settings-app-card--hidden' : 'settings-app-card--visible'}`}
                onClick={() => toggleHideApp(app.id)}
                title={hidden ? `Show ${app.label} in filter bar` : `Hide ${app.label} from filter bar`}
              >
                <AppIcon app={app} size={28} />
                <span className="settings-app-name">{app.label}</span>
                <span className="settings-app-status">{hidden ? 'Hidden' : 'Visible'}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── App keyboard shortcuts ─────────────────────────────── */}
      <section className="settings-section">
        <h3 className="settings-section-title">App keyboard shortcuts</h3>
        <p className="settings-hint">
          Each filter chip has a single-key shortcut. Click a key badge to remap it,
          then press your chosen letter. Reserved (cannot be remapped): {RESERVED_LABEL}.
        </p>

        <div className="key-remap-grid">
          {filterableApps.map((app) => {
            const defaultKey   = app.key || ''
            const effectiveKey = keyOverrides[app.id] !== undefined
              ? keyOverrides[app.id]
              : defaultKey
            const isCustom     = keyOverrides[app.id] !== undefined
            const isListening  = remappingId === app.id

            return (
              <div key={app.id} className="key-remap-row">
                <AppIcon app={app} size={18} />
                <span className="key-remap-label">{app.label}</span>

                <button
                  className={[
                    'key-remap-btn',
                    isListening ? 'key-remap-btn--listening' : '',
                    isCustom && !isListening ? 'key-remap-btn--custom' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={(e) => {
                    e.stopPropagation()
                    setRemappingId(isListening ? null : app.id)
                  }}
                  title={
                    isListening
                      ? 'Press a letter key… (Esc to cancel)'
                      : `${effectiveKey || '—'} · Click to remap`
                  }
                >
                  {isListening ? '?' : (effectiveKey || '—')}
                </button>

                {isCustom && !isListening && (
                  <button
                    className="key-remap-reset"
                    onClick={(e) => { e.stopPropagation(); resetKeyOverride(app.id) }}
                    title={`Reset to default (${defaultKey || 'none'})`}
                    aria-label="Reset to default"
                  >
                    ↺
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Preferences ───────────────────────────────────────── */}
      <section className="settings-section">
        <h3 className="settings-section-title">Preferences</h3>

        <div className="settings-prefs">

          <div className="settings-pref-row">
            <div className="settings-pref-text">
              <span className="settings-pref-label">Platform</span>
              <span className="settings-pref-desc">Which keyboard shortcuts to show by default</span>
            </div>
            <div className="platform-toggle">
              <button
                className={`platform-btn ${platform === 'mac' ? 'platform-btn--active' : ''}`}
                onClick={() => setPlatform('mac')}
              >
                <img
                  src="https://www.google.com/s2/favicons?domain=apple.com&sz=64"
                  alt=""
                  className="platform-icon"
                />
                macOS <kbd className="kbd-hint">M</kbd>
              </button>
              <button
                className={`platform-btn ${platform === 'win' ? 'platform-btn--active' : ''}`}
                onClick={() => setPlatform('win')}
              >
                <img
                  src="https://www.google.com/s2/favicons?domain=microsoft.com&sz=64"
                  alt=""
                  className="platform-icon"
                />
                Windows
              </button>
            </div>
          </div>

          <div className="settings-pref-row">
            <div className="settings-pref-text">
              <span className="settings-pref-label">Theme</span>
              <span className="settings-pref-desc">Toggle between dark and light mode</span>
            </div>
            <button className="settings-toggle-btn" onClick={toggleDarkMode}>
              {darkMode ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>

          <div className="settings-pref-row">
            <div className="settings-pref-text">
              <span className="settings-pref-label">Rate column</span>
              <span className="settings-pref-desc">Show or hide rating buttons in the Shortcuts table</span>
            </div>
            <button className="settings-toggle-btn" onClick={toggleRateCol}>
              {showRateCol ? '✅ Visible' : '⬜ Hidden'}
            </button>
          </div>

        </div>
      </section>
    </div>
  )
}
