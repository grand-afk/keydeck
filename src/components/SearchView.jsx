import { useState, useMemo } from 'react'
import { APPS } from '../data/index'
import { QUALITY } from '../utils/sm2'
import EditModal from './EditModal'

/**
 * SearchView — full-text search with tabular results (#6 fix).
 *
 * • No autoFocus on input (pressing 4 lands on the page cleanly)
 * • No duplicate app-filter row (TopBar already has one)
 * • Results rendered as a sortable table matching Study/Discover layout
 * • ⭐ / 🚩 / 🖊️ action buttons on each row
 */
export default function SearchView({
  shortcuts,
  platform,
  progress,
  rateCard,
  toggleFavourite,
  toggleNeedsEdit,
}) {
  const [query,      setQuery]      = useState('')
  const [rated,      setRated]      = useState({})
  const [editTarget, setEditTarget] = useState(null)

  const results = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return []
    return shortcuts.filter((s) =>
      s.action.toLowerCase().includes(q) ||
      s.cat.toLowerCase().includes(q) ||
      (s.mac  || '').toLowerCase().includes(q) ||
      (s.win  || '').toLowerCase().includes(q) ||
      (s.context || '').toLowerCase().includes(q)
    )
  }, [query, shortcuts])

  function handleRate(id, quality, label) {
    rateCard?.(id, quality)
    setRated((prev) => ({ ...prev, [id]: label }))
  }

  return (
    <div className="study-view">
      {/* Search input */}
      <div className="study-header">
        <h2 className="study-title">🔍 Search</h2>
        {query && (
          <span className="study-progress">
            {results.length} result{results.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          type="search"
          placeholder="Search shortcuts, apps, categories…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        {query && (
          <button
            className="search-clear"
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Empty / prompt state */}
      {!query && (
        <div className="empty-state">
          <p className="empty-icon">🔍</p>
          <p>Type to search across all shortcuts, categories, and key combinations.</p>
        </div>
      )}

      {query && results.length === 0 && (
        <div className="empty-state">
          <p className="empty-icon">🤷</p>
          <p>No shortcuts match <strong>"{query}"</strong>.</p>
        </div>
      )}

      {/* Results table */}
      {results.length > 0 && (
        <div className="study-table-wrapper">
          <table className="study-table">
            <thead>
              <tr>
                <th>App</th>
                <th>Category</th>
                <th>Function</th>
                <th>Shortcut</th>
                <th>Rate</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {results.map((s) => {
                const appMeta      = APPS.find((a) => a.id === s.app) || {}
                const shortcutText = platform === 'mac' ? s.mac : s.win
                const ratingLabel  = rated[s.id]
                const card         = progress?.[s.id] || {}
                const isFavourite  = !!card.favourite
                const flagged      = !!card.needsEdit

                return (
                  <tr
                    key={s.id}
                    className={`study-row ${ratingLabel ? `study-row--${ratingLabel}` : ''}`}
                  >
                    <td className="study-cell study-cell--app">
                      <span title={appMeta.label}>{appMeta.icon}</span>
                      <span className="study-app-label">{appMeta.label}</span>
                    </td>
                    <td className="study-cell study-cell--cat">{s.cat}</td>
                    <td className="study-cell study-cell--action">{s.action}</td>
                    <td className="study-cell study-cell--shortcut">
                      <kbd className="shortcut-badge">{shortcutText}</kbd>
                    </td>
                    <td className="study-cell study-cell--rate">
                      {ratingLabel ? (
                        <span className={`rating-badge rating-badge--${ratingLabel}`}>
                          {ratingLabel.charAt(0).toUpperCase() + ratingLabel.slice(1)}
                        </span>
                      ) : (
                        <div className="inline-rate-btns">
                          <button className="inline-rate-btn inline-rate-btn--again" onClick={() => handleRate(s.id, QUALITY.AGAIN, 'again')}>Again</button>
                          <button className="inline-rate-btn inline-rate-btn--hard"  onClick={() => handleRate(s.id, QUALITY.HARD,  'hard')} >Hard</button>
                          <button className="inline-rate-btn inline-rate-btn--good"  onClick={() => handleRate(s.id, QUALITY.GOOD,  'good')} >Good</button>
                          <button className="inline-rate-btn inline-rate-btn--easy"  onClick={() => handleRate(s.id, QUALITY.EASY,  'easy')} >Easy</button>
                        </div>
                      )}
                    </td>
                    <td className="study-cell study-cell--icons">
                      <button className={`row-icon-btn ${isFavourite ? 'row-icon-btn--on' : ''}`} onClick={() => toggleFavourite?.(s.id)} title="Toggle favourite">⭐</button>
                      <button className={`row-icon-btn ${flagged ? 'row-icon-btn--warn' : ''}`}   onClick={() => toggleNeedsEdit?.(s.id)}  title="Flag for editing">🚩</button>
                      <button className="row-icon-btn" onClick={() => setEditTarget(s)} title="Edit shortcut">🖊️</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {editTarget && (
        <EditModal shortcut={editTarget} onClose={() => setEditTarget(null)} />
      )}
    </div>
  )
}
