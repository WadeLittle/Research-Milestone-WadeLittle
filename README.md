# Maintenance Request Tracker

Individual CSCE research milestone sample for student-housing property management.

## Step 1: project structure

- `frontend/`: React, TypeScript, and Vite, managed with npm.
- `backend/`: Python 3.12+ and FastAPI, managed with uv.

This first step has a starter page and an API health check. Maintenance requests
and PostgreSQL will be added in separate commits.

Run these in two separate terminals:

```sh
cd frontend
npm install
npm run dev
```

```sh
cd backend
uv sync
uv run uvicorn backend.main:app --reload
```

Open http://localhost:5173 for the frontend and http://localhost:8000/docs
for API documentation. http://localhost:8000/health returns `{"status":"ok"}`.

Check the frontend with `npm run build` and `npm run lint`.
Commit `package-lock.json` and `uv.lock`; these record resolved dependency
versions. Installed dependencies (`node_modules/` and `.venv/`) stay out of Git.
