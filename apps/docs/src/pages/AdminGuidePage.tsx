export default function AdminGuidePage() {
  return (
    <div>
      <h1>Admin Console Guide</h1>
      <p>
        The RelayForge Admin Console is a separate web application for platform administrators. It
        provides tools for managing users, guilds, viewing audit logs, reviewing abuse reports, and
        configuring system-wide settings. The admin console is located at <code>apps/admin/</code>{' '}
        and runs independently of the main web client.
      </p>

      <h2>Access and Authentication</h2>
      <p>
        The admin console uses the same authentication system as the main platform but requires the
        user to have the <code>platform_admin</code> flag set on their account. This flag is
        separate from guild-level roles and permissions.
      </p>
      <ul>
        <li>
          Navigate to the admin console URL (default: <code>http://localhost:5174</code> in
          development).
        </li>
        <li>Log in with your platform admin credentials.</li>
        <li>
          If your account does not have the <code>platform_admin</code> flag, you will see an
          "Access Denied" error.
        </li>
      </ul>

      <h3>Creating the First Admin</h3>
      <p>
        During initial setup, no admin accounts exist. Use the CLI tool to promote an existing user:
      </p>
      <pre>
        <code>{`# Using the API service CLI
docker compose exec api /app/cli user set-admin --username admin --admin=true

# Or during development with the seed data
make seed  # Creates an "admin" user with platform_admin=true`}</code>
      </pre>

      <h2>Dashboard</h2>
      <p>The dashboard provides an at-a-glance overview of the platform:</p>
      <ul>
        <li>
          <strong>Total users:</strong> Registered accounts (with breakdown of active vs. disabled).
        </li>
        <li>
          <strong>Total guilds:</strong> Number of guilds on the platform.
        </li>
        <li>
          <strong>Messages today:</strong> Message volume for the current day.
        </li>
        <li>
          <strong>Active connections:</strong> Current WebSocket connections to the realtime
          service.
        </li>
        <li>
          <strong>Service health:</strong> Status indicators for each backend service (API,
          Realtime, Media, Worker).
        </li>
        <li>
          <strong>Storage usage:</strong> Total size across all S3 buckets.
        </li>
        <li>
          <strong>Recent activity feed:</strong> Latest admin actions from the audit log.
        </li>
      </ul>

      <h2>User Management</h2>

      <h3>User List</h3>
      <p>The user list shows all registered accounts with search, filtering, and sorting:</p>
      <ul>
        <li>Search by username, email, or display name.</li>
        <li>Filter by status: all, active, disabled, unverified.</li>
        <li>Sort by registration date, last active, or username.</li>
        <li>Paginated results (50 per page).</li>
      </ul>

      <h3>User Actions</h3>
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>View Profile</strong>
            </td>
            <td>
              See full user details: email, registration date, last login, devices, guild
              memberships.
            </td>
          </tr>
          <tr>
            <td>
              <strong>Disable Account</strong>
            </td>
            <td>
              Prevents the user from logging in. Active sessions are terminated. All user data is
              preserved.
            </td>
          </tr>
          <tr>
            <td>
              <strong>Enable Account</strong>
            </td>
            <td>Re-enables a previously disabled account.</td>
          </tr>
          <tr>
            <td>
              <strong>Force Password Reset</strong>
            </td>
            <td>Invalidates the user's current password and sends a password reset email.</td>
          </tr>
          <tr>
            <td>
              <strong>Reset 2FA</strong>
            </td>
            <td>
              Removes TOTP 2FA from the user's account. Use when a user has lost their authenticator
              device.
            </td>
          </tr>
          <tr>
            <td>
              <strong>Set Admin</strong>
            </td>
            <td>
              Grants or revokes the <code>platform_admin</code> flag.
            </td>
          </tr>
          <tr>
            <td>
              <strong>View Guilds</strong>
            </td>
            <td>Lists all guilds the user is a member of, with their roles in each.</td>
          </tr>
          <tr>
            <td>
              <strong>View Devices</strong>
            </td>
            <td>
              Lists all registered devices (sessions) for the user. Individual devices can be
              revoked.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Guild Management</h2>

      <h3>Guild List</h3>
      <p>View all guilds on the platform:</p>
      <ul>
        <li>Search by guild name.</li>
        <li>Sort by creation date, member count, or message volume.</li>
        <li>See at a glance: name, owner, member count, channel count, creation date.</li>
      </ul>

      <h3>Guild Actions</h3>
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Inspect</strong>
            </td>
            <td>View guild details: channels, roles, member list, settings, and invite links.</td>
          </tr>
          <tr>
            <td>
              <strong>Force Delete</strong>
            </td>
            <td>
              Permanently delete a guild and all its data (channels, messages, roles, invites). This
              is irreversible. Use for ToS violations.
            </td>
          </tr>
          <tr>
            <td>
              <strong>Transfer Ownership</strong>
            </td>
            <td>
              Force-transfer ownership to another member. Use when the owner's account is disabled.
            </td>
          </tr>
          <tr>
            <td>
              <strong>View Audit Log</strong>
            </td>
            <td>View the guild's internal audit log (moderation actions taken by guild staff).</td>
          </tr>
        </tbody>
      </table>

      <h2>Audit Log Viewer</h2>
      <p>
        The platform audit log records all administrative actions. Unlike guild audit logs (which
        track guild-level moderation), the platform audit log tracks admin console actions:
      </p>
      <ul>
        <li>User account changes (disable, enable, admin flag changes, password resets).</li>
        <li>Guild force-deletions and ownership transfers.</li>
        <li>System setting changes.</li>
        <li>Abuse report resolutions.</li>
      </ul>
      <p>
        Each audit log entry includes: timestamp, acting admin, action type, target entity, and a
        details field with before/after values where applicable.
      </p>
      <p>Filtering options:</p>
      <ul>
        <li>Filter by action type (dropdown).</li>
        <li>Filter by acting admin.</li>
        <li>Filter by date range.</li>
        <li>Full-text search on details.</li>
      </ul>

      <h2>Abuse Report Review</h2>
      <p>
        Users can report messages, users, or guilds for violating platform rules. Reports are queued
        for admin review:
      </p>
      <ol>
        <li>
          A user submits a report with a reason (harassment, spam, NSFW, other) and optional
          description.
        </li>
        <li>
          The report appears in the admin console under "Reports" with status <code>pending</code>.
        </li>
        <li>
          An admin reviews the reported content (the original message or user profile is linked).
        </li>
        <li>
          The admin takes action:
          <ul>
            <li>
              <strong>Dismiss:</strong> Mark the report as reviewed with no action taken.
            </li>
            <li>
              <strong>Warn:</strong> Send a warning to the reported user.
            </li>
            <li>
              <strong>Delete Content:</strong> Remove the reported message or content.
            </li>
            <li>
              <strong>Disable User:</strong> Disable the reported user's account.
            </li>
            <li>
              <strong>Delete Guild:</strong> Force-delete the guild (for guild reports).
            </li>
          </ul>
        </li>
        <li>
          The report status is updated to <code>resolved</code> with the action taken.
        </li>
      </ol>

      <h2>System Settings</h2>
      <p>
        The admin console allows modifying certain platform-wide settings at runtime without
        restarting services:
      </p>
      <table>
        <thead>
          <tr>
            <th>Setting</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Registration</strong>
            </td>
            <td>Enable or disable new user registration. Useful for private instances.</td>
          </tr>
          <tr>
            <td>
              <strong>Email Verification</strong>
            </td>
            <td>Require email verification for new accounts.</td>
          </tr>
          <tr>
            <td>
              <strong>Max Guild Size</strong>
            </td>
            <td>Maximum number of members per guild (default: unlimited).</td>
          </tr>
          <tr>
            <td>
              <strong>Max Guilds Per User</strong>
            </td>
            <td>Maximum number of guilds a user can create (default: 100).</td>
          </tr>
          <tr>
            <td>
              <strong>Default Upload Limit</strong>
            </td>
            <td>Maximum file upload size for non-premium users.</td>
          </tr>
          <tr>
            <td>
              <strong>Maintenance Mode</strong>
            </td>
            <td>
              Block all user requests with a maintenance message. Admin access remains available.
            </td>
          </tr>
          <tr>
            <td>
              <strong>Custom Branding</strong>
            </td>
            <td>Set a custom platform name and logo displayed on the login page.</td>
          </tr>
        </tbody>
      </table>

      <h2>Storage Overview</h2>
      <p>The storage overview page shows usage statistics for the S3 buckets:</p>
      <ul>
        <li>Total storage used per bucket (uploads, avatars, emoji).</li>
        <li>File count per bucket.</li>
        <li>Largest files (useful for identifying abuse).</li>
        <li>Storage growth trend over time (chart).</li>
        <li>
          Orphaned files (files referenced in the database but missing from S3, or vice versa).
        </li>
      </ul>

      <h2>Security Considerations</h2>
      <ul>
        <li>
          The admin console should be deployed on a separate subdomain or internal network, not
          exposed publicly.
        </li>
        <li>
          Consider requiring VPN access or IP allowlisting for the admin console in production.
        </li>
        <li>All admin actions are logged in the audit trail and cannot be deleted.</li>
        <li>Admin accounts should use strong passwords and enable 2FA.</li>
        <li>Limit the number of platform admins to the minimum necessary.</li>
      </ul>
    </div>
  );
}
