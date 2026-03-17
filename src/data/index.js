import excel        from './excel.json'
import powerpoint   from './powerpoint.json'
import googleWs     from './google-workspace.json'
import windows      from './windows.json'
import slack        from './slack.json'
import vimium       from './vimium.json'
import obsidian     from './obsidian.json'
import chrome       from './chrome.json'
import custom       from './custom.json'

// ─── App metadata ──────────────────────────────────────────────────────────
export const APPS = [
  { id: 'excel',             icon: '📊', label: 'Excel'           },
  { id: 'powerpoint',        icon: '📽️', label: 'PowerPoint'     },
  { id: 'google-workspace',  icon: '🔵', label: 'Google'          },
  { id: 'windows',           icon: '🖥️', label: 'Desktop'        },
  { id: 'slack',             icon: '💬', label: 'Slack'           },
  { id: 'vimium',            icon: '🌐', label: 'Vimium'          },
  { id: 'obsidian',          icon: '🔮', label: 'Obsidian'        },
  { id: 'chrome',            icon: '🟡', label: 'Chrome'          },
  { id: 'custom',            icon: '🔖', label: 'Bookmarks'       },
]

// ─── Tag each shortcut with its app id ─────────────────────────────────────
const tag = (appId, arr) => arr.map((s) => ({ ...s, app: appId }))

const ALL_SHORTCUTS = [
  ...tag('excel',            excel),
  ...tag('powerpoint',       powerpoint),
  ...tag('google-workspace', googleWs),
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
