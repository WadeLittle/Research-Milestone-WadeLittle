from fastapi import FastAPI, HTTPException

from backend.schemas import MaintenanceRequest, RequestCreate, RequestStatus, StatusUpdate

app = FastAPI(title="Maintenance Request Tracker")

# Temporary storage: restarting the server clears these requests.
requests: dict[int, MaintenanceRequest] = {}
next_id = 1


@app.get("/health")
def health() -> dict[str, str]:
    """Confirm that the API is running."""
    return {"status": "ok"}


@app.get("/requests", response_model=list[MaintenanceRequest])
async def list_requests(status: RequestStatus | None = None):
    return [
        request for request in requests.values()
        if status is None or request.status == status
    ]


@app.post("/requests", response_model=MaintenanceRequest, status_code=201)
async def create_request(data: RequestCreate):
    global next_id
    request = MaintenanceRequest(id=next_id, **data.model_dump())
    requests[request.id] = request
    next_id += 1
    return request


@app.patch("/requests/{request_id}/status", response_model=MaintenanceRequest)
async def update_status(request_id: int, data: StatusUpdate):
    if request_id not in requests:
        raise HTTPException(status_code=404, detail="Maintenance request not found")
    request = requests[request_id]
    request.status = data.status
    return request
