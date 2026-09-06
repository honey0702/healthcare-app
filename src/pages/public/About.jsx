import { Link } from 'react-router-dom'
import { db } from '../../utils/db'
import { Icon } from '../../components/Icons'

export default function About() {
  const wellness = db.getWellness()

  return (
    <div className="container section">
      {/* Who we are */}
      <div className="anim-up" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 60px' }}>
        <span className="tag mb-2">🏥 About Us</span>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>We're Building a <span className="text-gradient">Healthier India</span></h1>
        <p style={{ fontSize: 17, lineHeight: 1.7 }}>
          MediCare+ is a single digital platform that simplifies access to healthcare. We connect patients with hospitals,
          doctors and healthcare services — with transparent pricing, real-time availability and convenient appointment booking.
          From busy cities to small towns, we make quality care one tap away.
        </p>
      </div>

      {/* Mission / vision / values */}
      <div className="grid grid-3 stagger" style={{ marginBottom: 60 }}>
        {[
          { ic: '🎯', t: 'Our Mission', d: 'Remove the friction in healthcare — long waits, unclear prices and difficult discovery.' },
          { ic: '👁️', t: 'Our Vision', d: 'Every patient, anywhere, gets timely, transparent and affordable care.' },
          { ic: '💚', t: 'Our Values', d: 'Transparency, empathy, reliability and technology that serves people first.' },
        ].map((v) => (
          <div key={v.t} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>{v.ic}</div>
            <h3 style={{ fontSize: 19, marginBottom: 8 }}>{v.t}</h3>
            <p style={{ fontSize: 14 }}>{v.d}</p>
          </div>
        ))}
      </div>

      {/* Wellness section */}
      <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Wellness Programs</h2>
      <p className="muted" style={{ textAlign: 'center', marginBottom: 30 }}>Videos and health information to keep you healthy every day.</p>
      <div className="grid grid-3 stagger">
        {wellness.map((w) => (
          <div key={w.id} className="card">
            <div className="stat-icon mb-3" style={{ background: 'var(--brand-faint)', color: 'var(--brand)' }}>
              {w.type === 'Video' ? <Icon.Video /> : <Icon.Book />}
            </div>
            <h3 style={{ fontSize: 17, marginBottom: 6 }}>{w.title}</h3>
            <div className="flex gap-2 wrap" style={{ marginBottom: 12 }}>
              <span className="badge badge-brand">{w.category}</span>
              <span className="badge badge-gray">{w.duration || w.read}</span>
              <span className="badge badge-gray">{w.level || ''}</span>
            </div>
            <button className="btn btn-ghost btn-sm"><Icon.Play /> {w.type === 'Video' ? 'Watch' : 'Read'} Now</button>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="card" style={{ background: 'var(--grad-ink)', color: '#e2e8f0', marginTop: 60, padding: '40px' }}>
        <div className="grid grid-3">
          <div>
            <h3 style={{ color: '#fff', marginBottom: 12 }}>Contact Us</h3>
            <p style={{ fontSize: 14 }}>Have questions? Our support team is here to help 24/7.</p>
          </div>
          <div className="flex gap-3" style={{ fontSize: 14 }}>
            <div style={{ display: 'grid', gap: 8 }}>
              <span className="flex gap-2"><Icon.Phone /> +91 90000 00000</span>
              <span className="flex gap-2"><Icon.Mail /> care@medicareplus.in</span>
            </div>
          </div>
          <div className="flex gap-3" style={{ fontSize: 14, display: 'grid', gap: 8 }}>
            <span className="flex gap-2"><Icon.MapPin /> Ahmedabad, Gujarat</span>
            <span className="flex gap-2"><Icon.Clock /> Mon–Sun · 24x7</span>
          </div>
        </div>
      </div>

      <div className="flex-center mt-5">
        <Link to="/register" className="btn btn-primary btn-lg">Join MediCare+ Today <Icon.Arrow /></Link>
      </div>
    </div>
  )
}
