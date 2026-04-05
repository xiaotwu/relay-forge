export default function ReleaseFlowDiagram() {
  return (
    <div className="doc-diagram-frame">
      <svg viewBox="0 0 760 280" role="img" aria-label="RelayForge CI/CD and release flow">
        <rect x="0" y="0" width="760" height="280" rx="32" fill="#f4f5f0" />
        <rect x="24" y="24" width="712" height="232" rx="26" fill="#fcfcfa" stroke="#d8dccf" />

        {[
          ['Authoring', 56, 'Branch work, docs edits, and tagged releases.'],
          ['GitHub Actions', 292, 'Client CI, Pages deploy, backend CI, and release jobs.'],
          ['Distribution', 528, 'GitHub Pages, GitHub Releases, and GHCR images.'],
        ].map(([label, x, copy]) => (
          <g key={label}>
            <text x={Number(x)} y="68" className="diagram-eyebrow">
              {label}
            </text>
            <text x={Number(x)} y="90" className="diagram-copy">
              {copy}
            </text>
          </g>
        ))}

        {[
          ['Push or PR', 56, 118],
          ['Tag vX.Y.Z', 56, 170],
          ['client-ci', 292, 102],
          ['deploy-pages', 292, 154],
          ['server-ci', 292, 206],
          ['Pages site', 528, 92],
          ['Release assets', 528, 154],
          ['GHCR images', 528, 216],
        ].map(([label, x, y]) => (
          <g key={label}>
            <rect
              x={Number(x)}
              y={Number(y)}
              width="164"
              height="34"
              rx="12"
              className="diagram-pill"
            />
            <text x={Number(x) + 18} y={Number(y) + 22} className="diagram-pill-text">
              {label}
            </text>
          </g>
        ))}

        {['M220 135 H272', 'M220 187 H272', 'M456 119 H508', 'M456 171 H508', 'M456 223 H508'].map(
          (path) => (
            <path key={path} d={path} className="diagram-link" />
          ),
        )}
      </svg>
    </div>
  );
}
