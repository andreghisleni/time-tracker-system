'use client'

import { trpc } from '@/utils/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RouterOutput } from '@/server/trpc'
import { Filters } from '../filters'
import { useState } from 'react'

export default function ReadOnlyPage() {
  const formatTime = (dateTime: Date) => {
    return new Date(dateTime).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const formatDate = (dateTime: Date) => {
    return new Date(dateTime).toLocaleDateString('pt-BR')
  }
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [date, setDate] = useState('')
  const [startDateFilter, setStartDateFilter] = useState('')
  const [endDateFilter, setEndDateFilter] = useState('')
  const [quickFilter, setQuickFilter] = useState('')

  const utils = trpc.useUtils()

  const { data: timeEntries = [] as RouterOutput['getTimeEntries'], isLoading } = trpc.getTimeEntries.useQuery({
    startDate: startDateFilter || undefined,
    endDate: endDateFilter || undefined,
  })

  const totalHours = timeEntries.reduce((sum: number, entry: RouterOutput['getTimeEntries'][0]) => sum + entry.totalHours, 0)



  const createTimeEntry = trpc.createTimeEntry.useMutation({
    onSuccess: () => {
      utils.getTimeEntries.invalidate()
      setStartTime('')
      setEndTime('')
      setDate('')
    },
  })

  const deleteTimeEntry = trpc.deleteTimeEntry.useMutation({
    onSuccess: () => {
      utils.getTimeEntries.invalidate()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (startTime && endTime && date) {
      createTimeEntry.mutate({ startTime, endTime, date })
    }
  }

  // Group entries by date for better visualization
  const entriesByDate = timeEntries.reduce((acc: Record<string, {
    startTime: string;
    endTime: string;
    date: string;
    id: string;
    totalHours: number;
    createdAt: string;
    updatedAt: string;
  }[]>, entry: RouterOutput['getTimeEntries'][0]) => {
    const dateKey = formatDate(new Date(entry.date))
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(entry)
    return acc
  }, {} as Record<string, typeof timeEntries>)

  const dailyTotals = Object.entries(entriesByDate).map(([date, entries]) => ({
    date,
    totalHours: entries.reduce((sum: number, entry) => sum + entry.totalHours, 0),
    entries: entries.length,
  }))


  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Time Tracker - Read Only</h1>

      <Filters
        quickFilter={quickFilter}
        startDateFilter={startDateFilter}
        endDateFilter={endDateFilter}
        setQuickFilter={setQuickFilter}
        setStartDateFilter={setStartDateFilter}
        setEndDateFilter={setEndDateFilter}
      />

      {/* Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            Total Hours: <span className="font-bold">{totalHours.toFixed(2)}</span>
          </p>
          <p className="text-sm text-gray-600">
            Showing {timeEntries.length} entries
          </p>
        </CardContent>
      </Card>

      {/* Time Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : timeEntries.length === 0 ? (
            <p>No time entries found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Total Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{formatDate(new Date(entry.date))}</TableCell>
                    <TableCell>{formatTime(new Date(entry.startTime))}</TableCell>
                    <TableCell>{formatTime(new Date(entry.endTime))}</TableCell>
                    <TableCell>{entry.totalHours.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

