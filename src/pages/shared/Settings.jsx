import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../utils/db'
import { toast } from '../../utils/toast'
import { PageHeader } from '../../components/ui'
import { Icon } from '../../components/Icons'

export default function Settings() {
  const { user, updateUser, logout, deleteAccount } = useAuth()
  const navigate = useNavigate()
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [notif, setNotif] = useState({ email: true, sms: true, app: true })

  const changePw = (e) => {
    e.preventDefault()
    if (pw.current !== user.password) { toast('Current password is incorrect', 'error'); return }
    if (pw.next !== pw.confirm) { toast('New passwords do not match', 'error'); return }
    updateUser({ password: pw.next })
    setPw({ current: '', next: '', confirm: '' })
    toast('Password changed successfully')
  }

  const del = () => {
    if (window.confirm('This will permanently delete your account and all data. Continue?')) {
      deleteAccount(); navigate('/')
    }
  }

  return (
    <div>
      <PageHeader title="Settings" sub="Manage your password, preferences and account." />
      <div className="grid grid-2">
        <form className="card" onSubmit={changePw}>
          <h3 style={{ fontSize: 18, marginBottom: 14 }}>Change Password</h3>
          <div className="field"><label>Current Password</label><input type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} required /></div>
          <div className="field"><label>New Password</label><input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} required /></div>
          <div className="field"><label>Confirm New Password</label><input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} required /></div>
          <button className="btn btn-primary btn-sm">Update Password</button>
        </form>

        <div className="card">
          <h3 style={{ fontSize: 18, marginBottom: 14 }}>Notification Preferences</h3>
          {[['email', 'Email notifications'], ['sms', 'SMS reminders'], ['app', 'In-app notifications']].map(([k, l]) => (
            <label key={k} className="flex-between" style={{ padding: '10px 0', borderBottom: '1px solid var(--line-soft)', cursor: 'pointer' }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{l}</span>
              <input type="checkbox" checked={notif[k]} onChange={() => setNotif((n) => ({ ...n, [k]: !n[k] }))} style={{ width: 18, height: 18 }} />
            </label>
          ))}
          <button className="btn btn-ghost btn-sm mt-3" onClick={() => toast('Preferences saved')}>Save Preferences</button>

          <div className="divider" />
          <h3 style={{ fontSize: 18, marginBottom: 10 }}>Account</h3>
          <div className="flex gap-2 wrap">
            <button className="btn btn-outline btn-sm" onClick={() => { logout(); navigate('/') }}><Icon.Logout /> Logout</button>
            <button className="btn btn-danger btn-sm" onClick={del}><Icon.Trash /> Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  )
}
