'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'

export default function LoggedInRoot() {
  const router = useRouter()
  const { isLoaded, userId } = useAuth()

  useEffect(() => {
    if (isLoaded) {
      if (userId) {
        router.push('/upload')
      } else {
        router.push('/sign-in')
      }
    }
  }, [isLoaded, userId, router])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return null
}
