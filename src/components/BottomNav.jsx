const TABS = [
  { id: 'practice', icon: '🃏', label: 'Practice'  },
  { id: 'study',    icon: '📋', label: 'Study'     },
  { id: 'discover', icon: '🎲', label: 'Discover'  },
  { id: 'search',   icon: '🔍', label: 'Search'    },
  { id: 'help',     icon: '📖', label: 'Help'      },
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
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
