# Backend

From this directory, run `uv sync`, then
`uv run uvicorn backend.main:app --reload`.

Visit http://localhost:8000/health for the health check and
http://localhost:8000/docs for interactive API documentation.

## Maintenance API (step 2)

Requests are temporarily stored in memory and disappear on server restart.
Run one server process for this learning step. PostgreSQL comes in step 3.

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
