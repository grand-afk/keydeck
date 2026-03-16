import { useState, useCallback } from 'react'

const STORAGE_KEY = 'keydeck:settings'

const DEFAULTS = {
  platform: 'mac',       // 'mac' | 'windows'
  selectedApps: ['all'], // app IDs or ['all']
  priorityFilter: 0,     // 0 = all, 1 = priority ≤ 1, 2 = ≤ 2, 3 = ≤ 3
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

function persist(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (e) {
    console.warn('Could not save settings', e)
  }
}

/**
 * Manages user preferences: platform toggle and selected apps.
 * Settings are persisted to localStorage.
 */
export function useSettings() {
  const [settings, setSettings] = useState(() => loadSettings())

  const update = useCallback((patch) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      persist(next)
      return next
    })
  }, [])

  const setPlatform = useCallback(
    (platform) => update({ platform }),
    [update],
  )

  const toggleApp = useCallback(
    (appId) => {
      setSettings((prev) => {
        let next
        if (appId === 'all') {
          next = { ...prev, selectedApps: ['all'] }
        } else {
          const current = prev.selectedApps.filter((a) => a !== 'all')
          const exists = current.includes(appId)
          const updated = exists
            ? current.filter((a) => a !== appId)
            : [...current, appId]
          next = { ...prev, selectedApps: updated.length ? updated : ['all'] }
        }
        persist(next)
        return next
      })
    },
    [],
  )

  const setPriorityFilter = useCallback(
    (priorityFilter) => update({ priorityFilter }),
    [update],
  )

  return { ...settings, setPlatform, toggleApp, setPriorityFilter }
}
