/**
 * SM-2 Spaced Repetition Algorithm
 * Based on the algorithm used by Anki (SuperMemo 2)
 *
 * Quality ratings (passed in from the UI):
 *   1 = Again   (complete blackout / wrong)
 *   3 = Hard    (correct with significant difficulty)
 *   4 = Good    (correct after some hesitation)
 *   5 = Easy    (perfect recall)
 */

export const QUALITY = {
  AGAIN: 1,
  HARD: 3,
  GOOD: 4,
  EASY: 5,
}

/**
 * Default state for a brand-new card.
 */
export function defaultCardState() {
  return {
    repetitions: 0,   // how many times reviewed successfully in a row
    easeFactor: 2.5,  // multiplier for interval growth (min 1.3)
    interval: 1,      // days until next review
    nextReview: null, // ISO date string — null means "new, review immediately"
    lastQuality: null,
    lastReviewed: null,
  }
}

/**
 * Calculate the next review state given the current card state and user rating.
 *
 * @param {object} card  - current SM-2 state (from defaultCardState or previous run)
 * @param {number} quality - 1 | 3 | 4 | 5
 * @returns {object} updated card state
 */
export function calculateNextReview(card, quality) {
  let { repetitions = 0, easeFactor = 2.5, interval = 1 } = card

  if (quality >= 3) {
    // Correct response — advance the card
    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
    repetitions += 1
  } else {
    // Wrong — reset to beginning
    repetitions = 0
    interval = 1
  }

  // Adjust ease factor (clamp minimum at 1.3 to avoid near-zero growth)
  easeFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02),
  )

  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + interval)

  return {
    repetitions,
    easeFactor: Math.round(easeFactor * 100) / 100,
    interval,
    nextReview: nextReview.toISOString(),
    lastQuality: quality,
    lastReviewed: new Date().toISOString(),
  }
}

/**
 * Returns true if the card is due for review today (or has never been seen).
 */
export function isDue(cardState) {
  if (!cardState || !cardState.nextReview) return true
  return new Date(cardState.nextReview) <= new Date()
}

/**
 * Returns a human-readable status label for a card.
 * 'new' | 'learning' | 'review'
 */
export function getCardStatus(cardState) {
  if (!cardState || cardState.repetitions === 0) return 'new'
  if (cardState.interval < 7) return 'learning'
  return 'review'
}

/**
 * Human-readable label for when the card is next due.
 */
export function nextDueLabel(cardState) {
  if (!cardState || !cardState.nextReview) return 'Now'
  const diff = Math.round(
    (new Date(cardState.nextReview) - new Date()) / (1000 * 60 * 60 * 24),
  )
  if (diff <= 0) return 'Now'
  if (diff === 1) return 'Tomorrow'
  return `${diff}d`
}
