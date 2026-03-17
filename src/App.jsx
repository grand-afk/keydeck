import { useState, useEffect } from 'react'
import { getShortcuts } from './data/index'
import { useProgress } from './hooks/useProgress'
import { useSettings } from './hooks/useSettings'
import TopBar from './components/TopBar'
import BottomNav from './components/BottomNav'
import ShortcutsView from './components/ShortcutsView'
import StudyView from './components/StudyView'
import DiscoverView from './components/DiscoverView'
import SearchView from './components/SearchView'
import HelpView from './components/HelpView'

const VIEWS = ['shortcuts', 'study', 'discover', 'search', 'help']

export default function App() {
  // Default view is 'shortcuts' (#6)
  const [view, setView] = useState('shortcuts')

  const {
    platform, setPlatform,
    selectedApps, toggleApp,
    showFavourites, toggleShowFavourites,
  } = useSettings()

  const {
    progress, getCard, rateCard,
    toggleFavourite, toggleNeedsEdit,
    exportData, importData,
  } = useProgress()

  const shortcuts = getShortcuts(selectedApps)

  const visibleShortcuts = showFavourites
    ? shortcuts.filter((s) => progress[s.id]?.favourite)
    : shortcuts

  // ── Global keyboard shortcuts (#4) ────────────────────────────────────────
  useEffect(() => {
    function onKey(e) {
      // Ignore when typing in an input/textarea/select
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      switch (e.key) {
        case 'm': case 'M': setPlatform('mac'); break
        case 'w': case 'W': setPlatform('win'); break
        case '1': setView(VIEWS[0]); break
        case '2': setView(VIEWS[1]); break
        case '3': setView(VIEWS[2]); break
        case '4': setView(VIEWS[3]); break
        case '5': setView(VIEWS[4]); break
        case 'f': case 'F': toggleShowFavourites(); break
        case 'e': case 'E': exportData(); break
        default: break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setPlatform, toggleShowFavourites, exportData])

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
      />

      <main className="main-content">
        {view === 'shortcuts' && (
          <ShortcutsView
            shortcuts={visibleShortcuts}
            platform={platform}
            progress={progress}
            rateCard={rateCard}
            toggleFavourite={toggleFavourite}
            toggleNeedsEdit={toggleNeedsEdit}
          />
        )}
        {view === 'study' && (
          <StudyView
            shortcuts={visibleShortcuts}
            platform={platform}
            progress={progress}
            rateCard={rateCard}
            toggleFavourite={toggleFavourite}
            toggleNeedsEdit={toggleNeedsEdit}
          />
        )}
        {view === 'discover' && (
          <DiscoverView
            shortcuts={visibleShortcuts}
            platform={platform}
            progress={progress}
            getCard={getCard}
            rateCard={rateCard}
            toggleFavourite={toggleFavourite}
            toggleNeedsEdit={toggleNeedsEdit}
          />
        )}
        {view === 'search' && (
          <SearchView
            shortcuts={shortcuts}
            platform={platform}
            progress={progress}
            getCard={getCard}
            toggleFavourite={toggleFavourite}
            toggleNeedsEdit={toggleNeedsEdit}
          />
        )}
        {view === 'help' && <HelpView />}
      </main>

      <BottomNav view={view} setView={setView} />
    </div>
  )
}
