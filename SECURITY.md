# Security Policy

## Reporting Vulnerabilities

If you discover a RelayForge security issue, do not open a public issue. Report it privately with:

- the affected repository or component
- reproduction steps
- impact assessment
- any relevant logs, traces, or screenshots

## Repository Scope

This repository covers:

- the web client
- the admin console
- the desktop shell
- the shared frontend packages
- the public documentation site

Backend runtime security controls and operational hardening are implemented in
`relay-forge-server` and documented in the GitHub Pages handbook published from this repository.

## Client Security Expectations

- Keep backend endpoints explicit through environment variables.
- Avoid publishing secrets, internal deployment details, or credentials in docs or example config.
- Treat desktop release credentials and notification credentials as environment-specific secrets.
