import { useState } from 'react'
import { db } from '../../utils/db'
import { toast } from '../../utils/toast'
import { PageHeader, EmptyState, Modal } from '../../components/ui'
import { Icon } from '../../components/Icons'

const blank = { title: '', type: 'Video', duration: '', category: 'Fitness' }

export default function AdminWellness() {
  const [wellness, setWellness] = useState(db.getWellness())
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(blank)

  const save = (e) => {
    e.preventDefault()
    if (!form.title) { toast('Enter a title', 'error'); return }
    const list = [...wellness, { ...form, id: db.id('w') }]
    setWellness(list); db.saveWellness(list); toast('Content added'); setModal(false); setForm(blank)
  }

  const del = (id) => {
    const list = wellness.filter((w) => w.id !== id)
    setWellness(list); db.saveWellness(list); toast('Content removed', 'info')
  }

  return (
    <div>
      <PageHeader title="Wellness Content" sub="Add, edit or delete wellness videos and articles."
        actions={<button className="btn btn-primary btn-sm" onClick={() => setModal(true)}><Icon.Plus /> Add Content</button>} />

      {wellness.length === 0 ? <EmptyState icon="📚" title="No content" /> : (
        <div className="grid grid-3 stagger">
          {wellness.map((w) => (
            <div key={w.id} className="card">
              <div className="stat-icon mb-3" style={{ background: 'var(--brand-faint)', color: 'var(--brand)' }}>{w.type === 'Video' ? <Icon.Video /> : <Icon.Book />}</div>
              <h3 style={{ fontSize: 17, marginBottom: 8 }}>{w.title}</h3>
              <div className="flex gap-2 wrap" style={{ marginBottom: 12 }}>
                <span className="badge badge-brand">{w.category}</span>
                <span className="badge badge-gray">{w.duration || w.read || ''}</span>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-danger btn-sm" onClick={() => del(w.id)}><Icon.Trash /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Add Wellness Content">
        <form onSubmit={save}>
          <div className="field"><label>Title *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
          <div className="grid grid-2">
            <div className="field"><label>Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>Video</option><option>Article</option></select></div>
            <div className="field"><label>{form.type === 'Video' ? 'Duration' : 'Read time'}</label><input placeholder={form.type === 'Video' ? 'e.g. 15 min' : 'e.g. 5 min'} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></div>
          </div>
          <div className="field"><label>Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{['Fitness','Nutrition','Mental Health','Education'].map((c) => <option key={c}>{c}</option>)}</select></div>
          <div className="flex gap-2">
            <button className="btn btn-primary btn-sm">Add Content</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setModal(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
