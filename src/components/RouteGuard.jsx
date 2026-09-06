import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function RequireAuth({ children, roles = [] }) {
  const { user, loading } = useAuth()
  const loc = useLocation()
  if (loading) return <div className="flex-center" style={{ minHeight: '60vh' }}>Loading…</div>
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />
  if (roles.length && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

export function RedirectIfAuthed({ children }) {
  const { user } = useAuth()
  if (!user) return children
  const home = user.role === 'doctor' ? '/doctor' : user.role === 'admin' ? '/admin' : '/patient'
  return <Navigate to={home} replace />
}
