import { useMemo } from 'react'
import { db } from '../../utils/db'
import { PageHeader } from '../../components/ui'

export default function AdminReports() {
  const appts = db.getAppointments()
  const payments = db.getPayments()
  const reviews = db.getReviews()
  const doctors = db.getDoctors()

  const byCity = useMemo(() => {
    const map = {}
    doctors.forEach((d) => { map[d.city] = (map[d.city] || 0) + 1 })
    return Object.entries(map)
  }, [doctors])

  const byStatus = useMemo(() => {
    const map = {}
    appts.forEach((a) => { map[a.status] = (map[a.status] || 0) + 1 })
    return Object.entries(map)
  }, [appts])

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—'
  const maxCount = Math.max(1, ...byCity.map(([, c]) => c))

  const statusColor = { confirmed: 'var(--green)', pending: 'var(--amber)', completed: 'var(--blue)', canceled: 'var(--red)' }

  return (
    <div>
      <PageHeader title="System Reports" sub="Statistics and analytics across the platform." />

      <div className="grid grid-4 stagger" style={{ marginBottom: 24 }}>
        {[
          { l: 'Appointments', v: appts.length }, { l: 'Revenue', v: `₹${payments.filter((p) => p.status === 'completed').reduce((s, p) => s + p.amount, 0).toLocaleString('en-IN')}` },
          { l: 'Avg Rating', v: `${avgRating}★` }, { l: 'Reviews', v: reviews.length },
        ].map((s, i) => (
          <div key={s.l} className="card anim-up">
            <div className="stat-label">{s.l}</div><div className="stat-value">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ fontSize: 18, marginBottom: 18 }}>Appointments by Status</h3>
          <div className="grid gap-3">
            {byStatus.map(([k, v]) => (
              <div key={k}>
                <div className="flex-between mb-2" style={{ fontSize: 14 }}><span style={{ fontWeight: 600, textTransform: 'capitalize', color: 'var(--ink)' }}>{k}</span><strong>{v}</strong></div>
                <div className="bar"><span style={{ width: `${(v / Math.max(1, appts.length)) * 100}%`, background: statusColor[k] || 'var(--brand)' }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 18, marginBottom: 18 }}>Doctors by City</h3>
          <div className="grid gap-3">
            {byCity.map(([k, v]) => (
              <div key={k}>
                <div className="flex-between mb-2" style={{ fontSize: 14 }}><span style={{ fontWeight: 600, color: 'var(--ink)' }}>{k}</span><strong>{v}</strong></div>
                <div className="bar"><span style={{ width: `${(v / maxCount) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <h3 style={{ fontSize: 18, marginBottom: 12 }}>Platform Summary</h3>
        <div className="grid grid-3">
          {[
            ['Patients', db.getUsers().filter((u) => u.role === 'patient').length],
            ['Doctors', db.getDoctors().length],
            ['Hospitals', db.getHospitals().length],
            ['Rooms Listed', db.getRooms().length],
            ['Insurance Partners', db.getInsurances().length],
            ['Wellness Items', db.getWellness().length],
          ].map(([k, v]) => (
            <div key={k} className="card card-flat flex-between"><span className="muted">{k}</span><strong style={{ color: 'var(--ink)', fontSize: 18 }}>{v}</strong></div>
          ))}
        </div>
      </div>
    </div>
  )
}
