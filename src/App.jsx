import { useState } from 'react'
import { getShortcuts } from './data/index'
import { useProgress } from './hooks/useProgress'
import { useSettings } from './hooks/useSettings'
import TopBar from './components/TopBar'
import BottomNav from './components/BottomNav'
import PracticeView from './components/PracticeView'
import DiscoverView from './components/DiscoverView'
import SearchView from './components/SearchView'
import HelpView from './components/HelpView'

export default function App() {
  const [view, setView] = useState('practice')

  // Persistent settings
  const {
    platform, setPlatform,
    selectedApps, toggleApp,
  } = useSettings()

  // Spaced repetition progress
  const { progress, getCard, rateCard, resetProgress } = useProgress()

  // Shortcuts filtered by selected apps
  const shortcuts = getShortcuts(selectedApps)

  return (
    <div className="app">
      <TopBar
        platform={platform}
        setPlatform={setPlatform}
        selectedApps={selectedApps}
        toggleApp={toggleApp}
      />

      <main className="main-content">
        {view === 'practice' && (
          <PracticeView
            shortcuts={shortcuts}
            platform={platform}
            progress={progress}
            getCard={getCard}
            rateCard={rateCard}
          />
        )}
        {view === 'discover' && (
          <DiscoverView
            shortcuts={shortcuts}
            platform={platform}
            progress={progress}
            getCard={getCard}
            rateCard={rateCard}
          />
        )}
        {view === 'search' && (
          <SearchView
            shortcuts={shortcuts}
            platform={platform}
            getCard={getCard}
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
