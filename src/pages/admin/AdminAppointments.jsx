import { useMemo, useState } from 'react'
import { db } from '../../utils/db'
import { PageHeader, EmptyState, Pill } from '../../components/ui'

const pill = { confirmed: 'green', pending: 'amber', completed: 'blue', canceled: 'red' }

export default function AdminAppointments() {
  const [appts] = useState(db.getAppointments())
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => filter === 'all' ? appts : appts.filter((a) => a.status === filter), [appts, filter])

  return (
    <div>
      <PageHeader title="Appointment Management" sub="Monitor all appointments across the system." />
      <div className="flex gap-2 wrap" style={{ marginBottom: 18 }}>
        {[['all', 'All'], ['pending', 'Pending'], ['confirmed', 'Upcoming'], ['completed', 'Completed'], ['canceled', 'Canceled']].map(([k, l]) => (
          <button key={k} className={`btn btn-sm ${filter === k ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(k)}>{l}</button>
        ))}
      </div>
      {filtered.length === 0 ? <EmptyState icon="🗓️" title="No appointments" /> : (
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>Patient</th><th>Doctor</th><th>Hospital</th><th>Date & Time</th><th>Turn</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td><strong style={{ color: 'var(--ink)' }}>{a.patientName || 'Patient'}</strong></td>
                  <td>{a.doctorName}</td>
                  <td>{a.hospitalName}</td>
                  <td>{a.date}<div className="muted" style={{ fontSize: 12 }}>{a.time}</div></td>
                  <td><span className="badge badge-amber">#{a.turn}</span></td>
                  <td><Pill type={pill[a.status]}>{a.status.toUpperCase()}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
