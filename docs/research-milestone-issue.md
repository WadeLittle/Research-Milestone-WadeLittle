# Research Milestone: WadeLittle

Paste the title above into a new Issue in the **team repository** and use the
body below. Replace every bracketed placeholder before submitting. This file
is a draft; it does not create the GitHub Issue.

---

## Individual research sample

- Research repository: https://github.com/WadeLittle/Research-Milestone-WadeLittle
- Demo video: [INSERT ACCESSIBLE VIDEO LINK OR ATTACH VIDEO]

I built a Maintenance Request Tracker for our student-housing property-management
project using React, TypeScript, Vite, Python, FastAPI, REST, and PostgreSQL.
The frontend uses npm and the backend uses uv.

The app lists requests, accepts property/unit/title/priority input, updates status
between Open, In Progress, and Completed, and filters by status. PostgreSQL
persists requests and their status across restarts.

The repository contains separate commits for project setup, API endpoints,
PostgreSQL integration, the frontend form/list, status/filter controls, and
documentation. The README explains installation, package management, technology
choices, alternatives, and deployment considerations.

React state drives the interactive UI; TypeScript describes the request data.
FastAPI validates input and generates API docs. PostgreSQL provides persistent
relational storage, and direct SQL keeps the small sample understandable.
The main tradeoffs are two language toolchains, a separate database service,
and the need to add authentication and migrations for a larger project.

I verified the app locally. It is not deployed publicly. I plan to discuss these
findings and alternatives with my team before finalizing our project stack.

@instructors [INSERT TA @HANDLES]
