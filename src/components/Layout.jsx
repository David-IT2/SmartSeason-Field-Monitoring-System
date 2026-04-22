import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const adminLinks = [
  { to: '/admin',        label: 'Dashboard' },
  { to: '/admin/fields', label: 'Fields'    },
  { to: '/admin/agents', label: 'Agents'    },
]

const agentLinks = [
  { to: '/agent',        label: 'Dashboard' },
  { to: '/agent/fields', label: 'My Fields' },
]
export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()
  const links            = user?.role === 'admin' ? adminLinks : agentLinks

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-white flex flex-col fixed inset-y-0 left-0">
        <div className="px-5 py-5 border-b border-gray-700">
          <span className="text-brand-400 font-bold text-lg tracking-tight">
  SmartSeason
</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin' || link.to === '/agent'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 truncate">{user?.name}</p>
          <p className="text-xs text-gray-500 capitalize mb-3">{user?.role}</p>
          <button
            onClick={handleLogout}
            className="w-full text-left text-xs text-gray-400 hover:text-red-400 transition-colors"
          >
            → Sign out
          </button>
        </div>
      </aside>

      {/* Main content offset by sidebar width */}
      <main className="flex-1 ml-56 overflow-auto">
        <div className="p-6 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}