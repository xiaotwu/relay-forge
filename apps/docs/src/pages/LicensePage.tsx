export default function LicensePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-rf-primary text-3xl font-bold">License</h1>
        <p className="text-rf-secondary mt-2">
          RelayForge is licensed under the GNU Affero General Public License v3.0 or later
          (AGPL-3.0-or-later).
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-rf-primary text-2xl font-semibold">What This Means</h2>
        <div className="text-rf-secondary space-y-3">
          <p>
            The AGPL-3.0 is a strong copyleft license designed for software that runs over a
            network. It ensures that users who interact with the software over a network have access
            to the source code.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-rf-elevated rounded-lg p-4">
              <h3 className="font-semibold text-emerald-400">You Can</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>Use RelayForge for any purpose</li>
                <li>Study and modify the source code</li>
                <li>Distribute copies</li>
                <li>Self-host for your organization</li>
                <li>Offer it as a hosted service (with source disclosure)</li>
              </ul>
            </div>
            <div className="bg-rf-elevated rounded-lg p-4">
              <h3 className="font-semibold text-yellow-400">You Must</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>Include the original license and copyright</li>
                <li>Disclose source code of modified versions</li>
                <li>State changes made to the code</li>
                <li>Use the same license for derivative works</li>
                <li>Provide source access to network users</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-rf-primary text-2xl font-semibold">Why AGPL?</h2>
        <p className="text-rf-secondary">
          We chose the AGPL to ensure that RelayForge remains open source even when deployed as a
          network service. The AGPL's network use clause (Section 13) requires that anyone who
          modifies RelayForge and offers it as a service must make their modified source code
          available to users of that service. This protects the community's contributions while
          still allowing free use, self-hosting, and modification.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-rf-primary text-2xl font-semibold">Third-Party Dependencies</h2>
        <p className="text-rf-secondary">
          RelayForge depends on various open-source libraries, each with their own licenses. Most
          dependencies use MIT, Apache-2.0, or BSD licenses, which are compatible with AGPL-3.0.
          Notable dependencies include:
        </p>
        <ul className="text-rf-secondary list-inside list-disc space-y-1 pl-4">
          <li>Go standard library and ecosystem (BSD-3-Clause)</li>
          <li>React (MIT)</li>
          <li>Tailwind CSS (MIT)</li>
          <li>Tauri (MIT / Apache-2.0)</li>
          <li>LiveKit (Apache-2.0)</li>
          <li>PostgreSQL (PostgreSQL License)</li>
          <li>Valkey (BSD-3-Clause)</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-rf-primary text-2xl font-semibold">Full License Text</h2>
        <p className="text-rf-secondary">
          The full license text is available in the{' '}
          <code className="bg-rf-elevated rounded px-2 py-0.5 text-sm text-emerald-400">
            LICENSE
          </code>{' '}
          file at the root of the repository and at{' '}
          <a
            href="https://www.gnu.org/licenses/agpl-3.0.html"
            className="text-emerald-400 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            gnu.org/licenses/agpl-3.0.html
          </a>
          .
        </p>
      </section>
    </div>
  );
}
