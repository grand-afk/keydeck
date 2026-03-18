// Search moved to inline overlay in TopBar — only 4 tabs remain.
// 'study' renamed to 'practise'. Shortcuts icon changed to ⌨️.
const TABS = [
  { id: 'shortcuts', icon: '⌨️', label: 'Shortcuts', key: '1' },
  { id: 'practise',  icon: '📖', label: 'Practise',  key: '2' },
  { id: 'discover',  icon: '🎲', label: 'Discover',  key: '3' },
  { id: 'help',      icon: '❓', label: 'Help',      key: '4' },
  { id: 'settings',  icon: '⚙️', label: 'Settings',  key: '5' },
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
