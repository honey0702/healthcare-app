import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from '../../utils/toast'
import { LogoMark } from '../../components/ui'
import { Icon } from '../../components/Icons'

export default function Login() {
  const { login, loginOtp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || ''

  const [mode, setMode] = useState('password')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const homeFor = (role) => role === 'doctor' ? '/doctor' : role === 'admin' ? '/admin' : '/patient'

  const submit = (e) => {
    e.preventDefault()
    let ok
    if (mode === 'password') ok = login({ mobile, password })
    else ok = loginOtp({ mobile, otp })
    if (ok) {
      const u = JSON.parse(localStorage.getItem('mc_session'))
      navigate(from || homeFor(u?.role), { replace: true })
    }
  }

  return (
    <div className="container section" style={{ maxWidth: 480 }}>
      <div className="card anim-up" style={{ padding: 34 }}>
        <div className="flex-center mb-4"><LogoMark size={48} /></div>
        <h2 style={{ textAlign: 'center', fontSize: 24, marginBottom: 4 }}>Welcome Back</h2>
        <p className="muted" style={{ textAlign: 'center', marginBottom: 24 }}>Login to manage your appointments and health.</p>

        {/* mode toggle */}
        <div className="flex gap-2 mb-4" style={{ background: 'var(--line-soft)', padding: 5, borderRadius: 12 }}>
          {[['password', 'Password'], ['otp', 'Mobile + OTP']].map(([m, l]) => (
            <button key={m} type="button" onClick={() => { setMode(m); setOtpSent(false) }}
              className="btn btn-sm btn-block" style={mode === m ? { background: 'var(--surface)', boxShadow: 'var(--shadow-sm)', color: 'var(--brand-dark)' } : { color: 'var(--muted)' }}>
              {l}
            </button>
          ))}
        </div>

        <form onSubmit={submit}>
          <div className="field">
            <label>Mobile Number</label>
            <input placeholder="+91 98765 43210" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
          </div>

          {mode === 'password' ? (
            <div className="field">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--brand)', textAlign: 'right' }}>Forgot password?</Link>
            </div>
          ) : (
            <>
              <button type="button" className="btn btn-ghost btn-sm" style={{ marginBottom: 12 }} onClick={() => { setOtpSent(true); toast('OTP sent to your mobile (demo: 123456)', 'info') }}>
                <Icon.Send /> Send OTP
              </button>
              {otpSent && (
                <div className="field anim-in">
                  <label>Enter OTP</label>
                  <input placeholder="Demo OTP: 123456" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                </div>
              )}
            </>
          )}

          <button className="btn btn-primary btn-block btn-lg mt-3" disabled={mode === 'otp' && !otpSent}>Login</button>
        </form>

        <p className="muted" style={{ textAlign: 'center', marginTop: 20, fontSize: 14 }}>
          New to MediCare+? <Link to="/register" style={{ color: 'var(--brand)', fontWeight: 700 }}>Create an account</Link>
        </p>
      </div>

      {/* Demo accounts */}
      <div className="card card-flat mt-4" style={{ background: 'var(--brand-faint)' }}>
        <div className="muted" style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Demo accounts for testing:</div>
        <div className="grid gap-2" style={{ fontSize: 13 }}>
          <div className="flex-between"><span>👤 Patient</span><code>9700000000 / patient123</code></div>
          <div className="flex-between"><span>🩺 Doctor</span><code>9800000000 / doctor123</code></div>
          <div className="flex-between"><span>🛡️ Admin</span><code>9900000000 / admin123</code></div>
        </div>
      </div>
    </div>
  )
}
