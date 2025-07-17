'use client'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import Link from 'next/link'

export default function CreatePostPage() {
  const auth = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!auth.isAuthenticated) {
      router.push('/login')
    }
  }, [auth.isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8080/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify({ title, description })
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.message || 'Failed to create post')
      } else {
        setSuccess('Post created!')
        setTitle('')
        setDescription('')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  if (!auth.isAuthenticated) return null

  return (
    <main className="flex flex-col items-center min-h-screen py-8 bg-white">
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-4">
        <Link href="/"><Button variant="outline">Home</Button></Link>
        <Link href="/feed"><Button>Feed</Button></Link>
      </div>
      <div className="flex flex-col items-center justify-center w-full min-h-[60vh]">
        <Card className="w-full max-w-md bg-white shadow-lg border border-gray-200">
          <CardHeader>Create Post</CardHeader>
          <CardContent>
            <Form>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
                <Input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                />
                {error && <div className="text-red-500 text-sm">{error}</div>}
                {success && <div className="text-green-600 text-sm">{success}</div>}
                <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Posting...' : 'Create Post'}</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
} 