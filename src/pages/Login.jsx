import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login }               = useAuth()
  const navigate                = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      navigate(user.role === 'admin' ? '/admin' : '/agent', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (role) => {
    if (role === 'admin') { setEmail('admin@smartseason.com'); setPassword('password') }
    else                  { setEmail('jane@smartseason.com');  setPassword('password') }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">SmartSeason</h1>
          <p className="text-sm text-gray-500 mt-1">Field Monitoring System</p>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Sign in</h2>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 font-medium mb-2">Quick fill demo credentials</p>
            <div className="flex gap-2">
              <button onClick={() => fillDemo('admin')} className="btn-secondary text-xs flex-1">
                Admin
              </button>
              <button onClick={() => fillDemo('agent')} className="btn-secondary text-xs flex-1">
                Agent
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Password: <span className="font-mono">password</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
