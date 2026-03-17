import { useState, useCallback } from 'react'

const SETTINGS_KEY = 'keydeck:settings'

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveSettings(data) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Could not save settings', e)
  }
}

export function useSettings() {
  const [settings, setSettings] = useState(() => loadSettings())

  const update = useCallback((patch) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      saveSettings(next)
      return next
    })
  }, [])

  const platform      = settings.platform      ?? 'mac'
  const selectedApps  = settings.selectedApps  ?? []
  const showFavourites = settings.showFavourites ?? false

  const setPlatform = useCallback(
    (p) => update({ platform: p }),
    [update],
  )

  const toggleApp = useCallback(
    (appId) => {
      update({
        selectedApps: selectedApps.includes(appId)
          ? selectedApps.filter((a) => a !== appId)
          : [...selectedApps, appId],
      })
    },
    [selectedApps, update],
  )

  const toggleShowFavourites = useCallback(
    () => update({ showFavourites: !showFavourites }),
    [showFavourites, update],
  )

  return {
    platform,
    setPlatform,
    selectedApps,
    toggleApp,
    showFavourites,
    toggleShowFavourites,
  }
}
