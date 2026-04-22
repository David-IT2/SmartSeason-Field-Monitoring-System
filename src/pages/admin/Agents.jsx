import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function AdminAgents() {
  const [agents, setAgents]   = useState([])
  const [fields, setFields]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/agents'), api.get('/fields')]).then(([a, f]) => {
      setAgents(a.data)
      setFields(f.data)
      setLoading(false)
    })
  }, [])

  if (loading) return <Spinner />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Agents</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => {
          const agentFields  = fields.filter(f => f.agent?.id === agent.id)
          const atRisk       = agentFields.filter(f => f.status === 'at_risk').length
          const completed    = agentFields.filter(f => f.status === 'completed').length
          const active       = agentFields.filter(f => f.status === 'active').length

          return (
            <div key={agent.id} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-semibold text-gray-900">{agent.name}</p>
                  <p className="text-xs text-gray-500">{agent.email}</p>
                </div>
                <span className="badge-stage">{agentFields.length} fields</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-green-50 rounded-lg p-2">
                  <p className="text-lg font-bold text-green-700">{active}</p>
                  <p className="text-green-600">Active</p>
                </div>
                <div className="bg-red-50 rounded-lg p-2">
                  <p className="text-lg font-bold text-red-700">{atRisk}</p>
                  <p className="text-red-600">At Risk</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-lg font-bold text-gray-700">{completed}</p>
                  <p className="text-gray-600">Done</p>
                </div>
              </div>

              {agentFields.length > 0 && (
                <div className="mt-4 space-y-1">
                  {agentFields.map(f => (
                    <div key={f.id} className="flex justify-between items-center text-xs py-1 border-b border-gray-50 last:border-0">
                      <span className="text-gray-700">{f.name} — {f.crop_type}</span>
                      <span className={`badge-${f.status}`}>
                        {f.status === 'at_risk' ? 'At Risk' : f.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
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