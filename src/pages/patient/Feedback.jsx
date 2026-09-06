import { useState } from 'react'
import { db } from '../../utils/db'
import { useAuth } from '../../context/AuthContext'
import { toast } from '../../utils/toast'
import { PageHeader, EmptyState } from '../../components/ui'
import { Icon } from '../../components/Icons'

export default function Feedback() {
  const { user } = useAuth()
  const doctors = db.getDoctors()
  const [reviews, setReviews] = useState(db.getReviews().filter((r) => r.patientId === user?.id))
  const [doctorId, setDoctorId] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!doctorId) { toast('Select a doctor', 'error'); return }
    const doctor = doctors.find((d) => d.id === doctorId)
    const rev = { id: db.id('rev'), patientId: user.id, patientName: user.name, doctorId, doctorName: doctor?.name, rating, comment, date: new Date().toISOString().slice(0, 10) }
    const list = [...reviews, rev]
    setReviews(list); db.saveReviews([...db.getReviews(), rev])
    toast('Feedback submitted. Thank you!')
    setDoctorId(''); setComment(''); setRating(5)
  }

  return (
    <div>
      <PageHeader title="My Feedback & Reviews" sub="Rate doctors and manage your reviews." />
      <div className="grid" style={{ gridTemplateColumns: '1fr 1.3fr', gap: 22 }}>
        <form className="card" onSubmit={submit}>
          <h3 style={{ fontSize: 18, marginBottom: 14 }}>Leave a Review</h3>
          <div className="field"><label>Select Doctor</label>
            <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
              <option value="">— Choose a doctor —</option>
              {doctors.map((d) => <option key={d.id} value={d.id}>{d.name} · {d.speciality}</option>)}
            </select>
          </div>
          <div className="field"><label>Rating</label>
            <div className="flex gap-2" style={{ fontSize: 28 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <button type="button" key={s} onClick={() => setRating(s)} style={{ color: s <= rating ? '#f59e0b' : '#cbd5e1', transition: 'transform .15s ease', transform: s <= rating ? 'scale(1.1)' : 'scale(1)' }}>★</button>
              ))}
            </div>
          </div>
          <div className="field"><label>Your Comment</label><textarea rows={4} placeholder="Share your experience…" value={comment} onChange={(e) => setComment(e.target.value)} /></div>
          <button className="btn btn-primary btn-block">Submit Review</button>
        </form>

        <div>
          <h3 style={{ fontSize: 18, marginBottom: 14 }}>Your Reviews ({reviews.length})</h3>
          {reviews.length === 0 ? (
            <EmptyState icon="💬" title="No reviews yet" desc="Reviews you leave will appear here." />
          ) : (
            <div className="grid gap-3">
              {reviews.map((r) => (
                <div key={r.id} className="card">
                  <div className="flex-between">
                    <strong style={{ color: 'var(--ink)' }}>{r.doctorName}</strong>
                    <span className="badge badge-amber">{'★ '.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  </div>
                  <p style={{ marginTop: 8 }}>“{r.comment}”</p>
                  <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>{r.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
