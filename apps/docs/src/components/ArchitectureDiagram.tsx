import MermaidDiagram from './MermaidDiagram';

const architectureChart = String.raw`
flowchart LR
    classDef surface fill:#111827,stroke:#111827,color:#f8fafc;
    classDef shared fill:#ffffff,stroke:#d8dccf,color:#111827;
    classDef infra fill:#fff2e2,stroke:#f59e0b,color:#7c2d12;
    classDef accent fill:#eef2ff,stroke:#c7d2fe,color:#312e81;

    subgraph CLIENT["relay-forge"]
      direction TB
      WEB["apps/web"]:::surface
      ADMIN["apps/admin"]:::surface
      DESKTOP["apps/desktop"]:::surface
      DOCS["apps/docs"]:::surface
    end

    subgraph SHARED["shared packages"]
      direction TB
      CONFIG["config"]:::shared
      SDK["sdk"]:::shared
      TYPES["types"]:::shared
      CRYPTO["crypto"]:::shared
      UI["ui"]:::shared
    end

    subgraph SERVER["relay-forge-server"]
      direction TB
      API["api"]:::accent
      REALTIME["realtime"]:::accent
      MEDIA["media"]:::accent
      WORKER["worker"]:::accent
    end

    subgraph INFRA["infrastructure"]
      direction TB
      POSTGRES["postgres"]:::infra
      VALKEY["valkey"]:::infra
      STORAGE["object storage"]:::infra
      LIVEKIT["livekit"]:::infra
    end

    WEB --> API
    ADMIN --> API
    DESKTOP --> API
    DOCS --> API
    CLIENT --> SHARED
    SHARED --> SERVER
    API --> POSTGRES
    API --> VALKEY
    REALTIME --> VALKEY
    MEDIA --> STORAGE
    MEDIA --> LIVEKIT
    WORKER --> POSTGRES
`;

export default function ArchitectureDiagram() {
  return (
    <MermaidDiagram
      chart={architectureChart}
      eyebrow="Platform map"
      title="RelayForge client, shared packages, backend services, and infrastructure"
      note="Text-defined Mermaid charts now replace fixed SVG illustrations so the docs stay easier to audit and maintain."
    />
  );
}
