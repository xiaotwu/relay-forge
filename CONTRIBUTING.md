# Contributing to RelayForge

Thank you for your interest in contributing to RelayForge.

## Development Setup

1. Fork and clone the repository
2. Install prerequisites: Go 1.23+, Node.js 20+, Docker
3. Run `make dev-services` to start infrastructure
4. Run `make migrate && make seed` to set up the database
5. Start services with `make dev-api`, `make dev-web`, etc.

## Code Style

- **Go**: Follow standard Go conventions. Run `gofmt` and `golangci-lint`
- **TypeScript**: Follow the ESLint and Prettier configurations in the repo
- **Commits**: Use conventional commit messages (e.g., `feat:`, `fix:`, `docs:`, `refactor:`)

## Pull Requests

1. Create a feature branch from `main`
2. Make your changes with tests
3. Run `make lint` and `make test`
4. Submit a PR with a clear description of the changes

## Reporting Issues

Use GitHub Issues. Include:

- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, versions)

## Code of Conduct

Be respectful and constructive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/).
