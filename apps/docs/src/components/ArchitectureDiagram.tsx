export default function ArchitectureDiagram() {
  return (
    <div className="doc-diagram-frame">
      <svg viewBox="0 0 760 420" role="img" aria-label="RelayForge architecture overview">
        <defs>
          <linearGradient id="heroGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#91a6ff" />
            <stop offset="50%" stopColor="#d9e2ff" />
            <stop offset="100%" stopColor="#f4f7ff" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="760" height="420" rx="32" fill="url(#heroGlow)" />
        <rect x="28" y="26" width="704" height="368" rx="26" fill="#fbfbf8" fillOpacity="0.96" />

        <text x="56" y="68" className="diagram-eyebrow">
          relay-forge
        </text>
        <text x="404" y="68" className="diagram-eyebrow">
          relay-forge-server
        </text>

        <g>
          <rect x="56" y="92" width="292" height="164" rx="20" className="diagram-panel" />
          <text x="80" y="124" className="diagram-title">
            Client surfaces
          </text>
          <text x="80" y="148" className="diagram-copy">
            Web, admin, desktop, and docs ship from one repo.
          </text>

          {[
            ['apps/web', 80, 174],
            ['apps/admin', 214, 174],
            ['apps/desktop', 80, 220],
            ['apps/docs', 214, 220],
          ].map(([label, x, y]) => (
            <g key={label}>
              <rect
                x={Number(x)}
                y={Number(y)}
                width="112"
                height="32"
                rx="12"
                className="diagram-pill"
              />
              <text x={Number(x) + 16} y={Number(y) + 21} className="diagram-pill-text">
                {label}
              </text>
            </g>
          ))}
        </g>

        <g>
          <rect x="56" y="274" width="292" height="96" rx="20" className="diagram-panel" />
          <text x="80" y="306" className="diagram-title">
            Shared packages
          </text>
          <text x="80" y="330" className="diagram-copy">
            config, sdk, types, crypto, and UI keep every client aligned.
          </text>
          <text x="80" y="353" className="diagram-mono">
            packages/config · sdk · types · crypto · ui
          </text>
        </g>

        <g>
          <rect x="404" y="92" width="300" height="164" rx="20" className="diagram-panel" />
          <text x="428" y="124" className="diagram-title">
            Runtime services
          </text>
          <text x="428" y="148" className="diagram-copy">
            API, realtime, media, and worker split by runtime behavior.
          </text>

          {[
            ['api', 428, 174],
            ['realtime', 538, 174],
            ['media', 428, 220],
            ['worker', 538, 220],
          ].map(([label, x, y]) => (
            <g key={label}>
              <rect
                x={Number(x)}
                y={Number(y)}
                width="94"
                height="32"
                rx="12"
                className="diagram-pill"
              />
              <text x={Number(x) + 20} y={Number(y) + 21} className="diagram-pill-text">
                {label}
              </text>
            </g>
          ))}
        </g>

        <g>
          <rect x="404" y="274" width="300" height="96" rx="20" className="diagram-panel" />
          <text x="428" y="306" className="diagram-title">
            Infrastructure
          </text>
          <text x="428" y="330" className="diagram-copy">
            PostgreSQL, Valkey, S3-compatible storage, and LiveKit.
          </text>
          <text x="428" y="353" className="diagram-mono">
            postgres · valkey · object storage · livekit
          </text>
        </g>

        <path d="M348 174 H392" className="diagram-link" />
        <path d="M348 322 H392" className="diagram-link" />
        <path d="M552 256 V274" className="diagram-link" />
      </svg>
    </div>
  );
}
