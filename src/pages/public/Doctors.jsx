import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { db } from '../../utils/db'
import { useAuth } from '../../context/AuthContext'
import { Rating } from '../../components/ui'
import { Icon } from '../../components/Icons'

export default function Doctors() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('All')
  const [spec, setSpec] = useState('All')
  const [onlyAvailable, setOnlyAvailable] = useState(false)

  const doctors = db.getDoctors()
  const hospitals = db.getHospitals()

  const specialities = ['All', ...new Set(doctors.map((d) => d.speciality))]
  const cities = ['All', ...new Set(doctors.map((d) => d.city))]

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      const q = query.toLowerCase()
      const matchQ = d.name.toLowerCase().includes(q) || d.speciality.toLowerCase().includes(q) || (hospitals.find((h) => h.id === d.hospitalId)?.name || '').toLowerCase().includes(q)
      const matchCity = city === 'All' || d.city === city
      const matchSpec = spec === 'All' || d.speciality === spec
      const matchAvail = !onlyAvailable || d.available
      return matchQ && matchCity && matchSpec && matchAvail
    })
  }, [doctors, query, city, spec, onlyAvailable])

  const hospitalName = (id) => hospitals.find((h) => h.id === id)?.name || 'Hospital'

  const book = (d) => {
    if (!user) { navigate('/login', { state: { from: '/doctors' } }); return }
    navigate('/patient/book', { state: { doctor: d } })
  }

  return (
    <div className="container section">
      <div className="anim-up" style={{ textAlign: 'center', marginBottom: 34 }}>
        <span className="tag mb-2">🩺 Find Your Doctor</span>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 10 }}>Search Doctors</h1>
        <p className="muted" style={{ maxWidth: 560, margin: '0 auto' }}>Find specialists by name, location or speciality and book instantly.</p>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 26 }}>
        <div className="search-bar" style={{ marginBottom: 14 }}>
          <Icon.Search style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input placeholder="Search by doctor, speciality or hospital…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ paddingLeft: 46 }} />
        </div>
        <div className="grid grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))' }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>City</label>
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              {cities.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Speciality</label>
            <select value={spec} onChange={(e) => setSpec(e.target.value)}>
              {specialities.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0, justifyContent: 'flex-end' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 24 }}>
              <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} style={{ width: 16, height: 16 }} />
              Available now only
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-3 stagger">
        {filtered.map((d) => (
          <div key={d.id} className="card">
            <div className="flex-between mb-3">
              <span className="avatar avatar-lg">{d.image}</span>
              <span className={`badge ${d.available ? 'badge-green' : 'badge-red'}`}>{d.available ? '● Available' : '● Unavailable'}</span>
            </div>
            <h3 style={{ fontSize: 17 }}>{d.name}</h3>
            <div className="muted" style={{ fontSize: 14 }}>{d.speciality} · {d.experience} yrs exp</div>
            <Rating value={d.rating} />
            <div className="flex gap-2 wrap mt-2" style={{ fontSize: 13 }}>
              <span className="badge badge-gray"><Icon.MapPin /> {d.city}</span>
              <span className="badge badge-gray">{hospitalName(d.hospitalId)}</span>
            </div>
            <div className="flex-between mt-3">
              <div>
                <div style={{ fontWeight: 800, color: 'var(--ink)' }}>₹{d.fee}</div>
                <div className="muted" style={{ fontSize: 12 }}>Consultation fee</div>
              </div>
              <button className={`btn btn-sm ${d.available ? 'btn-primary' : 'btn-outline'}`} disabled={!d.available} onClick={() => book(d)}>
                <Icon.CalendarPlus /> Book
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty card" style={{ boxShadow: 'none', marginTop: 10 }}>
          <div className="empty-icon">🔍</div>
          <h3>No doctors found</h3>
          <p>Try adjusting your search filters.</p>
        </div>
      )}
    </div>
  )
}
