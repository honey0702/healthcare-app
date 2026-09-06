import { useMemo, useState } from 'react'
import { db } from '../../utils/db'
import { useAuth } from '../../context/AuthContext'
import { toast } from '../../utils/toast'
import { PageHeader, EmptyState } from '../../components/ui'
import { Icon } from '../../components/Icons'

const payPill = { completed: 'green', pending: 'amber', refunded: 'blue', failed: 'red', 'refund_failed': 'red' }

export default function Payments() {
  const { user } = useAuth()
  const [payments, setPayments] = useState(db.getPayments().filter((p) => p.patientId === user?.id))
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => filter === 'all' ? payments : payments.filter((p) => p.status === filter), [payments, filter])

  const total = payments.filter((p) => p.status === 'completed').reduce((s, p) => s + p.amount, 0)
  const refund = payments.filter((p) => p.status === 'refunded').reduce((s, p) => s + p.amount, 0)

  const payNow = (p) => {
    if (!window.confirm(`Pay ₹${p.amount} for this consultation? (demo)`)) return
    const list = payments.map((x) => x.id === p.id ? { ...x, status: 'completed', method: 'UPI' } : x)
    setPayments(list); db.savePayments([...db.getPayments().map((x) => x.id === p.id ? { ...x, status: 'completed', method: 'UPI' } : x)])
    toast(`Payment of ₹${p.amount} successful`)
  }

  const requestRefund = (p) => {
    const list = payments.map((x) => x.id === p.id ? { ...x, status: 'refunded' } : x)
    setPayments(list); db.savePayments([...db.getPayments().map((x) => x.id === p.id ? { ...x, status: 'refunded' } : x)])
    toast('Refund initiated. It will reflect in 3-5 days.', 'info')
  }

  return (
    <div>
      <PageHeader title="Payments" sub="Your transactions, payments and refunds." />

      <div className="grid grid-4 stagger" style={{ marginBottom: 22 }}>
          {[
            { l: 'Total Paid', v: `₹${total.toLocaleString('en-IN')}`, c: '#047857' },
            { l: 'Pending', v: `₹${payments.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0).toLocaleString('en-IN')}`, c: '#b45309' },
            { l: 'Refunds', v: `₹${refund.toLocaleString('en-IN')}`, c: '#1d4ed8' },
            { l: 'Failed', v: payments.filter((p) => p.status === 'failed' || p.status === 'refund_failed').length, c: '#b91c1c' },
          ].map((s) => (
          <div key={s.l} className="card anim-up">
            <div className="stat-label">{s.l}</div>
            <div className="stat-value" style={{ color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 wrap" style={{ marginBottom: 18 }}>
        {[['all', 'All'], ['completed', 'Completed'], ['pending', 'Pending'], ['refunded', 'Refunded'], ['failed', 'Failed']].map(([k, l]) => (
          <button key={k} className={`btn btn-sm ${filter === k ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(k)}>{l}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="💳" title="No transactions" desc="Your payment history will appear here." />
      ) : (
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>Ref</th><th>Date</th><th>Type</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{p.ref}</td>
                  <td>{p.date}</td>
                  <td style={{ textTransform: 'capitalize' }}>{p.type}</td>
                  <td style={{ fontWeight: 800, color: 'var(--brand-dark)' }}>₹{p.amount.toLocaleString('en-IN')}</td>
                  <td><span className={`badge badge-${payPill[p.status]}`}>{p.status.replace('_', ' ').toUpperCase()}</span></td>
                  <td>
                    {p.status === 'pending' && <button className="btn btn-primary btn-sm" onClick={() => payNow(p)}><Icon.Wallet /> Pay</button>}
                    {p.status === 'completed' && <button className="btn btn-ghost btn-sm" onClick={() => requestRefund(p)}>Refund</button>}
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
