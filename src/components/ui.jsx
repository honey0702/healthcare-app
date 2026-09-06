import { Icon } from './Icons'

/* Brand logo mark */
export function LogoMark({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0d9488" />
          <stop offset="1" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="24" fill="url(#lg)" />
      <circle cx="50" cy="42" r="16" fill="#fff" opacity=".95" />
      <path d="M30 66c0-11 9-18 20-18s20 7 20 18v6H30Z" fill="#fff" opacity=".95" />
      <path d="M50 38v-8M46 42h8" stroke="#0d9488" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ light = false }) {
  return (
    <span className="nav-logo" style={{ color: light ? '#fff' : undefined }}>
      <LogoMark />
      <span>
        MediCare<span className="text-gradient">+</span>
      </span>
    </span>
  )
}

/* Star rating row */
export function Rating({ value = 0, size = 14 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2, alignItems: 'center', color: '#f59e0b' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= Math.round(value) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path d="M12 2.5 15 9l7 .6-5.3 4.7L18.3 21 12 17.3 5.7 21 7.3 14.3 2 9.6 9 9Z" />
        </svg>
      ))}
      <span style={{ marginLeft: 6, color: '#64748b', fontSize: 13, fontWeight: 600 }}>{value.toFixed(1)}</span>
    </span>
  )
}

/* Stat card for dashboards */
export function StatCard({ icon, label, value, color = 'brand', sub, delay = '' }) {
  const map = {
    brand: 'var(--brand-faint)', dark: 'var(--line-soft)', green: 'var(--green-soft)',
    amber: 'var(--amber-soft)', red: 'var(--red-soft)', blue: 'var(--blue-soft)', violet: 'var(--violet-soft)',
  }
  const iconColor = {
    brand: 'var(--brand)', dark: 'var(--ink)', green: '#047857', amber: '#b45309',
    red: '#b91c1c', blue: '#1d4ed8', violet: '#6d28d9',
  }
  return (
    <div className={`card anim-up ${delay}`} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20 }}>
      <div className="stat-icon" style={{ background: map[color], color: iconColor[color] }}>{icon}</div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {sub && <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  )
}

/* Modal wrapper */
export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="close"><Icon.X /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

/* Empty state */
export function EmptyState({ icon = '📭', title, desc, children }) {
  return (
    <div className="empty card" style={{ boxShadow: 'none' }}>
      <div className="empty-icon">{icon}</div>
      <h3 style={{ marginBottom: 6, color: 'var(--ink-soft)' }}>{title}</h3>
      <p style={{ maxWidth: 380, margin: '0 auto 16px' }}>{desc}</p>
      {children}
    </div>
  )
}

/* Page header for dashboards */
export function PageHeader({ title, sub, actions }) {
  return (
    <div className="dash-top anim-up">
      <div>
        <h1 className="dash-title">{title}</h1>
        {sub && <div className="dash-sub">{sub}</div>}
      </div>
      {actions && <div className="flex gap-2 wrap">{actions}</div>}
    </div>
  )
}

/* Pills / badge shorthand */
export function Pill({ children, type = 'brand' }) {
  return <span className={`badge badge-${type}`}>{children}</span>
}

/* Section heading */
export function SectionTitle({ kicker, title, desc }) {
  return (
    <div className="sec-title anim-up">
      {kicker && <span className="tag mb-2">{kicker}</span>}
      <h2>{title}</h2>
      {desc && <p>{desc}</p>}
    </div>
  )
}
