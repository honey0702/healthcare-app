import { db } from '../../utils/db'
import { useAuth } from '../../context/AuthContext'
import { PageHeader, EmptyState } from '../../components/ui'
import { Icon } from '../../components/Icons'

export default function DoctorReviews() {
  const { user } = useAuth()
  const reviews = db.getReviews().filter((r) => r.doctorId === user?.doctorId || r.doctorName === user?.name)

  return (
    <div>
      <PageHeader title="Patient Reviews" sub="What your patients say about you." />
      {reviews.length === 0 ? (
        <EmptyState icon="💬" title="No reviews yet" desc="Reviews from your patients will appear here." />
      ) : (
        <div className="grid grid-2 stagger">
          {reviews.map((r) => (
            <div key={r.id} className="card">
              <div className="flex-between">
                <span className="badge badge-amber">{'★ '.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                <span className="muted" style={{ fontSize: 12 }}>{r.date}</span>
              </div>
              <p style={{ fontSize: 15, margin: '12px 0' }}>“{r.comment}”</p>
              <div className="flex gap-2" style={{ alignItems: 'center' }}>
                <span className="avatar" style={{ width: 32, height: 32, fontSize: 14 }}>{r.patientName?.[0]}</span>
                <strong style={{ color: 'var(--ink)', fontSize: 14 }}>{r.patientName}</strong>
                <span className="badge badge-green"><Icon.BadgeCheck /> Verified</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
