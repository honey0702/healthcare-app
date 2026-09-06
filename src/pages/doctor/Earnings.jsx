import { db } from '../../utils/db'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { PageHeader, EmptyState } from '../../components/ui'

export default function Earnings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const appts = db.getAppointments().filter((a) => a.doctorId === user?.doctorId || a.doctorName === user?.name)
  const completed = appts.filter((a) => a.status === 'confirmed' || a.status === 'completed')
  const total = completed.reduce((s, a) => s + a.fee, 0)
  const fee = user?.fee || db.getDoctors().find((d) => d.id === user?.doctorId)?.fee || 800

  return (
    <div>
      <PageHeader title="Earnings & Payments" sub="Consultation fees and payment history." />
      <div className="grid grid-3 stagger" style={{ marginBottom: 24 }}>
        {[
          { l: 'Consultation Fee', v: `₹${fee}`, c: '#047857' },
          { l: 'Total Appointments', v: completed.length, c: '#1d4ed8' },
          { l: 'Total Earnings', v: `₹${total.toLocaleString('en-IN')}`, c: '#b45309' },
        ].map((s) => (
          <div key={s.l} className="card anim-up">
            <div className="stat-label">{s.l}</div>
            <div className="stat-value" style={{ color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      {completed.length === 0 ? (
        <EmptyState icon="💰" title="No earnings yet" desc="Your consultation earnings will appear here.">
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/doctor/appointments')}>View Appointments</button>
        </EmptyState>
      ) : (
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>Patient</th><th>Date</th><th>Time</th><th>Fee</th><th>Status</th></tr></thead>
            <tbody>
              {completed.map((a) => (
                <tr key={a.id}>
                  <td><strong style={{ color: 'var(--ink)' }}>{a.patientName || 'Patient'}</strong></td>
                  <td>{a.date}</td>
                  <td>{a.time}</td>
                  <td style={{ fontWeight: 700 }}>₹{a.fee}</td>
                  <td><span className="badge badge-green">{a.status.toUpperCase()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
