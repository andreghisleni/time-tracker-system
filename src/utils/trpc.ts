'use client'

import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@/server/trpc'

export const trpc = createTRPCReact<AppRouter>()

export const TRPCProvider = trpc.Provider
