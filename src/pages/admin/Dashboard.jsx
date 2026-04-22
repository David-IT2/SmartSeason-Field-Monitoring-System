import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

export default function AdminDashboard() {
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
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Fields"  value={data.total_fields}                    color="blue"   />
        <StatCard label="Total Agents"  value={data.total_agents}                    color="purple" />
        <StatCard label="Unassigned"    value={data.unassigned_fields}               color="yellow" />
        <StatCard label="At Risk"       value={data.status_breakdown?.at_risk || 0}  color="red"    />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Status Breakdown</h2>
          <div className="space-y-3">
            {[
              { key: 'active',    label: 'Active',    color: 'bg-green-500' },
              { key: 'at_risk',   label: 'At Risk',   color: 'bg-red-500'   },
              { key: 'completed', label: 'Completed', color: 'bg-gray-400'  },
            ].map(({ key, label, color }) => {
              const count = data.status_breakdown?.[key] || 0
              const pct   = data.total_fields ? Math.round((count / data.total_fields) * 100) : 0
              return (
                <div key={key}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{label}</span>
                    <span>{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Stage Breakdown</h2>
          <div className="space-y-2">
            {['planted', 'growing', 'ready', 'harvested'].map((stage) => (
              <div key={stage} className="flex justify-between items-center">
                <span className="text-sm capitalize text-gray-600">{stage}</span>
                <span className="badge-stage">{data.stage_breakdown?.[stage] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {data.at_risk_fields?.length > 0 && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">At Risk Fields</h2>
          <div className="space-y-3">
            {data.at_risk_fields.map((field) => (
              <div key={field.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{field.name}</p>
                  <p className="text-xs text-gray-500">
                    {field.crop_type} · {field.days_since_planting} days since planting · Stage: {field.stage}
                  </p>
                  <p className="text-xs text-gray-400">
                    Agent: {field.agent?.name || 'Unassigned'}
                  </p>
                </div>
                <Link to={`/admin/fields/${field.id}`} className="btn-secondary text-xs">
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color }) {
  const colors = {
    blue:   'text-blue-700',
    purple: 'text-purple-700',
    yellow: 'text-yellow-700',
    red:    'text-red-700',
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
