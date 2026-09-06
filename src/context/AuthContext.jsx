import { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../utils/db'
import { toast } from '../utils/toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const s = db.getSession()
    setUser(s)
    setLoading(false)
  }, [])

  const register = (data) => {
    const users = db.getUsers()
    if (users.some((u) => u.mobile === data.mobile)) {
      toast('Mobile number already registered', 'error')
      return null
    }
    const newUser = { id: db.id('u'), ...data, status: data.role === 'doctor' ? 'pending' : 'approved' }
    db.saveUsers([...users, newUser])
    if (data.role === 'doctor') {
      db.saveNotifications([...db.getNotifications(), {
        id: db.id('n'), userId: 'u-admin', title: 'New doctor registration',
        message: `${newUser.name} applied to join. Please verify their details.`, read: false, date: new Date().toISOString().slice(0, 10),
      }])
    }
    // Auto-login for non-doctor roles
    if (data.role !== 'doctor') {
      db.saveSession(newUser)
      setUser(newUser)
    }
    return newUser
  }

  const login = ({ mobile, password }) => {
    const users = db.getUsers()
    const found = users.find((u) => u.mobile === mobile && u.password === password)
    if (!found) { toast('Invalid mobile number or password', 'error'); return false }
    if (found.role === 'doctor' && found.status !== 'approved') {
      toast('Your doctor account is awaiting admin approval', 'error')
      return false
    }
    db.saveSession(found)
    setUser(found)
    toast(`Welcome back, ${found.name.split(' ')[0]}!`)
    return true
  }

  const loginOtp = ({ mobile, otp }) => {
    const users = db.getUsers()
    const found = users.find((u) => u.mobile === mobile)
    if (!found) { toast('Mobile number not registered', 'error'); return false }
    if (otp !== '123456') { toast('Invalid OTP', 'error'); return false }
    if (found.role === 'doctor' && found.status !== 'approved') {
      toast('Your doctor account is awaiting admin approval', 'error'); return false
    }
    db.saveSession(found)
    setUser(found)
    toast('Logged in via OTP')
    return true
  }

  const resetPassword = ({ mobile, otp, newPassword }) => {
    const users = db.getUsers()
    const found = users.find((u) => u.mobile === mobile)
    if (!found) { toast('Mobile number not registered', 'error'); return false }
    if (otp !== '123456') { toast('Invalid OTP', 'error'); return false }
    const updated = users.map((u) => u.mobile === mobile ? { ...u, password: newPassword } : u)
    db.saveUsers(updated)
    toast('Password reset successfully. Please login.')
    return true
  }

  const updateUser = (patch) => {
    const users = db.getUsers()
    const updatedList = users.map((u) => u.id === user.id ? { ...u, ...patch } : u)
    db.saveUsers(updatedList)
    const updatedUser = { ...user, ...patch }
    setUser(updatedUser)
    db.saveSession(updatedUser)
    toast('Profile updated')
    return updatedUser
  }

  const logout = () => {
    db.clearSession()
    setUser(null)
    toast('Logged out successfully', 'info')
  }

  const deleteAccount = () => {
    const users = db.getUsers().filter((u) => u.id !== user?.id)
    db.saveUsers(users)
    db.clearSession()
    setUser(null)
    toast('Account deleted', 'info')
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, loginOtp, resetPassword, updateUser, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
