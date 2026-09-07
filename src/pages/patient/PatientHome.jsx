import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../utils/api'
import { db } from '../../utils/db'
import { useAuth } from '../../context/AuthContext'
import { StatCard, PageHeader } from '../../components/ui'
import { Icon } from '../../components/Icons'

const emptySummary = {
  total_appointments: 0,
  upcoming_appointments: 0,
  completed_appointments: 0,
  unread_notifications: 0,
  pending_payments: 0,
}

function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(`${value}T00:00:00`),
  )
}

function formatMoney(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`
}

export default function PatientHome() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.patientDashboard(db.getAccessToken())
      setDashboard(data)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const summary = dashboard?.summary || emptySummary
  const next = dashboard?.next_appointment
  const notifications = dashboard?.notifications || []
  const reports = dashboard?.recent_reports || []
  const payments = dashboard?.recent_payments || []
  const recommendedDoctors = dashboard?.recommended_doctors || []

  return (
    <div>
      <PageHeader title={`Welcome back, ${user?.name?.split(' ')[0]} 👋`} sub="Here's your health at a glance." />

      {loading && (
        <div className="card anim-up" style={{ padding: 24, marginBottom: 22 }}>
          <p className="muted">Loading your dashboard…</p>
        </div>
      )}

      {!loading && error && (
        <div className="alert alert-error anim-up" style={{ marginBottom: 22 }}>
          <span>{error}</span>
          <button className="btn btn-sm btn-outline" onClick={loadDashboard}>Try again</button>
        </div>
      )}

      <div className="grid grid-4 stagger" style={{ marginBottom: 26 }}>
        <StatCard icon="📅" label="Total Appointments" value={summary.total_appointments} color="brand" delay="d1" />
        <StatCard icon="🕒" label="Upcoming" value={summary.upcoming_appointments} color="blue" delay="d2" />
        <StatCard icon="✅" label="Completed" value={summary.completed_appointments} color="green" delay="d3" />
        <StatCard icon="🔔" label="Notifications" value={summary.unread_notifications} color="amber" delay="d4" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', gap: 22 }}>
        <div className="card">
          <div className="flex-between mb-4"><h3 style={{ fontSize: 18 }}>Next Appointment</h3><Link to="/patient/appointments" className="btn btn-ghost btn-sm">View All</Link></div>
          {next ? (
            <div className="flex gap-4" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="avatar avatar-lg">🗓️</span>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: 17 }}>{next.doctor_name}</div>
                <div className="muted" style={{ fontSize: 14 }}>{next.doctor_speciality || 'Healthcare specialist'} · {next.hospital_name || 'Hospital to be confirmed'}</div>
                <div className="flex gap-2 wrap mt-2">
                  <span className="badge badge-brand">{formatDate(next.date)}</span>
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
              { t: 'Payments', d: `${summary.pending_payments} pending payment${summary.pending_payments === 1 ? '' : 's'}`, to: '/patient/payments', ic: '💰', c: 'var(--amber-soft)' },
            ].map((action) => (
              <button key={action.t} className="btn btn-outline" style={{ justifyContent: 'flex-start', width: '100%' }} onClick={() => navigate(action.to)}>
                <span className="stat-icon" style={{ width: 38, height: 38, fontSize: 18, background: action.c }}>{action.ic}</span>
                <span style={{ textAlign: 'left' }}><strong style={{ display: 'block', color: 'var(--ink)' }}>{action.t}</strong><span className="muted" style={{ fontSize: 12 }}>{action.d}</span></span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 22, marginTop: 22 }}>
        <div className="card">
          <div className="flex-between mb-4"><h3 style={{ fontSize: 18 }}>Recent Medical Reports</h3><Link to="/patient/reports" className="btn btn-ghost btn-sm">View All</Link></div>
          {reports.length ? (
            <div className="grid gap-3">
              {reports.map((report) => (
                <div key={report.id} className="flex-between" style={{ gap: 12, alignItems: 'flex-start' }}>
                  <div className="flex gap-3">
                    <span className="stat-icon" style={{ width: 38, height: 38, fontSize: 18, background: 'var(--green-soft)' }}>📋</span>
                    <div>
                      <strong style={{ color: 'var(--ink)' }}>{report.title}</strong>
                      <div className="muted" style={{ fontSize: 12 }}>{report.report_type || 'Medical report'} · {formatDate(report.report_date)}</div>
                    </div>
                  </div>
                  {report.file_url && <a href={report.file_url} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">Open</a>}
                </div>
              ))}
            </div>
          ) : <p className="muted">No medical reports uploaded yet.</p>}
        </div>

        <div className="card">
          <div className="flex-between mb-4"><h3 style={{ fontSize: 18 }}>Recent Payments</h3><Link to="/patient/payments" className="btn btn-ghost btn-sm">View All</Link></div>
          {payments.length ? (
            <div className="grid gap-3">
              {payments.map((payment) => (
                <div key={payment.id} className="flex-between" style={{ gap: 12 }}>
                  <div>
                    <strong style={{ color: 'var(--ink)' }}>{payment.payment_type}</strong>
                    <div className="muted" style={{ fontSize: 12 }}>{payment.reference || 'No reference'} · {formatDate(payment.date)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ color: 'var(--ink)' }}>{formatMoney(payment.amount)}</strong>
                    <div><span className={`badge badge-${payment.status === 'completed' ? 'green' : payment.status === 'pending' ? 'amber' : 'gray'}`}>{payment.status}</span></div>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="muted">No payment history yet.</p>}
        </div>
      </div>

      {notifications.length > 0 && (
        <div className="card mt-4" style={{ background: 'var(--brand-faint)' }}>
          <div className="flex-between mb-3"><h3 style={{ fontSize: 18 }}>Recent Notifications</h3><Link to="/patient/notifications" className="btn btn-ghost btn-sm">View All</Link></div>
          <div className="grid gap-2">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex gap-3" style={{ alignItems: 'center' }}>
                <Icon.Bell style={{ color: 'var(--brand)' }} />
                <div style={{ fontSize: 14 }}>
                  <strong style={{ color: 'var(--ink)' }}>{notification.title}</strong> — {notification.message}
                  <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{formatDate(notification.date)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card mt-4">
        <div className="flex-between mb-4"><h3 style={{ fontSize: 18 }}>Recommended Doctors</h3><Link to="/doctors" className="btn btn-ghost btn-sm">Find More</Link></div>
        {recommendedDoctors.length ? (
          <div className="grid grid-2 gap-3">
            {recommendedDoctors.map((doctor) => (
              <div key={doctor.id} className="flex gap-3" style={{ alignItems: 'center', padding: 12, border: '1px solid var(--line)', borderRadius: 12 }}>
                <span className="avatar">🩺</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong style={{ color: 'var(--ink)' }}>{doctor.name}</strong>
                  <div className="muted" style={{ fontSize: 12 }}>{doctor.speciality || 'General physician'} · {doctor.experience || 0} yrs experience</div>
                  <div className="muted" style={{ fontSize: 12 }}>{doctor.hospital_name || 'MediCare partner'}</div>
                </div>
                <span className="badge badge-brand">★ {Number(doctor.rating || 0).toFixed(1)}</span>
              </div>
            ))}
          </div>
        ) : <p className="muted">Recommended doctors will appear here soon.</p>}
      </div>
    </div>
  )
}
