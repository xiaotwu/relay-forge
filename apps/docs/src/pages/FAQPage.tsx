export default function FAQPage() {
  return (
    <div>
      <h1>FAQ</h1>

      <h2>Where did the backend go?</h2>
      <p>
        It now lives in the <code>relay-forge-server</code> repository.
      </p>

      <h2>Does this repo still use Docker?</h2>
      <p>
        Not for the main client workflow. Docker support now belongs to the extracted backend
        project only.
      </p>

      <h2>How do I change the server address?</h2>
      <p>
        Update <code>API_BASE_URL</code>, <code>WS_URL</code>, and <code>LIVEKIT_URL</code>{' '}
        before starting or rebuilding the client. The older <code>VITE_*</code> aliases still work
        if you need them.
      </p>

      <h2>What should be packaged from this repo?</h2>
      <p>Static web/admin/docs artifacts and native desktop installers.</p>
    </div>
  );
}
