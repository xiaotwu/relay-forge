import { Link } from 'react-router-dom';
import ArchitectureDiagram from '../components/ArchitectureDiagram';

const stats = [
  {
    value: '4',
    label: 'Client surfaces',
    copy: 'Web, admin, desktop, and GitHub Pages documentation live in one release surface.',
  },
  {
    value: '5',
    label: 'Shared packages',
    copy: 'The SDK, UI system, config contract, crypto layer, and type models keep apps aligned.',
  },
  {
    value: '4',
    label: 'Server services',
    copy: 'API, realtime, media, and worker services stay isolated in the backend repository.',
  },
  {
    value: '1',
    label: 'Docs source',
    copy: 'The client repository is now the only place that publishes detailed platform documentation.',
  },
];

const handbookAreas = [
  {
    title: 'Client product surfaces',
    copy: 'Use this handbook to understand the browser client, admin console, desktop shell, and the docs site itself.',
  },
  {
    title: 'Shared frontend contracts',
    copy: 'Endpoint configuration, realtime conventions, shared types, and cryptography utilities are documented here.',
  },
  {
    title: 'Backend architecture',
    copy: 'The server repository stays code-focused, while service boundaries, operations notes, and threat-model decisions move here.',
  },
  {
    title: 'Delivery automation',
    copy: 'GitHub Pages, release assets, and GitHub Container Registry workflows are explained in one place.',
  },
];

const readingPaths = [
  {
    title: 'Shipping product UI',
    copy: 'Start with the client applications and shared packages pages, then confirm the endpoint contract before wiring a new feature.',
    to: '/client-apps',
    cta: 'Explore client surfaces',
  },
  {
    title: 'Operating the backend',
    copy: 'Read the server overview, operations, and security model pages to understand how requests, media, and background jobs are separated.',
    to: '/server',
    cta: 'Explore backend platform',
  },
  {
    title: 'Releasing the platform',
    copy: 'The build and release page explains how CI, GitHub Pages, GitHub Releases, and GHCR fit together after the docs consolidation.',
    to: '/deployment',
    cta: 'Explore delivery flow',
  },
];

export default function HomePage() {
  return (
    <>
      <section className="doc-hero">
        <div>
          <p className="doc-kicker">RelayForge platform handbook</p>
          <h1 className="doc-title">One documentation surface for the entire RelayForge stack.</h1>
          <p className="doc-subtitle">
            The client repository now owns the GitHub Pages site, contribution rules, release
            narrative, and detailed architecture notes for both repositories. The server repository
            stays focused on runtime code and deployment assets.
          </p>

          <div className="doc-actions">
            <Link to="/quick-start" className="doc-pill-button primary">
              Open quick start
            </Link>
            <Link to="/server" className="doc-pill-button">
              Explore backend platform
            </Link>
            <a
              href="https://github.com/xiaotwu/relay-forge"
              target="_blank"
              rel="noreferrer"
              className="doc-pill-button"
            >
              View client repo
            </a>
          </div>
        </div>

        <ArchitectureDiagram />
      </section>

      <section className="doc-stat-grid">
        {stats.map((stat) => (
          <article key={stat.label} className="doc-stat">
            <div className="doc-stat-value">{stat.value}</div>
            <div className="doc-stat-label">{stat.label}</div>
            <p className="doc-stat-copy">{stat.copy}</p>
          </article>
        ))}
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">What this handbook now owns</h2>
        <p className="doc-section-copy">
          This site is intentionally broader than a normal app README. It is the public reference
          for repository boundaries, platform components, deployment flow, and operating decisions
          that would otherwise drift between two repos.
        </p>

        <div className="doc-card-grid">
          {handbookAreas.map((area) => (
            <article key={area.title} className="doc-card">
              <h3 className="doc-card-title">{area.title}</h3>
              <p className="doc-card-copy">{area.copy}</p>
            </article>
          ))}
        </div>

        <div className="doc-callout">
          Policy: detailed documentation and GitHub Pages only publish from <code>relay-forge</code>
          . The <code>relay-forge-server</code> README stays concise and points back here for deeper
          context.
        </div>
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">Recommended reading paths</h2>
        <p className="doc-section-copy">
          The sections below are arranged to match the most common jobs on the project: build the
          product, operate the backend, or release the platform.
        </p>

        <div className="doc-card-grid">
          {readingPaths.map((path) => (
            <article key={path.title} className="doc-card">
              <h3 className="doc-card-title">{path.title}</h3>
              <p className="doc-card-copy">{path.copy}</p>
              <Link to={path.to} className="doc-pill-button mt-5">
                {path.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
