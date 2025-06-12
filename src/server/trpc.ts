import { z } from 'zod'
import { inferRouterInputs, inferRouterOutputs, initTRPC } from '@trpc/server'
import { prisma } from '@/lib/prisma'

import { addHours } from 'date-fns'

const t = initTRPC.create()

export const router = t.router
export const publicProcedure = t.procedure

const timeEntrySchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  date: z.string(),
})

const filterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export const appRouter = router({
  // Get all time entries with optional filtering
  getTimeEntries: publicProcedure
    .input(filterSchema)
    .query(async ({ input }) => {
      const where: any = {} // eslint-disable-line @typescript-eslint/no-explicit-any
      
      if (input.startDate || input.endDate) {
        where.date = {}
        if (input.startDate) {
          where.date.gte = new Date(input.startDate)
        }
        if (input.endDate) {
          where.date.lte = new Date(input.endDate)
        }
      }

      return await prisma.timeEntry.findMany({
        where,
        orderBy: { date: 'desc' }
      })
    }),

  // Create a new time entry
  createTimeEntry: publicProcedure
    .input(timeEntrySchema)
    .mutation(async ({ input }) => {
      const startTime = new Date(`${input.date}T${input.startTime}`)
      const endTime = new Date(`${input.date}T${input.endTime}`)
      const date = new Date(input.date)
      
      // Calculate total hours
      const totalHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)

      return await prisma.timeEntry.create({
        data: {
          startTime,
          endTime,
          date,
          totalHours,
        },
      })
    }),

  // Delete a time entry
  deleteTimeEntry: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.timeEntry.delete({
        where: { id: input.id },
      })
    }),

  // Update a time entry
  updateTimeEntry: publicProcedure
    .input(z.object({
      id: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      date: z.string(),
    }))
    .mutation(async ({ input }) => {
      const startTime = addHours(new Date(`${input.date}T${input.startTime}`), 3)
      const endTime = addHours(new Date(`${input.date}T${input.endTime}`), 3)
      const date = addHours(new Date(input.date), 3)

      // Calculate total hours
      const totalHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)

      return await prisma.timeEntry.update({
        where: { id: input.id },
        data: {
          startTime,
          endTime,
          date,
          totalHours,
        },
      })
    }),
})

export type AppRouter = typeof appRouter
export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>