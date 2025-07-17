'use client'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

interface User {
  _id: string
  username: string
}

export default function ManageFollowsPage() {
  const auth = useAuth()
  const router = useRouter()
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [following, setFollowing] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [userLoading, setUserLoading] = useState(false)

  useEffect(() => {
    if (!auth.isAuthenticated) {
      router.push('/login')
      return
    }
    const fetchUsers = async () => {
      setUserLoading(true)
      try {
        // Get all users
        const res = await fetch('http://localhost:8080/users', {
          headers: { Authorization: `Bearer ${auth.token}` }
        })
        let users: User[] = []
        if (res.ok) {
          users = await res.json()
        }
        // Get following list
        const res2 = await fetch(`http://localhost:8080/users/${auth.user?.id}`, {
          headers: { Authorization: `Bearer ${auth.token}` }
        })
        let followingUsers: User[] = []
        if (res2.ok) {
          const data2 = await res2.json()
          followingUsers = data2.following || []
        }
        setAllUsers(users.filter(u => u._id !== auth.user?.id))
        setFollowing(followingUsers)
      } finally {
        setUserLoading(false)
      }
    }
    fetchUsers()
  }, [auth.isAuthenticated, auth.token, auth.user?.id])

  const handleFollow = async (id: string) => {
    await fetch(`http://localhost:8080/users/${id}/follow`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    setFollowing([...following, allUsers.find(u => u._id === id)!])
  }
  const handleUnfollow = async (id: string) => {
    await fetch(`http://localhost:8080/users/${id}/unfollow`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    setFollowing(following.filter(f => f._id !== id))
  }

  const searchResults = allUsers.filter(
    u =>
      !following.some(f => f._id === u._id) &&
      u.username.toLowerCase().includes(search.toLowerCase())
  )

  if (!auth.isAuthenticated) return null

  return (
    <main className="flex flex-col items-center min-h-screen py-8 bg-white">
      <div className="flex gap-4 mb-6">
        <Link href="/"><Button variant="outline">Home</Button></Link>
        <Link href="/feed"><Button>Feed</Button></Link>
        <Link href="/create-post"><Button>Create Post</Button></Link>
      </div>
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 mb-8">
        {/* Left: Following */}
        <div className="flex-1">
          <Card>
            <CardHeader>Following</CardHeader>
            <CardContent>
              {userLoading ? <div>Loading...</div> : following.length === 0 ? <div>You are not following anyone.</div> : (
                <ul>
                  {following.map(u => (
                    <li key={u._id} className="flex items-center gap-2 mb-2">
                      <span>{u.username}</span>
                      <Button size="sm" variant="destructive" onClick={() => handleUnfollow(u._id)}>Unfollow</Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Right: Search and Follow */}
        <div className="flex-1">
          <Card>
            <CardHeader>Users You Can Follow</CardHeader>
            <CardContent>
              <Input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="mb-2"
              />
              {userLoading ? <div>Loading...</div> : searchResults.length === 0 ? <div>No users found.</div> : (
                <ul>
                  {searchResults.map(u => (
                    <li key={u._id} className="flex items-center gap-2 mb-2">
                      <span>{u.username}</span>
                      <Button size="sm" onClick={() => handleFollow(u._id)}>Follow</Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
} 