export default function ContributingPage() {
  return (
    <div className="space-y-10">
      <div>
        <span className="section-chip">Community handbook</span>
        <h1>Contributing to RelayForge</h1>
        <p>
          RelayForge is an open-source project and we welcome code, docs, bug reports, feature
          ideas, and design feedback. This page keeps the contribution workflow short and practical
          so new contributors can get from clone to pull request without guesswork.
        </p>
      </div>

      <section>
        <h2>Getting started</h2>
        <ol>
          <li>Fork the repository on GitHub.</li>
          <li>
            Clone your fork:
            <code>git clone https://github.com/your-user/relay-forge.git</code>
          </li>
          <li>Install prerequisites: Go 1.23+, Node.js 20+, and Docker.</li>
          <li>
            Start shared infrastructure:
            <code>make dev-services</code>
          </li>
          <li>
            Run migrations and seed development data:
            <code>make migrate && make seed</code>
          </li>
          <li>
            Install frontend dependencies and build shared packages:
            <code>npm install && npm run build:packages</code>
          </li>
          <li>
            Start the API:
            <code>make dev-api</code>
          </li>
          <li>
            Start the web app:
            <code>make dev-web</code>
          </li>
        </ol>
      </section>

      <section>
        <h2>Development workflow</h2>
        <p>
          Create a focused feature branch from <code>main</code>. Keep each branch scoped to one
          change when possible so review stays fast and the project history remains readable.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="docs-stat-card">
            <p className="section-chip mb-3">Validate</p>
            <p className="text-ink-900 mb-2 font-serif text-2xl">Tests</p>
            <p className="mb-0 text-sm leading-7">
              Run the project checks before opening a pull request.
              <br />
              <code>make test</code>
            </p>
          </div>
          <div className="docs-stat-card">
            <p className="section-chip mb-3">Polish</p>
            <p className="text-ink-900 mb-2 font-serif text-2xl">Lint</p>
            <p className="mb-0 text-sm leading-7">
              Keep service and frontend lint jobs green.
              <br />
              <code>make lint</code>
            </p>
          </div>
          <div className="docs-stat-card">
            <p className="section-chip mb-3">Ship</p>
            <p className="text-ink-900 mb-2 font-serif text-2xl">Format</p>
            <p className="mb-0 text-sm leading-7">
              Normalize formatting before review.
              <br />
              <code>make format</code>
            </p>
          </div>
        </div>
        <ul>
          <li>New features should include tests where practical.</li>
          <li>Documentation should be updated whenever workflows or structure change.</li>
          <li>Keep commits and pull requests small enough to review with context.</li>
        </ul>
      </section>

      <section>
        <h2>Code style</h2>
        <table>
          <thead>
            <tr>
              <th>Language</th>
              <th>Formatter</th>
              <th>Linter</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Go</td>
              <td>gofmt</td>
              <td>golangci-lint</td>
            </tr>
            <tr>
              <td>TypeScript</td>
              <td>Prettier</td>
              <td>ESLint</td>
            </tr>
            <tr>
              <td>CSS</td>
              <td>Prettier</td>
              <td>Tailwind CSS conventions</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Commit messages</h2>
        <p>Use conventional commit messages to keep history and release notes easy to scan.</p>
        <pre>{`feat: add voice message recording
fix: correct permission check for channel deletion
docs: update deployment guide for ARM64
refactor: extract message validation logic
test: add integration tests for guild creation
chore: update Go dependencies`}</pre>
      </section>

      <section>
        <h2>Pull request guidelines</h2>
        <ul>
          <li>Explain what changed and why in the PR description.</li>
          <li>Reference related issues when they exist.</li>
          <li>Split very large changes into smaller reviewable pull requests.</li>
          <li>Respond to review comments with follow-up changes or rationale.</li>
          <li>Wait for CI to pass before asking for final review.</li>
        </ul>
      </section>

      <section>
        <h2>Reporting issues</h2>
        <p>
          Use GitHub Issues for bugs and feature requests. Include reproduction steps, expected
          behavior, actual behavior, and environment details. For vulnerabilities, use the{' '}
          <a href="/security">Security Policy</a> instead of opening a public issue.
        </p>
      </section>

      <section>
        <h2>Code of conduct</h2>
        <p>
          We follow the Contributor Covenant. Be respectful, constructive, and welcoming to
          contributors at every experience level.
        </p>
      </section>
    </div>
  );
}
