import { useState, useCallback } from 'react'
import { calculateNextReview, defaultCardState } from '../utils/sm2'

const STORAGE_KEY = 'keydeck:progress'

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Could not save progress to localStorage', e)
  }
}

/**
 * Manages SM-2 card state for every shortcut.
 * Progress is persisted to localStorage under the key "keydeck:progress".
 */
export function useProgress() {
  const [progress, setProgress] = useState(() => loadProgress())

  /** Get SM-2 state for a single shortcut ID. */
  const getCard = useCallback(
    (id) => progress[id] || defaultCardState(),
    [progress],
  )

  /** Record a rating (1/3/4/5) for a shortcut and advance its SM-2 state. */
  const rateCard = useCallback(
    (id, quality) => {
      setProgress((prev) => {
        const current = prev[id] || defaultCardState()
        const updated = { ...prev, [id]: calculateNextReview(current, quality) }
        saveProgress(updated)
        return updated
      })
    },
    [],
  )

  /** Reset all progress for a specific app (or all apps if appId is undefined). */
  const resetProgress = useCallback(
    (appId, allShortcuts) => {
      setProgress((prev) => {
        let updated
        if (!appId) {
          updated = {}
        } else {
          updated = { ...prev }
          allShortcuts
            .filter((s) => s.app === appId)
            .forEach((s) => delete updated[s.id])
        }
        saveProgress(updated)
        return updated
      })
    },
    [],
  )

  /** Summary counts — useful for stats display. */
  const getStats = useCallback(
    (shortcuts) => {
      const now = new Date()
      let newCards = 0, learning = 0, review = 0, due = 0

      shortcuts.forEach((s) => {
        const card = progress[s.id]
        if (!card || card.repetitions === 0) {
          newCards++
          due++
        } else {
          if (card.interval < 7) learning++
          else review++
          if (new Date(card.nextReview) <= now) due++
        }
      })

      return { newCards, learning, review, due, total: shortcuts.length }
    },
    [progress],
  )

  return { progress, getCard, rateCard, resetProgress, getStats }
}
