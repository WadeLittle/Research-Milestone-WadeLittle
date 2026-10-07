from fastapi import FastAPI

app = FastAPI(title="Maintenance Request Tracker")


@app.get("/health")
def health() -> dict[str, str]:
    """Confirm that the API is running."""
    return {"status": "ok"}
