import { APPS } from '../data/index'

/**
 * TopBar — App selector chips + Mac/Windows platform toggle
 */
export default function TopBar({ platform, setPlatform, selectedApps, toggleApp }) {
  const isAllSelected = selectedApps.includes('all')

  return (
    <header className="topbar">
      <div className="topbar-apps">
        <button
          className={`app-chip ${isAllSelected ? 'active' : ''}`}
          onClick={() => toggleApp('all')}
          title="All apps"
        >
          All
        </button>
        {APPS.map((app) => (
          <button
            key={app.id}
            className={`app-chip ${!isAllSelected && selectedApps.includes(app.id) ? 'active' : ''}`}
            onClick={() => toggleApp(app.id)}
            title={app.label}
          >
            <span className="app-icon">{app.icon}</span>
            <span className="app-label">{app.label}</span>
          </button>
        ))}
      </div>

      <div className="platform-toggle">
        <button
          className={`platform-btn ${platform === 'mac' ? 'active' : ''}`}
          onClick={() => setPlatform('mac')}
          aria-label="Mac shortcuts"
        >

        </button>
        <button
          className={`platform-btn ${platform === 'windows' ? 'active' : ''}`}
          onClick={() => setPlatform('windows')}
          aria-label="Windows shortcuts"
        >
          ⊞
        </button>
      </div>
    </header>
  )
}
