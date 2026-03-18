import { useState, useEffect, useMemo } from 'react'
import { getShortcuts, getAllShortcuts, APPS } from './data/index'
import { useProgress } from './hooks/useProgress'
import { useSettings } from './hooks/useSettings'
import TopBar from './components/TopBar'
import BottomNav from './components/BottomNav'
import ShortcutsView from './components/ShortcutsView'
import StudyView from './components/StudyView'
import DiscoverView from './components/DiscoverView'
import HelpView from './components/HelpView'
import FlaggedModal from './components/FlaggedModal'

// Search tab removed — search is now an inline overlay via 🔍 in TopBar
// 'study' renamed to 'practise' throughout
const VIEWS = ['shortcuts', 'practise', 'discover', 'help']

export default function App() {
  const [view, setView] = useState('shortcuts')

  // Search overlay state
  const [searchOpen,  setSearchOpen]  = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Flagged modal state
  const [flaggedOpen, setFlaggedOpen] = useState(false)

  const {
    platform, setPlatform,
    selectedApps, toggleApp,
    showFavourites, toggleShowFavourites,
    darkMode, toggleDarkMode,
    showRateCol, toggleRateCol,
  } = useSettings()

  const {
    progress, getCard, rateCard,
    toggleFavourite, toggleNeedsEdit,
    exportData, importData,
  } = useProgress()

  // Apply dark / light mode class to root element
  useEffect(() => {
    document.documentElement.classList.toggle('light', !darkMode)
  }, [darkMode])

  const shortcuts    = getShortcuts(selectedApps)
  const allShortcuts = useMemo(() => getAllShortcuts(), [])  // for flagged modal

  // Visible shortcuts: search → fav filter → all
  const visibleShortcuts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      return shortcuts.filter((s) =>
        s.action.toLowerCase().includes(q) ||
        s.cat.toLowerCase().includes(q) ||
        (s.mac  || '').toLowerCase().includes(q) ||
        (s.win  || '').toLowerCase().includes(q) ||
        (s.context || '').toLowerCase().includes(q)
      )
    }
    return showFavourites
      ? shortcuts.filter((s) => progress[s.id]?.favourite)
      : shortcuts
  }, [shortcuts, searchQuery, showFavourites, progress])

  // ── Global keyboard shortcuts ─────────────────────────────────────────────
  useEffect(() => {
    function onKey(e) {
      const tag = e.target.tagName
      // Allow Escape everywhere (to close search/modals)
      if (e.key === 'Escape') {
        if (searchOpen) { setSearchOpen(false); setSearchQuery('') }
        if (flaggedOpen) setFlaggedOpen(false)
        return
      }
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      // '/' opens search
      if (e.key === '/') { e.preventDefault(); setSearchOpen(true); return }

      // App filter keyboard shortcuts — derived from APPS[].key
      const appByKey = APPS.find((a) => a.key === e.key.toUpperCase())
      if (appByKey) { toggleApp(appByKey.id); return }

      switch (e.key) {
        case 'm': case 'M': setPlatform('mac'); break
        case 'w': case 'W': setPlatform('win'); break
        case '1': setView(VIEWS[0]); break
        case '2': setView(VIEWS[1]); break
        case '3': setView(VIEWS[2]); break
        case '4': setView(VIEWS[3]); break
        case 'f': case 'F': toggleShowFavourites(); break
        default: break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setPlatform, toggleShowFavourites, toggleApp, searchOpen, flaggedOpen])

  // Common props shared by all table views
  const tableProps = {
    platform,
    progress,
    rateCard,
    toggleFavourite,
    toggleNeedsEdit,
    showRateCol,
    toggleRateCol,
  }

  // When search is active, always show ShortcutsView with results
  const isSearchActive = searchQuery.trim().length > 0

  return (
    <div className="app">
      <TopBar
        platform={platform}
        setPlatform={setPlatform}
        selectedApps={selectedApps}
        toggleApp={toggleApp}
        showFavourites={showFavourites}
        toggleShowFavourites={toggleShowFavourites}
        onExport={exportData}
        onImport={importData}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        searchOpen={searchOpen}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleSearch={() => {
          if (searchOpen) { setSearchOpen(false); setSearchQuery('') }
          else setSearchOpen(true)
        }}
        onOpenFlagged={() => setFlaggedOpen(true)}
      />

      <main className="main-content">
        {isSearchActive ? (
          <ShortcutsView
            {...tableProps}
            shortcuts={visibleShortcuts}
            showFavourites={showFavourites}
            toggleShowFavourites={toggleShowFavourites}
            searchQuery={searchQuery}
          />
        ) : (
          <>
            {view === 'shortcuts' && (
              <ShortcutsView
                {...tableProps}
                shortcuts={visibleShortcuts}
                showFavourites={showFavourites}
                toggleShowFavourites={toggleShowFavourites}
              />
            )}
            {view === 'practise' && (
              <StudyView
                {...tableProps}
                shortcuts={visibleShortcuts}
              />
            )}
            {view === 'discover' && (
              <DiscoverView
                {...tableProps}
                shortcuts={visibleShortcuts}
                getCard={getCard}
              />
            )}
            {view === 'help' && <HelpView />}
          </>
        )}
      </main>

      <BottomNav view={view} setView={setView} />

      {flaggedOpen && (
        <FlaggedModal
          shortcuts={allShortcuts}
          progress={progress}
          platform={platform}
          toggleNeedsEdit={toggleNeedsEdit}
          toggleFavourite={toggleFavourite}
          onClose={() => setFlaggedOpen(false)}
        />
      )}
    </div>
  )
}
