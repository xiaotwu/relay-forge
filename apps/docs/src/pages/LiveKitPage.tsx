export default function LiveKitPage() {
  return (
    <div>
      <h1>Voice &amp; Video (LiveKit)</h1>
      <p>
        RelayForge uses{' '}
        <a href="https://livekit.io" target="_blank" rel="noopener noreferrer">
          LiveKit
        </a>
        , an open-source WebRTC Selective Forwarding Unit (SFU), for all voice and video
        functionality. The RelayForge media service acts as a control plane that issues tokens and
        manages room lifecycle, while LiveKit handles the actual media routing.
      </p>

      <h2>Architecture Overview</h2>
      <pre>
        <code>{`┌─────────────┐     REST      ┌──────────────┐   LiveKit API   ┌──────────────┐
│  Web Client │ ────────────► │ Media Service│ ──────────────► │ LiveKit SFU  │
│  (Browser)  │               │   (Go)       │                 │  Server      │
└──────┬──────┘               └──────────────┘                 └──────┬───────┘
       │                                                              │
       │              WebRTC (DTLS-SRTP)                              │
       └──────────────────────────────────────────────────────────────┘`}</code>
      </pre>
      <p>The flow for joining a voice channel:</p>
      <ol>
        <li>
          The client sends a <code>POST /api/voice/join</code> request to the API with the channel
          ID.
        </li>
        <li>
          The API validates the user's permissions (<code>CONNECT</code> permission on the channel).
        </li>
        <li>The media service generates a JWT room token using the LiveKit API key and secret.</li>
        <li>The token is returned to the client along with the LiveKit WebSocket URL.</li>
        <li>
          The client connects directly to LiveKit using the <code>livekit-client</code> SDK with the
          token.
        </li>
        <li>LiveKit authenticates the token and adds the participant to the room.</li>
      </ol>

      <h2>Room Naming Convention</h2>
      <p>
        LiveKit rooms are identified by a string name. RelayForge uses a structured naming
        convention to map rooms to application concepts:
      </p>
      <table>
        <thead>
          <tr>
            <th>Context</th>
            <th>Room Name Pattern</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Guild voice channel</td>
            <td>
              <code>
                guild:{'{guild_id}'}:voice:{'{channel_id}'}
              </code>
            </td>
            <td>
              <code>guild:123456:voice:789012</code>
            </td>
          </tr>
          <tr>
            <td>1-on-1 DM call</td>
            <td>
              <code>dm:{'{sorted_user_ids}'}</code>
            </td>
            <td>
              <code>dm:100200_100300</code>
            </td>
          </tr>
          <tr>
            <td>Group DM call</td>
            <td>
              <code>group:{'{group_dm_id}'}</code>
            </td>
            <td>
              <code>group:456789</code>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        For DM calls, user IDs are sorted numerically and joined with an underscore to ensure the
        same room name regardless of who initiates the call.
      </p>

      <h2>Token Generation</h2>
      <p>
        Room tokens are JWTs signed with the LiveKit API secret. The media service generates tokens
        with the following claims:
      </p>
      <pre>
        <code>{`{
  "sub": "user_100200",           // Participant identity
  "iss": "devkey",                // LiveKit API key
  "nbf": 1700000000,             // Not before
  "exp": 1700086400,             // Expiry (24h default)
  "video": {
    "room": "guild:123456:voice:789012",
    "roomJoin": true,
    "canPublish": true,           // Based on SPEAK permission
    "canSubscribe": true,
    "canPublishData": true
  },
  "metadata": '{"displayName":"Alice","avatarUrl":"..."}'
}`}</code>
      </pre>
      <p>Permission-based token grants:</p>
      <table>
        <thead>
          <tr>
            <th>RelayForge Permission</th>
            <th>LiveKit Grant</th>
            <th>Effect</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>CONNECT</code>
            </td>
            <td>
              <code>roomJoin: true</code>
            </td>
            <td>Can join the room and receive media</td>
          </tr>
          <tr>
            <td>
              <code>SPEAK</code>
            </td>
            <td>
              <code>canPublish: true</code> (audio)
            </td>
            <td>Can transmit audio</td>
          </tr>
          <tr>
            <td>
              <code>VIDEO</code>
            </td>
            <td>
              <code>canPublish: true</code> (video)
            </td>
            <td>Can transmit video</td>
          </tr>
          <tr>
            <td>
              <code>MUTE_MEMBERS</code>
            </td>
            <td>
              <code>roomAdmin: true</code>
            </td>
            <td>Can mute other participants</td>
          </tr>
        </tbody>
      </table>

      <h2>Voice Channels</h2>
      <p>Voice channels in guilds are persistent rooms. Key behaviors:</p>
      <ul>
        <li>
          <strong>Room creation:</strong> The LiveKit room is created lazily when the first
          participant joins. The media service calls <code>CreateRoom</code> via the LiveKit server
          API.
        </li>
        <li>
          <strong>Room cleanup:</strong> When the last participant leaves, a cleanup job waits 30
          seconds (to handle reconnections), then deletes the room via the LiveKit API.
        </li>
        <li>
          <strong>Voice state:</strong> The realtime service broadcasts{' '}
          <code>VOICE_STATE_UPDATE</code> events over WebSocket so the UI shows who is in each voice
          channel.
        </li>
        <li>
          <strong>Server mute/deafen:</strong> Users with <code>MUTE_MEMBERS</code> or{' '}
          <code>DEAFEN_MEMBERS</code> permissions can force-mute participants via the API, which
          calls LiveKit's <code>MutePublishedTrack</code> RPC.
        </li>
        <li>
          <strong>Move between channels:</strong> Users with <code>MOVE_MEMBERS</code> can move a
          participant to a different voice channel, which disconnects them from the current room and
          issues a new token for the target room.
        </li>
      </ul>

      <h2>P2P Calls (DMs)</h2>
      <p>
        Direct message calls use the same LiveKit infrastructure but with different lifecycle
        management:
      </p>
      <ol>
        <li>Alice clicks "Call" in a DM conversation.</li>
        <li>The API creates a room and generates a token for Alice.</li>
        <li>
          A <code>CALL_RING</code> event is sent to Bob via WebSocket.
        </li>
        <li>Bob's client shows a ringing UI with Accept/Decline buttons.</li>
        <li>If Bob accepts, the API generates a token for Bob and he joins the room.</li>
        <li>
          If Bob declines or does not answer within 30 seconds, a <code>CALL_END</code> event is
          sent.
        </li>
        <li>
          When both participants disconnect, the room is cleaned up after a 10-second grace period.
        </li>
      </ol>

      <h2>Group Calls</h2>
      <p>Group DM channels support multi-party calls with up to 10 participants:</p>
      <ul>
        <li>Any participant in the group DM can start a call.</li>
        <li>
          A <code>CALL_RING</code> event is sent to all other participants.
        </li>
        <li>Participants can join or leave at any time during the call.</li>
        <li>The call ends when the last participant leaves.</li>
        <li>Late joiners can join an ongoing call without an invitation.</li>
      </ul>

      <h2>Video and Screen Sharing</h2>
      <p>
        Video and screen sharing are available in all call types (voice channels, DM calls, group
        calls):
      </p>
      <ul>
        <li>
          <strong>Camera video:</strong> Toggle with the camera button. The client publishes a video
          track using <code>LocalParticipant.setCameraEnabled(true)</code>.
        </li>
        <li>
          <strong>Screen sharing:</strong> Uses the browser's <code>getDisplayMedia</code> API. The
          client publishes a screen share track with{' '}
          <code>LocalParticipant.setScreenShareEnabled(true)</code>.
        </li>
        <li>
          <strong>Simulcast:</strong> Video tracks are published with simulcast enabled by default,
          providing three quality layers (high, medium, low). LiveKit automatically selects the
          appropriate layer based on each subscriber's bandwidth and display size.
        </li>
        <li>
          <strong>Adaptive bitrate:</strong> LiveKit adjusts video quality dynamically based on
          network conditions using its built-in bandwidth estimation.
        </li>
      </ul>

      <h2>Recording</h2>
      <p>
        LiveKit supports server-side recording via its Egress API. RelayForge exposes this for guild
        voice channels when enabled:
      </p>
      <ul>
        <li>
          Users with <code>MANAGE_CHANNELS</code> permission can start recording a voice channel.
        </li>
        <li>
          Recordings are stored in the configured S3 bucket under <code>recordings/</code>.
        </li>
        <li>A recording indicator is shown to all participants in the channel.</li>
        <li>Recording is disabled by default and must be enabled in the guild settings.</li>
      </ul>

      <h2>LiveKit Self-Hosting</h2>
      <p>
        RelayForge includes LiveKit in both the development and production Docker Compose files. For
        production deployments:
      </p>

      <h3>Single-Node Setup</h3>
      <pre>
        <code>{`# LiveKit is included in docker-compose.prod.yml
# Ensure these ports are open:
# - 7880 (HTTP/WebSocket for signaling)
# - 7881 (TCP for TURN)
# - 50000-60000/UDP (WebRTC media)`}</code>
      </pre>

      <h3>Multi-Node Setup</h3>
      <p>For larger deployments, run LiveKit on dedicated nodes using Redis-based routing:</p>
      <pre>
        <code>{`# livekit.yaml
port: 7880
rtc:
  port_range_start: 50000
  port_range_end: 60000
  use_external_ip: true
redis:
  address: valkey-host:6379
keys:
  your-api-key: your-api-secret
turn:
  enabled: true
  domain: turn.example.com
  tls_port: 5349`}</code>
      </pre>
      <p>
        Refer to the{' '}
        <a href="https://docs.livekit.io/deploy/" target="_blank" rel="noopener noreferrer">
          LiveKit deployment documentation
        </a>{' '}
        for detailed multi-node setup instructions.
      </p>

      <h2>Configuration</h2>
      <p>LiveKit-related configuration in RelayForge:</p>
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>LIVEKIT_HOST</code>
            </td>
            <td>LiveKit server hostname for server-side API calls.</td>
          </tr>
          <tr>
            <td>
              <code>LIVEKIT_PORT</code>
            </td>
            <td>LiveKit server port (default: 7880).</td>
          </tr>
          <tr>
            <td>
              <code>LIVEKIT_API_KEY</code>
            </td>
            <td>API key for authenticating with LiveKit.</td>
          </tr>
          <tr>
            <td>
              <code>LIVEKIT_API_SECRET</code>
            </td>
            <td>API secret for signing room tokens.</td>
          </tr>
          <tr>
            <td>
              <code>LIVEKIT_URL</code>
            </td>
            <td>
              WebSocket URL for client connections. Use <code>wss://</code> in production.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Network Requirements</h2>
      <ul>
        <li>
          <strong>UDP port range 50000-60000:</strong> Must be open for WebRTC media traffic.
          LiveKit uses these for audio/video RTP streams.
        </li>
        <li>
          <strong>TCP port 7880:</strong> Used for WebSocket signaling between clients and the
          LiveKit server.
        </li>
        <li>
          <strong>TURN fallback:</strong> For clients behind restrictive firewalls that block UDP,
          LiveKit's built-in TURN server relays media over TCP. Enable TURN in the LiveKit
          configuration for production deployments.
        </li>
        <li>
          <strong>Bandwidth:</strong> Voice consumes ~50 kbps per participant. Video at 720p
          consumes ~1.5 Mbps. Screen sharing varies widely (100 kbps to 5 Mbps depending on content
          motion).
        </li>
      </ul>
    </div>
  );
}
