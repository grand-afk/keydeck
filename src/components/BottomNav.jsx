const NAV_ITEMS = [
  { id: 'practice', label: 'Practice', icon: '🃏' },
  { id: 'discover', label: 'Discover', icon: '🎲' },
  { id: 'search',   label: 'Search',   icon: '🔍' },
  { id: 'help',     label: 'Help',     icon: '📖' },
]

/**
 * BottomNav — mobile-first tab bar
 */
export default function BottomNav({ view, setView }) {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${view === item.id ? 'active' : ''}`}
          onClick={() => setView(item.id)}
          aria-current={view === item.id ? 'page' : undefined}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
