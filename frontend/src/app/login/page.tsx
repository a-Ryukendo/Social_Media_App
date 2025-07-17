'use client'
import { useAuth } from '../../contexts/AuthContext'
import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const auth = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const ok = await auth.login(email, password)
    if (ok) {
      window.location.href = '/'
    } else {
      setError('Invalid credentials')
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white flex-col">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>Login</CardHeader>
        <CardContent>
          <Form>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="mt-6 text-center w-full flex justify-center">
        <span>Don't have an account? </span>
        <Link href="/signup" className="text-blue-600 hover:underline ml-1">Sign up</Link>
      </div>
    </div>
  )
} 