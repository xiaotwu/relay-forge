export default function LicensePage() {
  return (
    <div className="space-y-10">
      <div>
        <span className="section-chip">Project terms</span>
        <h1>License</h1>
        <p>
          RelayForge is licensed under the GNU Affero General Public License v3.0 or later
          (AGPL-3.0-or-later).
        </p>
      </div>

      <section>
        <h2>What this means</h2>
        <p>
          The AGPL is a strong copyleft license intended for software used over a network. If you
          modify RelayForge and make it available as a service, users of that service must also be
          able to access the modified source.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="docs-stat-card">
            <p className="section-chip mb-3">You can</p>
            <ul className="!mb-0">
              <li>Use RelayForge for any purpose.</li>
              <li>Study and modify the source code.</li>
              <li>Distribute copies.</li>
              <li>Self-host for your team or organization.</li>
              <li>Offer it as a hosted service, with source disclosure.</li>
            </ul>
          </div>
          <div className="docs-stat-card">
            <p className="section-chip mb-3">You must</p>
            <ul className="!mb-0">
              <li>Keep the original license and copyright notice.</li>
              <li>Disclose source code for modified versions.</li>
              <li>State what changes were made.</li>
              <li>License derivative works under the same terms.</li>
              <li>Provide source access to users interacting over a network.</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Why AGPL</h2>
        <p>
          RelayForge is built for self-hosted communication infrastructure. The AGPL helps ensure
          that improvements made to hosted deployments can continue to flow back to the community,
          while still allowing free use, modification, and internal deployment.
        </p>
      </section>

      <section>
        <h2>Third-party dependencies</h2>
        <p>
          RelayForge depends on open-source libraries with their own licenses, most commonly MIT,
          Apache-2.0, BSD-style licenses, and the PostgreSQL license.
        </p>
        <ul>
          <li>Go standard library and ecosystem</li>
          <li>React and Tailwind CSS</li>
          <li>Tauri for the desktop app</li>
          <li>LiveKit for real-time media</li>
          <li>PostgreSQL and Valkey for core infrastructure</li>
        </ul>
      </section>

      <section>
        <h2>Full license text</h2>
        <p>
          The complete license is available in the repository root as <code>LICENSE</code> and on{' '}
          <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noreferrer">
            gnu.org/licenses/agpl-3.0.html
          </a>
          .
        </p>
      </section>
    </div>
  );
}
