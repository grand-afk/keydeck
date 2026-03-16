import { useState, useMemo } from 'react'
import FlashCard from './FlashCard'
import { isDue, nextDueLabel } from '../utils/sm2'

/**
 * PracticeView — Spaced repetition practice queue.
 *
 * Shows cards that are due for review today (or are brand new).
 * When the queue is empty, shows a completion screen with stats.
 */
export default function PracticeView({ shortcuts, platform, progress, getCard, rateCard }) {
  const [sessionRated, setSessionRated] = useState(0)

  // Build the due queue — new cards first, then overdue
  const dueQueue = useMemo(() => {
    const due = shortcuts.filter((s) => isDue(getCard(s.id)))
    // Sort: new (no state) first, then by overdue amount
    return due.sort((a, b) => {
      const ca = getCard(a.id)
      const cb = getCard(b.id)
      if (!ca.lastReviewed && cb.lastReviewed) return -1
      if (ca.lastReviewed && !cb.lastReviewed) return 1
      return 0
    })
  }, [shortcuts, progress, getCard])

  // Current card is always the head of the queue
  const current = dueQueue[0]
  const remaining = dueQueue.length

  function handleRate(quality) {
    if (!current) return
    rateCard(current.id, quality)
    setSessionRated((n) => n + 1)
  }

  // ---- Stats row ----
  const stats = useMemo(() => {
    const now = new Date()
    let newCount = 0, learningCount = 0, reviewCount = 0

    shortcuts.forEach((s) => {
      const c = getCard(s.id)
      if (!c.lastReviewed) newCount++
      else if (c.interval < 7) learningCount++
      else reviewCount++
    })

    return { new: newCount, learning: learningCount, review: reviewCount }
  }, [shortcuts, progress, getCard])

  // ---- Empty state ----
  if (remaining === 0) {
    // Find next card due
    const upcoming = shortcuts
      .filter((s) => {
        const c = getCard(s.id)
        return c.nextReview && new Date(c.nextReview) > new Date()
      })
      .sort((a, b) =>
        new Date(getCard(a.id).nextReview) - new Date(getCard(b.id).nextReview),
      )

    const nextCard = upcoming[0]
    const nextLabel = nextCard ? nextDueLabel(getCard(nextCard.id)) : null

    return (
      <div className="empty-state">
        <div className="empty-icon">🎉</div>
        <h2 className="empty-title">All caught up!</h2>
        <p className="empty-body">
          You've reviewed all {sessionRated > 0 ? `${sessionRated} ` : ''}due cards.
          {nextLabel && ` Next review: ${nextLabel}.`}
        </p>
        <div className="stats-row">
          <div className="stat">
            <span className="stat-num stat-new">{stats.new}</span>
            <span className="stat-lbl">New</span>
          </div>
          <div className="stat">
            <span className="stat-num stat-learning">{stats.learning}</span>
            <span className="stat-lbl">Learning</span>
          </div>
          <div className="stat">
            <span className="stat-num stat-review">{stats.review}</span>
            <span className="stat-lbl">Review</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="practice-view">
      {/* Queue counter */}
      <div className="queue-row">
        <div className="queue-stats">
          <span className="queue-badge queue-new">{stats.new} new</span>
          <span className="queue-badge queue-learning">{stats.learning} learning</span>
          <span className="queue-badge queue-review">{stats.review} review</span>
        </div>
        <span className="queue-remaining">{remaining} remaining</span>
      </div>

      <FlashCard
        shortcut={current}
        platform={platform}
        cardState={getCard(current.id)}
        onRate={handleRate}
      />
    </div>
  )
}
