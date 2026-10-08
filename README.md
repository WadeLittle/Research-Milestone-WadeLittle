# Maintenance Request Tracker

Individual CSCE research milestone sample for student-housing property management.

## Project structure

- `frontend/`: React, TypeScript, and Vite, managed with npm.
- `backend/`: Python 3.12+ and FastAPI, managed with uv.

The backend now stores maintenance requests in PostgreSQL. The frontend is
still a starter page; connecting it is the next step.

Start PostgreSQL first using the instructions in [backend/README.md](backend/README.md).

Run these in two separate terminals:

```sh
cd frontend
npm install
npm run dev
```

```sh
cd backend
cp .env.example .env # first setup only
uv sync
uv run uvicorn backend.main:app --reload --env-file .env
```

Open http://localhost:5173 for the frontend and http://localhost:8000/docs
for API documentation. http://localhost:8000/health returns `{"status":"ok"}`.

Check the frontend with `npm run build` and `npm run lint`.
Commit `package-lock.json` and `uv.lock`; these record resolved dependency
versions. Installed dependencies (`node_modules/` and `.venv/`) stay out of Git.
