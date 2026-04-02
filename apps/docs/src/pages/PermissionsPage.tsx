export default function PermissionsPage() {
  return (
    <div>
      <h1>Permissions &amp; RBAC</h1>
      <p>
        RelayForge uses a role-based access control (RBAC) system inspired by Discord's permission
        model. Permissions are represented as a 64-bit integer bitfield, where each bit corresponds
        to a specific permission. Roles combine these bits, and channel-level overrides allow
        fine-grained control per channel.
      </p>

      <h2>How Permissions Work</h2>
      <p>
        Every guild member has one or more roles. Each role has a <code>permissions</code> field
        that is a 64-bit integer. A member's effective permissions are computed by OR-ing together
        all their role permission fields, then applying any channel-level overrides.
      </p>
      <p>The algorithm for computing a member's effective permissions in a channel is:</p>
      <ol>
        <li>
          Start with the <code>@everyone</code> role's permissions (every member implicitly has this
          role).
        </li>
        <li>OR in the permissions from all other roles the member has, in any order.</li>
        <li>
          If the member is the guild owner, grant all permissions (return <code>ALL</code>) and
          stop.
        </li>
        <li>
          If the computed permissions include <code>ADMINISTRATOR</code>, grant all permissions and
          stop.
        </li>
        <li>
          Apply channel-level overrides: for each of the member's roles, check if the channel has an
          override for that role. Apply <code>deny</code> first (AND NOT), then <code>allow</code>{' '}
          (OR).
        </li>
        <li>Apply member-specific channel overrides if they exist (same deny-then-allow logic).</li>
      </ol>

      <h2>Permission Bitfield</h2>
      <p>The following table lists all permissions, their hex values, and descriptions:</p>
      <table>
        <thead>
          <tr>
            <th>Permission</th>
            <th>Bit Value</th>
            <th>Hex</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>VIEW_CHANNEL</code>
            </td>
            <td>1</td>
            <td>
              <code>0x0000000001</code>
            </td>
            <td>See channels in the channel list and read messages.</td>
          </tr>
          <tr>
            <td>
              <code>SEND_MESSAGES</code>
            </td>
            <td>2</td>
            <td>
              <code>0x0000000002</code>
            </td>
            <td>Send messages in text channels.</td>
          </tr>
          <tr>
            <td>
              <code>SEND_TTS</code>
            </td>
            <td>4</td>
            <td>
              <code>0x0000000004</code>
            </td>
            <td>Send text-to-speech messages.</td>
          </tr>
          <tr>
            <td>
              <code>MANAGE_MESSAGES</code>
            </td>
            <td>8</td>
            <td>
              <code>0x0000000008</code>
            </td>
            <td>Delete and pin other users' messages.</td>
          </tr>
          <tr>
            <td>
              <code>EMBED_LINKS</code>
            </td>
            <td>16</td>
            <td>
              <code>0x0000000010</code>
            </td>
            <td>Allow link previews and rich embeds.</td>
          </tr>
          <tr>
            <td>
              <code>ATTACH_FILES</code>
            </td>
            <td>32</td>
            <td>
              <code>0x0000000020</code>
            </td>
            <td>Upload files and images.</td>
          </tr>
          <tr>
            <td>
              <code>READ_HISTORY</code>
            </td>
            <td>64</td>
            <td>
              <code>0x0000000040</code>
            </td>
            <td>
              Read message history. Without this, members only see messages sent after they join.
            </td>
          </tr>
          <tr>
            <td>
              <code>MENTION_EVERYONE</code>
            </td>
            <td>128</td>
            <td>
              <code>0x0000000080</code>
            </td>
            <td>Use @everyone and @here mentions.</td>
          </tr>
          <tr>
            <td>
              <code>ADD_REACTIONS</code>
            </td>
            <td>256</td>
            <td>
              <code>0x0000000100</code>
            </td>
            <td>Add emoji reactions to messages.</td>
          </tr>
          <tr>
            <td>
              <code>CONNECT</code>
            </td>
            <td>512</td>
            <td>
              <code>0x0000000200</code>
            </td>
            <td>Connect to voice channels.</td>
          </tr>
          <tr>
            <td>
              <code>SPEAK</code>
            </td>
            <td>1024</td>
            <td>
              <code>0x0000000400</code>
            </td>
            <td>Speak in voice channels (transmit audio).</td>
          </tr>
          <tr>
            <td>
              <code>VIDEO</code>
            </td>
            <td>2048</td>
            <td>
              <code>0x0000000800</code>
            </td>
            <td>Share video in voice channels.</td>
          </tr>
          <tr>
            <td>
              <code>MUTE_MEMBERS</code>
            </td>
            <td>4096</td>
            <td>
              <code>0x0000001000</code>
            </td>
            <td>Server-mute other members in voice.</td>
          </tr>
          <tr>
            <td>
              <code>DEAFEN_MEMBERS</code>
            </td>
            <td>8192</td>
            <td>
              <code>0x0000002000</code>
            </td>
            <td>Server-deafen other members in voice.</td>
          </tr>
          <tr>
            <td>
              <code>MOVE_MEMBERS</code>
            </td>
            <td>16384</td>
            <td>
              <code>0x0000004000</code>
            </td>
            <td>Move members between voice channels.</td>
          </tr>
          <tr>
            <td>
              <code>MANAGE_CHANNELS</code>
            </td>
            <td>32768</td>
            <td>
              <code>0x0000008000</code>
            </td>
            <td>Create, edit, delete, and reorder channels and categories.</td>
          </tr>
          <tr>
            <td>
              <code>MANAGE_GUILD</code>
            </td>
            <td>65536</td>
            <td>
              <code>0x0000010000</code>
            </td>
            <td>Edit guild name, icon, banner, and settings.</td>
          </tr>
          <tr>
            <td>
              <code>MANAGE_ROLES</code>
            </td>
            <td>131072</td>
            <td>
              <code>0x0000020000</code>
            </td>
            <td>Create, edit, delete, and assign roles below your highest role.</td>
          </tr>
          <tr>
            <td>
              <code>MANAGE_EMOJI</code>
            </td>
            <td>262144</td>
            <td>
              <code>0x0000040000</code>
            </td>
            <td>Upload, rename, and delete custom emoji.</td>
          </tr>
          <tr>
            <td>
              <code>MANAGE_WEBHOOKS</code>
            </td>
            <td>524288</td>
            <td>
              <code>0x0000080000</code>
            </td>
            <td>Create, edit, and delete webhooks.</td>
          </tr>
          <tr>
            <td>
              <code>MANAGE_INVITES</code>
            </td>
            <td>1048576</td>
            <td>
              <code>0x0000100000</code>
            </td>
            <td>Create, view, and revoke invite links.</td>
          </tr>
          <tr>
            <td>
              <code>KICK_MEMBERS</code>
            </td>
            <td>2097152</td>
            <td>
              <code>0x0000200000</code>
            </td>
            <td>Kick members from the guild.</td>
          </tr>
          <tr>
            <td>
              <code>BAN_MEMBERS</code>
            </td>
            <td>4194304</td>
            <td>
              <code>0x0000400000</code>
            </td>
            <td>Ban and unban members.</td>
          </tr>
          <tr>
            <td>
              <code>VIEW_AUDIT_LOG</code>
            </td>
            <td>8388608</td>
            <td>
              <code>0x0000800000</code>
            </td>
            <td>View the guild's audit log.</td>
          </tr>
          <tr>
            <td>
              <code>ADMINISTRATOR</code>
            </td>
            <td>16777216</td>
            <td>
              <code>0x0001000000</code>
            </td>
            <td>
              Grants all permissions and bypasses all channel overrides. Use with extreme caution.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Role Hierarchy</h2>
      <p>
        Roles have a <code>position</code> field that determines their rank in the hierarchy. Higher
        position means higher authority. The hierarchy enforces these rules:
      </p>
      <ul>
        <li>
          A member can only assign roles that are <strong>below</strong> their highest role in
          position.
        </li>
        <li>
          A member can only kick/ban members whose highest role is <strong>below</strong> their own
          highest role.
        </li>
        <li>
          A member can only edit roles that are <strong>below</strong> their highest role.
        </li>
        <li>
          The <code>@everyone</code> role is always at position 0 and cannot be deleted or
          repositioned.
        </li>
        <li>The guild owner bypasses all hierarchy checks and can manage any role or member.</li>
      </ul>

      <h3>Evaluation Order</h3>
      <p>
        When multiple roles grant conflicting permissions (e.g., one role allows and another denies
        via channel overrides), the evaluation follows this strict order:
      </p>
      <ol>
        <li>
          <strong>Owner check:</strong> Guild owner always has all permissions.
        </li>
        <li>
          <strong>Administrator check:</strong> If any role has ADMINISTRATOR, all permissions are
          granted.
        </li>
        <li>
          <strong>Role permissions:</strong> OR all role permission fields together.
        </li>
        <li>
          <strong>Channel deny overrides:</strong> AND NOT each role's deny field.
        </li>
        <li>
          <strong>Channel allow overrides:</strong> OR each role's allow field.
        </li>
        <li>
          <strong>Member-specific deny:</strong> AND NOT the member's personal channel deny field.
        </li>
        <li>
          <strong>Member-specific allow:</strong> OR the member's personal channel allow field.
        </li>
      </ol>

      <h2>Channel-Level Permission Overrides</h2>
      <p>
        Each channel can have permission overrides that modify the base role permissions for that
        specific channel. An override consists of:
      </p>
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>target_type</code>
            </td>
            <td>
              <code>role</code> or <code>member</code>
            </td>
            <td>Whether this override applies to a role or a specific member.</td>
          </tr>
          <tr>
            <td>
              <code>target_id</code>
            </td>
            <td>Snowflake ID</td>
            <td>The role ID or member ID this override applies to.</td>
          </tr>
          <tr>
            <td>
              <code>allow</code>
            </td>
            <td>Bitfield</td>
            <td>Permissions to explicitly grant in this channel (overrides role denials).</td>
          </tr>
          <tr>
            <td>
              <code>deny</code>
            </td>
            <td>Bitfield</td>
            <td>Permissions to explicitly deny in this channel (overrides role grants).</td>
          </tr>
        </tbody>
      </table>
      <p>Common use cases for channel overrides:</p>
      <ul>
        <li>
          <strong>Read-only announcement channel:</strong> Deny <code>SEND_MESSAGES</code> for{' '}
          <code>@everyone</code>, then allow <code>SEND_MESSAGES</code> for the{' '}
          <code>Announcer</code> role.
        </li>
        <li>
          <strong>Private channel:</strong> Deny <code>VIEW_CHANNEL</code> for{' '}
          <code>@everyone</code>, then allow <code>VIEW_CHANNEL</code> for specific roles.
        </li>
        <li>
          <strong>Muted member:</strong> Create a member-specific override that denies{' '}
          <code>SEND_MESSAGES</code> and <code>ADD_REACTIONS</code>.
        </li>
      </ul>

      <h2>Owner Protection</h2>
      <p>The guild owner has special protections that cannot be overridden:</p>
      <ul>
        <li>
          The owner always has all permissions in every channel, regardless of roles or overrides.
        </li>
        <li>The owner cannot be kicked, banned, or have roles removed by anyone.</li>
        <li>Only the owner can delete the guild.</li>
        <li>Ownership can only be transferred by the current owner, not by administrators.</li>
        <li>The owner cannot leave the guild without transferring ownership first.</li>
      </ul>

      <h2>Administrator Boundaries</h2>
      <p>
        The <code>ADMINISTRATOR</code> permission is powerful but not unlimited:
      </p>
      <ul>
        <li>
          Administrators can manage all channels, roles (below theirs), and members (below their
          highest role).
        </li>
        <li>
          Administrators <strong>cannot</strong> manage the guild owner.
        </li>
        <li>
          Administrators <strong>cannot</strong> assign the <code>ADMINISTRATOR</code> permission to
          roles at or above their own position.
        </li>
        <li>
          Administrators <strong>cannot</strong> delete the guild or transfer ownership.
        </li>
        <li>All administrator actions are recorded in the audit log.</li>
      </ul>

      <h2>Permission Check Examples</h2>

      <h3>Example 1: Can a user send a message?</h3>
      <pre>
        <code>{`// Pseudocode for checking SEND_MESSAGES in a channel
func canSendMessage(member, channel) bool {
    perms := computeBasePermissions(member)

    // Owner and admin bypass
    if member.isOwner || perms.has(ADMINISTRATOR) {
        return true
    }

    // Apply channel overrides
    perms = applyOverrides(perms, member, channel)

    return perms.has(SEND_MESSAGES)
}`}</code>
      </pre>

      <h3>Example 2: Creating a private channel</h3>
      <pre>
        <code>{`// 1. Create the channel
// 2. Add an override for @everyone denying VIEW_CHANNEL
POST /api/channels/:id/overrides
{
    "target_type": "role",
    "target_id": "everyone_role_id",
    "allow": 0,
    "deny": 1  // VIEW_CHANNEL = 0x1
}

// 3. Add an override for the "Staff" role allowing VIEW_CHANNEL
POST /api/channels/:id/overrides
{
    "target_type": "role",
    "target_id": "staff_role_id",
    "allow": 1,  // VIEW_CHANNEL = 0x1
    "deny": 0
}`}</code>
      </pre>

      <h3>Example 3: Read-only channel for most users</h3>
      <pre>
        <code>{`// Deny SEND_MESSAGES for @everyone
POST /api/channels/:id/overrides
{
    "target_type": "role",
    "target_id": "everyone_role_id",
    "allow": 0,
    "deny": 2  // SEND_MESSAGES = 0x2
}

// Allow SEND_MESSAGES for the "Moderators" role
POST /api/channels/:id/overrides
{
    "target_type": "role",
    "target_id": "moderator_role_id",
    "allow": 2,  // SEND_MESSAGES = 0x2
    "deny": 0
}`}</code>
      </pre>

      <h2>Default Roles</h2>
      <p>When a guild is created, two roles are set up automatically:</p>
      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Position</th>
            <th>Default Permissions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>@everyone</code>
            </td>
            <td>0</td>
            <td>
              <code>
                VIEW_CHANNEL | SEND_MESSAGES | READ_HISTORY | EMBED_LINKS | ATTACH_FILES |
                ADD_REACTIONS | CONNECT | SPEAK
              </code>
            </td>
          </tr>
          <tr>
            <td>
              <code>Owner</code> (auto-assigned)
            </td>
            <td>Highest</td>
            <td>All permissions (implicit via owner check, not via bitfield)</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
