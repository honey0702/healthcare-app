import { Link, useNavigate } from 'react-router-dom'
import { db } from '../../utils/db'
import { useAuth } from '../../context/AuthContext'
import { StatCard, PageHeader } from '../../components/ui'
import { Icon } from '../../components/Icons'

export default function PatientHome() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const appts = db.getAppointments().filter((a) => a.patientId === user?.id)
  const upcoming = appts.filter((a) => a.status === 'confirmed' || a.status === 'pending')
  const notifications = db.getNotifications().filter((n) => n.userId === user?.id && !n.read)

  const next = upcoming.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0]

  return (
    <div>
      <PageHeader title={`Welcome back, ${user?.name.split(' ')[0]} 👋`} sub="Here's your health at a glance." />

      <div className="grid grid-4 stagger" style={{ marginBottom: 26 }}>
        <StatCard icon="📅" label="Total Appointments" value={appts.length} color="brand" delay="d1" />
        <StatCard icon="🕒" label="Upcoming" value={appts.filter((a) => a.status === 'confirmed').length} color="blue" delay="d2" />
        <StatCard icon="✅" label="Completed" value={appts.filter((a) => a.status === 'completed').length} color="green" delay="d3" />
        <StatCard icon="🔔" label="Notifications" value={notifications.length} color="amber" delay="d4" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', gap: 22 }}>
        <div className="card">
          <div className="flex-between mb-4"><h3 style={{ fontSize: 18 }}>Next Appointment</h3><Link to="/patient/appointments" className="btn btn-ghost btn-sm">View All</Link></div>
          {next ? (
            <div className="flex gap-4" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="avatar avatar-lg">🗓️</span>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: 17 }}>{next.doctorName}</div>
                <div className="muted" style={{ fontSize: 14 }}>{next.hospitalName}</div>
                <div className="flex gap-2 wrap mt-2">
                  <span className="badge badge-brand">{next.date}</span>
                  <span className="badge badge-gray">{next.time}</span>
                  <span className="badge badge-amber">Turn #{next.turn}</span>
                </div>
              </div>
              <Link to="/patient/appointments" className="btn btn-primary btn-sm">Manage</Link>
            </div>
          ) : (
            <div className="empty" style={{ padding: 20 }}>
              <div className="empty-icon">📅</div>
              <p>No upcoming appointments.</p>
              <Link to="/doctors" className="btn btn-primary btn-sm mt-3">Book a Doctor</Link>
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>Quick Actions</h3>
          <div className="grid gap-2">
            {[
              { t: 'Book Appointment', d: 'Find & book a doctor', to: '/doctors', ic: '📅', c: 'var(--brand-faint)' },
              { t: 'Check Rooms', d: 'Room availability & price', to: '/rooms', ic: '🛏️', c: 'var(--blue-soft)' },
              { t: 'My Medical Reports', d: 'View your reports', to: '/patient/reports', ic: '📋', c: 'var(--green-soft)' },
              { t: 'Payments', d: 'Fees, refunds & history', to: '/patient/payments', ic: '💰', c: 'var(--amber-soft)' },
            ].map((q) => (
              <button key={q.t} className="btn btn-outline" style={{ justifyContent: 'flex-start', width: '100%' }} onClick={() => navigate(q.to)}>
                <span className="stat-icon" style={{ width: 38, height: 38, fontSize: 18, background: q.c }}>{q.ic}</span>
                <span style={{ textAlign: 'left' }}><strong style={{ display: 'block', color: 'var(--ink)' }}>{q.t}</strong><span className="muted" style={{ fontSize: 12 }}>{q.d}</span></span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {notifications.length > 0 && (
        <div className="card mt-4" style={{ background: 'var(--brand-faint)' }}>
          <h3 style={{ fontSize: 18, marginBottom: 12 }}>Recent Notifications</h3>
          <div className="grid gap-2">
            {notifications.slice(0, 3).map((n) => (
              <div key={n.id} className="flex gap-3" style={{ alignItems: 'center' }}>
                <Icon.Bell style={{ color: 'var(--brand)' }} />
                <div style={{ fontSize: 14 }}>
                  <strong style={{ color: 'var(--ink)' }}>{n.title}</strong> — {n.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
