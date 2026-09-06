import { Link, useNavigate } from 'react-router-dom'
import { db } from '../../utils/db'
import { useAuth } from '../../context/AuthContext'
import { StatCard, PageHeader } from '../../components/ui'
import { Icon } from '../../components/Icons'

export default function DoctorHome() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const today = new Date().toISOString().slice(0, 10)
  const appts = db.getAppointments()
  const myAppts = appts.filter((a) => a.doctorId === user?.doctorId || a.doctorName === user?.name)
  const todayAppts = myAppts.filter((a) => a.date === today)
  const pending = myAppts.filter((a) => a.status === 'pending')
  const patients = new Set(myAppts.map((a) => a.patientId)).size
  const earnings = db.getPayments().filter((p) => p.status === 'completed' && myAppts.some((a) => a.id?.includes('a') )).length // demo

  return (
    <div>
      <PageHeader title={`Dr. ${user?.name.split(' ').slice(1).join(' ')} 🩺`} sub="Your practice overview for today." />

      <div className="grid grid-4 stagger" style={{ marginBottom: 26 }}>
        <StatCard icon="📅" label="Today's Appointments" value={todayAppts.length} color="brand" delay="d1" />
        <StatCard icon="⏳" label="Pending Requests" value={pending.length} color="amber" delay="d2" />
        <StatCard icon="👥" label="Total Patients" value={patients} color="blue" delay="d3" />
        <StatCard icon="💼" label="Approved Today" value={todayAppts.filter((a) => a.status === 'confirmed').length} color="green" delay="d4" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', gap: 22 }}>
        <div className="card">
          <div className="flex-between mb-4"><h3 style={{ fontSize: 18 }}>Today's Schedule</h3><Link to="/doctor/appointments" className="btn btn-ghost btn-sm">Manage</Link></div>
          {todayAppts.length === 0 ? (
            <div className="empty" style={{ padding: 20 }}><div className="empty-icon">📅</div><p>No appointments scheduled for today.</p></div>
          ) : (
            <div className="grid gap-2">
              {todayAppts.map((a) => (
                <div key={a.id} className="card card-flat flex-between wrap" style={{ gap: 12 }}>
                  <div className="flex gap-3">
                    <span className="avatar">{a.patientName?.[0] || 'P'}</span>
                    <div>
                      <strong style={{ color: 'var(--ink)' }}>{a.patientName || 'Patient'}</strong>
                      <div className="muted" style={{ fontSize: 13 }}>{a.time} · Turn #{a.turn}</div>
                    </div>
                  </div>
                  <span className={`badge ${a.status === 'confirmed' ? 'badge-green' : a.status === 'pending' ? 'badge-amber' : 'badge-red'}`}>{a.status.toUpperCase()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>Quick Actions</h3>
          <div className="grid gap-2">
            {[
              { t: 'Review Appointments', d: 'Approve or reject requests', to: '/doctor/appointments', ic: '🗓️' },
              { t: 'Set Availability', d: 'Manage your schedule', to: '/doctor/availability', ic: '⏰' },
              { t: 'My Patients', d: 'View patient information', to: '/doctor/patients', ic: '👥' },
              { t: 'Earnings', d: 'Fees & payment history', to: '/doctor/earnings', ic: '💰' },
            ].map((q) => (
              <button key={q.t} className="btn btn-outline" style={{ justifyContent: 'flex-start', width: '100%' }} onClick={() => navigate(q.to)}>
                <span className="stat-icon" style={{ width: 38, height: 38, fontSize: 18, background: 'var(--brand-faint)' }}>{q.ic}</span>
                <span style={{ textAlign: 'left' }}><strong style={{ display: 'block', color: 'var(--ink)' }}>{q.t}</strong><span className="muted" style={{ fontSize: 12 }}>{q.d}</span></span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
