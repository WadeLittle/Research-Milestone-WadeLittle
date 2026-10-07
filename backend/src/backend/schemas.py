from typing import Annotated, Literal

from pydantic import BaseModel, StringConstraints

Priority = Literal["Low", "Medium", "High"]
RequestStatus = Literal["Open", "In Progress", "Completed"]
RequiredText = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=1, max_length=200)
]


class RequestCreate(BaseModel):
    property: RequiredText
    unit: RequiredText
    title: RequiredText
    priority: Priority


class MaintenanceRequest(RequestCreate):
    id: int
    status: RequestStatus = "Open"


class StatusUpdate(BaseModel):
    status: RequestStatus
