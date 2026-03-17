import { useState } from 'react'
import { getShortcuts, getAllShortcuts } from './data/index'
import { useProgress } from './hooks/useProgress'
import { useSettings } from './hooks/useSettings'
import TopBar from './components/TopBar'
import BottomNav from './components/BottomNav'
import PracticeView from './components/PracticeView'
import DiscoverView from './components/DiscoverView'
import StudyView from './components/StudyView'
import SearchView from './components/SearchView'
import HelpView from './components/HelpView'

export default function App() {
  const [view, setView] = useState('practice')

  // Persistent settings
  const {
    platform, setPlatform,
    selectedApps, toggleApp,
    showFavourites, toggleShowFavourites,
  } = useSettings()

  // Spaced repetition progress + new helpers
  const {
    progress,
    getCard,
    rateCard,
    resetProgress,
    toggleFavourite,
    toggleNeedsEdit,
    exportData,
    importData,
  } = useProgress()

  // Shortcuts filtered by selected apps
  const shortcuts = getShortcuts(selectedApps)

  // Further filter to favourites if that toggle is active
  const visibleShortcuts = showFavourites
    ? shortcuts.filter((s) => progress[s.id]?.favourite)
    : shortcuts

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
        {view === 'practice' && (
          <PracticeView
            shortcuts={visibleShortcuts}
            platform={platform}
            progress={progress}
            getCard={getCard}
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
        {view === 'help' && (
          <HelpView />
        )}
      </main>

      <BottomNav view={view} setView={setView} />
    </div>
  )
}
