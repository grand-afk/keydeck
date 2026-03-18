import { APPS } from '../data/index'
import AppIcon from './AppIcon'

export default function SettingsView({
  selectedApps,
  toggleApp,
  setSelectedApps,
  platform,
  setPlatform,
  darkMode,
  toggleDarkMode,
  showRateCol,
  toggleRateCol,
}) {
  // Custom app (Bookmarks) is managed separately via Add Shortcut — exclude from grid
  const filterableApps = APPS.filter((a) => a.id !== 'custom')

  const isFiltered   = selectedApps.length > 0
  const allCount     = filterableApps.length
  const activeCount  = isFiltered ? selectedApps.length : allCount

  return (
    <div className="settings-view">
      <h2 className="settings-title">⚙️ Settings</h2>

      {/* ── App selection ─────────────────────────────────────── */}
      <section className="settings-section">
        <div className="settings-section-header">
          <div>
            <h3 className="settings-section-title">Apps</h3>
            <p className="settings-hint">
              Select which apps show in Shortcuts, Practise and Discover.{' '}
              {isFiltered
                ? `${activeCount} of ${allCount} selected.`
                : 'All apps shown (none selected).'}
            </p>
          </div>
          <div className="settings-section-actions">
            <button
              className="btn-secondary"
              onClick={() => setSelectedApps(filterableApps.map((a) => a.id))}
              disabled={selectedApps.length === filterableApps.length}
            >
              Select all
            </button>
            <button
              className="btn-secondary"
              onClick={() => setSelectedApps([])}
              disabled={selectedApps.length === 0}
            >
              Show all
            </button>
          </div>
        </div>

        <div className="settings-app-grid">
          {filterableApps.map((app) => {
            const on = selectedApps.includes(app.id)
            return (
              <button
                key={app.id}
                className={`settings-app-card ${on ? 'settings-app-card--on' : ''} ${!isFiltered ? 'settings-app-card--all' : ''}`}
                onClick={() => toggleApp(app.id)}
                title={`${on ? 'Deselect' : 'Select'} ${app.label} — keyboard key: ${app.key}`}
              >
                <AppIcon app={app} size="lg" />
                <span className="settings-app-name">{app.label}</span>
                <kbd className="settings-app-key">{app.key}</kbd>
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
                  alt="Mac"
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
                  alt="Win"
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
