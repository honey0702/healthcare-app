import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LogoMark } from '../../components/ui'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || ''

  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const homeFor = (role) => role === 'doctor' ? '/doctor' : role === 'admin' ? '/admin' : '/patient'

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const loggedInUser = await login({ mobile, password })
    setSubmitting(false)
    if (loggedInUser) navigate(from || homeFor(loggedInUser.role), { replace: true })
  }

  return (
    <div className="container section" style={{ maxWidth: 480 }}>
      <div className="card anim-up" style={{ padding: 34 }}>
        <div className="flex-center mb-4"><LogoMark size={48} /></div>
        <h2 style={{ textAlign: 'center', fontSize: 24, marginBottom: 4 }}>Welcome Back</h2>
        <p className="muted" style={{ textAlign: 'center', marginBottom: 24 }}>Login to manage your appointments and health.</p>

        <form onSubmit={submit}>
          <div className="field">
            <label>Mobile Number</label>
            <input placeholder="+91 98765 43210" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--brand)', textAlign: 'right' }}>Forgot password?</Link>
          </div>
          <button className="btn btn-primary btn-block btn-lg mt-3" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p className="muted" style={{ textAlign: 'center', marginTop: 20, fontSize: 14 }}>
          New to MediCare+? <Link to="/register" style={{ color: 'var(--brand)', fontWeight: 700 }}>Create an account</Link>
        </p>
      </div>

      <div className="card card-flat mt-4" style={{ background: 'var(--brand-faint)' }}>
        <div className="muted" style={{ fontSize: 13, lineHeight: 1.6 }}>
          Authentication is handled by the Django API. Use the Swagger documentation at <code>/api/docs/</code> to explore the available endpoints.
        </div>
      </div>
    </div>
  )
}
