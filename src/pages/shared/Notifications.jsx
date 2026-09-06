import { useState } from 'react'
import { db } from '../../utils/db'
import { useAuth } from '../../context/AuthContext'
import { toast } from '../../utils/toast'
import { PageHeader, EmptyState } from '../../components/ui'
import { Icon } from '../../components/Icons'

export default function Notifications() {
  const { user } = useAuth()
  const [items, setItems] = useState(db.getNotifications().filter((n) => n.userId === user?.id))

  const markRead = (id) => {
    setItems(items.map((n) => n.id === id ? { ...n, read: true } : n))
    db.saveNotifications(db.getNotifications().map((n) => n.id === id ? { ...n, read: true } : n))
  }
  const markAll = () => {
    setItems(items.map((n) => ({ ...n, read: true })))
    db.saveNotifications(db.getNotifications().map((n) => ({ ...n, read: true })))
    toast('All marked as read')
  }

  return (
    <div>
      <PageHeader title="Notifications" sub="Alerts, requests and updates."
        actions={items.some((n) => !n.read) ? <button className="btn btn-ghost btn-sm" onClick={markAll}>Mark all as read</button> : null} />

      {items.length === 0 ? (
        <EmptyState icon="🔔" title="No notifications" desc="You're all caught up!" />
      ) : (
        <div className="grid gap-3">
          {items.map((n) => (
            <div key={n.id} className="card flex-between wrap" style={{ gap: 12, borderLeft: n.read ? '4px solid var(--line)' : '4px solid var(--brand)', opacity: n.read ? 0.75 : 1 }}>
              <div className="flex gap-3" style={{ flex: 1, minWidth: 200 }}>
                <span className="stat-icon" style={{ background: n.read ? 'var(--line-soft)' : 'var(--brand-faint)', color: n.read ? 'var(--muted)' : 'var(--brand)' }}><Icon.Bell /></span>
                <div>
                  <strong style={{ color: 'var(--ink)' }}>{n.title}</strong>
                  <p style={{ fontSize: 14 }}>{n.message}</p>
                  <div className="muted" style={{ fontSize: 12 }}>{n.date}</div>
                </div>
              </div>
              {!n.read && <button className="btn btn-outline btn-sm" onClick={() => markRead(n.id)}>Mark read</button>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
