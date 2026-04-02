export default function DeploymentPage() {
  return (
    <div>
      <h1>Packaging and Distribution</h1>
      <p>
        This repository now focuses on direct client distribution instead of containerized
        deployment. Web, admin, and docs builds produce static artifacts, while the desktop app
        produces native installers through Tauri.
      </p>

      <h2>Static archives</h2>
      <pre>{`make package-web
make package-admin
make package-docs`}</pre>

      <p>
        These commands build the application and create zip archives in the <code>release/</code>
        directory.
      </p>

      <h2>Desktop installers</h2>
      <pre>{`make package-desktop`}</pre>

      <p>
        The desktop release path relies on Tauri and your platform-native packaging toolchain.
      </p>

      <h2>Backend deployment</h2>
      <p>
        Backend runtime, migrations, and Docker-based server deployment have moved into
        <code>new-project/</code>. Keep the packaging story in this repo focused on client
        artifacts.
      </p>
    </div>
  );
}
