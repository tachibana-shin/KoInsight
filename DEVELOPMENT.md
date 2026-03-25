# KoInsight Development Guide

This guide covers everything you need to know to develop KoInsight locally.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Key Technologies](#key-technologies)
- [Project Structure](#project-structure)
- [Database Management](#database-management)
- [Code Quality](#code-quality)
- [Testing](#testing)
- [Contributing](#contributing)

## Prerequisites

### Required Dependencies

Before you begin, ensure you have the following installed:

1. **Bun** (v1.1 or higher) - Recommended for local development
2. **Node.js** (v22 or higher)
3. **Wrangler CLI** (for Cloudflare) or **Netlify CLI**

### Recommended Tools

- **nvm** (Node Version Manager)
- **Turbo CLI** (installed automatically via devDependencies)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/GeorgeSG/koinsight.git
cd koinsight
```

### 2. Install Dependencies

KoInsight uses a monorepo structure with npm workspaces. Install all dependencies from the root:

```bash
npm install
```

### 3. Set Up the Database

The project uses **Drizzle ORM** for database management.

Run database migrations:

```bash
cd apps/server
npx drizzle-kit migrate
```

### 4. Seed the Database (Optional)

```bash
# From the root directory
npm run seed
```

## Development Workflow

### Running the Development Server

KoInsight uses **Turborepo** to manage concurrent development servers:

```bash
npm run dev
```

This starts:
- **Hono Backend**: http://localhost:3000 (running with Bun)
- **Vite Frontend**: http://localhost:5173 (proxied to port 3000)

### Key Technologies

**Backend:**
- **Hono**: Ultrafast web framework for Edge/Cloudflare
- **Drizzle ORM**: TypeScript-first ORM
- **Postgres / SQLite**: Supported database engines
- **jszip**: Browser-compatible zipping library

**Frontend:**
- **React 18**: UI library
- **Vite**: Modern build tool
- **Mantine UI**: Design system
- **Recharts**: Data visualization

**Monorepo:**
- **Turborepo**: High-performance build system
- **npm Workspaces**: Dependency management

## Project Structure

```
koinsight/
├── apps/
│   ├── server/              # Hono serverless backend
│   │   ├── src/
│   │   │   ├── db/          # Drizzle schema & migrations
│   │   │   ├── kosync/      # KoSync protocol
│   │   │   └── app.ts       # Main API entry
│   └── web/                 # React Vite frontend
├── packages/
│   └── common/              # Shared types
├── wrangler.toml            # Cloudflare config
└── netlify.toml             # Netlify config
```

## Testing

```bash
# Run all tests via Turbo
npm run test:coverage

# Run server tests only
cd apps/server
npm run test
```
