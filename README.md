# Virtual Finance (Finlit App)

## Local Development & Database Setup

This project uses PostgreSQL for its backend database. Instead of installing Postgres directly on your machine, we use **Docker Compose** to guarantee a reproducible environment across the team.

### Prerequisites
- **Docker Desktop** installed and running on your machine.
- You do NOT need to install PostgreSQL locally.

### Getting Started
1. **Copy `.env.example` to `.env`** at the project root:
   ```bash
   cp .env.example .env
   ```
   (Feel free to change `POSTGRES_PASSWORD` if you want, but the default works fine for local dev).

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   This command automatically spins up the Postgres container in the background (`npm run db:up`), then starts the Vite frontend and Node backend concurrently.

### Database Management Commands
- `npm run db:up` - Starts the PostgreSQL container in detached mode.
- `npm run db:down` - Stops and removes the PostgreSQL container.
- `npm run db:logs` - Tails the logs of the PostgreSQL container.

**Note on Persistence:**
Database data is stored in a Docker volume (`finlit-pgdata`). This means your test users, investments, and badges will persist across container restarts (e.g., if you run `npm run db:down` and `npm run db:up` again). 

If you ever need a completely clean slate (wiping the database), run:
```bash
docker compose down -v
```
This will destroy the volume, and upon next start, `backend/db.js` will re-initialize the schema and default seed data.

---

## React + TypeScript + Vite

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
