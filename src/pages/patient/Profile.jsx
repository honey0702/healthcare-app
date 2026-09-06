import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from '../../utils/toast'
import { PageHeader } from '../../components/ui'
import { Icon } from '../../components/Icons'

export default function Profile() {
  const { user, updateUser, deleteAccount } = useAuth()
  const navigate = useNavigate()
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState(user)

  const save = (e) => {
    e.preventDefault()
    updateUser(form)
    setEdit(false)
  }

  const del = () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      deleteAccount(); navigate('/')
    }
  }

  return (
    <div>
      <PageHeader title="My Profile" sub="Your personal information and account details." />
      <div className="grid" style={{ gridTemplateColumns: '1fr 1.6fr', gap: 22 }}>
        <div className="card" style={{ textAlign: 'center', alignSelf: 'start' }}>
          <div className="avatar" style={{ width: 90, height: 90, fontSize: 34, margin: '0 auto 14px' }}>{user?.name?.[0]}</div>
          <h3 style={{ fontSize: 20 }}>{user?.name}</h3>
          <div className="muted" style={{ fontSize: 14 }}>+91 {user?.mobile}</div>
          <div className="flex-center gap-2 mt-3">
            <span className="badge badge-green">● Active</span>
            <span className="badge badge-brand">Patient</span>
          </div>
          <div className="divider" />
          <button className="btn btn-outline btn-sm btn-block" onClick={() => setEdit(true)}><Icon.Edit /> Edit Profile</button>
          <button className="btn btn-danger btn-sm btn-block mt-2" onClick={del}><Icon.Trash /> Delete Account</button>
          <button className="btn btn-ghost btn-sm btn-block mt-2" onClick={() => { toast('Logout', 'info'); navigate('/') }}><Icon.Logout /> Logout</button>
        </div>

        {!edit ? (
          <div className="card">
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>Personal Information</h3>
            <div className="grid grid-2">
              {[
                ['Full Name', user?.name], ['Email', user?.email || '—'], ['Mobile', '+91 ' + user?.mobile],
                ['Gender', user?.gender || '—'], ['Blood Group', user?.bloodGroup || '—'], ['Birthdate', user?.birthdate || '—'],
                ['Address', user?.address || '—'], ['Member Since', '2026'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="muted" style={{ fontSize: 12 }}>{k}</div>
                  <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form className="card" onSubmit={save}>
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>Edit Profile</h3>
            <div className="grid grid-2">
              <div className="field"><label>Full Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="field"><label>Email</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="field"><label>Gender</label><select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}><option>Male</option><option>Female</option><option>Other</option></select></div>
              <div className="field"><label>Blood Group</label><select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}>{['','A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b}>{b}</option>)}</select></div>
              <div className="field"><label>Birthdate</label><input type="date" value={form.birthdate} onChange={(e) => setForm({ ...form, birthdate: e.target.value })} /></div>
              <div className="field"><label>Address</label><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary btn-sm">Save Changes</button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => { setEdit(false); setForm(user) }}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
