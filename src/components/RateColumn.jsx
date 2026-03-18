import { QUALITY } from '../utils/sm2'

/** Numeric sort key for a session rating label (unrated = 0, again = 1 … easy = 4) */
export const RATING_ORDER = { again: 1, hard: 2, good: 3, easy: 4 }

/**
 * RateTh — the Rate column header.
 * Clicking toggles hide/show (via toggleRateCol).
 * When visible it also acts as a sort trigger (via onSort).
 */
export function RateTh({ showRateCol, toggleRateCol, sortActive, sortDir, onSort }) {
  if (!showRateCol) {
    return (
      <th
        className="rate-col-collapsed"
        onClick={toggleRateCol}
        title="Show Rate column"
      >▶</th>
    )
  }
  return (
    <th
      className={`sortable-th rate-th ${sortActive ? 'sortable-th--active' : ''}`}
      title="Rate your recall: Again = forgot • Hard = struggled • Good = recalled • Easy = effortless. Click to sort / hide."
    >
      <span onClick={onSort} style={{ cursor: 'pointer' }}>
        Rate{sortActive ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
      </span>
      <button
        className="col-hide-btn"
        onClick={(e) => { e.stopPropagation(); toggleRateCol() }}
        title="Hide Rate column"
        aria-label="Hide Rate column"
      >—</button>
    </th>
  )
}

/**
 * RateTd — the Rate column data cell.
 * Shows rating buttons (or a rated badge) when visible; empty cell when hidden.
 */
export function RateTd({ showRateCol, shortcutId, ratingLabel, onRate }) {
  if (!showRateCol) return <td className="rate-col-hidden" />

  return (
    <td className="study-cell study-cell--rate">
      {ratingLabel ? (
        <span className={`rating-badge rating-badge--${ratingLabel}`}>
          {ratingLabel.charAt(0).toUpperCase() + ratingLabel.slice(1)}
        </span>
      ) : (
        <div className="inline-rate-btns">
          <button className="inline-rate-btn inline-rate-btn--again" onClick={() => onRate(shortcutId, QUALITY.AGAIN, 'again')}>Again</button>
          <button className="inline-rate-btn inline-rate-btn--hard"  onClick={() => onRate(shortcutId, QUALITY.HARD,  'hard')} >Hard</button>
          <button className="inline-rate-btn inline-rate-btn--good"  onClick={() => onRate(shortcutId, QUALITY.GOOD,  'good')} >Good</button>
          <button className="inline-rate-btn inline-rate-btn--easy"  onClick={() => onRate(shortcutId, QUALITY.EASY,  'easy')} >Easy</button>
        </div>
      )}
    </td>
  )
}
