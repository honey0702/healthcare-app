import { useState } from 'react'
import { db } from '../../utils/db'
import { useAuth } from '../../context/AuthContext'
import { toast } from '../../utils/toast'
import { PageHeader, EmptyState } from '../../components/ui'
import { Icon } from '../../components/Icons'

const catIcon = { Blood: '🩸', 'X-Ray': '🩻', MRI: '🧠', ECG: '❤️', Report: '📄' }

export default function Reports() {
  const { user } = useAuth()
  const [reports, setReports] = useState(db.getReports().filter((r) => r.patientId === user?.id))
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'Report', date: '', notes: '' })

  const addReport = (e) => {
    e.preventDefault()
    if (!form.title) { toast('Enter a report title', 'error'); return }
    const r = { id: db.id('r'), patientId: user.id, ...form, fileName: form.title + '.pdf', size: (Math.random() * 3 + 0.4).toFixed(1) + ' MB', date: form.date || new Date().toISOString().slice(0, 10) }
    const list = [...reports, r]
    setReports(list); db.saveReports([...db.getReports(), r])
    toast('Report uploaded')
    setAdding(false); setForm({ title: '', category: 'Report', date: '', notes: '' })
  }

  return (
    <div>
      <PageHeader title="Medical Reports" sub="All your health records in one secure place."
        actions={<button className="btn btn-primary btn-sm" onClick={() => setAdding(true)}><Icon.Plus /> Upload Report</button>} />

      {adding && (
        <form className="card mb-4 anim-in" onSubmit={addReport}>
          <h3 style={{ fontSize: 18, marginBottom: 14 }}>Upload New Report</h3>
          <div className="grid grid-2">
            <div className="field"><label>Report Title *</label><input placeholder="e.g. Blood Test Report" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="field"><label>Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{Object.keys(catIcon).map((c) => <option key={c}>{c}</option>)}</select></div>
            <div className="field"><label>Report Date</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div className="field"><label>Notes</label><input placeholder="Any doctor notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary btn-sm">Save Report</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </form>
      )}

      {reports.length === 0 ? (
        <EmptyState icon="📋" title="No reports yet" desc="Upload your medical reports to keep them handy.">
          <button className="btn btn-primary btn-sm" onClick={() => setAdding(true)}>Upload Your First Report</button>
        </EmptyState>
      ) : (
        <div className="grid grid-3 stagger">
          {reports.map((r) => (
            <div key={r.id} className="card flex gap-3" style={{ alignItems: 'center' }}>
              <span className="stat-icon" style={{ background: 'var(--red-soft)' }}>{catIcon[r.category]}</span>
              <div style={{ flex: 1 }}>
                <strong style={{ color: 'var(--ink)' }}>{r.title}</strong>
                <div className="muted" style={{ fontSize: 13 }}>{r.category} · {r.date}</div>
                <div className="muted" style={{ fontSize: 12 }}>{r.fileName} · {r.size}</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => toast('Report downloaded (demo)', 'info')}><Icon.File /> View</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
