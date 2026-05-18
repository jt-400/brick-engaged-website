# Brick Engaged

A modern web application for LEGO enthusiasts and the Brick Engaged community.

## Getting Started

### Install Dependencies
```bash
pnpm install
```

### Run Development Server
```bash
pnpm --filter @workspace/brick-engaged run dev
```

The site will be available at `http://localhost:5173` (or the port shown in your terminal).

### Build for Production
```bash
pnpm run build
```

## Available Commands

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — typecheck across all packages
- `pnpm run build` — build all packages
- `pnpm --filter @workspace/db run push` — push database schema changes

## Project Structure

- `artifacts/brick-engaged/` — main website
- `lib/` — shared libraries and utilities
- `scripts/` — build and development scripts

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **API:** Express, Node.js 24
- **Database:** PostgreSQL with Drizzle ORM
- **Workspace:** pnpm workspaces
