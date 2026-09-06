import { Link, useNavigate } from 'react-router-dom'
import { db } from '../../utils/db'
import { useAuth } from '../../context/AuthContext'
import { StatCard, PageHeader } from '../../components/ui'
import { Icon } from '../../components/Icons'

export default function AdminHome() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const users = db.getUsers()
  const appts = db.getAppointments()
  const pendingDoctors = users.filter((u) => u.role === 'doctor' && u.status === 'pending').length
  const pendingAppts = appts.filter((a) => a.status === 'pending').length
  const revenue = db.getPayments().filter((p) => p.status === 'completed').reduce((s, p) => s + p.amount, 0)
  const patients = users.filter((u) => u.role === 'patient').length
  const doctors = users.filter((u) => u.role === 'doctor' && u.status === 'approved').length

  const recent = [...appts].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, 5)

  return (
    <div>
      <PageHeader title={`Admin Dashboard 🛡️`} sub="Overall system statistics and monitoring." />

      <div className="grid grid-4 stagger" style={{ marginBottom: 26 }}>
        <StatCard icon="👥" label="Total Patients" value={patients} color="blue" delay="d1" />
        <StatCard icon="🩺" label="Doctors" value={doctors} color="brand" delay="d2" />
        <StatCard icon="🏥" label="Hospitals" value={db.getHospitals().length} color="violet" delay="d3" />
        <StatCard icon="⏳" label="Pending Approvals" value={pendingDoctors} color="amber" delay="d4" />
      </div>
      <div className="grid grid-4 stagger" style={{ marginBottom: 26 }}>
        <StatCard icon="📅" label="Appointments" value={appts.length} color="green" delay="d1" />
        <StatCard icon="🔔" label="Pending Requests" value={pendingAppts} color="amber" delay="d2" />
        <StatCard icon="💰" label="Revenue" value={`₹${revenue.toLocaleString('en-IN')}`} color="brand" delay="d3" />
        <StatCard icon="💬" label="Reviews" value={db.getReviews().length} color="blue" delay="d4" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', gap: 22 }}>
        <div className="card">
          <div className="flex-between mb-4"><h3 style={{ fontSize: 18 }}>Recent Appointments</h3><Link to="/admin/appointments" className="btn btn-ghost btn-sm">View All</Link></div>
          {recent.length === 0 ? <div className="empty" style={{ padding: 20 }}><p>No appointments yet.</p></div> : (
            <div className="table-wrap" style={{ border: 'none' }}>
              <table className="tbl">
                <thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>{recent.map((a) => (
                  <tr key={a.id}><td style={{ fontWeight: 600 }}>{a.patientName || 'Patient'}</td><td>{a.doctorName}</td><td>{a.date}</td>
                    <td><span className={`badge ${a.status === 'confirmed' ? 'badge-green' : a.status === 'pending' ? 'badge-amber' : a.status === 'completed' ? 'badge-blue' : 'badge-red'}`}>{a.status.toUpperCase()}</span></td></tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>Quick Actions</h3>
          <div className="grid gap-2">
            {[
              { t: 'Approve Doctors', d: `${pendingDoctors} awaiting review`, to: '/admin/doctors', ic: '🩺' },
              { t: 'Manage Hospitals', d: 'Add or edit hospitals', to: '/admin/hospitals', ic: '🏥' },
              { t: 'Manage Rooms', d: 'Update room availability', to: '/admin/rooms', ic: '🛏️' },
              { t: 'Send Notifications', d: 'Broadcast to users', to: '/admin/notifications', ic: '📢' },
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
