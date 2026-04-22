import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'

import AdminDashboard from './pages/admin/Dashboard'
import AdminFields    from './pages/admin/Fields'
import AdminAgents    from './pages/admin/Agents'
import FieldDetail    from './pages/admin/FieldDetail'

import AgentDashboard   from './pages/agent/Dashboard'
import AgentFields      from './pages/agent/Fields'
import AgentFieldDetail from './pages/agent/FieldDetail'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/admin" element={<ProtectedRoute role="admin"><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
          <Route path="/admin/fields" element={<ProtectedRoute role="admin"><Layout><AdminFields /></Layout></ProtectedRoute>} />
          <Route path="/admin/fields/:id" element={<ProtectedRoute role="admin"><Layout><FieldDetail /></Layout></ProtectedRoute>} />
          <Route path="/admin/agents" element={<ProtectedRoute role="admin"><Layout><AdminAgents /></Layout></ProtectedRoute>} />

          <Route path="/agent" element={<ProtectedRoute role="agent"><Layout><AgentDashboard /></Layout></ProtectedRoute>} />
          <Route path="/agent/fields" element={<ProtectedRoute role="agent"><Layout><AgentFields /></Layout></ProtectedRoute>} />
          <Route path="/agent/fields/:id" element={<ProtectedRoute role="agent"><Layout><AgentFieldDetail /></Layout></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
