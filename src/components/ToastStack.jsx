import { useEffect, useState } from 'react'
import { onToast, toastIcon } from '../utils/toast'

export default function ToastStack() {
  const [items, setItems] = useState([])

  useEffect(() => {
    const unsub = onToast((t) => {
      setItems((prev) => [...prev, t])
      setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== t.id)), 3200)
    })
    return unsub
  }, [])

  return (
    <div className="toast-stack">
      {items.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{toastIcon[t.type]}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}
