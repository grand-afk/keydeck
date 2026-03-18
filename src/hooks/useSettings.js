import { useState, useCallback, useEffect } from 'react'

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

// ── URL sync for platform — ?p=mac or ?p=win ───────────────────────────────
function getPlatformFromUrl() {
  try {
    return new URLSearchParams(window.location.search).get('p') || null
  } catch { return null }
}

function setPlatformInUrl(p) {
  try {
    const url = new URL(window.location.href)
    url.searchParams.set('p', p)
    window.history.replaceState({}, '', url.toString())
  } catch {}
}

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    const saved = loadSettings()
    const urlPlatform = getPlatformFromUrl()
    if (urlPlatform === 'mac' || urlPlatform === 'win') saved.platform = urlPlatform
    return saved
  })

  const update = useCallback((patch) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      saveSettings(next)
      return next
    })
  }, [])

  const platform       = settings.platform       ?? 'mac'
  const selectedApps   = settings.selectedApps   ?? []
  const hiddenApps     = settings.hiddenApps      ?? []
  const showFavourites = settings.showFavourites  ?? false
  const darkMode       = settings.darkMode        ?? true   // default: dark
  const showRateCol    = settings.showRateCol     ?? true   // default: visible

  // Keep URL param in sync
  useEffect(() => { setPlatformInUrl(platform) }, [platform])

  const setPlatform = useCallback((p) => update({ platform: p }), [update])

  const toggleApp = useCallback(
    (appId) => update({
      selectedApps: selectedApps.includes(appId)
        ? selectedApps.filter((a) => a !== appId)
        : [...selectedApps, appId],
    }),
    [selectedApps, update],
  )

  const setSelectedApps = useCallback(
    (apps) => update({ selectedApps: apps }),
    [update],
  )

  // toggleHideApp: permanently remove/restore an app from the chip row + shortcuts.
  // Also removes the app from selectedApps so a hidden app can never be an active filter.
  const toggleHideApp = useCallback(
    (appId) => {
      const newHidden = hiddenApps.includes(appId)
        ? hiddenApps.filter((a) => a !== appId)
        : [...hiddenApps, appId]
      const newSelected = selectedApps.filter((a) => !newHidden.includes(a))
      update({ hiddenApps: newHidden, selectedApps: newSelected })
    },
    [hiddenApps, selectedApps, update],
  )

  const toggleShowFavourites = useCallback(
    () => update({ showFavourites: !showFavourites }),
    [showFavourites, update],
  )

  const toggleDarkMode = useCallback(
    () => update({ darkMode: !darkMode }),
    [darkMode, update],
  )

  const toggleRateCol = useCallback(
    () => update({ showRateCol: !showRateCol }),
    [showRateCol, update],
  )

  return {
    platform, setPlatform,
    selectedApps, toggleApp, setSelectedApps,
    hiddenApps, toggleHideApp,
    showFavourites, toggleShowFavourites,
    darkMode, toggleDarkMode,
    showRateCol, toggleRateCol,
  }
}
