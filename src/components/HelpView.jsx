export default function HelpView() {
  return (
    <div className="settings-view">
      <h2 className="settings-title">❓ Help</h2>

      {/* ── About ── */}
      <section className="settings-section">
        <h3 className="settings-section-title">About KeyDeck</h3>
        <p className="settings-hint" style={{ marginBottom: '8px' }}>
          A spaced-repetition keyboard shortcut trainer. Learn shortcuts for Excel, PowerPoint,
          Gmail, Google Drive, Slack, Chrome, Obsidian, Windows PowerToys and more — on Mac <em>and</em> Windows.
        </p>
        <p className="settings-hint">
          KeyDeck uses the <strong>SM-2 algorithm</strong> (the same one Anki uses) to schedule
          each shortcut at the optimal moment for long-term memory. Rate each card honestly:
        </p>
        <ul className="help-list">
          <li><strong>Again</strong> — you drew a blank. Resets the card.</li>
          <li><strong>Hard</strong> — you got it but it took real effort.</li>
          <li><strong>Good</strong> — normal recall with a small pause.</li>
          <li><strong>Easy</strong> — instant, effortless recall.</li>
        </ul>
      </section>

      {/* ── Views ── */}
      <section className="settings-section">
        <h3 className="settings-section-title">Views</h3>
        <ul className="help-list">
          <li><strong>⌨️ Shortcuts [1]</strong> — Full reference table, paginated 10/page. Sortable by any column. Use <strong>+ Add</strong> to create your own shortcuts.</li>
          <li><strong>📖 Practise [2]</strong> — Your daily review queue. Up to 10 shortcuts due today appear here; rate them all to complete the session.</li>
          <li><strong>🎲 Discover [3]</strong> — A fresh batch of shortcuts you haven't seen yet. Rating a card adds it to your Practise deck automatically. Hit 🎲 for a new batch.</li>
          <li><strong>❓ Help [4]</strong> — You're here.</li>
          <li><strong>⚙️ Settings [5]</strong> — Hide apps you don't use, and configure platform, theme and Rate column visibility.</li>
        </ul>
      </section>

      {/* ── Top bar icons ── */}
      <section className="settings-section">
        <h3 className="settings-section-title">Top bar icons</h3>
        <ul className="help-list">
          <li><strong>🔍 [/]</strong> — Open inline search. Filters the current view as you type.</li>
          <li><strong>⭐ [F]</strong> — Toggle favourites filter. Shows only starred shortcuts.</li>
          <li><strong>🚩</strong> — Open the flagged-for-review modal.</li>
          <li><strong>☀️ / 🌙</strong> — Switch between light and dark mode.</li>
          <li><strong>⬇️</strong> — Export your progress and overrides as a JSON backup.</li>
          <li><strong>⬆️</strong> — Import a previously exported backup.</li>
        </ul>
      </section>

      {/* ── Row actions ── */}
      <section className="settings-section">
        <h3 className="settings-section-title">Row actions</h3>
        <ul className="help-list">
          <li><strong>⭐</strong> — Star a shortcut as a favourite.</li>
          <li><strong>🚩</strong> — Flag a shortcut for review/correction (shows in the 🚩 modal).</li>
          <li><strong>🖊️</strong> — Edit the shortcut's action, keys, category, or context note inline.</li>
          <li><strong>Rate column</strong> — Click the Rate header to hide/show the column.</li>
          <li><strong>Context tooltip</strong> — Hover over any shortcut badge to see its context note.</li>
        </ul>
      </section>

      {/* ── Keyboard shortcuts ── */}
      <section className="settings-section">
        <h3 className="settings-section-title">Keyboard shortcuts</h3>
        <p className="settings-hint" style={{ marginBottom: '8px' }}>
          App filter shortcuts starting with <kbd style={{ fontSize: '0.75rem' }}>0</kbd> use a two-key sequence —
          press <kbd style={{ fontSize: '0.75rem' }}>0</kbd> then the letter. Single-letter shortcuts fire instantly.
        </p>
        <div className="modal-table-wrapper">
          <table className="help-kbd-table">
            <tbody>
              <tr><td><kbd>1</kbd></td><td>Go to Shortcuts</td></tr>
              <tr><td><kbd>2</kbd></td><td>Go to Practise</td></tr>
              <tr><td><kbd>3</kbd></td><td>Go to Discover</td></tr>
              <tr><td><kbd>4</kbd></td><td>Go to Help</td></tr>
              <tr><td><kbd>5</kbd></td><td>Go to Settings</td></tr>
              <tr><td><kbd>M</kbd></td><td>Switch to Mac platform</td></tr>
              <tr><td><kbd>W</kbd></td><td>Switch to Windows platform</td></tr>
              <tr><td><kbd>F</kbd></td><td>Toggle favourites filter</td></tr>
              <tr><td><kbd>/</kbd></td><td>Open search</td></tr>
              <tr><td><kbd>Esc</kbd></td><td>Close search / modal / cancel prefix</td></tr>
              <tr><td colSpan={2} style={{ paddingTop: '6px', paddingBottom: '2px', opacity: 0.5, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>App filters — single key</td></tr>
              <tr><td><kbd>A</kbd></td><td>Show all (clear filter)</td></tr>
              <tr><td><kbd>B</kbd></td><td>Toggle Bookmarks filter</td></tr>
              <tr><td><kbd>C</kbd></td><td>Toggle Chat filter</td></tr>
              <tr><td><kbd>D</kbd></td><td>Toggle Drive filter</td></tr>
              <tr><td><kbd>G</kbd></td><td>Toggle Gmail filter</td></tr>
              <tr><td><kbd>K</kbd></td><td>Toggle Keep filter</td></tr>
              <tr><td><kbd>L</kbd></td><td>Toggle Slack filter</td></tr>
              <tr><td><kbd>N</kbd></td><td>Toggle NotebookLM filter</td></tr>
              <tr><td><kbd>O</kbd></td><td>Toggle Outlook filter</td></tr>
              <tr><td><kbd>P</kbd></td><td>Toggle PowerPoint filter</td></tr>
              <tr><td><kbd>R</kbd></td><td>Toggle Chrome filter</td></tr>
              <tr><td><kbd>S</kbd></td><td>Toggle Sheets filter</td></tr>
              <tr><td><kbd>T</kbd></td><td>Toggle Tasks filter</td></tr>
              <tr><td><kbd>U</kbd></td><td>Toggle Claude filter</td></tr>
              <tr><td><kbd>V</kbd></td><td>Toggle Vimium filter</td></tr>
              <tr><td><kbd>X</kbd></td><td>Toggle Excel filter</td></tr>
              <tr><td><kbd>Z</kbd></td><td>Toggle Desktop filter</td></tr>
              <tr><td colSpan={2} style={{ paddingTop: '6px', paddingBottom: '2px', opacity: 0.5, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>App filters — press 0, then…</td></tr>
              <tr><td><kbd>0</kbd><kbd>C</kbd></td><td>Toggle Calendar filter</td></tr>
              <tr><td><kbd>0</kbd><kbd>D</kbd></td><td>Toggle Docs filter</td></tr>
              <tr><td><kbd>0</kbd><kbd>G</kbd></td><td>Toggle Gemini filter</td></tr>
              <tr><td><kbd>0</kbd><kbd>M</kbd></td><td>Toggle Meet filter</td></tr>
              <tr><td><kbd>0</kbd><kbd>O</kbd></td><td>Toggle Obsidian filter</td></tr>
              <tr><td><kbd>0</kbd><kbd>P</kbd></td><td>Toggle PowerToys filter</td></tr>
              <tr><td><kbd>0</kbd><kbd>S</kbd></td><td>Toggle Slides filter</td></tr>
              <tr><td><kbd>0</kbd><kbd>T</kbd></td><td>Toggle Teams filter</td></tr>
              <tr><td><kbd>0</kbd><kbd>W</kbd></td><td>Toggle Word filter</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Apps covered ── */}
      <section className="settings-section">
        <h3 className="settings-section-title">Apps covered</h3>
        <ul className="help-list">
          <li>📧 <strong>Gmail</strong> — compose, reply, archive, labels, navigation</li>
          <li>📹 <strong>Google Meet</strong> — audio, video, reactions, captions, screen share</li>
          <li>💬 <strong>Google Chat</strong> — navigation, messaging, formatting</li>
          <li>📅 <strong>Google Calendar</strong> — events, views, navigation</li>
          <li>💾 <strong>Google Drive</strong> — navigation, selection, file actions</li>
          <li>📄 <strong>Google Docs</strong> — formatting, styles, navigation, comments</li>
          <li>📊 <strong>Google Sheets</strong> — navigation, editing, formulas, formatting</li>
          <li>📽️ <strong>Google Slides</strong> — slides, text, objects, presenter mode</li>
          <li>✅ <strong>Google Tasks</strong> — tasks, navigation</li>
          <li>🟡 <strong>Google Keep</strong> — create, archive, pin, label, navigation</li>
          <li>✨ <strong>Gemini</strong> — compose, send, edit, format</li>
          <li>📓 <strong>NotebookLM</strong> — chat, notes, editing</li>
          <li>📊 <strong>Excel</strong> — navigation, formulas, formatting, workbook management</li>
          <li>📕 <strong>PowerPoint</strong> — slides, text, objects, presenter mode</li>
          <li>📘 <strong>Word</strong> — formatting, styles, paragraphs, review, navigation</li>
          <li>📨 <strong>Outlook</strong> — compose, reply, organise, calendar, navigation</li>
          <li>👥 <strong>Teams</strong> — chat, calls, meetings, formatting, navigation</li>
          <li>🖥️ <strong>Desktop</strong> — Windows snapping, virtual desktops, system shortcuts</li>
          <li>⚙️ <strong>PowerToys</strong> — Run, FancyZones, Color Picker, Text Extractor and more</li>
          <li>💼 <strong>Slack</strong> — navigation, messaging, formatting</li>
          <li>🌐 <strong>Vimium</strong> — browser navigation, tabs, link hints, find mode</li>
          <li>🔮 <strong>Obsidian</strong> — notes, editor, search, layout</li>
          <li>🌐 <strong>Chrome</strong> — tabs, navigation, bookmarks, developer tools</li>
          <li>🤖 <strong>Claude</strong> — compose, send, edit, format, navigation</li>
          <li>🔖 <strong>Bookmarks</strong> — your custom shortcuts</li>
        </ul>
      </section>

      {/* ── Data & privacy ── */}
      <section className="settings-section">
        <h3 className="settings-section-title">Data &amp; privacy</h3>
        <p className="settings-hint">
          All progress, settings, and custom shortcuts are stored locally in your browser's{' '}
          <code>localStorage</code>. Nothing is sent to any server.
          Use ⬇️ to export a backup and ⬆️ to restore it.
        </p>
      </section>

      <p className="help-footer-note">Made with the SM-2 algorithm · stores data locally · open source on GitHub</p>
    </div>
  )
}
