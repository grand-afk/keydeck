import { useState, useMemo } from 'react'
import { QUALITY } from '../utils/sm2'
import { APPS } from '../data/index'
import EditModal from './EditModal'

const DAILY_LIMIT = 10

/**
 * StudyView — tabular daily practice.
 * Shows up to 10 due shortcuts with shortcuts always visible (no reveal step).
 * Column headers are sortable (#5).
 */
export default function StudyView({
  shortcuts,
  platform,
  progress,
  rateCard,
  toggleFavourite,
  toggleNeedsEdit,
}) {
  const [rated,      setRated]     = useState({})
  const [editTarget, setEditTarget] = useState(null)
  const [sort,       setSort]      = useState({ key: null, dir: 'asc' })

  const dueCards = useMemo(() => {
    const now = new Date()
    const due = shortcuts.filter((s) => {
      const card = progress[s.id]
      if (!card || card.repetitions === 0) return true
      return new Date(card.nextReview) <= now
    })
    return due.slice(0, DAILY_LIMIT)
  }, [shortcuts, progress])

  // Sorted view of due cards
  const sortedCards = useMemo(() => {
    if (!sort.key) return dueCards
    return [...dueCards].sort((a, b) => {
      let av = '', bv = ''
      if (sort.key === 'app')      { av = a.app;    bv = b.app }
      if (sort.key === 'cat')      { av = a.cat;    bv = b.cat }
      if (sort.key === 'action')   { av = a.action; bv = b.action }
      if (sort.key === 'shortcut') { av = platform === 'mac' ? a.mac : a.win; bv = platform === 'mac' ? b.mac : b.win }
      const cmp = av.localeCompare(bv)
      return sort.dir === 'asc' ? cmp : -cmp
    })
  }, [dueCards, sort, platform])

  function toggleSort(key) {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' }
    )
  }

  function SortTh({ colKey, children }) {
    const active = sort.key === colKey
    return (
      <th
        className={`sortable-th ${active ? 'sortable-th--active' : ''}`}
        onClick={() => toggleSort(colKey)}
        title={`Sort by ${children}`}
      >
        {children}
        <span className="sort-arrow">{active ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : ' ↕'}</span>
      </th>
    )
  }

  const totalRated = Object.keys(rated).length

  function handleRate(id, quality, label) {
    rateCard(id, quality)
    setRated((prev) => ({ ...prev, [id]: label }))
  }

  if (dueCards.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-icon">🎉</p>
        <h2>All caught up!</h2>
        <p>No shortcuts due for review today. Come back tomorrow.</p>
      </div>
    )
  }

  return (
    <div className="study-view">
      <div className="study-header">
        <h2 className="study-title">📋 Today's Study Session</h2>
        <span className="study-progress">{totalRated} / {dueCards.length} rated</span>
      </div>

      <div className="study-table-wrapper">
        <table className="study-table">
          <thead>
            <tr>
              <SortTh colKey="app">App</SortTh>
              <SortTh colKey="cat">Category</SortTh>
              <SortTh colKey="action">Function</SortTh>
              <SortTh colKey="shortcut">Shortcut</SortTh>
              <th>Rate</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedCards.map((s) => {
              const appMeta      = APPS.find((a) => a.id === s.app) || {}
              const shortcutText = platform === 'mac' ? s.mac : s.win
              const ratingLabel  = rated[s.id]
              const card         = progress[s.id] || {}
              const isFavourite  = !!card.favourite
              const flagged      = !!card.needsEdit

              return (
                <tr key={s.id} className={`study-row ${ratingLabel ? `study-row--${ratingLabel}` : ''}`}>
                  <td className="study-cell study-cell--app">
                    <span title={appMeta.label}>{appMeta.icon}</span>
                    <span className="study-app-label">{appMeta.label}</span>
                  </td>
                  <td className="study-cell study-cell--cat">{s.cat}</td>
                  <td className="study-cell study-cell--action">{s.action}</td>
                  {/* Shortcut always visible — no reveal step (#5) */}
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
                    <button className={`row-icon-btn ${flagged ? 'row-icon-btn--warn' : ''}`}  onClick={() => toggleNeedsEdit?.(s.id)}  title="Flag for editing">🚩</button>
                    <button className="row-icon-btn" onClick={() => setEditTarget(s)} title="Edit shortcut">🖊️</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {totalRated === dueCards.length && (
        <div className="study-complete">
          <p>✅ Session complete! All {dueCards.length} shortcuts rated.</p>
          <button className="btn-primary" onClick={() => setRated({})}>Next batch →</button>
        </div>
      )}

      {editTarget && <EditModal shortcut={editTarget} onClose={() => setEditTarget(null)} />}
    </div>
  )
}
