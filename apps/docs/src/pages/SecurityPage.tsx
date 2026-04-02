export default function SecurityPage() {
  return (
    <div>
      <h1>Security Scope</h1>
      <p>
        Security responsibilities are now split across repositories. This repo covers client code,
        documentation, and desktop packaging. Backend runtime hardening and operational controls
        live in <code>relay-forge-server</code>.
      </p>

      <h2>Client concerns</h2>
      <ul>
        <li>Use explicit backend endpoint configuration.</li>
        <li>Do not leak secrets into documentation or frontend build artifacts.</li>
        <li>Validate packaging and release settings before publishing desktop installers.</li>
      </ul>
    </div>
  );
}
