'use client'

import { trpc, TRPCProvider } from '@/utils/trpc'
import './globals.css'
import { useState } from 'react'
import { QueryClient } from '@tanstack/react-query'
import { trpcLinks } from '@/utils/client'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const [queryClient] = useState(() => {
    return new QueryClient()
  })

  const [trpcClient] = useState(() => {
    return trpc.createClient({
      links: trpcLinks,
    })
  })

  return (
    <html lang="en">
      <body>
        <TRPCProvider client={trpcClient} queryClient={queryClient}>
          {children}
        </TRPCProvider>
      </body>
    </html>
  )
}

