import MermaidDiagram from './MermaidDiagram';

const runtimeFlowChart = String.raw`
flowchart LR
    classDef client fill:#111827,stroke:#111827,color:#f8fafc;
    classDef service fill:#ffffff,stroke:#d8dccf,color:#111827;
    classDef delivery fill:#eef2ff,stroke:#c7d2fe,color:#312e81;
    classDef state fill:#fff2e2,stroke:#f59e0b,color:#7c2d12;

    CLIENTS["web / admin / desktop"]:::client

    API["api"]:::service
    REALTIME["realtime"]:::service
    MEDIA["media"]:::service
    WORKER["worker"]:::service

    LIVEKIT["livekit"]:::delivery

    POSTGRES["postgres"]:::state
    VALKEY["valkey"]:::state
    STORAGE["s3 storage"]:::state

    CLIENTS -->|"REST, auth, metadata"| API
    CLIENTS -->|"presence, typing, fan-out"| REALTIME
    CLIENTS -->|"uploads and voice entry"| MEDIA
    CLIENTS -->|"maintenance triggers"| WORKER

    API --> POSTGRES
    API --> VALKEY
    REALTIME --> VALKEY
    MEDIA --> STORAGE
    MEDIA --> LIVEKIT
    WORKER --> POSTGRES
    WORKER --> VALKEY
    WORKER --> STORAGE
`;

export default function RuntimeFlowDiagram() {
  return (
    <MermaidDiagram
      chart={runtimeFlowChart}
      eyebrow="Runtime flow"
      title="Client traffic, backend services, delivery systems, and state stores"
      note="REST, realtime, media, and background work are split by runtime behavior, not by unnecessary service sprawl."
    />
  );
}
