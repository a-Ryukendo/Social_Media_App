'use client'
import '../app/globals.css'
import { AuthProvider } from '../contexts/AuthContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <header className="w-full py-4 bg-blue-600 text-white text-center text-2xl font-bold shadow-md">
            Social Media App
          </header>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
