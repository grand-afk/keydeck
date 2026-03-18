import { useState, useMemo } from 'react'
import { APPS } from '../data/index'
import AppIcon from './AppIcon'
import EditModal from './EditModal'
import { RateTh, RateTd, RATING_ORDER } from './RateColumn'

const DISCOVER_BATCH = 20   // larger batch so pagination is visible
const PAGE_SIZE      = 10

function fisherYates(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function DiscoverView({
  shortcuts,
  platform,
  progress,
  rateCard,
  toggleFavourite,
  toggleNeedsEdit,
  showRateCol,
  toggleRateCol,
}) {
  const [rated,      setRated]     = useState({})
  const [editTarget, setEditTarget] = useState(null)
  const [batch,      setBatch]     = useState(null)   // null = needs (re)generate
  const [sort,       setSort]      = useState({ key: null, dir: 'asc' })
  const [page,       setPage]      = useState(1)

  const currentBatch = useMemo(() => {
    if (batch !== null) return batch
    const unseen = shortcuts.filter((s) => !progress[s.id] || progress[s.id].repetitions === 0)
    const pool   = unseen.length >= DISCOVER_BATCH ? unseen : shortcuts
    return fisherYates(pool).slice(0, DISCOVER_BATCH)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batch, shortcuts, progress])

  const sortedBatch = useMemo(() => {
    if (!sort.key) return currentBatch
    return [...currentBatch].sort((a, b) => {
      if (sort.key === 'rate') {
        const av = RATING_ORDER[rated[a.id]] ?? 0
        const bv = RATING_ORDER[rated[b.id]] ?? 0
        return sort.dir === 'asc' ? av - bv : bv - av
      }
      let av = '', bv = ''
      if (sort.key === 'app')      { av = a.app;    bv = b.app }
      if (sort.key === 'cat')      { av = a.cat;    bv = b.cat }
      if (sort.key === 'action')   { av = a.action; bv = b.action }
      if (sort.key === 'shortcut') { av = platform === 'mac' ? a.mac : a.win; bv = platform === 'mac' ? b.mac : b.win }
      return (sort.dir === 'asc' ? 1 : -1) * (av || '').localeCompare(bv || '')
    })
  }, [currentBatch, sort, platform, rated])

  const totalPages = Math.max(1, Math.ceil(sortedBatch.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const pageItems  = sortedBatch.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const totalRated = Object.keys(rated).length

  function toggleSort(key) {
    setPage(1)
    setSort((prev) => prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' })
  }

  function SortTh({ colKey, children }) {
    const active = sort.key === colKey
    return (
      <th className={`sortable-th ${active ? 'sortable-th--active' : ''}`} onClick={() => toggleSort(colKey)} title={`Sort by ${children}`}>
        {children}<span className="sort-arrow">{active ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : ' ↕'}</span>
      </th>
    )
  }

  function handleRate(id, quality, label) { rateCard(id, quality); setRated((p) => ({ ...p, [id]: label })) }

  function nextBatch() {
    const unseen = shortcuts.filter((s) => !progress[s.id] || progress[s.id].repetitions === 0)
    const pool   = unseen.length >= DISCOVER_BATCH ? unseen : shortcuts
    setBatch(fisherYates(pool).slice(0, DISCOVER_BATCH))
    setRated({})
    setPage(1)
  }

  if (shortcuts.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-icon">🎲</p>
        <p>No shortcuts to discover with the current filter.</p>
      </div>
    )
  }

  return (
    <div className="study-view">
      <div className="study-header">
        <h2 className="study-title">🎲 Discover Shortcuts</h2>
        <span className="study-progress">{totalRated} / {currentBatch.length} rated</span>
      </div>

      <p className="discover-hint">
        Rate each shortcut to add it to your Practise deck. Prioritising shortcuts you haven't seen yet.
      </p>

      <div className="study-table-wrapper">
        <table className="study-table">
          <thead>
            <tr>
              <SortTh colKey="app">App</SortTh>
              <SortTh colKey="cat">Category</SortTh>
              <SortTh colKey="action">Function</SortTh>
              <SortTh colKey="shortcut">Shortcut</SortTh>
              <RateTh showRateCol={showRateCol} toggleRateCol={toggleRateCol} sortActive={sort.key === 'rate'} sortDir={sort.dir} onSort={() => toggleSort('rate')} />
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((s) => {
              const appMeta      = APPS.find((a) => a.id === s.app) || {}
              const shortcutText = platform === 'mac' ? s.mac : s.win
              const ratingLabel  = rated[s.id]
              const card         = progress[s.id] || {}
              return (
                <tr key={s.id} className={`study-row ${ratingLabel ? `study-row--${ratingLabel}` : ''}`}>
                  <td className="study-cell study-cell--app"><AppIcon app={appMeta} /><span className="study-app-label">{appMeta.label}</span></td>
                  <td className="study-cell study-cell--cat">{s.cat}</td>
                  <td className="study-cell study-cell--action">{s.action}</td>
                  <td className="study-cell study-cell--shortcut">
                    <kbd className="shortcut-badge" title={s.context || undefined}>{shortcutText}</kbd>
                  </td>
                  <RateTd showRateCol={showRateCol} shortcutId={s.id} ratingLabel={ratingLabel} onRate={handleRate} />
                  <td className="study-cell study-cell--icons">
                    <button className={`row-icon-btn ${card.favourite ? 'row-icon-btn--on' : ''}`} onClick={() => toggleFavourite?.(s.id)} title="Toggle favourite">⭐</button>
                    <button className={`row-icon-btn ${card.needsEdit ? 'row-icon-btn--warn' : ''}`} onClick={() => toggleNeedsEdit?.(s.id)} title="Flag for editing">🚩</button>
                    <button className="row-icon-btn" onClick={() => setEditTarget(s)} title="Edit shortcut">🖊️</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}>← Prev</button>
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`page-num ${p === safePage ? 'page-num--active' : ''}`} onClick={() => setPage(p)}>{p}</button>
            ))}
          </div>
          <button className="page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>Next →</button>
        </div>
      )}

      <div className="study-complete">
        <button className="btn-secondary" onClick={nextBatch}>🎲 New batch</button>
      </div>

      {editTarget && <EditModal shortcut={editTarget} onClose={() => setEditTarget(null)} />}
    </div>
  )
}
