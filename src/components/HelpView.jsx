/**
 * HelpView — mirrors the README content.
 * Keep this in sync with README.md when you update it.
 */
export default function HelpView() {
  return (
    <div className="help-view">
      <h1 className="help-title">⌨️ KeyDeck</h1>
      <p className="help-lead">
        A spaced-repetition keyboard shortcut trainer for power users.
        Learn Excel, PowerPoint, Google Workspace, Slack, Vimium, Obsidian,
        Windows Desktop shortcuts — on Mac <em>and</em> Windows.
      </p>

      <section className="help-section">
        <h2>How it works</h2>
        <p>
          KeyDeck uses the <strong>SM-2 algorithm</strong> (the same one Anki uses) to
          schedule each shortcut at the optimal moment for long-term memory. The more
          reliably you recall a shortcut, the longer the gap before it appears again.
        </p>
        <p>Rate each card honestly:</p>
        <ul>
          <li><strong>Again</strong> — you drew a blank. Resets the card.</li>
          <li><strong>Hard</strong> — you got it but it took real effort.</li>
          <li><strong>Good</strong> — normal recall with a small pause.</li>
          <li><strong>Easy</strong> — instant, effortless recall.</li>
        </ul>
      </section>

      <section className="help-section">
        <h2>Modes</h2>
        <ul>
          <li>
            <strong>Practice</strong> — Your daily review queue. Cards due today
            appear here; when the queue is empty you're done for the day.
          </li>
          <li>
            <strong>Discover</strong> — Random shortcuts you haven't seen yet.
            Great for expanding what you know. Rating a Discover card adds it to
            your Practice deck automatically.
          </li>
          <li>
            <strong>Search</strong> — Find any shortcut by action, category, or
            key combination. Useful when you need to look something up quickly.
          </li>
        </ul>
      </section>

      <section className="help-section">
        <h2>Switching platforms</h2>
        <p>
          Use the <strong>🍎 / ⊞</strong> toggle in the top bar to switch between
          Mac and Windows shortcuts at any time. Your progress is shared across
          both platforms.
        </p>
      </section>

      <section className="help-section">
        <h2>Filtering apps</h2>
        <p>
          Tap any app chip in the top bar to focus on just that application.
          Select multiple chips to practise a custom mix. Tap <strong>All</strong>{' '}
          to return to the full deck.
        </p>
      </section>

      <section className="help-section">
        <h2>Adding your own shortcuts</h2>
        <p>
          Edit <code>src/data/custom.json</code> to add your own bookmark shortcuts
          or any other bindings that aren't already in the library. Follow the same
          JSON schema as the other data files.
        </p>
      </section>

      <section className="help-section">
        <h2>Apps covered</h2>
        <ul>
          <li>📊 <strong>Excel</strong> — navigation, formulas, formatting, workbook management</li>
          <li>📽️ <strong>PowerPoint</strong> — slides, text, objects, presenter mode</li>
          <li>🔵 <strong>Google Workspace</strong> — Docs, Sheets, and Slides</li>
          <li>🖥️ <strong>Desktop</strong> — Windows snapping, virtual desktops, system shortcuts</li>
          <li>💬 <strong>Slack</strong> — navigation, messaging, formatting</li>
          <li>🌐 <strong>Vimium</strong> — browser navigation, tabs, link hints, find mode</li>
          <li>🔮 <strong>Obsidian</strong> — notes, editor, search, layout</li>
          <li>🔖 <strong>Bookmarks</strong> — your custom shortcuts (edit <code>custom.json</code>)</li>
        </ul>
      </section>

      <section className="help-section">
        <h2>Sequence shortcuts</h2>
        <p>
          Some shortcuts require pressing keys one after another (e.g. Vimium's{' '}
          <code>gg</code> or <code>g0</code>). These are labelled with a{' '}
          <strong>Sequence</strong> badge so you know to type them in order, not
          simultaneously.
        </p>
      </section>

      <section className="help-section">
        <h2>Data &amp; privacy</h2>
        <p>
          All progress and settings are stored locally in your browser's{' '}
          <code>localStorage</code>. Nothing is sent to any server.
        </p>
      </section>

      <section className="help-section">
        <h2>Contributing</h2>
        <p>
          PRs welcome! Add shortcuts by editing the relevant JSON file in{' '}
          <code>src/data/</code>. Each shortcut needs: <code>id</code>,{' '}
          <code>cat</code>, <code>action</code>, <code>mac</code>, <code>win</code>,{' '}
          and <code>priority</code> (1 = essential, 2 = useful, 3 = advanced).
        </p>
      </section>

      <footer className="help-footer">
        <p>
          Made with the SM-2 algorithm · stores data locally · open source on GitHub
        </p>
      </footer>
    </div>
  )
}
