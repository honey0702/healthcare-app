import { useParams, Link, useNavigate } from 'react-router-dom'
import { db } from '../../utils/db'
import { useAuth } from '../../context/AuthContext'
import { Rating } from '../../components/ui'
import { Icon } from '../../components/Icons'

export default function HospitalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const hospital = db.getHospitals().find((h) => h.id === id)
  const doctors = db.getDoctors().filter((d) => d.hospitalId === id)
  const rooms = db.getRooms().filter((r) => r.hospitalId === id)

  if (!hospital) return <div className="container section"><h2>Hospital not found</h2><Link to="/hospitals" className="btn btn-primary mt-3">Back</Link></div>

  const bookDoctor = (d) => {
    if (!user) { navigate('/login', { state: { from: `/hospital/${id}` } }); return }
    navigate('/patient/book', { state: { doctor: d } })
  }

  return (
    <div className="container section">
      <Link to="/hospitals" className="btn btn-ghost btn-sm mb-4"><Icon.Arrow style={{ transform: 'rotate(180deg)' }} /> Back to Hospitals</Link>

      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 26 }}>
        <div style={{ background: 'var(--grad-brand)', padding: '30px', color: '#fff' }}>
          <div className="flex gap-4" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 64 }}>{hospital.image}</span>
            <div style={{ flex: 1, minWidth: 220 }}>
              <h1 style={{ color: '#fff', fontSize: 26 }}>{hospital.name}</h1>
              <div style={{ color: '#f0fdfa' }}><Icon.MapPin style={{ verticalAlign: 'middle' }} /> {hospital.area}, {hospital.city}</div>
              <Rating value={hospital.rating} />
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="badge" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }}><Icon.Bed /> {hospital.beds} beds</div>
              <div style={{ fontSize: 14, color: '#f0fdfa', marginTop: 8 }}>{hospital.phone}</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '30px' }}>
          <h3 className="mb-3" style={{ fontSize: 19 }}>Specialities</h3>
          <div className="flex gap-2 wrap" style={{ marginBottom: 26 }}>
            {hospital.specialities.map((s) => <span key={s} className="tag" style={{ fontSize: 14 }}>{s}</span>)}
          </div>

          <div className="grid grid-2" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
            <div>
              <h3 className="mb-3" style={{ fontSize: 19 }}>Doctors at this hospital</h3>
              <div className="grid gap-3">
                {doctors.map((d) => (
                  <div key={d.id} className="card card-flat flex-between wrap" style={{ gap: 12 }}>
                    <div className="flex gap-3">
                      <span className="avatar avatar-lg">{d.image}</span>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--ink)' }}>{d.name}</div>
                        <div className="muted" style={{ fontSize: 13 }}>{d.speciality} · {d.experience} yrs · ₹{d.fee}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/doctor/${d.id}`} className="btn btn-ghost btn-sm">Profile</Link>
                      <button className={`btn btn-sm ${d.available ? 'btn-primary' : 'btn-outline'}`} disabled={!d.available} onClick={() => bookDoctor(d)}>Book</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-3" style={{ fontSize: 19 }}>Rooms & Pricing</h3>
              <div className="grid gap-3">
                {rooms.map((r) => (
                  <div key={r.id} className="card card-flat">
                    <div className="flex-between"><strong style={{ color: 'var(--ink)' }}>{r.type}</strong><span className="badge badge-gray">₹{r.price}/day</span></div>
                    <div className="muted" style={{ fontSize: 13, marginTop: 6 }}><span className={`badge ${r.available > 0 ? 'badge-green' : 'badge-red'}`}>{r.available > 0 ? `${r.available} available` : 'Full'}</span> of {r.total} rooms</div>
                  </div>
                ))}
              </div>
              <Link to="/rooms" className="btn btn-outline btn-sm btn-block mt-3">View All Rooms</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
