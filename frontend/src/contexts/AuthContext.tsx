'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

interface AuthContextType {
  user: any
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null)

  const getUserInfo = (token: string) => {
    try {
      const decoded: any = jwtDecode(token)
      setUser({ username: decoded.username, id: decoded.sub })
    } catch {
      setUser(null)
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      getUserInfo(storedToken)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) return false
      const data = await res.json()
      setToken(data.access_token)
      localStorage.setItem('token', data.access_token)
      getUserInfo(data.access_token)
      return true
    } catch {
      return false
    }
  }

  const signup = async (username: string, email: string, password: string) => {
    try {
      const res = await fetch('http://localhost:8080/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      })
      return res.ok
    } catch {
      return false
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
} 