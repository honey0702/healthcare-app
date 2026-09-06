import { useParams, useNavigate, Link } from 'react-router-dom'
import { db } from '../../utils/db'
import { useAuth } from '../../context/AuthContext'
import { Rating } from '../../components/ui'
import { Icon } from '../../components/Icons'

export default function DoctorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const doctor = db.getDoctors().find((d) => d.id === id)
  const hospitals = db.getHospitals()
  const reviews = db.getReviews().filter((r) => r.doctorId === id)

  if (!doctor) return <div className="container section"><h2>Doctor not found</h2><Link to="/doctors" className="btn btn-primary mt-3">Back to Doctors</Link></div>

  const hospital = hospitals.find((h) => h.id === doctor.hospitalId)

  const book = () => {
    if (!user) { navigate('/login', { state: { from: `/doctor/${id}` } }); return }
    navigate('/patient/book', { state: { doctor } })
  }

  return (
    <div className="container section">
      <Link to="/doctors" className="btn btn-ghost btn-sm mb-4"><Icon.Arrow style={{ transform: 'rotate(180deg)' }} /> Back to Doctors</Link>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ background: 'var(--grad-brand)', padding: '30px', color: '#fff' }}>
          <div className="flex gap-4" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 72 }}>{doctor.image}</span>
            <div style={{ flex: 1, minWidth: 220 }}>
              <h1 style={{ color: '#fff', fontSize: 28 }}>{doctor.name}</h1>
              <div style={{ color: '#f0fdfa' }}>{doctor.speciality} · {doctor.experience} years experience</div>
              <Rating value={doctor.rating} />
            </div>
            <div>
              <div className="badge" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }}>{doctor.available ? '● Available' : '● Unavailable'}</div>
              <div style={{ fontSize: 24, fontWeight: 800, marginTop: 10 }}>₹{doctor.fee}</div>
              <div style={{ fontSize: 13, color: '#f0fdfa' }}>Consultation fee</div>
              <button className="btn btn-dark btn-lg mt-2" disabled={!doctor.available} onClick={book}><Icon.CalendarPlus /> Book Appointment</button>
            </div>
          </div>
        </div>

        <div style={{ padding: '30px' }}>
          <div className="grid grid-2" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
            <div>
              <h3 className="mb-3" style={{ fontSize: 19 }}>About</h3>
              <p style={{ marginBottom: 20 }}>Dr. {doctor.name.split(' ')[1]} is an experienced {doctor.speciality.toLowerCase()} practicing in {doctor.city} with {doctor.experience} years of clinical experience. Known for a patient-first approach, clear communication and reliable care.</p>

              <h3 className="mb-3" style={{ fontSize: 19 }}>Qualifications</h3>
              <ul style={{ listStyle: 'none', display: 'grid', gap: 8, marginBottom: 20 }}>
                <li className="flex gap-2"><Icon.BadgeCheck style={{ color: 'var(--brand)' }} /> {doctor.degree}</li>
                <li className="flex gap-2"><Icon.Building style={{ color: 'var(--brand)' }} /> {doctor.college}</li>
                <li className="flex gap-2"><Icon.Clock style={{ color: 'var(--brand)' }} /> {doctor.experience} years of experience</li>
                {hospital && <li className="flex gap-2"><Icon.Hospital style={{ color: 'var(--brand)' }} /> Practicing at {hospital.name}</li>}
              </ul>
            </div>

            <div>
              <div className="card" style={{ background: 'var(--brand-faint)', boxShadow: 'none' }}>
                <h4 className="mb-3" style={{ fontSize: 17 }}>Practice at</h4>
                {hospital && (
                  <>
                    <div style={{ fontWeight: 700, color: 'var(--ink)' }}>{hospital.name}</div>
                    <div className="muted" style={{ fontSize: 14 }}>{hospital.area}, {hospital.city}</div>
                    <Link to={`/hospital/${hospital.id}`} className="btn btn-ghost btn-sm mt-3">View Hospital <Icon.Arrow /></Link>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="divider" />

          <h3 className="mb-4" style={{ fontSize: 19 }}>Patient Reviews</h3>
          {reviews.length === 0 ? (
            <div className="empty card" style={{ boxShadow: 'none' }}><div className="empty-icon">💬</div><p>No reviews yet. Be the first to leave one after your visit.</p></div>
          ) : (
            <div className="grid grid-2">
              {reviews.map((r) => (
                <div key={r.id} className="card card-flat">
                  <div className="flex-between"><Rating value={r.rating} /><span className="muted" style={{ fontSize: 12 }}>{r.date}</span></div>
                  <p style={{ fontSize: 15, marginTop: 10 }}>“{r.comment}”</p>
                  <div style={{ fontWeight: 700, marginTop: 8, color: 'var(--ink)' }}>— {r.patientName}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
