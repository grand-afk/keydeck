import { APPS } from '../data/index'
import AppIcon from './AppIcon'

/**
 * FlaggedModal — lists all shortcuts flagged for review (🚩).
 * Opened from the 🚩 icon in the TopBar.
 */
export default function FlaggedModal({
  shortcuts,
  progress,
  platform,
  toggleNeedsEdit,
  toggleFavourite,
  onClose,
}) {
  const flagged = shortcuts.filter((s) => progress[s.id]?.needsEdit)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--wide" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <h3 className="modal-title">🚩 Flagged for review</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {flagged.length === 0 ? (
          <div className="modal-empty">
            <p className="empty-icon">✅</p>
            <p>No shortcuts flagged. Use the 🚩 button on any row to flag shortcuts that need correction.</p>
          </div>
        ) : (
          <>
            <p className="modal-hint">{flagged.length} shortcut{flagged.length !== 1 ? 's' : ''} flagged. Click ✓ to unflag.</p>
            <div className="modal-table-wrapper">
              <table className="study-table">
                <thead>
                  <tr>
                    <th>App</th>
                    <th>Category</th>
                    <th>Function</th>
                    <th>Shortcut</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {flagged.map((s) => {
                    const appMeta      = APPS.find((a) => a.id === s.app) || {}
                    const shortcutText = platform === 'mac' ? s.mac : s.win
                    const isFavourite  = !!progress[s.id]?.favourite

                    return (
                      <tr key={s.id} className="study-row">
                        <td className="study-cell study-cell--app">
                          <AppIcon app={appMeta} />
                          <span className="study-app-label">{appMeta.label}</span>
                        </td>
                        <td className="study-cell study-cell--cat">{s.cat}</td>
                        <td className="study-cell study-cell--action">{s.action}</td>
                        <td className="study-cell study-cell--shortcut">
                          <kbd className="shortcut-badge" title={s.context || undefined}>
                            {shortcutText}
                          </kbd>
                        </td>
                        <td className="study-cell study-cell--icons">
                          <button
                            className={`row-icon-btn ${isFavourite ? 'row-icon-btn--on' : ''}`}
                            onClick={() => toggleFavourite?.(s.id)}
                            title="Toggle favourite"
                          >⭐</button>
                          <button
                            className="row-icon-btn row-icon-btn--warn"
                            onClick={() => toggleNeedsEdit?.(s.id)}
                            title="Unflag this shortcut"
                          >✓</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
