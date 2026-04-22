import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function AgentDashboard() {
  const { user }              = useAuth()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard').then(r => {
      setData(r.data)
      setLoading(false)
    })
  }, [])

  if (loading) return <Spinner />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
        <p className="text-gray-500 text-sm mt-1">Here is an overview of your assigned fields.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Fields" value={data.total_fields}                      color="blue"  />
        <StatCard label="Active"       value={data.status_breakdown?.active    || 0}  color="green" />
        <StatCard label="At Risk"      value={data.status_breakdown?.at_risk   || 0}  color="red"   />
        <StatCard label="Completed"    value={data.status_breakdown?.completed || 0}  color="gray"  />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.needs_attention?.length > 0 && (
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Needs Attention</h2>
            <div className="space-y-3">
              {data.needs_attention.map((field) => (
                <div key={field.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{field.name}</p>
                    <p className="text-xs text-gray-500">{field.crop_type} · {field.days_since_planting} days · {field.stage}</p>
                  </div>
                  <Link to={`/agent/fields/${field.id}`} className="btn-secondary text-xs">View</Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.ready_to_harvest?.length > 0 && (
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Ready to Harvest</h2>
            <div className="space-y-3">
              {data.ready_to_harvest.map((field) => (
                <div key={field.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{field.name}</p>
                    <p className="text-xs text-gray-500">{field.crop_type}</p>
                  </div>
                  <Link to={`/agent/fields/${field.id}`} className="btn-secondary text-xs">Update</Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Stage Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['planted', 'growing', 'ready', 'harvested'].map((stage) => (
            <div key={stage} className="text-center bg-gray-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-gray-800">{data.stage_breakdown?.[stage] || 0}</p>
              <p className="text-xs text-gray-500 capitalize mt-1">{stage}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  const colors = {
    blue:  'text-blue-700',
    green: 'text-green-700',
    red:   'text-red-700',
    gray:  'text-gray-700',
  }
  return (
    <div className="card p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${colors[color]}`}>{value}</p>
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