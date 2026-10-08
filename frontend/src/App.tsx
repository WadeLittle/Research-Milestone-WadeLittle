import { useEffect, useState } from 'react'
import type { SubmitEvent } from 'react'
import { createRequest, getRequests } from './api'
import type { MaintenanceRequest, Priority } from './api'
import './App.css'

function App() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [formError, setFormError] = useState('')
  const [message, setMessage] = useState('')

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
        {loading && <p role="status">Loading requests…</p>}
        {loadError && <p className="error" role="alert">{loadError}</p>}
        {!loading && !loadError && requests.length === 0 && <p>No requests yet.</p>}
        <ul className="request-list">
          {requests.map((request) => (
            <li key={request.id}>
              <h3>#{request.id}: {request.title}</h3>
              <p>{request.property} · Unit {request.unit}</p>
              <p>Priority: {request.priority} · Status: {request.status}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App
