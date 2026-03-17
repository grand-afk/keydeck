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

// ── URL sync for platform (#1) — ?p=mac or ?p=win ─────────────────────────
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
  const showFavourites = settings.showFavourites  ?? false

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

  const toggleShowFavourites = useCallback(
    () => update({ showFavourites: !showFavourites }),
    [showFavourites, update],
  )

  return { platform, setPlatform, selectedApps, toggleApp, showFavourites, toggleShowFavourites }
}
