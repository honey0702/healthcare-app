import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { db } from '../../utils/db'
import { useAuth } from '../../context/AuthContext'
import { toast } from '../../utils/toast'
import { PageHeader, EmptyState, Pill } from '../../components/ui'
import { Icon } from '../../components/Icons'

const statusPill = { confirmed: 'green', pending: 'amber', completed: 'blue', canceled: 'red' }

export default function Appointments() {
  const { user } = useAuth()
  const [filter, setFilter] = useState('all')
  const [appts, setAppts] = useState(db.getAppointments().filter((a) => a.patientId === user?.id))

  const filtered = useMemo(() => {
    if (filter === 'all') return appts
    return appts.filter((a) => a.status === filter)
  }, [appts, filter])

  const addToCalendar = (a) => {
    try {
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Appointment with ' + a.doctorName)}&dates=${a.date.replace(/-/g, '')}/T${a.time.split(':')[0]}0000&details=${encodeURIComponent('Consultation at ' + a.hospitalName)}`
      window.open(url, '_blank')
      toast('Opening calendar to add reminder…', 'info')
    } catch { toast('Could not open calendar', 'error') }
  }

  const cancel = (id) => {
    if (!window.confirm('Cancel this appointment?')) return
    const list = db.getAppointments().map((a) => a.id === id ? { ...a, status: 'canceled' } : a)
    db.saveAppointments(list)
    setAppts(list.filter((a) => a.patientId === user?.id))
    toast('Appointment canceled')
  }

  return (
    <div>
      <PageHeader title="My Appointments" sub="View, filter and manage your bookings." />

      <div className="flex gap-2 wrap" style={{ marginBottom: 20 }}>
        {[['all', 'All'], ['confirmed', 'Upcoming'], ['pending', 'Pending'], ['completed', 'Completed'], ['canceled', 'Canceled']].map(([k, l]) => (
          <button key={k} className={`btn btn-sm ${filter === k ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(k)}>{l}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="🗓️" title="No appointments here" desc="Book your next appointment with a trusted doctor.">
          <Link to="/doctors" className="btn btn-primary btn-sm">Find a Doctor</Link>
        </EmptyState>
      ) : (
        <div className="grid gap-3 stagger">
          {filtered.map((a) => (
            <div key={a.id} className="card flex-between wrap" style={{ gap: 16 }}>
              <div className="flex gap-4" style={{ flex: 1, minWidth: 240, alignItems: 'center' }}>
                <span className="avatar avatar-lg" style={{ background: a.status === 'canceled' ? 'var(--line-soft)' : 'var(--grad-brand)' }}>🗓️</span>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: 16 }}>{a.doctorName}</div>
                  <div className="muted" style={{ fontSize: 14 }}>{a.hospitalName}</div>
                  <div className="flex gap-2 wrap" style={{ marginTop: 6 }}>
                    <span className="badge badge-gray">{a.date}</span>
                    <span className="badge badge-gray">{a.time}</span>
                    {a.turn && <span className="badge badge-amber">Turn #{a.turn}</span>}
                    <Pill type={statusPill[a.status]}>{a.status.toUpperCase()}</Pill>
                  </div>
                </div>
              </div>
              <div className="flex gap-2" style={{ alignItems: 'center' }}>
                {a.status === 'confirmed' && (
                  <button className="btn btn-ghost btn-sm" onClick={() => addToCalendar(a)}><Icon.CalendarPlus /> Add to Calendar</button>
                )}
                {(a.status === 'confirmed' || a.status === 'pending') && (
                  <button className="btn btn-danger btn-sm" onClick={() => cancel(a.id)}><Icon.Trash /> Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
