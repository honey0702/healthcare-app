import { useState } from 'react'
import { db } from '../../utils/db'
import { toast } from '../../utils/toast'
import { PageHeader, EmptyState } from '../../components/ui'

const pill = { completed: 'green', pending: 'amber', refunded: 'blue', failed: 'red', refund_failed: 'red' }

export default function AdminPayments() {
  const [payments, setPayments] = useState(db.getPayments())

  const update = (id, status, msg) => {
    const list = payments.map((p) => p.id === id ? { ...p, status } : p)
    setPayments(list); db.savePayments(list); toast(msg)
  }

  return (
    <div>
      <PageHeader title="Payment Management" sub="Manage payments, refunds and failures." />
      {payments.length === 0 ? <EmptyState icon="💳" title="No payments" /> : (
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>Ref</th><th>Date</th><th>Type</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{p.ref}</td>
                  <td>{p.date}</td>
                  <td style={{ textTransform: 'capitalize' }}>{p.type}</td>
                  <td style={{ fontWeight: 700 }}>₹{p.amount.toLocaleString('en-IN')}</td>
                  <td><span className={`badge badge-${pill[p.status]}`}>{p.status.replace('_', ' ').toUpperCase()}</span></td>
                  <td><div className="flex gap-2">
                    {p.status === 'pending' && <button className="btn btn-success btn-sm" onClick={() => update(p.id, 'completed', 'Payment confirmed')}>Mark Paid</button>}
                    {p.status === 'pending' && <button className="btn btn-danger btn-sm" onClick={() => update(p.id, 'failed', 'Marked failed')}>Fail</button>}
                    {p.status === 'completed' && <button className="btn btn-ghost btn-sm" onClick={() => update(p.id, 'refunded', 'Refund issued')}>Refund</button>}
                    {p.status === 'refunded' && <span className="muted" style={{ fontSize: 13 }}>Refunded ✓</span>}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
