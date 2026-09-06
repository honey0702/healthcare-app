import { Link } from 'react-router-dom'
import { LogoMark } from './ui'
import { Icon } from './Icons'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--grad-ink)', color: '#cbd5e1', marginTop: 'auto' }}>
      <div className="container" style={{ padding: '52px 22px 20px' }}>
        <div className="grid grid-4" style={{ marginBottom: 30 }}>
          <div>
            <div className="flex gap-2" style={{ marginBottom: 14, alignItems: 'center' }}>
              <LogoMark />
              <span style={{ fontWeight: 800, fontSize: 19, color: '#fff' }}>MediCare+</span>
            </div>
            <p style={{ fontSize: 14, maxWidth: 260 }}>Your single digital platform for hospitals, doctors, rooms, transparent pricing and easy appointment booking.</p>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: 14, fontSize: 15 }}>Quick Links</h4>
            {[['/doctors', 'Find Doctors'], ['/hospitals', 'Hospitals'], ['/rooms', 'Room Availability'], ['/pricing', 'Pricing']].map(([to, l]) => (
              <Link key={to} to={to} style={{ display: 'block', padding: '4px 0', fontSize: 14 }}>{l}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: 14, fontSize: 15 }}>Patient</h4>
            {[['/register', 'Create Account'], ['/login', 'Login'], ['/about', 'About Us'], ['/about', 'Feedback']].map(([to, l]) => (
              <Link key={l} to={to} style={{ display: 'block', padding: '4px 0', fontSize: 14 }}>{l}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: 14, fontSize: 15 }}>Contact</h4>
            <div className="flex gap-2" style={{ padding: '4px 0', fontSize: 14 }}><Icon.Phone /> +91 90000 00000</div>
            <div className="flex gap-2" style={{ padding: '4px 0', fontSize: 14 }}><Icon.Mail /> care@medicareplus.in</div>
            <div className="flex gap-2" style={{ padding: '4px 0', fontSize: 14 }}><Icon.MapPin /> Ahmedabad, Gujarat</div>
          </div>
        </div>
        <div className="divider" style={{ background: 'rgba(255,255,255,.1)', margin: '20px 0' }} />
        <div className="flex-between wrap" style={{ gap: 12 }}>
          <span style={{ fontSize: 13 }}>© 2026 MediCare+. All rights reserved.</span>
          <span style={{ fontSize: 13 }}>Made with <Icon.Heart style={{ color: '#f43f5e', verticalAlign: 'middle' }} /> for better healthcare.</span>
        </div>
      </div>
    </footer>
  )
}
