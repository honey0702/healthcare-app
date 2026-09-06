import { useState } from 'react'
import { db } from '../../utils/db'
import { useAuth } from '../../context/AuthContext'
import { toast } from '../../utils/toast'
import { PageHeader, EmptyState } from '../../components/ui'
import { Icon } from '../../components/Icons'

export default function DoctorReports() {
  const { user } = useAuth()
  const patients = db.getUsers().filter((u) => u.role === 'patient')
  const [patientId, setPatientId] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Report')
  const [notes, setNotes] = useState('')
  const [reports, setReports] = useState(db.getReports())

  const upload = (e) => {
    e.preventDefault()
    if (!patientId) { toast('Select a patient', 'error'); return }
    if (!title) { toast('Enter report title', 'error'); return }
    const r = { id: db.id('r'), patientId, doctorId: user?.doctorId, doctorName: user?.name, title, category, notes, date: new Date().toISOString().slice(0, 10), fileName: title + '.pdf', size: (Math.random() * 3 + 0.4).toFixed(1) + ' MB' }
    const list = [...reports, r]
    setReports(list); db.saveReports(list)
    const pat = patients.find((p) => p.id === patientId)
    db.saveNotifications([...db.getNotifications(), { id: db.id('n'), userId: patientId, title: 'New medical report', read: false, message: `Dr. ${user?.name} uploaded "${title}" for you.`, date: r.date }])
    toast(`Report uploaded for ${pat?.name}`)
    setPatientId(''); setTitle(''); setNotes('')
  }

  return (
    <div>
      <PageHeader title="Upload Reports" sub="Share medical reports with your patients." />
      <div className="grid" style={{ gridTemplateColumns: '1fr 1.5fr', gap: 22 }}>
        <form className="card" onSubmit={upload}>
          <h3 style={{ fontSize: 18, marginBottom: 14 }}>New Report</h3>
          <div className="field"><label>Patient</label>
            <select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
              <option value="">— Select patient —</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.name} (+91 {p.mobile})</option>)}
            </select>
          </div>
          <div className="field"><label>Report Title *</label><input placeholder="e.g. Blood Test Results" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
          <div className="field"><label>Category</label><select value={category} onChange={(e) => setCategory(e.target.value)}>{['Report','Blood','X-Ray','MRI','ECG'].map((c) => <option key={c}>{c}</option>)}</select></div>
          <div className="field"><label>Notes</label><textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Doctor's notes…" /></div>
          <button className="btn btn-primary btn-block">Upload Report</button>
        </form>

        <div>
          <h3 style={{ fontSize: 18, marginBottom: 14 }}>Recently Uploaded ({reports.filter((r) => r.doctorId === user?.doctorId).length})</h3>
          {reports.filter((r) => r.doctorId === user?.doctorId).length === 0 ? (
            <EmptyState icon="📋" title="No uploads yet" desc="Reports you upload to patients appear here." />
          ) : (
            <div className="grid gap-2">
              {reports.filter((r) => r.doctorId === user?.doctorId).map((r) => (
                <div key={r.id} className="card card-flat flex-between wrap" style={{ gap: 10 }}>
                  <div className="flex gap-3"><span className="stat-icon" style={{ width: 40, height: 40, fontSize: 18, background: 'var(--red-soft)' }}>📄</span>
                    <div><strong style={{ color: 'var(--ink)' }}>{r.title}</strong><div className="muted" style={{ fontSize: 12 }}>{patients.find((p) => p.id === r.patientId)?.name || 'Patient'} · {r.date}</div></div></div>
                  <span className="badge badge-green"><Icon.Check /> Uploaded</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
