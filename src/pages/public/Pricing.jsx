import { useMemo, useState } from 'react'
import { db } from '../../utils/db'
import { Icon } from '../../components/Icons'

export default function Pricing() {
  const prices = db.getPrices()
  const insurances = db.getInsurances()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => prices.filter((p) => p.service.toLowerCase().includes(query.toLowerCase())), [prices, query])

  return (
    <div className="container section">
      <div className="anim-up" style={{ textAlign: 'center', marginBottom: 34 }}>
        <span className="tag mb-2">💰 Transparent Pricing</span>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 10 }}>Pricing for Rooms & Services</h1>
        <p className="muted" style={{ maxWidth: 560, margin: '0 auto' }}>Clear, upfront costs — no hidden charges, ever.</p>
      </div>

      <div className="search-bar" style={{ maxWidth: 440, margin: '0 auto 28px' }}>
        <Icon.Search style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
        <input placeholder="Search a service (e.g. MRI, Room, Delivery)…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ paddingLeft: 46 }} />
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap" style={{ border: 'none' }}>
          <table className="tbl">
            <thead><tr><th>Service</th><th>Unit</th><th>Price</th><th></th></tr></thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.service}>
                  <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{p.service}</td>
                  <td>{p.unit}</td>
                  <td style={{ fontWeight: 800, color: 'var(--brand-dark)' }}>₹{p.price.toLocaleString('en-IN')}</td>
                  <td><span className="badge badge-green"><Icon.Check /> Listed</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insurance */}
      <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, margin: '54px 0 8px' }}>Insurance Partners</h2>
      <p className="muted" style={{ textAlign: 'center', marginBottom: 30 }}>Cashless and reimbursement options for smoother hospital stays.</p>
      <div className="grid grid-4 stagger">
        {insurances.map((i) => (
          <div key={i.provider} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 38, marginBottom: 10 }}>🛡️</div>
            <h3 style={{ fontSize: 17 }}>{i.provider}</h3>
            <div className="muted" style={{ fontSize: 13, margin: '4px 0' }}>{i.network}</div>
            <span className={`badge ${i.cashless ? 'badge-green' : 'badge-amber'}`}>{i.cashless ? '✓ Cashless' : 'Reimbursement'}</span>
            <div style={{ fontWeight: 700, color: 'var(--brand-dark)', marginTop: 10 }}>{i.coverage}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
