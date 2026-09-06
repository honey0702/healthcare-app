import { useMemo, useState } from 'react'
import { db } from '../../utils/db'
import { useAuth } from '../../context/AuthContext'
import { EmptyState, PageHeader } from '../../components/ui'
import { Icon } from '../../components/Icons'

export default function DoctorPatients() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const users = db.getUsers()
  const appts = db.getAppointments().filter((a) => a.doctorId === user?.doctorId || a.doctorName === user?.name)
  const patientIds = [...new Set(appts.map((a) => a.patientId))]

  const patients = useMemo(() => {
    return patientIds.map((pid) => {
      const u = users.find((x) => x.id === pid)
      const pAppts = appts.filter((a) => a.patientId === pid)
      return {
        id: pid, name: u?.name || 'Patient', mobile: u?.mobile, bloodGroup: u?.bloodGroup,
        visits: pAppts.length, lastVisit: [...pAppts].sort((a, b) => b.date.localeCompare(a.date))[0]?.date,
      }
    }).filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || (p.mobile || '').includes(query))
  }, [patientIds, users, appts, query])

  return (
    <div>
      <PageHeader title="My Patients" sub="Information about all patients you've treated." />
      <div className="search-bar" style={{ maxWidth: 380, marginBottom: 20 }}>
        <Icon.Search style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
        <input placeholder="Search patient…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ paddingLeft: 46 }} />
      </div>

      {patients.length === 0 ? (
        <EmptyState icon="👥" title="No patients yet" desc="Patients appear here after you've had appointments with them." />
      ) : (
        <div className="grid grid-3 stagger">
          {patients.map((p) => (
            <div key={p.id} className="card">
              <div className="flex gap-3" style={{ alignItems: 'center', marginBottom: 12 }}>
                <span className="avatar avatar-lg">{p.name[0]}</span>
                <div>
                  <strong style={{ color: 'var(--ink)', fontSize: 16 }}>{p.name}</strong>
                  <div className="muted" style={{ fontSize: 13 }}>+91 {p.mobile}</div>
                </div>
              </div>
              <div className="flex gap-2 wrap">
                <span className="badge badge-gray">Visits: {p.visits}</span>
                {p.bloodGroup && <span className="badge badge-red">🩸 {p.bloodGroup}</span>}
              </div>
              <div className="muted" style={{ fontSize: 13, marginTop: 10 }}>Last visit: {p.lastVisit || '—'}</div>
              <button className="btn btn-ghost btn-sm btn-block mt-3" onClick={() => alert(`Viewing full records of ${p.name} (demo)`)}>View Records</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
