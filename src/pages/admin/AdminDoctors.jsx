import { useState } from 'react'
import { db } from '../../utils/db'
import { toast } from '../../utils/toast'
import { PageHeader, EmptyState, Pill } from '../../components/ui'

export default function AdminDoctors() {
  const [users, setUsers] = useState(db.getUsers())
  const doctors = users.filter((u) => u.role === 'doctor')

  const setStatus = (id, status) => {
    const list = users.map((u) => u.id === id ? { ...u, status } : u)
    setUsers(list); db.saveUsers(list)
    toast(`Doctor ${status === 'approved' ? 'approved' : 'rejected'}`)
    if (status === 'approved') {
      db.saveNotifications([...db.getNotifications(), { id: db.id('n'), userId: id, title: 'Account approved', read: false, message: 'Congratulations! Your doctor account has been approved by the admin. You can now log in.', date: new Date().toISOString().slice(0, 10) }])
    }
  }

  return (
    <div>
      <PageHeader title="Doctor Management" sub="Approve or reject doctor registrations and view all details." />
      {doctors.length === 0 ? <EmptyState icon="🩺" title="No doctors registered" /> : (
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>Doctor</th><th>Speciality</th><th>Degree / College</th><th>Experience</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {doctors.map((d) => (
                <tr key={d.id}>
                  <td><strong style={{ color: 'var(--ink)' }}>{d.name}</strong><div className="muted" style={{ fontSize: 12 }}>+91 {d.mobile}</div></td>
                  <td>{d.speciality}</td>
                  <td>{d.degree}<div className="muted" style={{ fontSize: 12 }}>{d.college}</div></td>
                  <td>{d.experience} yrs</td>
                  <td><Pill type={d.status === 'approved' ? 'green' : d.status === 'pending' ? 'amber' : 'red'}>{d.status.toUpperCase()}</Pill></td>
                  <td>
                    {d.status !== 'approved' && <button className="btn btn-success btn-sm" onClick={() => setStatus(d.id, 'approved')}>Approve</button>}
                    {d.status !== 'rejected' && <button className="btn btn-danger btn-sm mt-2" onClick={() => setStatus(d.id, 'rejected')}>Reject</button>}
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
