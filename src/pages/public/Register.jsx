import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from '../../utils/toast'
import { LogoMark } from '../../components/ui'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('patient')
  const [form, setForm] = useState({ name: '', mobile: '', email: '', password: '', confirm: '', gender: 'Male', bloodGroup: '', birthdate: '', address: '', degree: '', college: '', experience: '', speciality: '' })
  const [sent, setSent] = useState(false)
  const [otp, setOtp] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast('Passwords do not match', 'error'); return }
    if (!sent) { toast('OTP sent to your mobile (demo: 123456)', 'info'); setSent(true); return }
    if (otp !== '123456') { toast('Invalid OTP', 'error'); return }
    const payload = { name: form.name, mobile: form.mobile, email: form.email, password: form.password, role }
    if (role === 'patient') Object.assign(payload, { gender: form.gender, bloodGroup: form.bloodGroup, birthdate: form.birthdate, address: form.address, status: 'approved' })
    else Object.assign(payload, { degree: form.degree, college: form.college, experience: form.experience, speciality: form.speciality, status: 'pending' })
    const u = register(payload)
    if (u) {
      if (role === 'doctor') { toast('Registration submitted. Awaiting admin approval.'); navigate('/login') }
      else navigate('/patient')
    }
  }

  return (
    <div className="container section" style={{ maxWidth: 620 }}>
      <div className="card anim-up" style={{ padding: 34 }}>
        <div className="flex-center mb-4"><LogoMark size={48} /></div>
        <h2 style={{ textAlign: 'center', fontSize: 24, marginBottom: 4 }}>Create Your Account</h2>
        <p className="muted" style={{ textAlign: 'center', marginBottom: 24 }}>Register as a patient or a doctor.</p>

        {/* role toggle */}
        <div className="flex gap-2 mb-4" style={{ background: 'var(--line-soft)', padding: 5, borderRadius: 12 }}>
          {[['patient', '👤 Patient'], ['doctor', '🩺 Doctor']].map(([r, l]) => (
            <button key={r} type="button" onClick={() => setRole(r)}
              className="btn btn-sm btn-block" style={role === r ? { background: 'var(--surface)', boxShadow: 'var(--shadow-sm)', color: 'var(--brand-dark)' } : { color: 'var(--muted)' }}>
              {l}
            </button>
          ))}
        </div>

        <form onSubmit={submit}>
          <div className="grid grid-2">
            <div className="field"><label>Full Name *</label><input placeholder="Your full name" value={form.name} onChange={set('name')} required /></div>
            <div className="field"><label>Mobile Number *</label><input placeholder="+91 98765 43210" value={form.mobile} onChange={set('mobile')} required /></div>
          </div>
          <div className="field"><label>Email Address</label><input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} /></div>
          <div className="grid grid-2">
            <div className="field"><label>Password *</label><input type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required /></div>
            <div className="field"><label>Confirm Password *</label><input type="password" placeholder="Re-enter password" value={form.confirm} onChange={set('confirm')} required /></div>
          </div>

          {role === 'patient' && (
            <div className="anim-in">
              <div className="grid grid-2">
                <div className="field"><label>Gender</label><select value={form.gender} onChange={set('gender')}><option>Male</option><option>Female</option><option>Other</option></select></div>
                <div className="field"><label>Blood Group</label><select value={form.bloodGroup} onChange={set('bloodGroup')}><option value="">Select</option>{['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b}>{b}</option>)}</select></div>
              </div>
              <div className="field"><label>Date of Birth</label><input type="date" value={form.birthdate} onChange={set('birthdate')} /></div>
              <div className="field"><label>Address</label><textarea placeholder="Full address" value={form.address} onChange={set('address')} rows={2} /></div>
            </div>
          )}

          {role === 'doctor' && (
            <div className="anim-in">
              <p className="alert alert-info" style={{ fontSize: 13 }}>Doctor accounts are sent for verification. You can log in only after the admin approves your registration.</p>
              <div className="grid grid-2">
                <div className="field"><label>Degree *</label><input placeholder="e.g. MBBS, MD" value={form.degree} onChange={set('degree')} required /></div>
                <div className="field"><label>College / University *</label><input placeholder="e.g. AIIMS Delhi" value={form.college} onChange={set('college')} required /></div>
                <div className="field"><label>Years of Experience *</label><input type="number" placeholder="e.g. 10" value={form.experience} onChange={set('experience')} required /></div>
                <div className="field"><label>Speciality *</label><input placeholder="e.g. Cardiologist" value={form.speciality} onChange={set('speciality')} required /></div>
              </div>
            </div>
          )}

          <div className="divider" />
          {!sent ? (
            <button className="btn btn-primary btn-block btn-lg">Verify Mobile (Send OTP)</button>
          ) : (
            <div className="field anim-in">
              <label>Enter OTP sent to your mobile</label>
              <input placeholder="Demo OTP: 123456" value={otp} onChange={(e) => setOtp(e.target.value)} />
              <button className="btn btn-primary btn-block btn-lg mt-2">Complete Registration</button>
            </div>
          )}
        </form>

        <p className="muted" style={{ textAlign: 'center', marginTop: 18, fontSize: 14 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--brand)', fontWeight: 700 }}>Login</Link>
        </p>
      </div>
    </div>
  )
}
