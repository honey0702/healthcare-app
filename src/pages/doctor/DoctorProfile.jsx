import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../utils/db'
import { PageHeader } from '../../components/ui'
import { Icon } from '../../components/Icons'

export default function DoctorProfile() {
  const { user, updateUser } = useAuth()
  const doctor = db.getDoctors().find((d) => d.id === user?.doctorId)
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState({ ...user, hospitalId: doctor?.hospitalId || '' })

  const save = (e) => {
    e.preventDefault()
    updateUser(form)
    if (form.hospitalId) {
      db.saveDoctors(db.getDoctors().map((d) => d.id === user?.doctorId ? { ...d, hospitalId: form.hospitalId, speciality: form.speciality } : d))
    }
    setEdit(false)
  }

  return (
    <div>
      <PageHeader title="My Profile" sub="Your professional details." />
      <div className="grid" style={{ gridTemplateColumns: '1fr 1.6fr', gap: 22 }}>
        <div className="card" style={{ textAlign: 'center', alignSelf: 'start' }}>
          <div className="avatar" style={{ width: 90, height: 90, fontSize: 34, margin: '0 auto 14px' }}>🩺</div>
          <h3 style={{ fontSize: 20 }}>{user?.name}</h3>
          <div className="muted" style={{ fontSize: 14 }}>{user?.speciality}</div>
          <div className="flex-center gap-2 mt-3">
            <span className="badge badge-green">● Verified</span>
            <span className="badge badge-brand">Doctor</span>
          </div>
          <div className="divider" />
          <button className="btn btn-outline btn-sm btn-block" onClick={() => setEdit(true)}><Icon.Edit /> Edit</button>
        </div>

        {!edit ? (
          <div className="card">
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>Professional Information</h3>
            <div className="grid grid-2">
              {[
                ['Full Name', user?.name], ['Email', user?.email || '—'], ['Mobile', '+91 ' + user?.mobile],
                ['Degree', user?.degree || '—'], ['College', user?.college || '—'], ['Experience', (user?.experience || '—') + ' years'],
                ['Speciality', user?.speciality || '—'], ['Status', 'Approved & Active'],
              ].map(([k, v]) => (
                <div key={k}><div className="muted" style={{ fontSize: 12 }}>{k}</div><div style={{ fontWeight: 600, color: 'var(--ink)' }}>{v}</div></div>
              ))}
            </div>
          </div>
        ) : (
          <form className="card" onSubmit={save}>
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>Edit Details</h3>
            <div className="grid grid-2">
              <div className="field"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="field"><label>Speciality</label><input value={form.speciality} onChange={(e) => setForm({ ...form, speciality: e.target.value })} /></div>
              <div className="field"><label>Degree</label><input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} /></div>
              <div className="field"><label>College</label><input value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} /></div>
              <div className="field"><label>Experience (years)</label><input type="number" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} /></div>
              <div className="field"><label>Email</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary btn-sm">Save</button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => { setEdit(false); setForm(user) }}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
