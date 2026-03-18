export default function HelpView() {
  return (
    <div className="help-view">
      <h1 className="help-title">⌨️ KeyDeck</h1>
      <p className="help-lead">
        A spaced-repetition keyboard shortcut trainer. Learn shortcuts for Excel, PowerPoint,
        Gmail, Google Drive, Slack, Chrome, Obsidian, Windows PowerToys and more — on Mac <em>and</em> Windows.
      </p>

      <section className="help-section">
        <h2>How it works</h2>
        <p>
          KeyDeck uses the <strong>SM-2 algorithm</strong> (the same one Anki uses) to schedule
          each shortcut at the optimal moment for long-term memory. Rate each card honestly:
        </p>
        <ul>
          <li><strong>Again</strong> — you drew a blank. Resets the card.</li>
          <li><strong>Hard</strong> — you got it but it took real effort.</li>
          <li><strong>Good</strong> — normal recall with a small pause.</li>
          <li><strong>Easy</strong> — instant, effortless recall.</li>
        </ul>
      </section>

      <section className="help-section">
        <h2>Views</h2>
        <ul>
          <li>
            <strong>⌨️ Shortcuts [1]</strong> — Full reference table, paginated 10/page.
            Sortable by any column. Use <strong>+ Add</strong> to create your own shortcuts.
          </li>
          <li>
            <strong>📖 Practise [2]</strong> — Your daily review queue. Up to 10 shortcuts
            due today appear here; rate them all to complete the session.
          </li>
          <li>
            <strong>🎲 Discover [3]</strong> — A fresh batch of shortcuts you haven't seen
            yet. Rating a card adds it to your Practise deck automatically. Hit 🎲 for a
            new batch.
          </li>
          <li>
            <strong>❓ Help [4]</strong> — You're here.
          </li>
        </ul>
      </section>

      <section className="help-section">
        <h2>Top bar icons</h2>
        <ul>
          <li><strong>🔍 [/]</strong> — Open inline search. Filters the current view as you type.</li>
          <li><strong>⭐ [F]</strong> — Toggle favourites filter. Shows only starred shortcuts.</li>
          <li><strong>🚩</strong> — Open the flagged-for-review modal. Lists all shortcuts you've marked with 🚩.</li>
          <li><strong>☀️ / 🌙</strong> — Switch between light and dark mode.</li>
          <li><strong>⬇️</strong> — Export your progress and overrides as a JSON backup.</li>
          <li><strong>⬆️</strong> — Import a previously exported backup.</li>
        </ul>
      </section>

      <section className="help-section">
        <h2>Platform toggle</h2>
        <p>
          Use the <strong>Mac / Win</strong> toggle (top left) to switch between Mac and
          Windows shortcuts at any time. Your progress is shared across both platforms.
          Keyboard shortcut: <kbd>M</kbd> for Mac, <kbd>W</kbd> for Windows.
        </p>
      </section>

      <section className="help-section">
        <h2>Keyboard shortcuts</h2>
        <table className="help-kbd-table">
          <tbody>
            <tr><td><kbd>1</kbd></td><td>Go to Shortcuts</td></tr>
            <tr><td><kbd>2</kbd></td><td>Go to Practise</td></tr>
            <tr><td><kbd>3</kbd></td><td>Go to Discover</td></tr>
            <tr><td><kbd>4</kbd></td><td>Go to Help</td></tr>
            <tr><td><kbd>M</kbd></td><td>Switch to Mac platform</td></tr>
            <tr><td><kbd>W</kbd></td><td>Switch to Windows platform</td></tr>
            <tr><td><kbd>F</kbd></td><td>Toggle favourites filter</td></tr>
            <tr><td><kbd>/</kbd></td><td>Open search</td></tr>
            <tr><td><kbd>Esc</kbd></td><td>Close search / modal</td></tr>
            <tr><td><kbd>X</kbd></td><td>Toggle Excel filter</td></tr>
            <tr><td><kbd>P</kbd></td><td>Toggle PowerPoint filter</td></tr>
            <tr><td><kbd>G</kbd></td><td>Toggle Gmail filter</td></tr>
            <tr><td><kbd>C</kbd></td><td>Toggle Chat filter</td></tr>
            <tr><td><kbd>A</kbd></td><td>Toggle Calendar filter</td></tr>
            <tr><td><kbd>T</kbd></td><td>Toggle Tasks filter</td></tr>
            <tr><td><kbd>D</kbd></td><td>Toggle Drive filter</td></tr>
            <tr><td><kbd>N</kbd></td><td>Toggle Desktop filter</td></tr>
            <tr><td><kbd>Y</kbd></td><td>Toggle PowerToys filter</td></tr>
            <tr><td><kbd>K</kbd></td><td>Toggle Slack filter</td></tr>
            <tr><td><kbd>V</kbd></td><td>Toggle Vimium filter</td></tr>
            <tr><td><kbd>O</kbd></td><td>Toggle Obsidian filter</td></tr>
            <tr><td><kbd>R</kbd></td><td>Toggle Chrome filter</td></tr>
            <tr><td><kbd>B</kbd></td><td>Toggle Bookmarks filter</td></tr>
          </tbody>
        </table>
      </section>

      <section className="help-section">
        <h2>Row actions</h2>
        <ul>
          <li><strong>⭐</strong> — Star a shortcut as a favourite.</li>
          <li><strong>🚩</strong> — Flag a shortcut for review/correction (shows in the 🚩 modal).</li>
          <li><strong>🖊️</strong> — Edit the shortcut's action, keys, category, or context note inline.</li>
          <li><strong>Rate column</strong> — Click the Rate header to hide/show the column. Hover over the header for a description of each rating.</li>
          <li><strong>Context tooltip</strong> — Hover over any shortcut badge to see its context note, if one exists.</li>
        </ul>
      </section>

      <section className="help-section">
        <h2>Filtering apps</h2>
        <p>
          Tap any app chip to focus on just that application. Select multiple chips to
          practise a custom mix. Tap <strong>All</strong> to return to the full deck.
          Each chip has a letter shortcut shown in small brackets.
        </p>
      </section>

      <section className="help-section">
        <h2>Adding your own shortcuts</h2>
        <p>
          Use the <strong>+ Add</strong> button on the Shortcuts page to create custom shortcuts
          stored in your browser. They appear immediately and are included in exports.
          You can also edit <code>src/data/custom.json</code> to add shortcuts that ship
          with the app for everyone.
        </p>
      </section>

      <section className="help-section">
        <h2>Apps covered</h2>
        <ul>
          <li>📊 <strong>Excel</strong> — navigation, formulas, formatting, workbook management</li>
          <li>📽️ <strong>PowerPoint</strong> — slides, text, objects, presenter mode</li>
          <li>📧 <strong>Gmail</strong> — compose, reply, archive, labels, navigation</li>
          <li>🗨️ <strong>Google Chat</strong> — navigation, messaging, formatting</li>
          <li>📅 <strong>Google Calendar</strong> — events, views, navigation</li>
          <li>✅ <strong>Google Tasks</strong> — tasks, navigation</li>
          <li>📁 <strong>Google Drive</strong> — navigation, selection, file actions</li>
          <li>🖥️ <strong>Desktop</strong> — Windows snapping, virtual desktops, system shortcuts</li>
          <li>⚙️ <strong>PowerToys</strong> — Run, FancyZones, Color Picker, Text Extractor and more</li>
          <li>💬 <strong>Slack</strong> — navigation, messaging, formatting</li>
          <li>🌐 <strong>Vimium</strong> — browser navigation, tabs, link hints, find mode</li>
          <li>🔮 <strong>Obsidian</strong> — notes, editor, search, layout</li>
          <li>🟡 <strong>Chrome</strong> — tabs, navigation, bookmarks, developer tools</li>
          <li>🔖 <strong>Bookmarks</strong> — your custom shortcuts</li>
        </ul>
      </section>

      <section className="help-section">
        <h2>Data &amp; privacy</h2>
        <p>
          All progress, settings, and custom shortcuts are stored locally in your browser's{' '}
          <code>localStorage</code>. Nothing is sent to any server.
          Use ⬇️ to export a backup and ⬆️ to restore it.
        </p>
      </section>

      <footer className="help-footer">
        <p>Made with the SM-2 algorithm · stores data locally · open source on GitHub</p>
      </footer>
    </div>
  )
}
