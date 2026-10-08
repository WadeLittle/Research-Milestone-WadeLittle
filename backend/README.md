# Backend

From this directory, run `uv sync`, then
`uv run uvicorn backend.main:app --reload --env-file .env`.
First start PostgreSQL and copy `.env.example` to `.env` (see below).

Visit http://localhost:8000/health for the health check and
http://localhost:8000/docs for interactive API documentation.

## Maintenance API

Requests are stored in PostgreSQL and survive backend restarts.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/requests` | List requests; optional `status` query filter |
| POST | `/requests` | Create a request with status Open; returns HTTP 201 |
| PATCH | `/requests/{request_id}/status` | Change a request's status |

Example POST body:

```json
{
  "property": "Campus Commons",
  "unit": "204",
  "title": "Kitchen sink leaking",
  "priority": "High"
}
```

Priorities: `Low`, `Medium`, `High`.
Statuses: `Open`, `In Progress`, `Completed`.
Property, unit, and title must be nonblank and at most 200 characters.
Invalid input returns HTTP 422; updating an unknown request returns HTTP 404.

Try POST, GET, and PATCH from `/docs`. For PATCH, use the ID returned by POST
and a body such as `{"status": "In Progress"}`. Then filter GET by that status.

## PostgreSQL (step 3)

From the repository root:

```sh
docker compose up -d --wait
```

On this Mac, Colima supplies Docker and Compose is installed as the standalone
`docker-compose` command. Use this explicit context:

```sh
colima start --profile maintenance-tracker --cpu 2 --memory 2 --disk 10
docker-compose --context colima-maintenance-tracker up -d --wait
```

Then start the backend:

```sh
cd backend
cp .env.example .env
uv sync
uv run uvicorn backend.main:app --reload --env-file .env
```

The local database listens on port 5433. Its development credentials are in
`compose.yaml`; `.env.example` contains the matching connection URL.
The API creates the table on startup. Database-generated IDs replace the
in-memory counter. SQL parameters keep user values separate from SQL commands.
Each connection commits successful writes and closes when its `with` block ends.
Endpoints use regular `def` so FastAPI runs blocking database calls in its thread pool.

Create a request, stop and restart the backend, then list requests again to
observe persistence. `docker compose stop` stops PostgreSQL without deleting
its named volume; use the Colima context option on this Mac.
The health endpoint checks the API process; it does not monitor database availability.
This small sample uses direct SQL and table creation, without an ORM or migration system.
