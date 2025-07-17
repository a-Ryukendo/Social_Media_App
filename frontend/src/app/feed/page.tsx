'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface Post {
  _id: string
  title: string
  description: string
  author: string
  createdAt: string
}

export default function FeedPage() {
  const auth = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth.isAuthenticated) {
      router.push('/login')
      return
    }
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const res = await fetch('http://localhost:8080/posts/timeline', {
          headers: { Authorization: `Bearer ${auth.token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setPosts(data)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [auth.isAuthenticated, auth.token, router])

  if (!auth.isAuthenticated) return null

  return (
    <main className="flex flex-col items-center min-h-screen py-8 bg-white">
      <div className="flex gap-4 mb-6">
        <Link href="/"><Button variant="outline">Home</Button></Link>
        <Link href="/create-post"><Button>Create Post</Button></Link>
      </div>
      <h1 className="text-2xl font-bold mb-6">Your Feed</h1>
      {loading ? (
        <div>Loading...</div>
      ) : posts.length === 0 ? (
        <div>No posts to show.</div>
      ) : (
        <div className="w-full max-w-xl space-y-4">
          {posts.map(post => (
            <Card key={post._id}>
              <CardHeader>{post.title}</CardHeader>
              <CardContent>
                <div className="mb-2 text-gray-700">{post.description}</div>
                <div className="text-xs text-gray-400">By {post.author} on {new Date(post.createdAt).toLocaleString()}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
} 