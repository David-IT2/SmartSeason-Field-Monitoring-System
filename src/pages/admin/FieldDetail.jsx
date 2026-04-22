import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function FieldDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const [field, setField]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/fields/${id}`).then(r => {
      setField(r.data)
      setLoading(false)
    })
  }, [id])

  if (loading) return <Spinner />
  if (!field)  return <p className="text-gray-500">Field not found.</p>

  return (
    <div className="space-y-6 max-w-2xl">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700">
        ← Back
      </button>

      <div className="card p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{field.name}</h1>
            <p className="text-gray-500 text-sm mt-1">{field.crop_type}</p>
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
          <div>
            <p className="text-gray-400 text-xs">Assigned Agent</p>
            <p className="font-medium">{field.agent?.name || 'Unassigned'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Created By</p>
            <p className="font-medium">{field.creator?.name}</p>
          </div>
        </div>
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
                  <span className="text-xs text-gray-400">by {u.updated_by}</span>
                  <span className="text-xs text-gray-400">
                    · {new Date(u.created_at).toLocaleDateString()}
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