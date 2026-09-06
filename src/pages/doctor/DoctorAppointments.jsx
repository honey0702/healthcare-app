import { useMemo, useState } from 'react'
import { db } from '../../utils/db'
import { useAuth } from '../../context/AuthContext'
import { toast } from '../../utils/toast'
import { PageHeader, EmptyState, Pill } from '../../components/ui'

const statusPill = { confirmed: 'green', pending: 'amber', completed: 'blue', canceled: 'red' }

export default function DoctorAppointments() {
  const { user } = useAuth()
  const [appts, setAppts] = useState(db.getAppointments().filter((a) => a.doctorId === user?.doctorId || a.doctorName === user?.name))
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => filter === 'all' ? appts : appts.filter((a) => a.status === filter), [appts, filter])

  const update = (id, status) => {
    const list = appts.map((a) => a.id === id ? { ...a, status } : a)
    setAppts(list)
    const all = db.getAppointments().map((a) => a.id === id ? { ...a, status } : a)
    db.saveAppointments(all)
    const a = list.find((x) => x.id === id)
    db.saveNotifications([...db.getNotifications(), { id: db.id('n'), userId: a.patientId, title: `Appointment ${status}`, read: false, message: `Your appointment with ${a.doctorName} on ${a.date} was ${status}.`, date: new Date().toISOString().slice(0, 10) }])
    toast(`Appointment ${status}`)
  }

  return (
    <div>
      <PageHeader title="Appointments" sub="Approve, reject and manage your bookings." />
      <div className="flex gap-2 wrap" style={{ marginBottom: 18 }}>
        {[['all', 'All'], ['pending', 'Pending'], ['confirmed', 'Upcoming'], ['completed', 'Completed'], ['canceled', 'Canceled']].map(([k, l]) => (
          <button key={k} className={`btn btn-sm ${filter === k ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(k)}>{l}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="🗓️" title="No appointments here" desc="New bookings will show up here for approval." />
      ) : (
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>Patient</th><th>Date & Time</th><th>Reason</th><th>Turn</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td><strong style={{ color: 'var(--ink)' }}>{a.patientName || 'Patient'}</strong></td>
                  <td>{a.date}<br /><span className="muted">{a.time}</span></td>
                  <td>{a.reason}</td>
                  <td><span className="badge badge-amber">#{a.turn}</span></td>
                  <td><Pill type={statusPill[a.status]}>{a.status.toUpperCase()}</Pill></td>
                  <td>
                    {a.status === 'pending' && (
                      <div className="flex gap-2">
                        <button className="btn btn-success btn-sm" onClick={() => update(a.id, 'confirmed')}>Approve</button>
                        <button className="btn btn-danger btn-sm" onClick={() => update(a.id, 'canceled')}>Reject</button>
                      </div>
                    )}
                    {a.status === 'confirmed' && <button className="btn btn-outline btn-sm" onClick={() => update(a.id, 'completed')}>Mark Completed</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
