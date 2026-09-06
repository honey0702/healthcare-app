import { useMemo, useState } from 'react'
import { db } from '../../utils/db'
import { Icon } from '../../components/Icons'

export default function Rooms() {
  const rooms = db.getRooms()
  const hospitals = db.getHospitals()
  const [hospitalId, setHospitalId] = useState('all')
  const [type, setType] = useState('all')

  const types = ['all', ...new Set(rooms.map((r) => r.type))]
  const hospitalName = (id) => hospitals.find((h) => h.id === id)?.name || ''

  const filtered = useMemo(() => rooms.filter((r) =>
    (hospitalId === 'all' || r.hospitalId === hospitalId) &&
    (type === 'all' || r.type === type)
  ), [rooms, hospitalId, type])

  return (
    <div className="container section">
      <div className="anim-up" style={{ textAlign: 'center', marginBottom: 34 }}>
        <span className="tag mb-2">🛏️ Room Availability</span>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 10 }}>Check Room Availability & Price</h1>
        <p className="muted" style={{ maxWidth: 560, margin: '0 auto' }}>Live availability and transparent pricing for every room type.</p>
      </div>

      <div className="card" style={{ marginBottom: 26 }}>
        <div className="grid grid-2">
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Hospital</label>
            <select value={hospitalId} onChange={(e) => setHospitalId(e.target.value)}>
              <option value="all">All Hospitals</option>
              {hospitals.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Room Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {types.map((t) => <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-3 stagger">
        {filtered.map((r) => (
          <div key={r.id} className="card">
            <div className="flex-between mb-2">
              <h3 style={{ fontSize: 17 }}>{r.type}</h3>
              <span className={`badge ${r.available > 0 ? 'badge-green' : 'badge-red'}`}>
                {r.available > 0 ? `${r.available} available` : 'Fully booked'}
              </span>
            </div>
            <div className="muted" style={{ fontSize: 14, marginBottom: 12 }}>{hospitalName(r.hospitalId)}</div>
            <div className="flex gap-2 wrap" style={{ marginBottom: 14 }}>
              {r.amenities.map((a) => <span key={a} className="tag" style={{ fontSize: 12 }}>{a}</span>)}
            </div>
            <div className="flex-between">
              <div>
                <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)' }}>₹{r.price}</span>
                <span className="muted" style={{ fontSize: 12 }}> / day</span>
              </div>
              <div className="bar" style={{ width: 90 }}><span style={{ width: `${(r.available / r.total) * 100}%` }} /></div>
            </div>
            <button className="btn btn-primary btn-sm btn-block mt-3" disabled={r.available === 0}>Reserve Room</button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty card" style={{ boxShadow: 'none' }}><div className="empty-icon">🛏️</div><h3>No rooms found</h3><p>Try a different filter.</p></div>
      )}
    </div>
  )
}
