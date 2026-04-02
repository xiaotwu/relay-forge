.PHONY: help build build-packages build-web build-admin build-desktop build-docs \
       package-web package-admin package-docs package-desktop lint test typecheck clean

SHELL := /bin/bash
RELEASE_DIR := release

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: build-packages build-web build-admin build-desktop build-docs ## Build all client applications

build-packages: ## Build shared frontend packages
	npm run build:packages

build-web: ## Build the web client
	npm run build:packages
	npm -w apps/web run build

build-admin: ## Build the admin client
	npm run build:packages
	npm -w apps/admin run build

build-desktop: ## Build the desktop frontend bundle
	npm run build:packages
	npm -w apps/desktop run build

build-docs: ## Build the GitHub Pages site
	npm run build:packages
	npm -w apps/docs run build

package-web: build-web ## Package the web client as a zip archive
	@mkdir -p $(RELEASE_DIR)
	cd apps/web/dist && zip -qr ../../../$(RELEASE_DIR)/relayforge-web.zip .

package-admin: build-admin ## Package the admin client as a zip archive
	@mkdir -p $(RELEASE_DIR)
	cd apps/admin/dist && zip -qr ../../../$(RELEASE_DIR)/relayforge-admin.zip .

package-docs: build-docs ## Package the docs site as a zip archive
	@mkdir -p $(RELEASE_DIR)
	cd apps/docs/dist && zip -qr ../../../$(RELEASE_DIR)/relayforge-docs.zip .

package-desktop: ## Build native desktop installers through Tauri
	npm run build:packages
	npm -w apps/desktop run tauri build

lint: ## Run lint checks for the client repo
	npm run lint

test: ## Run client tests
	npm test

typecheck: ## Run TypeScript type checks
	npm run typecheck

clean: ## Clean build artifacts and packaged outputs
	rm -rf $(RELEASE_DIR) node_modules apps/*/node_modules packages/*/node_modules
	rm -rf apps/*/dist packages/*/dist apps/desktop/src-tauri/target
