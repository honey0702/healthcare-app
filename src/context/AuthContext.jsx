import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../utils/api'
import { db } from '../utils/db'
import { toast } from '../utils/toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const session = db.getSession()
    const accessToken = db.getAccessToken()

    if (!session || !accessToken) {
      setLoading(false)
      return () => { mounted = false }
    }

    // Restore the session from Django instead of trusting stale localStorage data.
    api.me(accessToken)
      .then((currentUser) => {
        if (mounted) {
          db.saveSession(currentUser)
          setUser(currentUser)
        }
      })
      .catch(() => {
        if (mounted) {
          db.clearSession()
          setUser(null)
        }
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => { mounted = false }
  }, [])

  const register = async (data) => {
    try {
      const result = await api.register(data)
      if (result.tokens) {
        db.saveAuth(result)
        setUser(result.user)
      }
      return result.user
    } catch (error) {
      toast(error.message, 'error')
      return null
    }
  }

  const login = async ({ mobile, password }) => {
    try {
      const result = await api.login({ mobile, password })
      db.saveAuth(result)
      setUser(result.user)
      toast(`Welcome back, ${result.user.name.split(' ')[0]}!`)
      return result.user
    } catch (error) {
      toast(error.message, 'error')
      return null
    }
  }

  // Profile edits and the remaining dashboard features still use the mock data
  // layer for now. They will move to API endpoints in the next backend phase.
  const updateUser = (patch) => {
    if (!user) return null
    const users = db.getUsers()
    const updatedList = users.map((item) => item.id === user.id ? { ...item, ...patch } : item)
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
    const users = db.getUsers().filter((item) => item.id !== user?.id)
    db.saveUsers(users)
    db.clearSession()
    setUser(null)
    toast('Account deleted', 'info')
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, updateUser, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
