import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

const STAGES = ['planted', 'growing', 'ready', 'harvested']

export default function AdminFields() {
  const [fields, setFields]   = useState([])
  const [agents, setAgents]   = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editField, setEditField] = useState(null)
  const [form, setForm] = useState({
    name: '', crop_type: '', planting_date: '', stage: 'planted', assigned_to: ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const fetchAll = async () => {
    const [f, a] = await Promise.all([api.get('/fields'), api.get('/agents')])
    setFields(f.data)
    setAgents(a.data)
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const openCreate = () => {
    setEditField(null)
    setForm({ name: '', crop_type: '', planting_date: '', stage: 'planted', assigned_to: '' })
    setError('')
    setShowForm(true)
  }

  const openEdit = (field) => {
    setEditField(field)
    setForm({
      name:          field.name,
      crop_type:     field.crop_type,
      planting_date: field.planting_date,
      stage:         field.stage,
      assigned_to:   field.agent?.id || '',
    })
    setError('')
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, assigned_to: form.assigned_to || null }
      if (editField) {
        await api.put(`/fields/${editField.id}`, payload)
      } else {
        await api.post('/fields', payload)
      }
      setShowForm(false)
      fetchAll()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this field?')) return
    await api.delete(`/fields/${id}`)
    fetchAll()
  }

  if (loading) return <Spinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Fields</h1>
        <button onClick={openCreate} className="btn-primary">+ New Field</button>
      </div>

      {/* Modal */}<span className="text-4xl">🌱</span>
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editField ? 'Edit Field' : 'New Field'}
            </h2>
            {error && (
              <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Field Name</label>
                <input className="input" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="label">Crop Type</label>
                <input className="input" value={form.crop_type}
                  onChange={e => setForm({ ...form, crop_type: e.target.value })} required />
              </div>
              <div>
                <label className="label">Planting Date</label>
                <input type="date" className="input" value={form.planting_date}
                  onChange={e => setForm({ ...form, planting_date: e.target.value })} required />
              </div>
              <div>
                <label className="label">Stage</label>
                <select className="input" value={form.stage}
                  onChange={e => setForm({ ...form, stage: e.target.value })}>
                  {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Assign to Agent</label>
                <select className="input" value={form.assigned_to}
                  onChange={e => setForm({ ...form, assigned_to: e.target.value })}>
                  <option value="">— Unassigned —</option>
                  {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1" disabled={saving}>
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button type="button" className="btn-secondary flex-1"
                  onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fields table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Name', 'Crop', 'Stage', 'Status', 'Agent', 'Days', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {fields.map((field) => (
              <tr key={field.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{field.name}</td>
                <td className="px-4 py-3 text-gray-600">{field.crop_type}</td>
                <td className="px-4 py-3">
                  <span className="badge-stage capitalize">{field.stage}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge-${field.status}`}>
                    {field.status === 'at_risk' ? 'At Risk' : field.status.charAt(0).toUpperCase() + field.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{field.agent?.name || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{field.days_since_planting}d</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link to={`/admin/fields/${field.id}`} className="text-xs text-brand-600 hover:underline">
                      View
                    </Link>
                    <button onClick={() => openEdit(field)} className="text-xs text-blue-600 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(field.id)} className="text-xs text-red-600 hover:underline">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {fields.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No fields yet.</div>
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