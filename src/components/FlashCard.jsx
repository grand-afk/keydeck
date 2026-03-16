import { useState, useEffect } from 'react'
import { QUALITY } from '../utils/sm2'
import { APPS } from '../data/index'

/**
 * FlashCard — shows the action, flips to reveal the shortcut.
 * Calls onRate(quality) after the user rates their recall.
 */
export default function FlashCard({ shortcut, platform, cardState, onRate }) {
  const [flipped, setFlipped] = useState(false)

  // Reset flip when shortcut changes
  useEffect(() => {
    setFlipped(false)
  }, [shortcut?.id])

  if (!shortcut) return null

  const appMeta = APPS.find((a) => a.id === shortcut.app) || {}
  const shortcutText = platform === 'mac' ? shortcut.mac : shortcut.win

  function handleRate(quality) {
    onRate(quality)
    setFlipped(false)
  }

  return (
    <div className="flashcard-wrapper">
      {/* Progress chips */}
      <div className="card-meta">
        <span className="app-badge">
          {appMeta.icon} {appMeta.label}
        </span>
        <span className="card-cat">{shortcut.cat}</span>
      </div>

      {/* The card itself */}
      <div
        className={`card ${flipped ? 'card--flipped' : ''}`}
        onClick={() => !flipped && setFlipped(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && !flipped && setFlipped(true)}
        aria-label={flipped ? 'Card revealed' : 'Tap to reveal shortcut'}
      >
        <div className="card-inner">
          {/* FRONT */}
          <div className="card-face card-front">
            <p className="card-action">{shortcut.action}</p>
            {shortcut.context && (
              <p className="card-context">{shortcut.context}</p>
            )}
            <p className="card-hint">Tap to reveal</p>
          </div>

          {/* BACK */}
          <div className="card-face card-back">
            <p className="card-action card-action--back">{shortcut.action}</p>
            <p className="card-shortcut">{shortcutText}</p>
            {shortcut.isSequence && (
              <span className="badge badge--sequence">Sequence</span>
            )}
          </div>
        </div>
      </div>

      {/* Rating buttons — only visible after flip */}
      {flipped && (
        <div className="rating-buttons" role="group" aria-label="Rate your recall">
          <button
            className="rate-btn rate-btn--again"
            onClick={() => handleRate(QUALITY.AGAIN)}
          >
            <span className="rate-icon">✕</span>
            <span className="rate-label">Again</span>
            <span className="rate-sub">Didn't know it</span>
          </button>
          <button
            className="rate-btn rate-btn--hard"
            onClick={() => handleRate(QUALITY.HARD)}
          >
            <span className="rate-icon">~</span>
            <span className="rate-label">Hard</span>
            <span className="rate-sub">Barely remembered</span>
          </button>
          <button
            className="rate-btn rate-btn--good"
            onClick={() => handleRate(QUALITY.GOOD)}
          >
            <span className="rate-icon">✓</span>
            <span className="rate-label">Good</span>
            <span className="rate-sub">Got it</span>
          </button>
          <button
            className="rate-btn rate-btn--easy"
            onClick={() => handleRate(QUALITY.EASY)}
          >
            <span className="rate-icon">★</span>
            <span className="rate-label">Easy</span>
            <span className="rate-sub">Nailed it</span>
          </button>
        </div>
      )}
    </div>
  )
}
