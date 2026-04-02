# Security Policy

## Reporting Vulnerabilities

If you discover a security vulnerability in RelayForge, please report it responsibly.

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, email: ...

Include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will acknowledge receipt within 48 hours and provide a timeline for a fix.

## Supported Versions

| Version | Supported |
| ------- | --------- |
| Latest  | Yes       |

## Security Design

- Passwords are hashed with Argon2id
- JWT access tokens with short TTL and refresh token rotation
- Server-side permission enforcement on all API and WebSocket operations
- Direct messages support end-to-end encryption (Double Ratchet + X3DH)
- Guild/channel messages use TLS in transit and server-side access control
- CSRF protection via SameSite cookies and origin checking
- Rate limiting on authentication and sensitive endpoints
- Input validation on all API boundaries
- SQL injection prevention via parameterized queries
- File upload MIME validation and optional antivirus scanning
