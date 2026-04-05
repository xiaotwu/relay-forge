export default function RuntimeFlowDiagram() {
  return (
    <div className="doc-diagram-frame">
      <svg viewBox="0 0 760 360" role="img" aria-label="RelayForge request and realtime flow">
        <rect x="0" y="0" width="760" height="360" rx="32" fill="#f5f7ff" />
        <rect x="22" y="22" width="716" height="316" rx="26" fill="#fbfbff" stroke="#d6dff4" />

        {[
          ['Clients', 56],
          ['Control plane', 254],
          ['Delivery plane', 464],
          ['State', 648],
        ].map(([label, x]) => (
          <text key={label} x={Number(x)} y="62" className="diagram-eyebrow">
            {label}
          </text>
        ))}

        {[
          ['web / admin / desktop', 56, 94, 154],
          ['api', 254, 94, 110],
          ['realtime', 254, 154, 110],
          ['media', 254, 214, 110],
          ['worker', 254, 274, 110],
          ['livekit', 464, 214, 112],
          ['postgres', 648, 94, 92],
          ['valkey', 648, 154, 92],
          ['s3 storage', 648, 214, 92],
        ].map(([label, x, y, width]) => (
          <g key={label}>
            <rect
              x={Number(x)}
              y={Number(y)}
              width={Number(width)}
              height="34"
              rx="12"
              className="diagram-pill"
            />
            <text x={Number(x) + 18} y={Number(y) + 22} className="diagram-pill-text">
              {label}
            </text>
          </g>
        ))}

        {[
          'M210 111 H236',
          'M210 171 H236',
          'M210 231 H236',
          'M364 111 H620',
          'M364 171 H620',
          'M364 231 H620',
          'M420 231 H446',
          'M420 291 H620',
        ].map((path) => (
          <path key={path} d={path} className="diagram-link" />
        ))}

        <text x="392" y="109" className="diagram-note">
          REST, auth, metadata
        </text>
        <text x="392" y="169" className="diagram-note">
          WebSocket fan-out and presence
        </text>
        <text x="392" y="229" className="diagram-note">
          Uploads and voice tokens
        </text>
        <text x="392" y="289" className="diagram-note">
          Background jobs and retention
        </text>
      </svg>
    </div>
  );
}
