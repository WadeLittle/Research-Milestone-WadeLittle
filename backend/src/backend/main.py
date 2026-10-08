from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException

from backend.database import connect, initialize_database
from backend.schemas import MaintenanceRequest, RequestCreate, RequestStatus, StatusUpdate

@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_database()
    yield


app = FastAPI(title="Maintenance Request Tracker", lifespan=lifespan)


@app.get("/health")
def health() -> dict[str, str]:
    """Confirm that the API is running."""
    return {"status": "ok"}


@app.get("/requests", response_model=list[MaintenanceRequest])
def list_requests(status: RequestStatus | None = None):
    with connect() as connection:
        if status is None:
            return connection.execute(
                "SELECT * FROM maintenance_requests ORDER BY id"
            ).fetchall()
        return connection.execute(
            "SELECT * FROM maintenance_requests WHERE status = %s ORDER BY id",
            (status,),
        ).fetchall()


@app.post("/requests", response_model=MaintenanceRequest, status_code=201)
def create_request(data: RequestCreate):
    with connect() as connection:
        return connection.execute(
            """INSERT INTO maintenance_requests (property, unit, title, priority)
               VALUES (%s, %s, %s, %s) RETURNING *""",
            (data.property, data.unit, data.title, data.priority),
        ).fetchone()


@app.patch("/requests/{request_id}/status", response_model=MaintenanceRequest)
def update_status(request_id: int, data: StatusUpdate):
    with connect() as connection:
        request = connection.execute(
            "UPDATE maintenance_requests SET status = %s WHERE id = %s RETURNING *",
            (data.status, request_id),
        ).fetchone()
    if request is None:
        raise HTTPException(status_code=404, detail="Maintenance request not found")
    return request
