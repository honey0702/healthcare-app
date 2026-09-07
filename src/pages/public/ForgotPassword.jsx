import { Link } from 'react-router-dom'
import { LogoMark } from '../../components/ui'

export default function ForgotPassword() {
  return (
    <div className="container section" style={{ maxWidth: 460 }}>
      <div className="card anim-up" style={{ padding: 34, textAlign: 'center' }}>
        <div className="flex-center mb-4"><LogoMark size={48} /></div>
        <h2 style={{ fontSize: 24, marginBottom: 8 }}>Password Reset</h2>
        <p className="muted" style={{ lineHeight: 1.7 }}>
          Password reset is not part of the first authentication API release. It will be added with the next backend phase.
        </p>
        <Link to="/login" className="btn btn-primary btn-block btn-lg mt-3">Back to Login</Link>
      </div>
    </div>
  )
}
