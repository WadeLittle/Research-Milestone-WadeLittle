# Frontend

From this directory, run `npm install`, then `npm run dev`.
Open http://localhost:5173.

`npm run build` type-checks TypeScript and creates production files in `dist/`.
`npm run lint` checks the source code for common mistakes.

The page loads requests from the API and submits new ones. Start PostgreSQL
and the backend first (see `../backend/README.md`). Vite forwards `/api/*`
to `http://127.0.0.1:8000/*` during development, so the browser uses one origin.
Refresh the page after submitting to see the request load from PostgreSQL.
This development proxy is not a production deployment configuration.

Each request has a status dropdown. Changes use PATCH and update the list only
after the API confirms success. While a change saves, status controls are disabled.
Failed changes show an error and retain the previous status.
The status filter works on the loaded list in React; selecting All shows every
request. A request disappears from a filtered list if its new status no longer
matches. Newly submitted requests start Open, so choose All or Open to see them.
