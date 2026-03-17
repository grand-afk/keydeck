import { useState, useMemo } from 'react'
import { QUALITY } from '../utils/sm2'
import { APPS } from '../data/index'
import EditModal from './EditModal'

const DISCOVER_BATCH = 10

/**
 * DiscoverView — tabular discovery session (request #11).
 *
 * Prioritises shortcuts the user has never seen (repetitions === 0).
 * Same table layout as StudyView with click-to-reveal shortcuts.
 * Rating a row adds it to the Practice deck automatically (SM-2 via rateCard).
 */
export default function DiscoverView({
  shortcuts,
  platform,
  progress,
  rateCard,
  toggleFavourite,
  toggleNeedsEdit,
}) {
  const [revealed,    setReveal]    = useState({})
  const [rated,       setRated]     = useState({})
  const [editTarget,  setEditTarget] = useState(null)
  const [batch,       setBatch]     = useState(null)   // null = needs (re)generate

  // Fisher-Yates shuffle — produces a genuinely random order every call
  function shuffle(arr) {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  // Compute a fresh batch; called on mount and each "New batch" press
  const currentBatch = useMemo(() => {
    if (batch !== null) return batch   // already generated — keep stable
    const unseen = shortcuts.filter(
      (s) => !progress[s.id] || progress[s.id].repetitions === 0,
    )
    const pool = unseen.length >= DISCOVER_BATCH ? unseen : shortcuts
    return shuffle(pool).slice(0, DISCOVER_BATCH)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batch, shortcuts, progress])

  const totalRated = Object.keys(rated).length

  function reveal(id) {
    setReveal((prev) => ({ ...prev, [id]: true }))
  }

  function handleRate(id, quality, label) {
    rateCard(id, quality)     // adds it to practice deck via SM-2
    setRated((prev) => ({ ...prev, [id]: label }))
  }

  function nextBatch() {
    const unseen = shortcuts.filter(
      (s) => !progress[s.id] || progress[s.id].repetitions === 0,
    )
    const pool = unseen.length >= DISCOVER_BATCH ? unseen : shortcuts
    const next = shuffle(pool).slice(0, DISCOVER_BATCH)
    setBatch(next)
    setReveal({})
    setRated({})
  }

  if (shortcuts.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-icon">🎲</p>
        <p>No shortcuts to discover with the current filter.</p>
      </div>
    )
  }

  return (
    <div className="study-view">
      <div className="study-header">
        <h2 className="study-title">🎲 Discover Shortcuts</h2>
        <span className="study-progress">
          {totalRated} / {currentBatch.length} rated
        </span>
      </div>

      <p className="discover-hint">
        Rate each shortcut to add it to your Practice deck. Prioritising shortcuts you haven't seen yet.
      </p>

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
            {currentBatch.map((s) => {
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
                  <td className="study-cell study-cell--app">
                    <span title={appMeta.label}>{appMeta.icon}</span>
                    <span className="study-app-label">{appMeta.label}</span>
                  </td>
                  <td className="study-cell study-cell--cat">{s.cat}</td>
                  <td className="study-cell study-cell--action">{s.action}</td>
                  <td className="study-cell study-cell--shortcut">
                    {isRevealed ? (
                      <kbd className="shortcut-badge">{shortcutText}</kbd>
                    ) : (
                      <button className="reveal-btn" onClick={() => reveal(s.id)}>
                        Reveal ▶
                      </button>
                    )}
                  </td>
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

      <div className="study-complete">
        <button className="btn-secondary" onClick={nextBatch}>
          🔀 New batch
        </button>
      </div>

      {editTarget && (
        <EditModal shortcut={editTarget} onClose={() => setEditTarget(null)} />
      )}
    </div>
  )
}
