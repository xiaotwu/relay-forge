export default function ContributingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-rf-primary text-3xl font-bold">Contributing to RelayForge</h1>
        <p className="text-rf-secondary mt-2">
          Thank you for your interest in contributing. RelayForge is an open-source project and we
          welcome contributions of all kinds: code, documentation, bug reports, feature requests,
          and design feedback.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-rf-primary text-2xl font-semibold">Getting Started</h2>
        <ol className="text-rf-secondary list-inside list-decimal space-y-2">
          <li>Fork the repository on GitHub</li>
          <li>
            Clone your fork:{' '}
            <code className="bg-rf-elevated rounded px-2 py-0.5 text-sm text-emerald-400">
              git clone https://github.com/your-user/relay-forge.git
            </code>
          </li>
          <li>Install prerequisites: Go 1.23+, Node.js 20+, Docker</li>
          <li>
            Start infrastructure:{' '}
            <code className="bg-rf-elevated rounded px-2 py-0.5 text-sm text-emerald-400">
              make dev-services
            </code>
          </li>
          <li>
            Run migrations and seed:{' '}
            <code className="bg-rf-elevated rounded px-2 py-0.5 text-sm text-emerald-400">
              make migrate && make seed
            </code>
          </li>
          <li>
            Install frontend deps:{' '}
            <code className="bg-rf-elevated rounded px-2 py-0.5 text-sm text-emerald-400">
              npm install && npm run build:packages
            </code>
          </li>
          <li>
            Start the API:{' '}
            <code className="bg-rf-elevated rounded px-2 py-0.5 text-sm text-emerald-400">
              make dev-api
            </code>
          </li>
          <li>
            Start the web app:{' '}
            <code className="bg-rf-elevated rounded px-2 py-0.5 text-sm text-emerald-400">
              make dev-web
            </code>
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-rf-primary text-2xl font-semibold">Development Workflow</h2>
        <div className="text-rf-secondary space-y-3">
          <p>
            Create a feature branch from{' '}
            <code className="bg-rf-elevated rounded px-2 py-0.5 text-sm text-emerald-400">
              main
            </code>{' '}
            for your changes. Keep branches focused on a single change when possible.
          </p>
          <p>Before submitting a pull request, ensure:</p>
          <ul className="list-inside list-disc space-y-1 pl-4">
            <li>
              All tests pass:{' '}
              <code className="bg-rf-elevated rounded px-2 py-0.5 text-sm text-emerald-400">
                make test
              </code>
            </li>
            <li>
              Linting passes:{' '}
              <code className="bg-rf-elevated rounded px-2 py-0.5 text-sm text-emerald-400">
                make lint
              </code>
            </li>
            <li>
              Code is formatted:{' '}
              <code className="bg-rf-elevated rounded px-2 py-0.5 text-sm text-emerald-400">
                make format
              </code>
            </li>
            <li>New features have tests</li>
            <li>Documentation is updated if needed</li>
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-rf-primary text-2xl font-semibold">Code Style</h2>
        <div className="overflow-x-auto">
          <table className="text-rf-secondary w-full text-left text-sm">
            <thead className="border-rf-elevated text-rf-primary border-b">
              <tr>
                <th className="pb-3 pr-6 font-semibold">Language</th>
                <th className="pb-3 pr-6 font-semibold">Formatter</th>
                <th className="pb-3 font-semibold">Linter</th>
              </tr>
            </thead>
            <tbody className="divide-rf-elevated divide-y">
              <tr>
                <td className="py-2 pr-6">Go</td>
                <td className="py-2 pr-6">gofmt</td>
                <td className="py-2">golangci-lint</td>
              </tr>
              <tr>
                <td className="py-2 pr-6">TypeScript</td>
                <td className="py-2 pr-6">Prettier</td>
                <td className="py-2">ESLint</td>
              </tr>
              <tr>
                <td className="py-2 pr-6">CSS</td>
                <td className="py-2 pr-6">Prettier</td>
                <td className="py-2">Tailwind CSS conventions</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-rf-primary text-2xl font-semibold">Commit Messages</h2>
        <p className="text-rf-secondary">
          Use conventional commit messages to keep the history readable:
        </p>
        <pre className="bg-rf-elevated text-rf-primary overflow-x-auto rounded-lg p-4 text-sm">
          {`feat: add voice message recording
fix: correct permission check for channel deletion
docs: update deployment guide for ARM64
refactor: extract message validation logic
test: add integration tests for guild creation
chore: update Go dependencies`}
        </pre>
      </section>

      <section className="space-y-4">
        <h2 className="text-rf-primary text-2xl font-semibold">Pull Request Guidelines</h2>
        <ul className="text-rf-secondary list-inside list-disc space-y-2">
          <li>Write a clear PR description explaining what changed and why</li>
          <li>Reference related issues if applicable</li>
          <li>Keep PRs reasonably sized — split large changes into smaller PRs</li>
          <li>Respond to review feedback constructively</li>
          <li>Ensure CI passes before requesting review</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-rf-primary text-2xl font-semibold">Reporting Issues</h2>
        <p className="text-rf-secondary">
          Use GitHub Issues to report bugs or request features. Include steps to reproduce, expected
          behavior, actual behavior, and environment details (OS, browser, versions). For security
          vulnerabilities, see the{' '}
          <a href="/relay-forge/security" className="text-emerald-400 hover:underline">
            Security Policy
          </a>
          .
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-rf-primary text-2xl font-semibold">Code of Conduct</h2>
        <p className="text-rf-secondary">
          We follow the <span className="text-rf-primary">Contributor Covenant</span>. Be
          respectful, constructive, and welcoming to all contributors regardless of experience
          level.
        </p>
      </section>
    </div>
  );
}
