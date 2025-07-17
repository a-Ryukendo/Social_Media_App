'use client'
import { useAuth } from '../../contexts/AuthContext'
import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import Link from 'next/link'

export default function SignupPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const auth = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const ok = await auth.signup(username, email, password)
    if (ok) {
      window.location.href = '/login'
    } else {
      setError('Signup failed')
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white flex-col">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>Sign Up</CardHeader>
        <CardContent>
          <Form>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
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
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="mt-6 text-center w-full flex justify-center">
        <span>Already have an account? </span>
        <Link href="/login" className="text-blue-600 hover:underline ml-1">Login</Link>
      </div>
    </div>
  )
} 