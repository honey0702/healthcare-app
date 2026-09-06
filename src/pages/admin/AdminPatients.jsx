import { useMemo, useState } from 'react'
import { db } from '../../utils/db'
import { PageHeader, EmptyState } from '../../components/ui'
import { Icon } from '../../components/Icons'

export default function AdminPatients() {
  const [query, setQuery] = useState('')
  const patients = db.getUsers().filter((u) => u.role === 'patient')

  const filtered = useMemo(() => patients.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || (p.mobile || '').includes(query)), [patients, query])

  return (
    <div>
      <PageHeader title="Patient Management" sub="All registered patients." />
      <div className="search-bar" style={{ maxWidth: 380, marginBottom: 20 }}>
        <Icon.Search style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
        <input placeholder="Search patient…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ paddingLeft: 46 }} />
      </div>
      {filtered.length === 0 ? <EmptyState icon="👥" title="No patients found" /> : (
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>Patient</th><th>Mobile</th><th>Email</th><th>Blood Group</th><th>Gender</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td><strong style={{ color: 'var(--ink)' }}>{p.name}</strong></td>
                  <td>+91 {p.mobile}</td>
                  <td>{p.email || '—'}</td>
                  <td>{p.bloodGroup || '—'}</td>
                  <td>{p.gender || '—'}</td>
                  <td><span className="badge badge-green">ACTIVE</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
