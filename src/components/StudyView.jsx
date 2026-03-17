import { useState, useMemo } from 'react'
import { QUALITY } from '../utils/sm2'
import { APPS } from '../data/index'
import EditModal from './EditModal'

const DAILY_LIMIT = 10

/**
 * StudyView — tabular daily practice session.
 *
 * Shows up to 10 shortcuts that are due for review today in a table.
 * Each row has:  App | Category | Function | Shortcut (click to reveal) | Rate
 *
 * Requests #2 and #11.
 */
export default function StudyView({
  shortcuts,
  platform,
  progress,
  rateCard,
  toggleFavourite,
  toggleNeedsEdit,
}) {
  // Track which rows have been revealed and which have been rated
  const [revealed, setReveal] = useState({})     // { [id]: true }
  const [rated,    setRated]  = useState({})     // { [id]: 'again'|'hard'|'good'|'easy' }
  const [editTarget, setEditTarget] = useState(null)
  const [sessionDone, setSessionDone] = useState(false)

  // Pick up to DAILY_LIMIT shortcuts that are due
  const dueCards = useMemo(() => {
    const now = new Date()
    const due = shortcuts.filter((s) => {
      const card = progress[s.id]
      if (!card || card.repetitions === 0) return true           // new
      return new Date(card.nextReview) <= now                    // overdue
    })
    return due.slice(0, DAILY_LIMIT)
  }, [shortcuts, progress])

  const totalRated = Object.keys(rated).length

  function reveal(id) {
    setReveal((prev) => ({ ...prev, [id]: true }))
  }

  function handleRate(id, quality, label) {
    rateCard(id, quality)
    setRated((prev) => ({ ...prev, [id]: label }))
  }

  function startNextBatch() {
    setReveal({})
    setRated({})
    setSessionDone(false)
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
        <span className="study-progress">
          {totalRated} / {dueCards.length} rated
        </span>
      </div>

      <div className="study-table-wrapper">
        <table className="study-table">
          <thead>
            <tr>
              <th>App</th>
              <th>Category</th>
              <th>Function</th>
              <th>Shortcut</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {dueCards.map((s) => {
              const appMeta      = APPS.find((a) => a.id === s.app) || {}
              const shortcutText = platform === 'mac' ? s.mac : s.win
              const isRevealed   = !!revealed[s.id]
              const ratingLabel  = rated[s.id]
              const card         = progress[s.id] || {}
              const isFavourite  = !!card.favourite
              const flagged      = !!card.needsEdit

              return (
                <tr
                  key={s.id}
                  className={`study-row ${ratingLabel ? `study-row--${ratingLabel}` : ''}`}
                >
                  {/* App */}
                  <td className="study-cell study-cell--app">
                    <span title={appMeta.label}>{appMeta.icon}</span>
                    <span className="study-app-label">{appMeta.label}</span>
                  </td>

                  {/* Category */}
                  <td className="study-cell study-cell--cat">{s.cat}</td>

                  {/* Function */}
                  <td className="study-cell study-cell--action">{s.action}</td>

                  {/* Shortcut — click to reveal */}
                  <td className="study-cell study-cell--shortcut">
                    {isRevealed ? (
                      <kbd className="shortcut-badge">{shortcutText}</kbd>
                    ) : (
                      <button
                        className="reveal-btn"
                        onClick={() => reveal(s.id)}
                        title="Click to reveal shortcut"
                      >
                        Reveal ▶
                      </button>
                    )}
                  </td>

                  {/* Rate buttons — only shown after reveal */}
                  <td className="study-cell study-cell--rate">
                    {ratingLabel ? (
                      <span className={`rating-badge rating-badge--${ratingLabel}`}>
                        {ratingLabel.charAt(0).toUpperCase() + ratingLabel.slice(1)}
                      </span>
                    ) : isRevealed ? (
                      <div className="inline-rate-btns">
                        <button className="inline-rate-btn inline-rate-btn--again" onClick={() => handleRate(s.id, QUALITY.AGAIN, 'again')}>Again</button>
                        <button className="inline-rate-btn inline-rate-btn--hard"  onClick={() => handleRate(s.id, QUALITY.HARD,  'hard')} >Hard</button>
                        <button className="inline-rate-btn inline-rate-btn--good"  onClick={() => handleRate(s.id, QUALITY.GOOD,  'good')} >Good</button>
                        <button className="inline-rate-btn inline-rate-btn--easy"  onClick={() => handleRate(s.id, QUALITY.EASY,  'easy')} >Easy</button>
                      </div>
                    ) : (
                      <span className="study-cell--pending">—</span>
                    )}
                  </td>

                  {/* Action icons */}
                  <td className="study-cell study-cell--icons">
                    <button
                      className={`row-icon-btn ${isFavourite ? 'row-icon-btn--on' : ''}`}
                      onClick={() => toggleFavourite?.(s.id)}
                      title={isFavourite ? 'Unfavourite' : 'Favourite'}
                    >⭐</button>
                    <button
                      className={`row-icon-btn ${flagged ? 'row-icon-btn--warn' : ''}`}
                      onClick={() => toggleNeedsEdit?.(s.id)}
                      title={flagged ? 'Remove edit flag' : 'Flag for editing'}
                    >🚩</button>
                    <button
                      className="row-icon-btn"
                      onClick={() => setEditTarget(s)}
                      title="Edit shortcut"
                    >🖊️</button>
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
          <button className="btn-primary" onClick={startNextBatch}>
            Next batch →
          </button>
        </div>
      )}

      {editTarget && (
        <EditModal
          shortcut={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}
    </div>
  )
}
