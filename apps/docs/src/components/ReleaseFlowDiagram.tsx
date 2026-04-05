import MermaidDiagram from './MermaidDiagram';

const releaseFlowChart = String.raw`
flowchart LR
    classDef source fill:#111827,stroke:#111827,color:#f8fafc;
    classDef pipeline fill:#ffffff,stroke:#d8dccf,color:#111827;
    classDef deliver fill:#eef2ff,stroke:#c7d2fe,color:#312e81;
    classDef package fill:#fff2e2,stroke:#f59e0b,color:#7c2d12;

    PUSH["Push or pull request"]:::source
    TAG["Tag vX.Y.Z"]:::source

    CLIENTCI["Client CI"]:::pipeline
    PAGESJOB["Deploy Pages"]:::pipeline
    SERVERCI["Backend CI"]:::pipeline
    RELEASE["Tagged release jobs"]:::pipeline

    PAGES["GitHub Pages site"]:::deliver
    ASSETS["Release assets"]:::package
    GHCR["GHCR images"]:::package

    PUSH --> CLIENTCI
    PUSH --> PAGESJOB
    PUSH --> SERVERCI
    TAG --> RELEASE
    CLIENTCI --> PAGESJOB
    PAGESJOB --> PAGES
    RELEASE --> ASSETS
    RELEASE --> GHCR
`;

export default function ReleaseFlowDiagram() {
  return (
    <MermaidDiagram
      chart={releaseFlowChart}
      eyebrow="Automation flow"
      title="Branch work, GitHub Actions, and published RelayForge artifacts"
      note="Docs, releases, and registry publishing now share a single visual language instead of separate hand-drawn diagrams."
    />
  );
}
