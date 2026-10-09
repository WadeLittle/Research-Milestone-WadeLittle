# Maintenance Request Tracker

An individual CSCE research milestone sample by Wade Little for a student-housing
property-management project. It explores React + TypeScript + Vite, Python +
FastAPI, a REST API, PostgreSQL, npm, and uv.

## What it does

- Lists maintenance requests with property, unit, title, priority, and status.
- Submits requests with Low, Medium, or High priority; new requests start Open.
- Changes status between Open, In Progress, and Completed.
- Filters the displayed list by status or shows All.
- Saves requests in PostgreSQL so they survive page refreshes and API restarts.

## Requirements and installation

Install [Node.js](https://nodejs.org/en/download) (a supported LTS version meeting
[Vite's requirements](https://vite.dev/guide/): 20.19+ or 22.12+),
[uv](https://docs.astral.sh/uv/getting-started/installation/), and a Docker runtime
with Docker Compose. npm comes with Node.js. The backend requires Python 3.12+;
uv can install the version selected by `backend/.python-version`.

[Docker Desktop](https://docs.docker.com/desktop/) is one local runtime option.
On this project's Mac, Homebrew's Docker CLI, standalone Docker Compose, and
[Colima](https://github.com/abiosoft/colima) are used instead. If setting up that
Mac combination from scratch, install Homebrew first, then:

```sh
brew install colima docker docker-compose
```

Clone your personal repository and enter it:

```sh
git clone https://github.com/WadeLittle/Research-Milestone-WadeLittle.git
cd Research-Milestone-WadeLittle
```

## Run locally

### 1. Start PostgreSQL

With Docker Desktop running, from the repository root:

```sh
docker compose up -d --wait
```

For the Colima setup used on this Mac, use these commands instead:

```sh
colima start --profile maintenance-tracker --cpu 2 --memory 2 --disk 10
docker-compose --context colima-maintenance-tracker up -d --wait
```

`compose.yaml` starts PostgreSQL 17 on localhost port **5433** and stores data
in a named volume. The credentials are for this local sample only.

### 2. Start FastAPI in one terminal

From the repository root:

```sh
cd backend
cp .env.example .env
uv sync --locked
uv run uvicorn backend.main:app --reload --env-file .env
```

Copy the example only on first setup; keep any later connection changes in `.env`.
That file is ignored by Git. Open http://localhost:8000/docs for interactive API
examples. http://localhost:8000/health checks the API process, not database health.

### 3. Start React in another terminal

From the repository root:

```sh
cd frontend
npm ci
npm run dev
```

Open http://localhost:5173. Use the URL Vite prints if that port is occupied.
Vite forwards `/api/requests` to FastAPI's `/requests` endpoint on port 8000.

### Stop and restart

Press Ctrl+C in the frontend and backend terminals. From the repository root,
stop the database with `docker compose stop`, or on this Mac:

```sh
docker-compose --context colima-maintenance-tracker stop
```

Start it again with the corresponding `up -d --wait` command. Stopping keeps the
volume and requests. Removing the volume deletes the database contents.

## Package managers

**npm** manages frontend packages. `package.json` declares dependencies and scripts;
`package-lock.json` records resolved versions. `npm ci` installs from the lockfile
and fails when it disagrees with `package.json`. `npm install <package>` adds a
dependency and updates both files. `npm run dev`, `npm run build`, and
`npm run lint` execute the scripts declared in `package.json`.
See [npm ci documentation](https://docs.npmjs.com/cli/v11/commands/npm-ci/).

**uv** manages backend packages, Python, and the `.venv` environment.
`pyproject.toml` declares project dependencies, `uv.lock` records their resolution,
and `.python-version` selects Python 3.12. `uv sync --locked` installs dependencies
without allowing a stale lockfile; `uv add <package>` updates declarations and
resolution; `uv run <command>` runs in the project environment without manual
activation. See [uv locking and syncing](https://docs.astral.sh/uv/concepts/projects/sync/).

Commit both lockfiles. Do not commit `node_modules/`, `.venv/`, or `.env`.
Lockfiles improve reproducibility; compatible runtimes and matching environment
settings are still needed.

## How the code works

```text
React page → fetch('/api/requests') → Vite development proxy
           → FastAPI REST endpoint → Psycopg SQL → PostgreSQL
```

| File | Responsibility |
| --- | --- |
| `frontend/src/App.tsx` | Form, list, state, status changes, and local filtering |
| `frontend/src/api.ts` | TypeScript request types and HTTP calls |
| `frontend/vite.config.ts` | Development proxy to the backend |
| `backend/src/backend/main.py` | API endpoints and startup |
| `backend/src/backend/schemas.py` | Pydantic input/output models and validation |
| `backend/src/backend/database.py` | Database connections and table creation |
| `compose.yaml` | Local PostgreSQL service and volume |

The browser loads the list on opening. POST adds a request, and PATCH changes its
status. React updates the screen after a successful API response. The UI filters
its loaded list; the API also supports a status query for other clients.
SQL parameters separate user data from SQL commands. Successful connection blocks
commit transactions and close connections. PostgreSQL generates IDs.

## REST endpoints

| Method | Path | Result |
| --- | --- | --- |
| GET | `/health` | API process health |
| GET | `/requests` | Request list; optional `?status=Open` |
| POST | `/requests` | Creates a request; HTTP 201 |
| PATCH | `/requests/{id}/status` | Updates status; HTTP 200 |

POST example:

```json
{
  "property": "Campus Commons",
  "unit": "204",
  "title": "Kitchen sink leaking",
  "priority": "High"
}
```

PATCH example: `{"status":"In Progress"}`. Text fields are trimmed, required,
and limited to 200 characters. Invalid input returns 422; an unknown request ID
on a status update returns 404.

## Technology research and tradeoffs

These choices fit this sample; they are a starting point for the team's discussion.
Alternatives below were reviewed through documentation, not implemented or benchmarked.

| Choice | Why it fits | Costs and alternatives |
| --- | --- | --- |
| React + TypeScript | Components and state support interactive forms and lists. Types describe request fields and catch many mistakes before running. | Hooks and build tooling take practice. TypeScript does not validate API JSON at runtime. Vue is another component-based option; plain JavaScript reduces tooling but requires more manual UI updates. |
| Vite | Provides the development server, React integration, proxy, and production build. | Requires Node tooling. It is not a complete backend or production hosting service. A framework such as Next.js adds server rendering and routing, which this sample does not need. |
| FastAPI | Python type hints and Pydantic support input validation and automatic OpenAPI documentation. | Database, authentication, and migrations require additional choices. Django bundles an ORM and admin; Flask offers a smaller core with more manual integration. |
| REST over HTTP/JSON | GET, POST, and PATCH make the small resource workflow easy to inspect and demonstrate. | Clients use predefined responses, and multiple resources can require multiple calls. GraphQL lets clients select fields but adds schema/resolver work beyond this sample's needs. |
| PostgreSQL | Persistent relational storage, transactions, and constraints fit structured property/unit/request data. | Requires a server, credentials, and operational care. SQLite needs less setup but allows only one writer at a time; it is useful for smaller local applications. |
| Psycopg + direct SQL | A few explicit queries make the database interaction visible for learning. | More queries and schema changes become manual work. SQLAlchemy plus Alembic is an option for ORM mapping and migrations as the project grows. |
| npm + uv | Separate tools manage the JavaScript and Python ecosystems with project metadata and lockfiles. | Two ecosystems mean two sets of commands and dependency updates. Yarn/pnpm and pip with virtual environments are alternatives. |

Official references reviewed October 8, 2026:

- [React quick start](https://react.dev/learn): components, lists, events, and state.
- [TypeScript introduction](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html): static checking of JavaScript.
- [Vite guide](https://vite.dev/guide/) and [production build](https://vite.dev/guide/build).
- [FastAPI features](https://fastapi.tiangolo.com/features/): validation and API documentation.
- [Psycopg usage](https://www.psycopg.org/psycopg3/docs/basic/usage.html): parameters and connection transactions.
- [PostgreSQL transactions](https://www.postgresql.org/docs/17/tutorial-transactions.html).
- Alternatives: [Vue](https://vuejs.org/guide/introduction.html), [Django](https://www.djangoproject.com/start/overview/), [Flask](https://flask.palletsprojects.com/en/stable/), [SQLite](https://www.sqlite.org/whentouse.html), and [GraphQL](https://graphql.org/learn/).

## Checks and learning exercises

From `frontend/`, run:

```sh
npm run build
npm run lint
```

Manual workflow:

1. Submit a request; verify its initial Open status and chosen priority.
2. Refresh; verify the saved request returns.
3. Change it to In Progress, then Completed.
4. Switch between All and each status filter; check the empty-filter message.
5. Restart the backend and verify the saved status remains.
6. Use `/docs` to submit an invalid priority and update a nonexistent ID; expect 422 and 404.

During development, API checks covered creation, listing, unique IDs, status
transitions, filtering, invalid input, and missing IDs. A separate process restart
verified PostgreSQL persistence. Browser checks covered submission, form reset,
refresh persistence, status updates, and filter behavior. These were interactive
checks; there is no committed automated test suite.

To explain the work yourself, trace `handleSubmit` through `createRequest`, the
POST endpoint, and the SQL INSERT. Then explain why `visibleRequests` is derived
from state and why TypeScript types do not replace backend validation.

## Deployment considerations and limitations

This repo is verified locally and has not been deployed publicly. A deployment
would serve `frontend/dist` after `npm run build`, route `/api` to a running
FastAPI service, and supply a PostgreSQL connection through environment settings.
The Vite development proxy is not the deployed routing layer.
A platform that runs Python services/containers and a managed database reduces
server maintenance; a VM gives more control but requires updates, TLS, process
restarts, backups, and monitoring. Review [FastAPI deployment concepts](https://fastapi.tiangolo.com/deployment/)
and [Vite static deployment](https://vite.dev/guide/static-deploy.html).

This learning app has no login, role permissions, uploads, pagination, connection
pool, or migration system. It creates one table on startup; that does not migrate
an existing schema. Property and unit are plain text rather than related records.
The list updates locally after actions and otherwise refreshes on page reload.
Before using real tenant data, the team would need authentication, authorization,
production secrets, backups, and a proper deployment plan.

## Milestone submission

- [Video script and checklist](docs/demo-script.md)
- [Team GitHub Issue draft](docs/research-milestone-issue.md)

Record the demo, upload or attach it, replace the Issue draft's placeholders,
and create the Issue in the team repository. Verify instructors/TAs can access
both the personal research repository and video. Share findings with the team.
