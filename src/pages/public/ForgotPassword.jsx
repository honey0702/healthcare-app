import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from '../../utils/toast'
import { LogoMark } from '../../components/ui'
import { Icon } from '../../components/Icons'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const sendOtp = () => {
    if (!mobile) { toast('Enter your mobile number', 'error'); return }
    setOtpSent(true)
    toast('OTP sent to your mobile (demo: 123456)', 'info')
  }

  const submit = (e) => {
    e.preventDefault()
    if (newPassword !== confirm) { toast('Passwords do not match', 'error'); return }
    if (resetPassword({ mobile, otp, newPassword })) navigate('/login')
  }

  return (
    <div className="container section" style={{ maxWidth: 460 }}>
      <div className="card anim-up" style={{ padding: 34 }}>
        <div className="flex-center mb-4"><LogoMark size={48} /></div>
        <h2 style={{ textAlign: 'center', fontSize: 24, marginBottom: 4 }}>Reset Password</h2>
        <p className="muted" style={{ textAlign: 'center', marginBottom: 24 }}>Verify your mobile number to set a new password.</p>

        <form onSubmit={submit}>
          <div className="field"><label>Mobile Number</label><input placeholder="+91 98765 43210" value={mobile} onChange={(e) => setMobile(e.target.value)} required /></div>

          {!otpSent ? (
            <button type="button" className="btn btn-primary btn-block btn-lg mt-2" onClick={sendOtp}><Icon.Send /> Send OTP</button>
          ) : (
            <div className="anim-in">
              <div className="field"><label>Enter OTP</label><input placeholder="Demo OTP: 123456" value={otp} onChange={(e) => setOtp(e.target.value)} required /></div>
              <div className="field"><label>New Password</label><input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /></div>
              <div className="field"><label>Confirm New Password</label><input type="password" placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required /></div>
              <button className="btn btn-primary btn-block btn-lg mt-2">Reset Password</button>
            </div>
          )}
        </form>

        <p className="muted" style={{ textAlign: 'center', marginTop: 18, fontSize: 14 }}>
          Remembered it? <Link to="/login" style={{ color: 'var(--brand)', fontWeight: 700 }}>Login</Link>
        </p>
      </div>
    </div>
  )
}
