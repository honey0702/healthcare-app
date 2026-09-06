import { useState } from 'react'
import { db } from '../../utils/db'
import { toast } from '../../utils/toast'
import { PageHeader, EmptyState, Modal } from '../../components/ui'
import { Icon } from '../../components/Icons'

const blank = { hospitalId: '', type: 'General Ward', price: 1000, available: 1, total: 5, amenities: '' }

export default function AdminRooms() {
  const hospitals = db.getHospitals()
  const [rooms, setRooms] = useState(db.getRooms())
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blank)

  const openAdd = () => { setEditing(null); setForm({ ...blank, hospitalId: hospitals[0]?.id || '' }); setModal(true) }
  const openEdit = (r) => { setEditing(r); setForm({ ...r, amenities: r.amenities.join(', ') }); setModal(true) }

  const save = (e) => {
    e.preventDefault()
    const payload = { ...form, amenities: form.amenities.split(',').map((a) => a.trim()).filter(Boolean) }
    let list
    if (editing) { list = rooms.map((r) => r.id === editing.id ? { ...r, ...payload } : r); toast('Room updated') }
    else { list = [...rooms, { ...payload, id: db.id('r') }]; toast('Room added') }
    setRooms(list); db.saveRooms(list); setModal(false)
  }

  const toggleAvail = (id) => {
    const list = rooms.map((r) => r.id === id ? { ...r, available: r.available === 0 ? r.total : r.available - (r.available > 0 ? 1 : 0) } : r)
    setRooms(list); db.saveRooms(list)
  }

  const del = (id) => {
    const list = rooms.filter((r) => r.id !== id)
    setRooms(list); db.saveRooms(list); toast('Room deleted', 'info')
  }

  return (
    <div>
      <PageHeader title="Room Management" sub="Manage all rooms and live availability."
        actions={<button className="btn btn-primary btn-sm" onClick={openAdd}><Icon.Plus /> Add Room</button>} />

      {rooms.length === 0 ? <EmptyState icon="🛏️" title="No rooms" /> : (
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>Type</th><th>Hospital</th><th>Price/day</th><th>Availability</th><th>Actions</th></tr></thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.id}>
                  <td><strong style={{ color: 'var(--ink)' }}>{r.type}</strong></td>
                  <td>{hospitals.find((h) => h.id === r.hospitalId)?.name || '—'}</td>
                  <td style={{ fontWeight: 700 }}>₹{r.price.toLocaleString('en-IN')}</td>
                  <td><span className={`badge ${r.available > 0 ? 'badge-green' : 'badge-red'}`}>{r.available}/{r.total} available</span></td>
                  <td><div className="flex gap-2">
                    <button className="btn btn-ghost btn-sm" onClick={() => toggleAvail(r.id)}>Toggle</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(r)}><Icon.Edit /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => del(r.id)}><Icon.Trash /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Room' : 'Add Room'}>
        <form onSubmit={save}>
          <div className="field"><label>Hospital</label>
            <select value={form.hospitalId} onChange={(e) => setForm({ ...form, hospitalId: e.target.value })}>
              {hospitals.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </div>
          <div className="field"><label>Room Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{['General Ward','Semi-Private','Private Room','ICU / HDU'].map((t) => <option key={t}>{t}</option>)}</select>
          </div>
          <div className="grid grid-2">
            <div className="field"><label>Price (₹/day)</label><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
            <div className="field"><label>Total Rooms</label><input type="number" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} /></div>
            <div className="field"><label>Available</label><input type="number" value={form.available} onChange={(e) => setForm({ ...form, available: e.target.value })} /></div>
          </div>
          <div className="field"><label>Amenities (comma separated)</label><input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} /></div>
          <div className="flex gap-2">
            <button className="btn btn-primary btn-sm">{editing ? 'Save Changes' : 'Add Room'}</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setModal(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
