export default function ConfigReferencePage() {
  return (
    <div>
      <h1>Endpoint Configuration</h1>
      <p>
        RelayForge clients are designed to follow the backend by configuration, not by repository
        structure. When the backend moves to a new host or cloud provider, update the endpoint
        values and rebuild or restart the client workflow as needed.
      </p>

      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Purpose</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>API_BASE_URL</code>
            </td>
            <td>Base URL for REST API calls.</td>
            <td>
              <code>https://relay.example.com/api/v1</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>WS_URL</code>
            </td>
            <td>WebSocket endpoint for realtime events.</td>
            <td>
              <code>wss://relay.example.com/ws</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>LIVEKIT_URL</code>
            </td>
            <td>LiveKit endpoint for voice and video.</td>
            <td>
              <code>wss://livekit.example.com</code>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Example</h2>
      <pre>{`API_BASE_URL=https://relay.example.com/api/v1
WS_URL=wss://relay.example.com/ws
LIVEKIT_URL=wss://livekit.example.com`}</pre>

      <p>
        These values are shared by the web, admin, and desktop frontend bundles through the shared
        config package.
      </p>
      <p>
        Older <code>VITE_*</code> aliases are still accepted, but the explicit names above are the
        preferred contract for future deployments and host migrations.
      </p>
    </div>
  );
}
