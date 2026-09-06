import { useState } from 'react'
import { db } from '../../utils/db'
import { useAuth } from '../../context/AuthContext'
import { toast } from '../../utils/toast'
import { PageHeader, EmptyState } from '../../components/ui'
import { Icon } from '../../components/Icons'

export default function AdminNotifications() {
  const { user } = useAuth()
  const users = db.getUsers()
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [audience, setAudience] = useState('all')
  const [list, setList] = useState(db.getNotifications().filter((n) => n.userId === user?.id))

  const send = (e) => {
    e.preventDefault()
    if (!message) { toast('Enter a message', 'error'); return }
    const targets = users.filter((u) => audience === 'all' || u.role === audience)
    const notifs = targets.map((t) => ({ id: db.id('n'), userId: t.id, title: title || 'New notification', message, read: false, date: new Date().toISOString().slice(0, 10) }))
    db.saveNotifications([...db.getNotifications(), ...notifs])
    setList([...list, ...notifs])
    toast(`Notification sent to ${targets.length} users`)
    setTitle(''); setMessage('')
  }

  return (
    <div>
      <PageHeader title="Send Notifications" sub="Broadcast alerts to patients, doctors or everyone." />
      <div className="grid" style={{ gridTemplateColumns: '1fr 1.5fr', gap: 22 }}>
        <form className="card" onSubmit={send}>
          <div className="field"><label>Audience</label>
            <select value={audience} onChange={(e) => setAudience(e.target.value)}>
              <option value="all">All Users ({users.length})</option>
              <option value="patient">Patients</option>
              <option value="doctor">Doctors</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          <div className="field"><label>Title</label><input placeholder="e.g. Health Camp on Sunday" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="field"><label>Message *</label><textarea rows={4} placeholder="Notification message…" value={message} onChange={(e) => setMessage(e.target.value)} required /></div>
          <button className="btn btn-primary btn-block"><Icon.Send /> Send Notification</button>
        </form>

        <div>
          <h3 style={{ fontSize: 18, marginBottom: 14 }}>Sent Notifications ({list.length})</h3>
          {list.length === 0 ? <EmptyState icon="📢" title="Nothing sent yet" /> : (
            <div className="grid gap-2">
              {[...list].reverse().slice(0, 6).map((n) => (
                <div key={n.id} className="card card-flat flex gap-3">
                  <span className="stat-icon" style={{ width: 40, height: 40, fontSize: 18, background: 'var(--brand-faint)', color: 'var(--brand)' }}><Icon.Bell /></span>
                  <div><strong style={{ color: 'var(--ink)' }}>{n.title}</strong><p style={{ fontSize: 14 }}>{n.message}</p><span className="muted" style={{ fontSize: 12 }}>{n.date}</span></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
