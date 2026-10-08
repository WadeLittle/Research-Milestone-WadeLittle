import { useEffect, useState } from 'react'
import type { SubmitEvent } from 'react'
import { createRequest, getRequests, updateRequestStatus } from './api'
import type { MaintenanceRequest, Priority, RequestStatus } from './api'
import './App.css'

function App() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [formError, setFormError] = useState('')
  const [message, setMessage] = useState('')
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'All'>('All')
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [statusError, setStatusError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const visibleRequests = requests.filter(
    (request) => statusFilter === 'All' || request.status === statusFilter,
  )

  useEffect(() => {
    const controller = new AbortController()
    getRequests(controller.signal)
      .then(setRequests)
      .catch(() => {
        if (!controller.signal.aborted) {
          setLoadError('Could not load requests. Check the backend and refresh the page.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [])

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const fields = new FormData(form)
    const data = {
      property: String(fields.get('property')).trim(),
      unit: String(fields.get('unit')).trim(),
      title: String(fields.get('title')).trim(),
      priority: String(fields.get('priority')) as Priority,
    }
    setFormError('')
    setMessage('')
    if (!data.property || !data.unit || !data.title) {
      setFormError('Property, unit, and title must contain text.')
      return
    }
    setSaving(true)
    try {
      const created = await createRequest(data)
      setRequests((current) => [...current, created])
      form.reset()
      setMessage(`Request #${created.id} submitted.`)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Could not submit request.')
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusChange(id: number, status: RequestStatus) {
    setUpdatingId(id)
    setStatusError('')
    setStatusMessage('')
    try {
      const updated = await updateRequestStatus(id, status)
      setRequests((current) => current.map((request) => (
        request.id === id ? updated : request
      )))
      setStatusMessage(`Request #${id} changed to ${updated.status}.`)
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : 'Could not update status.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <main>
      <h1>Maintenance Request Tracker</h1>
      <p>Submit and track maintenance for student housing.</p>

      <section aria-labelledby="form-heading">
        <h2 id="form-heading">New request</h2>
        <form onSubmit={handleSubmit}>
          <fieldset disabled={saving || loading || Boolean(loadError)}>
            <legend>Request details</legend>
            <label htmlFor="property">Property</label>
            <input id="property" name="property" required maxLength={200} />
            <label htmlFor="unit">Unit</label>
            <input id="unit" name="unit" required maxLength={200} />
            <label htmlFor="title">Title</label>
            <input id="title" name="title" required maxLength={200} />
            <label htmlFor="priority">Priority</label>
            <select id="priority" name="priority" defaultValue="Medium">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <button type="submit">{saving ? 'Submitting…' : 'Submit request'}</button>
          </fieldset>
        </form>
        {formError && <p className="error" role="alert">{formError}</p>}
        <p role="status">{message}</p>
      </section>

      <section aria-labelledby="list-heading" aria-busy={loading}>
        <h2 id="list-heading">Maintenance requests</h2>
        <label htmlFor="status-filter">Filter by status </label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as RequestStatus | 'All')}
        >
          <option>All</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        {loading && <p role="status">Loading requests…</p>}
        {loadError && <p className="error" role="alert">{loadError}</p>}
        {statusError && <p className="error" role="alert">{statusError}</p>}
        <p role="status">{statusMessage}</p>
        {!loading && !loadError && visibleRequests.length === 0 && (
          <p>{requests.length === 0 ? 'No requests yet.' : 'No requests match this status.'}</p>
        )}
        <ul className="request-list">
          {visibleRequests.map((request) => (
            <li key={request.id}>
              <h3>#{request.id}: {request.title}</h3>
              <p>{request.property} · Unit {request.unit}</p>
              <p>Priority: {request.priority} · Status: {request.status}</p>
              <label htmlFor={`status-${request.id}`}>Change status </label>
              <select
                id={`status-${request.id}`}
                value={request.status}
                disabled={updatingId !== null}
                onChange={(event) => handleStatusChange(
                  request.id, event.target.value as RequestStatus,
                )}
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
              {updatingId === request.id && <span role="status"> Saving…</span>}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App
