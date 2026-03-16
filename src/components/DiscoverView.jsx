import { useState, useCallback, useMemo } from 'react'
import FlashCard from './FlashCard'
import { getCardStatus } from '../utils/sm2'

/**
 * DiscoverView — Random shortcut discovery mode.
 *
 * Introduces shortcuts the user hasn't seen yet, drawn randomly.
 * Shortcuts already well-known (interval ≥ 21 days) are excluded.
 */
export default function DiscoverView({ shortcuts, platform, progress, getCard, rateCard }) {
  const [seed, setSeed] = useState(0)
  const [seen, setSeen] = useState(new Set())

  // Prioritise shortcuts the user hasn't encountered yet
  const candidates = useMemo(() => {
    const unknown = shortcuts.filter((s) => {
      const c = getCard(s.id)
      return !c.lastReviewed
    })
    // Fall back to all shortcuts if there are no new ones
    const pool = unknown.length > 0 ? unknown : shortcuts
    return pool.filter((s) => !seen.has(s.id))
  }, [shortcuts, progress, getCard, seen, seed])

  const current = useMemo(() => {
    if (!candidates.length) return null
    const idx = Math.floor(Math.random() * candidates.length)
    return candidates[idx]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, candidates.length])

  function nextCard() {
    if (current) setSeen((prev) => new Set([...prev, current.id]))
    setSeed((s) => s + 1)
  }

  function handleRate(quality) {
    if (!current) return
    rateCard(current.id, quality)
    nextCard()
  }

  if (!current) {
    return (
      <div className="empty-state">
        <div className="empty-icon">✨</div>
        <h2 className="empty-title">You've discovered everything!</h2>
        <p className="empty-body">
          Head to <strong>Practice</strong> to reinforce what you've learned with spaced repetition.
        </p>
        <button className="btn-primary" onClick={() => setSeen(new Set())}>
          Shuffle again
        </button>
      </div>
    )
  }

  const status = getCardStatus(getCard(current.id))

  return (
    <div className="discover-view">
      <div className="discover-header">
        <p className="discover-subtitle">
          Discover a new shortcut — rate it to add it to your practice deck.
        </p>
        <div className="discover-status">
          {status === 'new' && <span className="badge badge--new">New to you</span>}
          {status === 'learning' && <span className="badge badge--learning">In progress</span>}
          {status === 'review' && <span className="badge badge--review">Review</span>}
        </div>
      </div>

      <FlashCard
        shortcut={current}
        platform={platform}
        cardState={getCard(current.id)}
        onRate={handleRate}
      />

      <button className="btn-skip" onClick={nextCard}>
        Skip →
      </button>
    </div>
  )
}
