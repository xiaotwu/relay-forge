export default function MonitoringPage() {
  return (
    <div>
      <h1>Monitoring &amp; Operations</h1>
      <p>
        RelayForge provides built-in observability through health check endpoints, Prometheus
        metrics, OpenTelemetry distributed tracing, and structured JSON logging. This page covers
        how to set up monitoring, alerting, backup procedures, and common troubleshooting scenarios.
      </p>

      <h2>Health Check Endpoints</h2>
      <p>Each service exposes two health endpoints on its main HTTP port:</p>
      <table>
        <thead>
          <tr>
            <th>Endpoint</th>
            <th>Purpose</th>
            <th>Response</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>/healthz</code>
            </td>
            <td>
              Liveness probe. Returns 200 if the process is running and can handle HTTP requests.
            </td>
            <td>
              <code>{`{"status":"ok"}`}</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>/readyz</code>
            </td>
            <td>
              Readiness probe. Returns 200 only when all dependencies (database, cache) are
              reachable and the service is ready to serve traffic.
            </td>
            <td>
              <code>{`{"status":"ready","checks":{"database":"ok","valkey":"ok"}}`}</code>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Use <code>/healthz</code> for Kubernetes liveness probes (restart the pod if it fails) and{' '}
        <code>/readyz</code> for readiness probes (remove from load balancer if not ready). In
        Docker Compose, use <code>/healthz</code> for the
        <code>healthcheck</code> directive.
      </p>
      <pre>
        <code>{`# Docker Compose health check example
api:
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:8080/healthz"]
    interval: 15s
    timeout: 5s
    retries: 3
    start_period: 10s`}</code>
      </pre>

      <h2>Prometheus Metrics</h2>
      <p>
        When <code>METRICS_ENABLED=true</code>, each service exposes a <code>/metrics</code>{' '}
        endpoint on the configured <code>METRICS_PORT</code> (default: 9090). Metrics are in the
        standard Prometheus exposition format.
      </p>

      <h3>Key Metrics</h3>
      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>relayforge_http_requests_total</code>
            </td>
            <td>Counter</td>
            <td>Total HTTP requests, labeled by method, path, and status code.</td>
          </tr>
          <tr>
            <td>
              <code>relayforge_http_request_duration_seconds</code>
            </td>
            <td>Histogram</td>
            <td>Request latency distribution, labeled by method and path.</td>
          </tr>
          <tr>
            <td>
              <code>relayforge_ws_connections_active</code>
            </td>
            <td>Gauge</td>
            <td>Current number of active WebSocket connections (realtime service).</td>
          </tr>
          <tr>
            <td>
              <code>relayforge_ws_messages_total</code>
            </td>
            <td>Counter</td>
            <td>Total WebSocket messages sent/received, labeled by event type and direction.</td>
          </tr>
          <tr>
            <td>
              <code>relayforge_db_pool_open_connections</code>
            </td>
            <td>Gauge</td>
            <td>Current open database connections in the pool.</td>
          </tr>
          <tr>
            <td>
              <code>relayforge_db_pool_idle_connections</code>
            </td>
            <td>Gauge</td>
            <td>Current idle database connections.</td>
          </tr>
          <tr>
            <td>
              <code>relayforge_db_query_duration_seconds</code>
            </td>
            <td>Histogram</td>
            <td>Database query latency.</td>
          </tr>
          <tr>
            <td>
              <code>relayforge_valkey_commands_total</code>
            </td>
            <td>Counter</td>
            <td>Total Valkey commands executed, labeled by command name.</td>
          </tr>
          <tr>
            <td>
              <code>relayforge_valkey_command_duration_seconds</code>
            </td>
            <td>Histogram</td>
            <td>Valkey command latency.</td>
          </tr>
          <tr>
            <td>
              <code>relayforge_uploads_total</code>
            </td>
            <td>Counter</td>
            <td>Total file uploads, labeled by status (success, rejected, virus_detected).</td>
          </tr>
          <tr>
            <td>
              <code>relayforge_upload_bytes_total</code>
            </td>
            <td>Counter</td>
            <td>Total bytes uploaded.</td>
          </tr>
          <tr>
            <td>
              <code>relayforge_worker_jobs_total</code>
            </td>
            <td>Counter</td>
            <td>Total background jobs processed, labeled by job type and status.</td>
          </tr>
          <tr>
            <td>
              <code>relayforge_worker_job_duration_seconds</code>
            </td>
            <td>Histogram</td>
            <td>Background job processing duration.</td>
          </tr>
        </tbody>
      </table>

      <h3>Prometheus Configuration</h3>
      <pre>
        <code>{`# prometheus.yml
scrape_configs:
  - job_name: relayforge-api
    static_configs:
      - targets: ["api:9090"]
    metrics_path: /metrics
    scrape_interval: 15s

  - job_name: relayforge-realtime
    static_configs:
      - targets: ["realtime:9091"]
    metrics_path: /metrics
    scrape_interval: 15s

  - job_name: relayforge-media
    static_configs:
      - targets: ["media:9092"]
    metrics_path: /metrics
    scrape_interval: 15s

  - job_name: relayforge-worker
    static_configs:
      - targets: ["worker:9093"]
    metrics_path: /metrics
    scrape_interval: 15s`}</code>
      </pre>

      <h3>Grafana Dashboard</h3>
      <p>
        A pre-built Grafana dashboard is included at{' '}
        <code>infra/monitoring/grafana/dashboards/relayforge.json</code>. Import it into your
        Grafana instance for out-of-the-box visualization of:
      </p>
      <ul>
        <li>Request rate and error rate (RED metrics)</li>
        <li>P50/P95/P99 latency per endpoint</li>
        <li>WebSocket connection count and message throughput</li>
        <li>Database connection pool utilization</li>
        <li>Background job queue depth and processing rate</li>
        <li>Upload volume and antivirus scan results</li>
      </ul>

      <h2>OpenTelemetry Tracing</h2>
      <p>
        When <code>OTEL_ENABLED=true</code>, all services export distributed traces via OTLP/gRPC.
        Traces span across services: an HTTP request to the API that triggers a WebSocket broadcast
        and a background job will produce a single trace with spans from all three services.
      </p>

      <h3>Instrumented Operations</h3>
      <ul>
        <li>HTTP handlers (automatic span per request)</li>
        <li>Database queries (span per query with SQL statement as attribute)</li>
        <li>Valkey commands (span per command)</li>
        <li>S3 operations (span per upload/download)</li>
        <li>WebSocket event dispatch</li>
        <li>Background job execution</li>
        <li>LiveKit API calls</li>
      </ul>

      <h3>Collector Setup</h3>
      <pre>
        <code>{`# docker-compose.monitoring.yml
otel-collector:
  image: otel/opentelemetry-collector-contrib:latest
  ports:
    - "4317:4317"   # OTLP gRPC
    - "4318:4318"   # OTLP HTTP
  volumes:
    - ./otel-collector-config.yaml:/etc/otelcol-contrib/config.yaml

# Send traces to Jaeger, Tempo, or Honeycomb
# otel-collector-config.yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
exporters:
  otlp:
    endpoint: tempo:4317
    tls:
      insecure: true
service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [otlp]`}</code>
      </pre>

      <h2>Structured Logging</h2>
      <p>
        All services use <code>zerolog</code> for structured JSON logging. Each log entry includes:
      </p>
      <pre>
        <code>{`{
  "level": "info",
  "service": "api",
  "time": "2025-01-15T10:30:00Z",
  "caller": "handler/message.go:42",
  "trace_id": "abc123def456",
  "span_id": "789ghi",
  "method": "POST",
  "path": "/api/channels/123/messages",
  "status": 201,
  "duration_ms": 12.5,
  "user_id": "100200",
  "message": "message created"
}`}</code>
      </pre>
      <p>Log levels and their usage:</p>
      <table>
        <thead>
          <tr>
            <th>Level</th>
            <th>Usage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>trace</code>
            </td>
            <td>
              Very detailed debugging. Includes raw SQL queries and full request/response bodies.
            </td>
          </tr>
          <tr>
            <td>
              <code>debug</code>
            </td>
            <td>Detailed operational information. Cache hits/misses, permission check results.</td>
          </tr>
          <tr>
            <td>
              <code>info</code>
            </td>
            <td>Normal operations. Service start/stop, user login, guild creation.</td>
          </tr>
          <tr>
            <td>
              <code>warn</code>
            </td>
            <td>
              Recoverable issues. Rate limit hits, deprecated API usage, slow queries (&gt;1s).
            </td>
          </tr>
          <tr>
            <td>
              <code>error</code>
            </td>
            <td>
              Failures requiring attention. Database errors, S3 failures, failed authentication.
            </td>
          </tr>
          <tr>
            <td>
              <code>fatal</code>
            </td>
            <td>
              Unrecoverable errors. Service exits after logging. Missing required config, port bind
              failure.
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        For production, set <code>RELAY_LOG_LEVEL=info</code>. Ship logs to a centralized system
        (ELK, Loki, CloudWatch) for aggregation and search.
      </p>

      <h2>Backup and Restore</h2>

      <h3>PostgreSQL Backup</h3>
      <pre>
        <code>{`# One-time logical backup
docker compose exec postgres pg_dump -U relayforge relayforge > backup.sql

# Compressed backup
docker compose exec postgres pg_dump -U relayforge -Fc relayforge > backup.dump

# Restore from dump
docker compose exec -T postgres pg_restore -U relayforge -d relayforge < backup.dump

# Automated daily backups with cron
# Add to crontab:
0 3 * * * docker compose --env-file /path/to/.env -f /path/to/infra/docker/docker-compose.yml exec -T postgres \\
  pg_dump -U relayforge -Fc relayforge > /backups/relayforge-$(date +\\%Y\\%m\\%d).dump`}</code>
      </pre>
      <p>
        For point-in-time recovery, enable WAL archiving with{' '}
        <a href="https://github.com/wal-g/wal-g" target="_blank" rel="noopener noreferrer">
          WAL-G
        </a>{' '}
        or pgBackRest. This allows restoring to any moment in time, not just the last snapshot.
      </p>

      <h3>S3 Object Storage Backup</h3>
      <pre>
        <code>{`# Mirror MinIO buckets to a backup location
mc alias set source http://localhost:9000 minioadmin minioadmin
mc alias set backup http://backup-minio:9000 backupadmin backupadmin

mc mirror source/relay-uploads backup/relay-uploads
mc mirror source/relay-avatars backup/relay-avatars
mc mirror source/relay-emoji backup/relay-emoji`}</code>
      </pre>
      <p>For AWS S3, enable versioning and cross-region replication for disaster recovery.</p>

      <h2>Alerting Guidance</h2>
      <p>Recommended Prometheus alerting rules for production:</p>
      <pre>
        <code>{`# alerts.yml
groups:
  - name: relayforge
    rules:
      - alert: HighErrorRate
        expr: |
          rate(relayforge_http_requests_total{status=~"5.."}[5m])
          / rate(relayforge_http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High 5xx error rate ({{ $value | humanizePercentage }})"

      - alert: HighLatency
        expr: |
          histogram_quantile(0.95,
            rate(relayforge_http_request_duration_seconds_bucket[5m])
          ) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "P95 latency above 2 seconds"

      - alert: DatabaseConnectionPoolExhausted
        expr: relayforge_db_pool_open_connections / 25 > 0.9
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Database connection pool >90% utilized"

      - alert: WebSocketConnectionsDrop
        expr: |
          relayforge_ws_connections_active
          < relayforge_ws_connections_active offset 5m * 0.5
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "WebSocket connections dropped by >50% in 5 minutes"

      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service {{ $labels.job }} is down"`}</code>
      </pre>

      <h2>Troubleshooting Common Issues</h2>

      <h3>WebSocket connections dropping</h3>
      <ul>
        <li>
          Check if a reverse proxy is timing out idle connections. Set{' '}
          <code>proxy_read_timeout 86400s</code> in Nginx.
        </li>
        <li>
          Verify the realtime service has enough file descriptors (<code>ulimit -n</code> should be
          at least 65535).
        </li>
        <li>
          Check <code>REALTIME_MAX_CONNECTIONS</code> is not set too low.
        </li>
        <li>
          Look for OOM kills: <code>dmesg | grep -i "oom"</code>.
        </li>
      </ul>

      <h3>Slow API responses</h3>
      <ul>
        <li>
          Check database query latency in metrics or logs (slow queries are logged at warn level).
        </li>
        <li>
          Verify connection pool is not exhausted (<code>relayforge_db_pool_open_connections</code>
          ).
        </li>
        <li>
          Check Valkey latency (<code>redis-cli --latency</code>).
        </li>
        <li>Look for missing database indexes in the slow query log.</li>
      </ul>

      <h3>Uploads failing</h3>
      <ul>
        <li>
          Check reverse proxy <code>client_max_body_size</code> matches{' '}
          <code>UPLOAD_MAX_FILE_SIZE</code>.
        </li>
        <li>Verify S3 credentials and bucket existence.</li>
        <li>If ClamAV is enabled, ensure the daemon is running and reachable.</li>
        <li>Check media service logs for presigned URL generation errors.</li>
      </ul>

      <h3>LiveKit voice not connecting</h3>
      <ul>
        <li>Verify UDP ports 50000-60000 are open on the firewall.</li>
        <li>
          Check that <code>LIVEKIT_URL</code> is reachable from the client's browser (use{' '}
          <code>wss://</code> in production).
        </li>
        <li>Ensure TURN is enabled for clients behind restrictive firewalls.</li>
        <li>Check LiveKit server logs for authentication errors (wrong API key/secret).</li>
      </ul>

      <h3>High memory usage</h3>
      <ul>
        <li>
          The realtime service memory usage scales with active connections (~50 KB per connection).
        </li>
        <li>ClamAV uses ~1 GB for its virus database. This is normal.</li>
        <li>PostgreSQL shared buffers should be ~25% of available RAM.</li>
        <li>
          Check for goroutine leaks: enable the Go pprof endpoint in development and check{' '}
          <code>/debug/pprof/goroutine</code>.
        </li>
      </ul>
    </div>
  );
}
