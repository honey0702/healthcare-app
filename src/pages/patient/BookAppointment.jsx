import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { db } from '../../utils/db'
import { useAuth } from '../../context/AuthContext'
import { toast } from '../../utils/toast'
import { Icon } from '../../components/Icons'

const timeSlots = ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '04:00 PM', '05:30 PM', '07:00 PM']
const reasons = ['General Checkup', 'Follow-up', 'Consultation', 'Second Opinion', 'Emergency']

export default function BookAppointment() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const preDoctor = location.state?.doctor

  const doctors = db.getDoctors()
  const hospitals = db.getHospitals()
  const [doctorId, setDoctorId] = useState(preDoctor?.id || '')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [reason, setReason] = useState('Consultation')

  const doctor = doctors.find((d) => d.id === doctorId)
  const hospital = doctor ? hospitals.find((h) => h.id === doctor.hospitalId) : null

  const submit = (e) => {
    e.preventDefault()
    if (!doctor) { toast('Please select a doctor', 'error'); return }
    if (!date) { toast('Please select a date', 'error'); return }
    if (!time) { toast('Please select a time slot', 'error'); return }

    const turn = Math.floor(Math.random() * 9) + 1
    const appt = {
      id: db.id('a'), patientId: user.id, doctorId: doctor.id, doctorName: doctor.name,
      hospitalId: hospital.id, hospitalName: hospital.name, date, time, turn,
      status: 'confirmed', reason, fee: doctor.fee, createdAt: new Date().toISOString().slice(0, 10),
    }
    db.saveAppointments([...db.getAppointments(), appt])
    // notify doctor
    db.saveNotifications([...db.getNotifications(), {
      id: db.id('n'), userId: 'u-dr', title: 'New appointment booked', read: false,
      message: `${user.name} booked with ${doctor.name} on ${date} at ${time}.`, date: new Date().toISOString().slice(0, 10),
    }])
    db.savePayments([...db.getPayments(), { id: db.id('p'), patientId: user.id, amount: doctor.fee, type: 'consultation', status: 'pending', method: '—', date, ref: 'PAY-' + Date.now().toString().slice(-6) }])
    toast(`Appointment booked! Your turn number is ${turn}. A confirmation SMS will be sent.`)
    navigate('/patient/appointments')
  }

  return (
    <div>
      <Link to="/doctors" className="btn btn-ghost btn-sm mb-4"><Icon.Arrow style={{ transform: 'rotate(180deg)' }} /> Back</Link>
      <h1 className="dash-title" style={{ marginBottom: 4 }}>Book Appointment</h1>
      <div className="dash-sub" style={{ marginBottom: 24 }}>Select a doctor and reserve your slot.</div>

      <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: 22 }}>
        <form className="card" onSubmit={submit}>
          <div className="field">
            <label>Select Doctor</label>
            <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
              <option value="">— Choose a doctor —</option>
              {doctors.map((d) => <option key={d.id} value={d.id}>{d.name} · {d.speciality} (₹{d.fee})</option>)}
            </select>
          </div>

          {doctor && (
            <div className="alert alert-info anim-in"><Icon.Check style={{ color: 'var(--green)' }} /> {doctor.name} — {doctor.speciality} at {hospital?.name}. Consultation fee ₹{doctor.fee}.</div>
          )}

          <div className="grid grid-2">
            <div className="field">
              <label>Appointment Date</label>
              <input type="date" min={new Date().toISOString().slice(0, 10)} value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="field">
              <label>Reason</label>
              <select value={reason} onChange={(e) => setReason(e.target.value)}>{reasons.map((r) => <option key={r}>{r}</option>)}</select>
            </div>
          </div>

          <div className="field">
            <label>Available Time Slots</label>
            <div className="flex gap-2 wrap">
              {timeSlots.map((t) => (
                <button type="button" key={t} onClick={() => setTime(t)}
                  className={`btn btn-sm ${time === t ? 'btn-primary' : 'btn-outline'}`}>{t}</button>
              ))}
            </div>
          </div>

          <button className="btn btn-primary btn-block btn-lg mt-3" disabled={!doctor}>Confirm Booking <Icon.Arrow /></button>
        </form>

        <div className="card" style={{ alignSelf: 'start', background: 'var(--brand-faint)' }}>
          <h3 style={{ fontSize: 18, marginBottom: 14 }}>Booking Summary</h3>
          {doctor ? (
            <div className="grid gap-3">
              <div className="flex-between"><span className="muted">Doctor</span><strong style={{ color: 'var(--ink)' }}>{doctor.name}</strong></div>
              <div className="flex-between"><span className="muted">Speciality</span><span>{doctor.speciality}</span></div>
              <div className="flex-between"><span className="muted">Hospital</span><span>{hospital?.name}</span></div>
              <div className="flex-between"><span className="muted">Date</span><span>{date || '—'}</span></div>
              <div className="flex-between"><span className="muted">Time</span><span>{time || '—'}</span></div>
              <div className="divider" style={{ margin: '4px 0' }} />
              <div className="flex-between"><strong>Consultation Fee</strong><strong style={{ color: 'var(--brand-dark)', fontSize: 18 }}>₹{doctor.fee}</strong></div>
            </div>
          ) : <p className="muted">Select a doctor to see the summary.</p>}
        </div>
      </div>
    </div>
  )
}
