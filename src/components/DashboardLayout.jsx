import { useState } from 'react'
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogoMark } from './ui'
import { Icon } from './Icons'

export default function DashboardLayout({ menu }) {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="dash-layout">
      <div className={`sidebar-overlay ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <LogoMark />
          <span>MediCare+</span>
        </div>

        <div style={{ padding: '6px 22px 12px', color: '#94a3b8', fontSize: 13 }}>
          Signed in as <strong style={{ color: '#e2e8f0' }}>{user?.name}</strong>
        </div>

        {menu.map((group) => (
          <div key={group.label}>
            <div className="sidebar-group-label">{group.label}</div>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <span style={{ opacity: .9 }}>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}

        <div className="sidebar-foot">
          <Link to="/" className="sidebar-back"><Icon.Home /> Back to website</Link>
          <button
            className="sidebar-back"
            onClick={() => { logout(); navigate('/') }}
          >
            <Icon.Logout /> Logout
          </button>
        </div>
      </aside>

      <main className="dash-main">
        <div className="flex-between" style={{ marginBottom: 20 }}>
          <button className="btn btn-outline btn-sm sidebar-toggle" onClick={() => setOpen(true)}>
            <Icon.Menu /> Menu
          </button>
          <span className="badge badge-brand">{user?.role === 'admin' ? 'Admin' : user?.role === 'doctor' ? 'Doctor' : 'Patient'} Panel</span>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
