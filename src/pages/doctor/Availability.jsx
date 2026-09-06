import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../utils/db'
import { toast } from '../../utils/toast'
import { PageHeader } from '../../components/ui'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const slots = ['09:00 - 12:00', '12:00 - 15:00', '15:00 - 18:00', '18:00 - 21:00']

export default function Availability() {
  const { user } = useAuth()
  const [schedule, setSchedule] = useState(() => {
    const stored = db.getDoctors().find((d) => d.id === user?.doctorId)
    return stored?.schedule || { Monday: ['09:00 - 12:00'], Tuesday: ['09:00 - 12:00'], Wednesday: ['09:00 - 12:00'], Thursday: ['09:00 - 12:00'], Friday: ['09:00 - 12:00'], Saturday: ['09:00 - 12:00'], Sunday: [] }
  })
  const [unavailable, setUnavailable] = useState('')

  const toggleSlot = (day, slot) => {
    setSchedule((prev) => {
      const cur = prev[day] || []
      const next = cur.includes(slot) ? cur.filter((s) => s !== slot) : [...cur, slot]
      return { ...prev, [day]: next }
    })
  }

  const save = () => {
    const docs = db.getDoctors().map((d) => d.id === user?.doctorId ? { ...d, schedule, unavailable } : d)
    db.saveDoctors(docs)
    toast('Availability updated')
  }

  return (
    <div>
      <PageHeader title="Availability" sub="Set your working days, times and leave." />
      <div className="card">
        <h3 style={{ fontSize: 18, marginBottom: 6 }}>Weekly Schedule</h3>
        <p className="muted" style={{ marginBottom: 20, fontSize: 14 }}>Toggle the time slots you're available each day.</p>
        <div className="grid gap-3">
          {days.map((day) => (
            <div key={day} className="card card-flat" style={{ background: 'var(--bg)' }}>
              <div className="flex-between wrap" style={{ gap: 10 }}>
                <strong style={{ color: 'var(--ink)', minWidth: 110 }}>{day}</strong>
                <div className="flex gap-2 wrap">
                  {slots.map((s) => {
                    const active = (schedule[day] || []).includes(s)
                    return (
                      <button key={s} className={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline'}`} onClick={() => toggleSlot(day, s)}>
                        {active ? '✓ ' : ''}{s}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="field mt-4">
          <label>Leave / Unavailable Date (optional)</label>
          <input type="date" value={unavailable} onChange={(e) => setUnavailable(e.target.value)} />
        </div>
        <button className="btn btn-primary btn-lg mt-2" onClick={save}>Save Availability</button>
      </div>
    </div>
  )
}
