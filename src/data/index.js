import excel        from './excel.json'
import powerpoint   from './powerpoint.json'
import gmail        from './gmail.json'
import googleChat   from './google-chat.json'
import googleCal    from './google-calendar.json'
import googleTasks  from './google-tasks.json'
import googleDocs   from './google-docs.json'
import googleSheets from './google-sheets.json'
import googleDrive  from './google-drive.json'
import windows      from './windows.json'
import word         from './word.json'
import powertoys    from './powertoys.json'
import slack        from './slack.json'
import vimium       from './vimium.json'
import obsidian     from './obsidian.json'
import chrome       from './chrome.json'
import custom       from './custom.json'

// ─── App metadata ──────────────────────────────────────────────────────────
// iconUrl: uses Google's favicon service for web apps (reliable, no attribution needed)
export const APPS = [
  { id: 'excel',           iconUrl: 'https://www.google.com/s2/favicons?domain=excel.office.com&sz=64',           label: 'Excel',       key: 'X' },
  { id: 'powerpoint',      iconUrl: 'https://www.google.com/s2/favicons?domain=powerpoint.office.com&sz=64',      label: 'PowerPoint',  key: 'P' },
  { id: 'gmail',           iconUrl: 'https://www.google.com/s2/favicons?domain=mail.google.com&sz=64',            label: 'Gmail',       key: 'G' },
  { id: 'google-chat',     iconUrl: 'https://www.google.com/s2/favicons?domain=chat.google.com&sz=64',            label: 'Chat',        key: 'C' },
  { id: 'google-calendar', iconUrl: 'https://www.google.com/s2/favicons?domain=calendar.google.com&sz=64',        label: 'Calendar',    key: 'A' },
  { id: 'google-tasks',    iconUrl: 'https://www.google.com/s2/favicons?domain=tasks.google.com&sz=64',           label: 'Tasks',       key: 'T' },
  { id: 'google-docs',     iconUrl: 'https://www.google.com/s2/favicons?domain=docs.google.com&sz=64',            label: 'Docs',        key: 'J' },
  { id: 'google-sheets',   iconUrl: 'https://www.google.com/s2/favicons?domain=sheets.google.com&sz=64',          label: 'Sheets',      key: 'H' },
  { id: 'google-drive',    iconUrl: 'https://www.google.com/s2/favicons?domain=drive.google.com&sz=64',           label: 'Drive',       key: 'D' },
  { id: 'windows',         iconUrl: 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=64',              label: 'Desktop',     key: 'N' },
  { id: 'word',            iconUrl: 'https://www.google.com/s2/favicons?domain=word.office.com&sz=64',            label: 'Word',        key: 'U' },
  { id: 'powertoys',       icon: '⚙️',                                                                            label: 'PowerToys',   key: 'Y' },
  { id: 'slack',           iconUrl: 'https://www.google.com/s2/favicons?domain=slack.com&sz=64',                  label: 'Slack',       key: 'K' },
  { id: 'vimium',          icon: '🌐',                                                                            label: 'Vimium',      key: 'V' },
  { id: 'obsidian',        iconUrl: 'https://www.google.com/s2/favicons?domain=obsidian.md&sz=64',                label: 'Obsidian',    key: 'O' },
  { id: 'chrome',          iconUrl: 'https://www.google.com/s2/favicons?domain=google.com/chrome&sz=64',          label: 'Chrome',      key: 'R' },
  { id: 'custom',          icon: '🔖',                                                                            label: 'Bookmarks',   key: 'B' },
]

// ─── Tag each shortcut with its app id ─────────────────────────────────────
const tag = (appId, arr) => arr.map((s) => ({ ...s, app: appId }))

const ALL_SHORTCUTS = [
  ...tag('excel',            excel),
  ...tag('powerpoint',       powerpoint),
  ...tag('gmail',            gmail),
  ...tag('google-chat',      googleChat),
  ...tag('google-calendar',  googleCal),
  ...tag('google-tasks',     googleTasks),
  ...tag('google-docs',      googleDocs),
  ...tag('google-sheets',    googleSheets),
  ...tag('google-drive',     googleDrive),
  ...tag('word',             word),
  ...tag('windows',          windows),
  ...tag('powertoys',        powertoys),
  ...tag('slack',            slack),
  ...tag('vimium',           vimium),
  ...tag('obsidian',         obsidian),
  ...tag('chrome',           chrome),
  ...tag('custom',           custom),
]

// ─── User-created shortcuts stored in localStorage ─────────────────────────
function getCustomShortcuts() {
  try {
    const raw = localStorage.getItem('keydeck:custom')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/** Add a new user-created shortcut to localStorage. */
export function addCustomShortcut(shortcut) {
  try {
    const existing = getCustomShortcuts()
    const newEntry = { ...shortcut, id: `custom-${Date.now()}` }
    localStorage.setItem('keydeck:custom', JSON.stringify([...existing, newEntry]))
    return newEntry
  } catch (e) {
    console.warn('Could not save custom shortcut', e)
    return null
  }
}

/** Delete a user-created shortcut by id. */
export function deleteCustomShortcut(id) {
  try {
    const existing = getCustomShortcuts()
    localStorage.setItem('keydeck:custom', JSON.stringify(existing.filter((s) => s.id !== id)))
  } catch (e) {
    console.warn('Could not delete custom shortcut', e)
  }
}

// ─── Apply any in-browser user overrides from localStorage ─────────────────
function applyOverrides(shortcuts) {
  try {
    const raw = localStorage.getItem('keydeck:overrides')
    if (!raw) return shortcuts
    const overrides = JSON.parse(raw)           // { [id]: { action, mac, win, cat, context } }
    return shortcuts.map((s) =>
      overrides[s.id] ? { ...s, ...overrides[s.id] } : s
    )
  } catch {
    return shortcuts
  }
}

/**
 * Return all shortcuts (optionally filtered by app), with user overrides applied.
 * Includes user-created custom shortcuts from localStorage.
 * Pass an empty array or undefined to get every shortcut.
 */
export function getShortcuts(selectedApps) {
  const custom = getCustomShortcuts()
  const combined = [...ALL_SHORTCUTS, ...custom]
  const base =
    !selectedApps || selectedApps.length === 0
      ? combined
      : combined.filter((s) => selectedApps.includes(s.app))
  return applyOverrides(base)
}

/** Return every shortcut regardless of filter (used by export / edit). */
export function getAllShortcuts() {
  return applyOverrides([...ALL_SHORTCUTS, ...getCustomShortcuts()])
}
