export type Priority = 'Low' | 'Medium' | 'High'
export type RequestStatus = 'Open' | 'In Progress' | 'Completed'

export interface RequestCreate {
  property: string
  unit: string
  title: string
  priority: Priority
}

export interface MaintenanceRequest extends RequestCreate {
  id: number
  status: RequestStatus
}

async function readResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). Check your input and backend.`)
  }
  return response.json() as Promise<T>
}

export async function getRequests(signal?: AbortSignal): Promise<MaintenanceRequest[]> {
  return readResponse(await fetch('/api/requests', { signal }))
}

export async function createRequest(data: RequestCreate): Promise<MaintenanceRequest> {
  return readResponse(await fetch('/api/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }))
}

export async function updateRequestStatus(
  id: number,
  status: RequestStatus,
): Promise<MaintenanceRequest> {
  return readResponse(await fetch(`/api/requests/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  }))
}
