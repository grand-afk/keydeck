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
 *
 * Each card entry may include:
 *   { repetitions, interval, easeFactor, nextReview,   ← SM-2 fields
 *     favourite: bool,                                  ← starred by user
 *     needsEdit: bool }                                 ← flagged for correction
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

  /** Toggle the ⭐ favourite flag on a shortcut. */
  const toggleFavourite = useCallback((id) => {
    setProgress((prev) => {
      const current = prev[id] || defaultCardState()
      const updated = { ...prev, [id]: { ...current, favourite: !current.favourite } }
      saveProgress(updated)
      return updated
    })
  }, [])

  /** Toggle the 🚩 needs-edit flag on a shortcut. */
  const toggleNeedsEdit = useCallback((id) => {
    setProgress((prev) => {
      const current = prev[id] || defaultCardState()
      const updated = { ...prev, [id]: { ...current, needsEdit: !current.needsEdit } }
      saveProgress(updated)
      return updated
    })
  }, [])

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

  /**
   * Export ALL progress + overrides as a JSON blob the user can save.
   * Also bundles the current overrides so nothing is lost.
   */
  const exportData = useCallback(() => {
    try {
      const overridesRaw = localStorage.getItem('keydeck:overrides')
      const payload = {
        exportedAt: new Date().toISOString(),
        progress,
        overrides: overridesRaw ? JSON.parse(overridesRaw) : {},
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `keydeck-backup-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Export failed', e)
    }
  }, [progress])

  /**
   * Import a previously exported JSON file.
   * Merges (or replaces) progress and overrides.
   */
  const importData = useCallback((jsonText, mode = 'merge') => {
    try {
      const payload = JSON.parse(jsonText)
      setProgress((prev) => {
        const newProgress = mode === 'replace'
          ? payload.progress
          : { ...prev, ...payload.progress }
        saveProgress(newProgress)
        return newProgress
      })
      if (payload.overrides && Object.keys(payload.overrides).length > 0) {
        const existingRaw = localStorage.getItem('keydeck:overrides')
        const existing = existingRaw ? JSON.parse(existingRaw) : {}
        const merged = mode === 'replace'
          ? payload.overrides
          : { ...existing, ...payload.overrides }
        localStorage.setItem('keydeck:overrides', JSON.stringify(merged))
      }
      return true
    } catch (e) {
      console.error('Import failed', e)
      return false
    }
  }, [])

  return {
    progress,
    getCard,
    rateCard,
    resetProgress,
    getStats,
    toggleFavourite,
    toggleNeedsEdit,
    exportData,
    importData,
  }
}
