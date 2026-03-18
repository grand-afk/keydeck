import { APPS } from '../data/index'
import AppIcon from './AppIcon'

export default function SettingsView({
  hiddenApps,
  toggleHideApp,
  platform,
  setPlatform,
  darkMode,
  toggleDarkMode,
  showRateCol,
  toggleRateCol,
}) {
  // Custom (Bookmarks) shortcuts are managed via Add Shortcut — exclude from grid
  const filterableApps = APPS.filter((a) => a.id !== 'custom')
  const visibleCount   = filterableApps.length - hiddenApps.length

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
                Windows <kbd className="kbd-hint">W</kbd>
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
