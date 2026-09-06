import { useState } from 'react'
import { db } from '../../utils/db'
import { toast } from '../../utils/toast'
import { PageHeader, EmptyState, Modal } from '../../components/ui'
import { Icon } from '../../components/Icons'

const blank = { name: '', city: '', area: '', beds: 50, rating: 4.0, phone: '', specialities: '', image: '🏥' }

export default function AdminHospitals() {
  const [hospitals, setHospitals] = useState(db.getHospitals())
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blank)

  const openAdd = () => { setEditing(null); setForm(blank); setModal(true) }
  const openEdit = (h) => { setEditing(h); setForm({ ...h, specialities: h.specialities.join(', ') }); setModal(true) }

  const save = (e) => {
    e.preventDefault()
    const payload = { ...form, specialities: form.specialities.split(',').map((s) => s.trim()).filter(Boolean) }
    let list
    if (editing) { list = hospitals.map((h) => h.id === editing.id ? { ...h, ...payload } : h); toast('Hospital updated') }
    else { list = [...hospitals, { ...payload, id: db.id('h') }]; toast('Hospital added') }
    setHospitals(list); db.saveHospitals(list); setModal(false)
  }

  const del = (id) => {
    if (!window.confirm('Delete this hospital?')) return
    const list = hospitals.filter((h) => h.id !== id)
    setHospitals(list); db.saveHospitals(list); toast('Hospital deleted', 'info')
  }

  return (
    <div>
      <PageHeader title="Hospital Management" sub="Add, edit or remove hospitals."
        actions={<button className="btn btn-primary btn-sm" onClick={openAdd}><Icon.Plus /> Add Hospital</button>} />

      {hospitals.length === 0 ? <EmptyState icon="🏥" title="No hospitals" desc="Add your first hospital." /> : (
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>Hospital</th><th>Location</th><th>Beds</th><th>Rating</th><th>Specialities</th><th>Actions</th></tr></thead>
            <tbody>
              {hospitals.map((h) => (
                <tr key={h.id}>
                  <td><strong style={{ color: 'var(--ink)' }}>{h.image} {h.name}</strong><div className="muted" style={{ fontSize: 12 }}>{h.phone}</div></td>
                  <td>{h.area}, {h.city}</td>
                  <td>{h.beds}</td>
                  <td>★ {h.rating}</td>
                  <td>{h.specialities.slice(0, 2).join(', ')}{h.specialities.length > 2 ? ' +' + (h.specialities.length - 2) : ''}</td>
                  <td><div className="flex gap-2">
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(h)}><Icon.Edit /> Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => del(h.id)}><Icon.Trash /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Hospital' : 'Add Hospital'}>
        <form onSubmit={save}>
          <div className="grid grid-2">
            <div className="field" style={{ gridColumn: '1/-1' }}><label>Hospital Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="field"><label>City</label><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required /></div>
            <div className="field"><label>Area</label><input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} /></div>
            <div className="field"><label>Beds</label><input type="number" value={form.beds} onChange={(e) => setForm({ ...form, beds: e.target.value })} /></div>
            <div className="field"><label>Rating</label><input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></div>
            <div className="field" style={{ gridColumn: '1/-1' }}><label>Specialities (comma separated)</label><input value={form.specialities} onChange={(e) => setForm({ ...form, specialities: e.target.value })} placeholder="Cardiology, Orthopedics" /></div>
            <div className="field"><label>Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          </div>
          <div className="flex gap-2 mt-2">
            <button className="btn btn-primary btn-sm">{editing ? 'Save Changes' : 'Add Hospital'}</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setModal(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
