import { useState, useMemo } from 'react'
import { APPS } from '../data/index'
import { getCardStatus, nextDueLabel } from '../utils/sm2'

/**
 * SearchView — full-text search across all shortcuts with inline shortcut display.
 */
export default function SearchView({ shortcuts, platform, getCard }) {
  const [query, setQuery] = useState('')
  const [filterApp, setFilterApp] = useState('all')

  const results = useMemo(() => {
    const q = query.toLowerCase().trim()
    return shortcuts.filter((s) => {
      const appMatch = filterApp === 'all' || s.app === filterApp
      if (!appMatch) return false
      if (!q) return true
      return (
        s.action.toLowerCase().includes(q) ||
        s.cat.toLowerCase().includes(q) ||
        (s.mac || '').toLowerCase().includes(q) ||
        (s.win || '').toLowerCase().includes(q) ||
        (s.context || '').toLowerCase().includes(q)
      )
    })
  }, [query, filterApp, shortcuts])

  return (
    <div className="search-view">
      {/* Search input */}
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          type="search"
          placeholder="Search shortcuts, apps, categories…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        {query && (
          <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear search">
            ✕
          </button>
        )}
      </div>

      {/* App filter row */}
      <div className="search-filters">
        <button
          className={`filter-chip ${filterApp === 'all' ? 'active' : ''}`}
          onClick={() => setFilterApp('all')}
        >
          All
        </button>
        {APPS.map((app) => (
          <button
            key={app.id}
            className={`filter-chip ${filterApp === app.id ? 'active' : ''}`}
            onClick={() => setFilterApp(app.id)}
          >
            {app.icon} {app.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="search-count">
        {results.length} shortcut{results.length !== 1 ? 's' : ''}
        {query ? ` for "${query}"` : ''}
      </p>

      {/* Results list */}
      <ul className="search-results">
        {results.map((s) => {
          const appMeta = APPS.find((a) => a.id === s.app) || {}
          const shortcutText = platform === 'mac' ? s.mac : s.win
          const status = getCardStatus(getCard(s.id))
          const dueLabel = nextDueLabel(getCard(s.id))

          return (
            <li key={s.id} className="search-result-item">
              <div className="result-top">
                <span className="result-app">
                  {appMeta.icon} {appMeta.label}
                </span>
                <span className="result-cat">{s.cat}</span>
                <span className={`badge badge--${status}`}>{dueLabel}</span>
              </div>
              <p className="result-action">{s.action}</p>
              <p className="result-shortcut">{shortcutText}</p>
              {s.context && <p className="result-context">{s.context}</p>}
              {s.isSequence && (
                <span className="badge badge--sequence">Sequence</span>
              )}
            </li>
          )
        })}
        {results.length === 0 && (
          <li className="search-empty">No shortcuts match your search.</li>
        )}
      </ul>
    </div>
  )
}
