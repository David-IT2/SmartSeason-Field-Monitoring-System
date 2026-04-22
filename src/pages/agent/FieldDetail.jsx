import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const STAGES = ['planted', 'growing', 'ready', 'harvested']

export default function AgentFieldDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [field, setField]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm]       = useState({ stage: '', notes: '' })
  const [saving, setSaving]   = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError]     = useState('')

  const fetchField = () => {
    api.get(`/fields/${id}`).then(r => {
      setField(r.data)
      setForm({ stage: r.data.stage, notes: '' })
      setLoading(false)
    })
  }

  useEffect(() => { fetchField() }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await api.post(`/fields/${id}/updates`, form)
      setSuccess('Field updated successfully.')
      fetchField()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />
  if (!field)  return <p className="text-gray-500">Field not found.</p>

  return (
    <div className="space-y-6 max-w-2xl">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700">
        ← Back
      </button>

      {/* Field info */}
      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{field.name}</h1>
            <p className="text-gray-500 text-sm">{field.crop_type}</p>
          </div>
          <div className="flex gap-2">
            <span className={`badge-${field.status}`}>
              {field.status === 'at_risk' ? 'At Risk' : field.status.charAt(0).toUpperCase() + field.status.slice(1)}
            </span>
            <span className="badge-stage capitalize">{field.stage}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs">Planting Date</p>
            <p className="font-medium">{field.planting_date}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Days Since Planting</p>
            <p className="font-medium">{field.days_since_planting} days</p>
          </div>
        </div>
      </div>

      {/* Update form */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Post an Update</h2>

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-2 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Stage</label>
            <select className="input" value={form.stage}
              onChange={e => setForm({ ...form, stage: e.target.value })}>
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Notes / Observations</label>
            <textarea
              className="input"
              rows={4}
              placeholder="Describe what you observed in the field…"
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={saving}>
            {saving ? 'Saving…' : 'Submit Update'}
          </button>
        </form>
      </div>

      {/* Update history */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Update History</h2>
        {field.updates?.length === 0 ? (
          <p className="text-sm text-gray-400">No updates yet.</p>
        ) : (
          <div className="space-y-4">
            {field.updates.map((u) => (
              <div key={u.id} className="border-l-2 border-brand-300 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge-stage capitalize">{u.stage}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(u.created_at).toLocaleDateString()}
                  </span>
                </div>
                {u.notes && <p className="text-sm text-gray-600">{u.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
    </div>
  )
}