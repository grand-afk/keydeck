import { useState } from 'react'

const OVERRIDES_KEY = 'keydeck:overrides'

function loadOverrides() {
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveOverrides(data) {
  try {
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Could not save overrides', e)
  }
}

/**
 * EditModal — in-browser shortcut editor (request #8).
 *
 * Edits are stored in localStorage under "keydeck:overrides" and applied
 * at runtime by src/data/index.js's applyOverrides().
 * They are also included in the JSON export so nothing is lost.
 *
 * Note: changes take effect immediately on the NEXT render cycle because
 * getShortcuts() reads localStorage fresh. A hard refresh is not needed.
 */
export default function EditModal({ shortcut, onClose }) {
  const existing = loadOverrides()[shortcut.id] || {}

  const [action,  setAction]  = useState(existing.action  ?? shortcut.action  ?? '')
  const [mac,     setMac]     = useState(existing.mac     ?? shortcut.mac     ?? '')
  const [win,     setWin]     = useState(existing.win     ?? shortcut.win     ?? '')
  const [cat,     setCat]     = useState(existing.cat     ?? shortcut.cat     ?? '')
  const [context, setContext] = useState(existing.context ?? shortcut.context ?? '')
  const [saved,   setSaved]   = useState(false)

  function handleSave() {
    const overrides = loadOverrides()
    overrides[shortcut.id] = { action, mac, win, cat, context }
    saveOverrides(overrides)
    setSaved(true)
    // Close after a short delay so user sees the confirmation
    setTimeout(() => {
      onClose()
      // Force a page reload so the new data takes effect immediately.
      // An alternative would be to use a React context/event bus, but reload
      // is simpler and reliable.
      window.location.reload()
    }, 800)
  }

  function handleReset() {
    const overrides = loadOverrides()
    delete overrides[shortcut.id]
    saveOverrides(overrides)
    onClose()
    window.location.reload()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <h3 className="modal-title">🖊️ Edit Shortcut</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <p className="modal-hint">
          Edits are saved in your browser and included in exports.
          They override the built-in data without modifying any files.
        </p>

        <div className="modal-body">
          <label className="form-label">
            Function / Action
            <input
              className="form-input"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="What this shortcut does"
            />
          </label>

          <div className="form-row">
            <label className="form-label">
              Mac shortcut
              <input
                className="form-input form-input--mono"
                value={mac}
                onChange={(e) => setMac(e.target.value)}
                placeholder="e.g. ⌘⇧K"
              />
            </label>
            <label className="form-label">
              Win shortcut
              <input
                className="form-input form-input--mono"
                value={win}
                onChange={(e) => setWin(e.target.value)}
                placeholder="e.g. Ctrl+Shift+K"
              />
            </label>
          </div>

          <label className="form-label">
            Category
            <input
              className="form-input"
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              placeholder="e.g. Navigation"
            />
          </label>

          <label className="form-label">
            Context note (optional)
            <input
              className="form-input"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. Only works when a cell is selected"
            />
          </label>
        </div>

        <div className="modal-footer">
          <button className="btn-danger-outline" onClick={handleReset} title="Remove your override and restore the original">
            Reset to original
          </button>
          <button className="btn-primary" onClick={handleSave} disabled={saved}>
            {saved ? '✅ Saved!' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
