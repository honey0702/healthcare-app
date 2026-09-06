import { useState } from 'react'
import { db } from '../../utils/db'
import { toast } from '../../utils/toast'
import { PageHeader, EmptyState } from '../../components/ui'
import { Icon } from '../../components/Icons'

export default function AdminReviews() {
  const [reviews, setReviews] = useState(db.getReviews())

  const del = (id) => {
    if (!window.confirm('Delete this review?')) return
    const list = reviews.filter((r) => r.id !== id)
    setReviews(list); db.saveReviews(list); toast('Review removed', 'info')
  }

  return (
    <div>
      <PageHeader title="Reviews Management" sub="Manage all patient reviews and feedback." />
      {reviews.length === 0 ? <EmptyState icon="💬" title="No reviews yet" /> : (
        <div className="grid grid-2 stagger">
          {reviews.map((r) => (
            <div key={r.id} className="card">
              <div className="flex-between">
                <div>
                  <strong style={{ color: 'var(--ink)' }}>{r.patientName}</strong>
                  <div className="muted" style={{ fontSize: 13 }}>on {r.doctorName}</div>
                </div>
                <span className="badge badge-amber">{'★ '.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              </div>
              <p style={{ margin: '10px 0' }}>“{r.comment}”</p>
              <div className="flex-between">
                <span className="muted" style={{ fontSize: 12 }}>{r.date}</span>
                <button className="btn btn-danger btn-sm" onClick={() => del(r.id)}><Icon.Trash /> Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
