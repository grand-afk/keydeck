import { useState, useMemo } from 'react'
import { QUALITY } from '../utils/sm2'
import { APPS } from '../data/index'
import EditModal from './EditModal'

const PAGE_SIZE = 10

/**
 * ShortcutsView — paginated shortcut reference (#6).
 *
 * • Favourites filter ON by default (toggleable within the view)
 * • Shows all shortcuts (not just due ones), 10 per page
 * • Sortable columns
 * • Rating buttons on each row (adds to SM-2 deck)
 * • This is the default view
 */
export default function ShortcutsView({
  shortcuts,
  platform,
  progress,
  rateCard,
  toggleFavourite,
  toggleNeedsEdit,
}) {
  const [showFavOnly, setShowFavOnly] = useState(true)   // favourites on by default
  const [page,        setPage]        = useState(1)
  const [sort,        setSort]        = useState({ key: null, dir: 'asc' })
  const [rated,       setRated]       = useState({})
  const [editTarget,  setEditTarget]  = useState(null)

  // Filter
  const filtered = useMemo(() => {
    if (!showFavOnly) return shortcuts
    return shortcuts.filter((s) => progress[s.id]?.favourite)
  }, [shortcuts, progress, showFavOnly])

  // Sort
  const sorted = useMemo(() => {
    if (!sort.key) return filtered
    return [...filtered].sort((a, b) => {
      let av = '', bv = ''
      if (sort.key === 'app')      { av = a.app;    bv = b.app }
      if (sort.key === 'cat')      { av = a.cat;    bv = b.cat }
      if (sort.key === 'action')   { av = a.action; bv = b.action }
      if (sort.key === 'shortcut') { av = platform === 'mac' ? a.mac : a.win; bv = platform === 'mac' ? b.mac : b.win }
      const cmp = av.localeCompare(bv)
      return sort.dir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sort, platform])

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const pageItems  = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function toggleSort(key) {
    setPage(1)
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' }
    )
  }

  function SortTh({ colKey, children }) {
    const active = sort.key === colKey
    return (
      <th
        className={`sortable-th ${active ? 'sortable-th--active' : ''}`}
        onClick={() => toggleSort(colKey)}
        title={`Sort by ${children}`}
      >
        {children}
        <span className="sort-arrow">{active ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : ' ↕'}</span>
      </th>
    )
  }

  function handleRate(id, quality, label) {
    rateCard(id, quality)
    setRated((prev) => ({ ...prev, [id]: label }))
  }

  function handleToggleFav() {
    setShowFavOnly((v) => !v)
    setPage(1)
  }

  return (
    <div className="study-view">
      {/* Header */}
      <div className="study-header">
        <h2 className="study-title">⭐ Shortcuts</h2>
        <div className="shortcuts-header-right">
          <button
            className={`btn-toggle ${showFavOnly ? 'btn-toggle--on' : ''}`}
            onClick={handleToggleFav}
            title="Toggle favourites filter"
          >
            ⭐ {showFavOnly ? 'Favourites' : 'All shortcuts'}
          </button>
          <span className="study-progress">
            {sorted.length} shortcut{sorted.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Empty state */}
      {sorted.length === 0 && (
        <div className="empty-state">
          <p className="empty-icon">⭐</p>
          <h2>No favourites yet</h2>
          <p>Star shortcuts in the Study or Discover views, or turn off the favourites filter to browse everything.</p>
          <button className="btn-secondary" onClick={() => setShowFavOnly(false)}>
            Show all shortcuts
          </button>
        </div>
      )}

      {/* Table */}
      {sorted.length > 0 && (
        <>
          <div className="study-table-wrapper">
            <table className="study-table">
              <thead>
                <tr>
                  <SortTh colKey="app">App</SortTh>
                  <SortTh colKey="cat">Category</SortTh>
                  <SortTh colKey="action">Function</SortTh>
                  <SortTh colKey="shortcut">Shortcut</SortTh>
                  <th>Rate</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((s) => {
                  const appMeta      = APPS.find((a) => a.id === s.app) || {}
                  const shortcutText = platform === 'mac' ? s.mac : s.win
                  const ratingLabel  = rated[s.id]
                  const card         = progress[s.id] || {}
                  const isFavourite  = !!card.favourite
                  const flagged      = !!card.needsEdit

                  return (
                    <tr key={s.id} className={`study-row ${ratingLabel ? `study-row--${ratingLabel}` : ''}`}>
                      <td className="study-cell study-cell--app">
                        <span title={appMeta.label}>{appMeta.icon}</span>
                        <span className="study-app-label">{appMeta.label}</span>
                      </td>
                      <td className="study-cell study-cell--cat">{s.cat}</td>
                      <td className="study-cell study-cell--action">{s.action}</td>
                      <td className="study-cell study-cell--shortcut">
                        <kbd className="shortcut-badge">{shortcutText}</kbd>
                      </td>
                      <td className="study-cell study-cell--rate">
                        {ratingLabel ? (
                          <span className={`rating-badge rating-badge--${ratingLabel}`}>
                            {ratingLabel.charAt(0).toUpperCase() + ratingLabel.slice(1)}
                          </span>
                        ) : (
                          <div className="inline-rate-btns">
                            <button className="inline-rate-btn inline-rate-btn--again" onClick={() => handleRate(s.id, QUALITY.AGAIN, 'again')}>Again</button>
                            <button className="inline-rate-btn inline-rate-btn--hard"  onClick={() => handleRate(s.id, QUALITY.HARD,  'hard')} >Hard</button>
                            <button className="inline-rate-btn inline-rate-btn--good"  onClick={() => handleRate(s.id, QUALITY.GOOD,  'good')} >Good</button>
                            <button className="inline-rate-btn inline-rate-btn--easy"  onClick={() => handleRate(s.id, QUALITY.EASY,  'easy')} >Easy</button>
                          </div>
                        )}
                      </td>
                      <td className="study-cell study-cell--icons">
                        <button className={`row-icon-btn ${isFavourite ? 'row-icon-btn--on' : ''}`} onClick={() => toggleFavourite?.(s.id)} title="Toggle favourite">⭐</button>
                        <button className={`row-icon-btn ${flagged ? 'row-icon-btn--warn' : ''}`}  onClick={() => toggleNeedsEdit?.(s.id)}  title="Flag for editing">🚩</button>
                        <button className="row-icon-btn" onClick={() => setEditTarget(s)} title="Edit shortcut">🖊️</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
              >
                ← Prev
              </button>
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`page-num ${p === safePage ? 'page-num--active' : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                className="page-btn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {editTarget && <EditModal shortcut={editTarget} onClose={() => setEditTarget(null)} />}
    </div>
  )
}
