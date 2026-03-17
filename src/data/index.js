import excel        from './excel.json'
import powerpoint   from './powerpoint.json'
import googleWs     from './google-workspace.json'
import gmail        from './gmail.json'
import googleChat   from './google-chat.json'
import googleCal    from './google-calendar.json'
import googleTasks  from './google-tasks.json'
import windows      from './windows.json'
import slack        from './slack.json'
import vimium       from './vimium.json'
import obsidian     from './obsidian.json'
import chrome       from './chrome.json'
import custom       from './custom.json'

// ─── App metadata ──────────────────────────────────────────────────────────
export const APPS = [
  { id: 'excel',           icon: '📊', label: 'Excel',       key: 'X' },
  { id: 'powerpoint',      icon: '📽️', label: 'PowerPoint',  key: 'P' },
  { id: 'google-workspace',icon: '📄', label: 'Workspace',   key: 'D' },
  { id: 'gmail',           icon: '📧', label: 'Gmail',       key: 'G' },
  { id: 'google-chat',     icon: '🗨️', label: 'Chat',        key: 'C' },
  { id: 'google-calendar', icon: '📅', label: 'Calendar',    key: 'A' },
  { id: 'google-tasks',    icon: '✅', label: 'Tasks',       key: 'T' },
  { id: 'windows',         icon: '🖥️', label: 'Desktop',     key: 'N' },
  { id: 'slack',           icon: '💬', label: 'Slack',       key: 'K' },
  { id: 'vimium',          icon: '🌐', label: 'Vimium',      key: 'V' },
  { id: 'obsidian',        icon: '🔮', label: 'Obsidian',    key: 'O' },
  { id: 'chrome',          icon: '🟡', label: 'Chrome',      key: 'R' },
  { id: 'custom',          icon: '🔖', label: 'Bookmarks',   key: 'B' },
]

// ─── Tag each shortcut with its app id ─────────────────────────────────────
const tag = (appId, arr) => arr.map((s) => ({ ...s, app: appId }))

const ALL_SHORTCUTS = [
  ...tag('excel',            excel),
  ...tag('powerpoint',       powerpoint),
  ...tag('google-workspace', googleWs),
  ...tag('gmail',            gmail),
  ...tag('google-chat',      googleChat),
  ...tag('google-calendar',  googleCal),
  ...tag('google-tasks',     googleTasks),
  ...tag('windows',          windows),
  ...tag('slack',            slack),
  ...tag('vimium',           vimium),
  ...tag('obsidian',         obsidian),
  ...tag('chrome',           chrome),
  ...tag('custom',           custom),
]

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
 * Pass an empty array or undefined to get every shortcut.
 */
export function getShortcuts(selectedApps) {
  const base =
    !selectedApps || selectedApps.length === 0
      ? ALL_SHORTCUTS
      : ALL_SHORTCUTS.filter((s) => selectedApps.includes(s.app))
  return applyOverrides(base)
}

/** Return every shortcut regardless of filter (used by export / edit). */
export function getAllShortcuts() {
  return applyOverrides(ALL_SHORTCUTS)
}
