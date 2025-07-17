'use client'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  const auth = useAuth()

  if (auth.isAuthenticated) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-white">
        <h1 className="text-2xl font-bold mb-2">Welcome, {auth.user?.username}!</h1>
        <p className="mb-4 text-gray-600">User ID: {auth.user?.id}</p>
        <div className="flex flex-col gap-3 mb-6 w-full max-w-xs">
          <Link href="/feed"><Button className="w-full">Feed</Button></Link>
          <Link href="/create-post"><Button className="w-full" variant="outline">Create Post</Button></Link>
          <Link href="/manage-follows"><Button className="w-full" variant="secondary">Follow/Unfollow Users</Button></Link>
          <Button onClick={auth.logout} className="w-full" variant="destructive">Logout</Button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
      <Link href="/login"><Button className="w-full max-w-xs">Login</Button></Link>
    </main>
  )
}
