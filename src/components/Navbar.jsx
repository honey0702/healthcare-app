import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Logo } from './ui'
import { Icon } from './Icons'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const roleHome = user?.role === 'doctor' ? '/doctor' : user?.role === 'admin' ? '/admin' : user?.role === 'patient' ? '/patient' : '/'

  const links = [
    { to: '/', label: 'Home' },
    { to: '/doctors', label: 'Find Doctors' },
    { to: '/hospitals', label: 'Hospitals' },
    { to: '/rooms', label: 'Rooms' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/about', label: 'About Us' },
  ]

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/"><Logo /></Link>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className={({ isActive }) => (isActive && l.to !== '/' ? 'active' : '')} end={l.to === '/'}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-cta">
          {user ? (
            <>
              <button className="btn btn-outline btn-sm" onClick={() => { logout(); navigate('/') }}>Logout</button>
              <Link to={roleHome} className="btn btn-primary btn-sm">Dashboard</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
          <button className="btn btn-outline nav-burger" onClick={() => setOpen((o) => !o)}>
            <Icon.Menu />
          </button>
        </div>
      </div>
    </header>
  )
}
