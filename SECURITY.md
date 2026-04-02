# Security Policy

## Reporting Vulnerabilities

If you discover a RelayForge security issue, do not open a public issue. Report it privately with:

- a description of the issue
- reproduction steps
- affected component or repository
- impact assessment

## Repository Scope

This repository now covers:

- the web client
- the admin client
- the desktop client
- the public documentation site

Backend runtime security controls and operational hardening have been moved into `new-project/`.

## Client Security Expectations

- All client-to-server communication must be configured through explicit endpoint URLs.
- Sensitive tokens should stay in the smallest practical storage surface for each client.
- Desktop packaging should use signed installers whenever your release channel supports it.
- Documentation must not expose deployment secrets or backend-only operational details.
