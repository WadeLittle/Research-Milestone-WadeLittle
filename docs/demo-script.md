# Research milestone demo: 1–2 minutes

## Before recording

- Start PostgreSQL, FastAPI, and Vite using the README.
- Open the tracker and prepare the GitHub repo and `/docs` in separate tabs.
- Use sample property information and avoid showing credentials or unrelated tabs.

## Script and screen actions

**0:00–0:15 — Show the tracker.**
“I'm Wade Little. This is my individual research sample for our student-housing
property-management project. It tracks maintenance requests using React,
TypeScript, Vite, FastAPI, a REST API, and PostgreSQL.”

**0:15–0:40 — Fill the form and submit.**
“I'll enter Campus Commons, unit 204, a leaking sink, and High priority.
Submitting sends JSON to the API. The backend validates the fields and saves the
request in PostgreSQL. It appears here with an Open status.”

**0:40–1:05 — Change status and filter.**
“I can move the request to In Progress and then Completed. These changes use
PATCH requests. The filter shows only the selected status. Choosing All brings
back the full list.”

**1:05–1:20 — Refresh, then show API docs.**
“Refreshing keeps the request and its status because the data is in PostgreSQL.
FastAPI also generates this interactive documentation, where I can inspect and
try the endpoints.”

**1:20–1:45 — Show the repo and README.**
“npm manages frontend dependencies, while uv manages Python dependencies and the
backend environment. Both lockfiles are committed. React helps organize the
interactive UI, FastAPI supplies validation and API docs, and PostgreSQL fits
relational data. The tradeoff is managing two toolchains and a database server.
I built this in separate commits and documented setup and alternatives.”

## Final checklist

- Show submission, the list, both status changes, filtering, and persistence.
- Keep the recording between one and two minutes.
- Check that the video link works for instructors and TAs.
- Put the video and personal repo links in the team Issue and mention @instructors
  plus the correct TA handles.
