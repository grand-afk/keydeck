// Tabs: Practice removed (#3). Shortcuts added as first tab (#6).
// kbd hints shown on desktop/iPad, hidden on mobile (#4).
const TABS = [
  { id: 'shortcuts', icon: '⭐', label: 'Shortcuts', key: '1' },
  { id: 'study',     icon: '📋', label: 'Study',     key: '2' },
  { id: 'discover',  icon: '🎲', label: 'Discover',  key: '3' },
  { id: 'search',    icon: '🔍', label: 'Search',    key: '4' },
  { id: 'help',      icon: '📖', label: 'Help',      key: '5' },
]

export default function BottomNav({ view, setView }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`nav-btn ${view === tab.id ? 'nav-btn--active' : ''}`}
          onClick={() => setView(tab.id)}
          aria-current={view === tab.id ? 'page' : undefined}
          title={`${tab.label} [${tab.key}]`}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">
            {tab.label}
            <kbd className="kbd-hint">{tab.key}</kbd>
          </span>
        </button>
      ))}
    </nav>
  )
}
