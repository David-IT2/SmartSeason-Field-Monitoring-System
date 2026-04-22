import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

export default function AgentFields() {
  const [fields, setFields]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/my-fields').then(r => {
      setFields(r.data)
      setLoading(false)
    })
  }, [])

  if (loading) return <Spinner />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Fields</h1>

      {fields.length === 0 ? (
        <div className="card p-12 text-center text-gray-400 text-sm">
          No fields assigned to you yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-semibold text-gray-900">{field.name}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{field.crop_type}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`badge-${field.status}`}>
                    {field.status === 'at_risk' ? 'At Risk' : field.status.charAt(0).toUpperCase() + field.status.slice(1)}
                  </span>
                  <span className="badge-stage capitalize">{field.stage}</span>
                </div>
              </div>

              <div className="text-xs text-gray-500 space-y-1 mb-4">
                <p>Planted: {field.planting_date}</p>
                <p>Days in field: {field.days_since_planting} days</p>
                {field.latest_update && (
                  <p className="text-gray-400 italic truncate">
                    Last note: {field.latest_update.notes || '—'}
                  </p>
                )}
              </div>

              <Link to={`/agent/fields/${field.id}`} className="btn-primary text-sm w-full text-center block">
                View &amp; Update
              </Link>
            </div>
          ))}
        </div>
      )}
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