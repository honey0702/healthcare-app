import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../utils/db'
import { Rating } from '../../components/ui'
import { Icon } from '../../components/Icons'

export default function Hospitals() {
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('All')
  const hospitals = db.getHospitals()
  const cities = ['All', ...new Set(hospitals.map((h) => h.city))]

  const filtered = useMemo(() => {
    return hospitals.filter((h) => {
      const q = query.toLowerCase()
      const matchQ = h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q) || h.area.toLowerCase().includes(q)
      const matchCity = city === 'All' || h.city === city
      return matchQ && matchCity
    })
  }, [hospitals, query, city])

  return (
    <div className="container section">
      <div className="anim-up" style={{ textAlign: 'center', marginBottom: 34 }}>
        <span className="tag mb-2">🏥 Hospitals</span>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 10 }}>Hospitals Near You</h1>
        <p className="muted" style={{ maxWidth: 560, margin: '0 auto' }}>Compare hospitals by rating, capacity and specialities.</p>
      </div>

      <div className="card" style={{ marginBottom: 26 }}>
        <div className="grid grid-2">
          <div className="search-bar">
            <Icon.Search style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
            <input placeholder="Search by hospital name, city or area…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ paddingLeft: 46 }} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              {cities.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-2 stagger">
        {filtered.map((h) => (
          <div key={h.id} className="card">
            <div className="flex gap-4">
              <div className="stat-icon" style={{ width: 64, height: 64, background: 'var(--brand-faint)', fontSize: 30 }}>{h.image}</div>
              <div style={{ flex: 1 }}>
                <div className="flex-between"><h3 style={{ fontSize: 17 }}>{h.name}</h3><Rating value={h.rating} /></div>
                <div className="flex gap-2 wrap" style={{ margin: '6px 0', fontSize: 13 }}>
                  <span className="badge badge-gray"><Icon.MapPin /> {h.area}, {h.city}</span>
                  <span className="badge badge-gray"><Icon.Bed /> {h.beds} beds</span>
                </div>
                <div className="flex gap-2 wrap" style={{ marginBottom: 12 }}>
                  {h.specialities.map((s) => <span key={s} className="tag">{s}</span>)}
                </div>
                <div className="flex gap-2 wrap">
                  <Link to={`/hospital/${h.id}`} className="btn btn-primary btn-sm">View Details</Link>
                  <Link to="/rooms" className="btn btn-ghost btn-sm">Check Rooms</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty card" style={{ boxShadow: 'none' }}>
          <div className="empty-icon">🏥</div><h3>No hospitals found</h3><p>Try a different search.</p>
        </div>
      )}
    </div>
  )
}
