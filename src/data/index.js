import excel from './excel.json'
import powerpoint from './powerpoint.json'
import googleWorkspace from './google-workspace.json'
import windows from './windows.json'
import slack from './slack.json'
import vimium from './vimium.json'
import obsidian from './obsidian.json'
import custom from './custom.json'

/**
 * App metadata — display names, icons (emoji), and IDs used throughout the app.
 */
export const APPS = [
  { id: 'excel',           label: 'Excel',           icon: '📊' },
  { id: 'powerpoint',      label: 'PowerPoint',       icon: '📽️' },
  { id: 'google',          label: 'Google',           icon: '🔵' },
  { id: 'windows',         label: 'Desktop',          icon: '🖥️' },
  { id: 'slack',           label: 'Slack',            icon: '💬' },
  { id: 'vimium',          label: 'Vimium',           icon: '🌐' },
  { id: 'obsidian',        label: 'Obsidian',         icon: '🔮' },
  { id: 'custom',          label: 'Bookmarks',        icon: '🔖' },
]

/**
 * All shortcuts, each augmented with their app ID.
 */
export const ALL_SHORTCUTS = [
  ...excel.map(s => ({ ...s, app: 'excel' })),
  ...powerpoint.map(s => ({ ...s, app: 'powerpoint' })),
  ...googleWorkspace.map(s => ({ ...s, app: 'google' })),
  ...windows.map(s => ({ ...s, app: 'windows' })),
  ...slack.map(s => ({ ...s, app: 'slack' })),
  ...vimium.map(s => ({ ...s, app: 'vimium' })),
  ...obsidian.map(s => ({ ...s, app: 'obsidian' })),
  ...custom.map(s => ({ ...s, app: 'custom' })),
]

/**
 * Returns shortcuts filtered by app selection.
 * @param {string[]} appIds — empty array or ['all'] means all apps
 */
export function getShortcuts(appIds = []) {
  if (!appIds.length || appIds.includes('all')) return ALL_SHORTCUTS
  return ALL_SHORTCUTS.filter(s => appIds.includes(s.app))
}
