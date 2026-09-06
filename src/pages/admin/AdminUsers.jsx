import { useState } from 'react'
import { db } from '../../utils/db'
import { toast } from '../../utils/toast'
import { PageHeader, EmptyState } from '../../components/ui'
import { Icon } from '../../components/Icons'

export default function AdminUsers() {
  const [users, setUsers] = useState(db.getUsers())

  const roleLabel = { patient: '👤 Patient', doctor: '🩺 Doctor', admin: '🛡️ Admin' }

  const toggleActive = (id) => {
    const list = users.map((u) => u.id === id ? { ...u, active: !u.active } : u)
    setUsers(list); db.saveUsers(list); toast('User status updated')
  }

  const del = (id) => {
    if (!window.confirm('Remove this user?')) return
    const list = users.filter((u) => u.id !== id)
    setUsers(list); db.saveUsers(list); toast('User removed', 'info')
  }

  return (
    <div>
      <PageHeader title="User Management" sub="Manage all registered users and admin accounts." />
      {users.length === 0 ? <EmptyState icon="👥" title="No users" /> : (
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>User</th><th>Role</th><th>Mobile</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td><strong style={{ color: 'var(--ink)' }}>{u.name}</strong></td>
                  <td>{roleLabel[u.role]}</td>
                  <td>+91 {u.mobile}</td>
                  <td><span className={`badge ${u.active === false ? 'badge-red' : 'badge-green'}`}>{u.active === false ? 'INACTIVE' : (u.status === 'pending' ? 'PENDING' : 'ACTIVE')}</span></td>
                  <td><div className="flex gap-2">
                    <button className="btn btn-ghost btn-sm" onClick={() => toggleActive(u.id)}><Icon.Refresh /> Toggle</button>
                    <button className="btn btn-danger btn-sm" onClick={() => del(u.id)}><Icon.Trash /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
