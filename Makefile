.PHONY: help dev dev-services dev-web dev-admin dev-desktop build build-go build-web build-admin build-docker \
       test test-go test-ts lint lint-go lint-ts format migrate migrate-down seed clean

SHELL := /bin/bash
COMPOSE_DEV_FILE := infra/docker/docker-compose.dev.yml
COMPOSE_PROD_FILE := infra/docker/docker-compose.yml
ENV_FILE ?= .env

# Build variables
VERSION ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
BUILD_TIME := $(shell date -u +"%Y-%m-%dT%H:%M:%SZ")
GO_LDFLAGS := -ldflags "-s -w -X main.version=$(VERSION) -X main.buildTime=$(BUILD_TIME)"

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ---------------------------------------------------------------------------
# Development
# ---------------------------------------------------------------------------

dev: dev-services dev-web ## Start all development services

dev-services: ## Start infrastructure services (DB, Valkey, MinIO, LiveKit)
	docker compose -f $(COMPOSE_DEV_FILE) up -d

dev-stop: ## Stop infrastructure services
	docker compose -f $(COMPOSE_DEV_FILE) down

dev-api: ## Run API service locally
	cd services/api && go run $(GO_LDFLAGS) ./cmd/api

dev-realtime: ## Run Realtime service locally
	cd services/realtime && go run $(GO_LDFLAGS) ./cmd/realtime

dev-media: ## Run Media service locally
	cd services/media && go run $(GO_LDFLAGS) ./cmd/media

dev-worker: ## Run Worker service locally
	cd services/worker && go run $(GO_LDFLAGS) ./cmd/worker

dev-web: ## Run web app dev server
	npm -w apps/web run dev

dev-admin: ## Run admin app dev server
	npm -w apps/admin run dev

dev-desktop: ## Run desktop app dev server
	npm -w apps/desktop run dev

# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------

build: build-go build-web build-admin ## Build everything

build-go: ## Build all Go services
	cd services/api && go build $(GO_LDFLAGS) -o ../../bin/api ./cmd/api
	cd services/realtime && go build $(GO_LDFLAGS) -o ../../bin/realtime ./cmd/realtime
	cd services/media && go build $(GO_LDFLAGS) -o ../../bin/media ./cmd/media
	cd services/worker && go build $(GO_LDFLAGS) -o ../../bin/worker ./cmd/worker

build-web: ## Build web app
	npm run build:packages
	npm -w apps/web run build

build-admin: ## Build admin app
	npm run build:packages
	npm -w apps/admin run build

build-desktop: ## Build desktop app
	npm run build:packages
	npm -w apps/desktop run build

build-docker: ## Build Docker images
	docker build -f infra/docker/Dockerfile.api -t relayforge/api:$(VERSION) .
	docker build -f infra/docker/Dockerfile.realtime -t relayforge/realtime:$(VERSION) .
	docker build -f infra/docker/Dockerfile.media -t relayforge/media:$(VERSION) .
	docker build -f infra/docker/Dockerfile.worker -t relayforge/worker:$(VERSION) .
	docker build -f infra/docker/Dockerfile.web -t relayforge/web:$(VERSION) .

# ---------------------------------------------------------------------------
# Test
# ---------------------------------------------------------------------------

test: test-go test-ts ## Run all tests

test-go: ## Run Go tests
	cd services/api && go test -race -cover ./...
	cd services/realtime && go test -race -cover ./...
	cd services/media && go test -race -cover ./...
	cd services/worker && go test -race -cover ./...

test-ts: ## Run TypeScript tests
	npx vitest run

test-e2e: ## Run end-to-end tests
	npx playwright test

# ---------------------------------------------------------------------------
# Lint & Format
# ---------------------------------------------------------------------------

lint: lint-go lint-ts ## Run all linters

lint-go: ## Lint Go code
	cd services/api && golangci-lint run ./...
	cd services/realtime && golangci-lint run ./...
	cd services/media && golangci-lint run ./...
	cd services/worker && golangci-lint run ./...

lint-ts: ## Lint TypeScript code
	npx eslint 'apps/*/src/**/*.{ts,tsx}' 'packages/*/src/**/*.{ts,tsx}'

format: ## Format all code
	gofmt -s -w services/
	npx prettier --write '**/*.{ts,tsx,js,json,css,md,yaml,yml}'

format-check: ## Check formatting
	gofmt -l services/ | grep . && exit 1 || true
	npx prettier --check '**/*.{ts,tsx,js,json,css,md,yaml,yml}'

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------

migrate: ## Run database migrations
	cd services/api && go run ./cmd/api migrate up

migrate-down: ## Rollback last migration
	cd services/api && go run ./cmd/api migrate down

migrate-create: ## Create a new migration (usage: make migrate-create NAME=create_users)
	@if [ -z "$(NAME)" ]; then echo "Usage: make migrate-create NAME=migration_name"; exit 1; fi
	@mkdir -p services/api/internal/database/migrations
	@TIMESTAMP=$$(date +%Y%m%d%H%M%S); \
	touch services/api/internal/database/migrations/$${TIMESTAMP}_$(NAME).up.sql; \
	touch services/api/internal/database/migrations/$${TIMESTAMP}_$(NAME).down.sql; \
	echo "Created migrations/$${TIMESTAMP}_$(NAME).{up,down}.sql"

seed: ## Seed database with development data
	cd services/api && go run ./cmd/api seed

# ---------------------------------------------------------------------------
# Deployment
# ---------------------------------------------------------------------------

deploy-init: ## Create a local deployment env file if one does not exist
	@if [ ! -f "$(ENV_FILE)" ]; then cp .env.example "$(ENV_FILE)"; fi
	@echo "Using env file: $(ENV_FILE)"

deploy-up: ## Start the self-hosted deployment stack
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_PROD_FILE) up -d

deploy-migrate: ## Run database migrations inside the deployment stack
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_PROD_FILE) exec api api migrate up

deploy-down: ## Stop the self-hosted deployment stack
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_PROD_FILE) down

compose-up: deploy-up ## Backward-compatible alias for the old target

compose-down: deploy-down ## Backward-compatible alias for the old target

# ---------------------------------------------------------------------------
# Cleanup
# ---------------------------------------------------------------------------

clean: ## Clean build artifacts and dependencies
	rm -rf bin/ dist/ build/
	rm -rf node_modules apps/*/node_modules packages/*/node_modules
	rm -rf apps/*/dist packages/*/dist
	rm -rf apps/desktop/src-tauri/target
