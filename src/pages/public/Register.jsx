import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from '../../utils/toast'
import { LogoMark } from '../../components/ui'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('patient')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', mobile: '', email: '', password: '', confirm: '', gender: 'Male', bloodGroup: '', birthdate: '', address: '', degree: '', college: '', experience: '', speciality: '' })

  const set = (key) => (e) => setForm((current) => ({ ...current, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast('Passwords do not match', 'error'); return }
    if (form.password.length < 8) { toast('Password must be at least 8 characters', 'error'); return }

    const payload = {
      name: form.name,
      mobile: form.mobile,
      email: form.email,
      password: form.password,
      role,
      ...(role === 'patient' ? {
        gender: form.gender,
        blood_group: form.bloodGroup,
        birthdate: form.birthdate || null,
        address: form.address,
      } : {
        degree: form.degree,
        college: form.college,
        experience: form.experience ? Number(form.experience) : null,
        speciality: form.speciality,
      }),
    }

    setSubmitting(true)
    const registeredUser = await register(payload)
    setSubmitting(false)
    if (registeredUser) {
      if (role === 'doctor') {
        toast('Registration submitted. Awaiting admin approval.')
        navigate('/login')
      } else {
        navigate('/patient')
      }
    }
  }

  return (
    <div className="container section" style={{ maxWidth: 620 }}>
      <div className="card anim-up" style={{ padding: 34 }}>
        <div className="flex-center mb-4"><LogoMark size={48} /></div>
        <h2 style={{ textAlign: 'center', fontSize: 24, marginBottom: 4 }}>Create Your Account</h2>
        <p className="muted" style={{ textAlign: 'center', marginBottom: 24 }}>Register as a patient or a doctor.</p>

        <div className="flex gap-2 mb-4" style={{ background: 'var(--line-soft)', padding: 5, borderRadius: 12 }}>
          {[['patient', '👤 Patient'], ['doctor', '🩺 Doctor']].map(([itemRole, label]) => (
            <button key={itemRole} type="button" onClick={() => setRole(itemRole)}
              className="btn btn-sm btn-block" style={role === itemRole ? { background: 'var(--surface)', boxShadow: 'var(--shadow-sm)', color: 'var(--brand-dark)' } : { color: 'var(--muted)' }}>
              {label}
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
            <div className="field"><label>Password *</label><input type="password" placeholder="At least 8 characters" value={form.password} onChange={set('password')} required /></div>
            <div className="field"><label>Confirm Password *</label><input type="password" placeholder="Re-enter password" value={form.confirm} onChange={set('confirm')} required /></div>
          </div>

          {role === 'patient' && (
            <div className="anim-in">
              <div className="grid grid-2">
                <div className="field"><label>Gender</label><select value={form.gender} onChange={set('gender')}><option>Male</option><option>Female</option><option>Other</option></select></div>
                <div className="field"><label>Blood Group</label><select value={form.bloodGroup} onChange={set('bloodGroup')}><option value="">Select</option>{['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((bloodGroup) => <option key={bloodGroup}>{bloodGroup}</option>)}</select></div>
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
                <div className="field"><label>Years of Experience *</label><input type="number" min="0" placeholder="e.g. 10" value={form.experience} onChange={set('experience')} required /></div>
                <div className="field"><label>Speciality *</label><input placeholder="e.g. Cardiologist" value={form.speciality} onChange={set('speciality')} required /></div>
              </div>
            </div>
          )}

          <div className="divider" />
          <button className="btn btn-primary btn-block btn-lg" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="muted" style={{ textAlign: 'center', marginTop: 18, fontSize: 14 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--brand)', fontWeight: 700 }}>Login</Link>
        </p>
      </div>
    </div>
  )
}
