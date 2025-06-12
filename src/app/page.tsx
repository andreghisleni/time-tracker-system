'use client'

import { useState } from 'react'
import { trpc } from '@/utils/trpc'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RouterOutput } from '@/server/trpc'
import { addHours } from 'date-fns'
import { Filters } from './filters'

export default function HomePage() {
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


  const formatTime = (dateTime: Date) => {
    return new Date(dateTime).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const formatDate = (dateTime: Date) => {
    return addHours(new Date(dateTime), 3).toLocaleDateString('pt-BR')
  }

  const totalHours = timeEntries.reduce((sum: number, entry: RouterOutput['getTimeEntries'][0]) => sum + entry.totalHours, 0)

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
      <h1 className="text-3xl font-bold mb-8">Time Tracker</h1>

      {/* Add Time Entry Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add Time Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={createTimeEntry.isPending}>
                {createTimeEntry.isPending ? 'Adding...' : 'Add Entry'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Enhanced Filters */}

      <Filters
        quickFilter={quickFilter}
        startDateFilter={startDateFilter}
        endDateFilter={endDateFilter}
        setStartDateFilter={setStartDateFilter}
        setEndDateFilter={setEndDateFilter}
        setQuickFilter={setQuickFilter}
      />

      {/* Enhanced Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg">
                Total Hours: <span className="font-bold">{totalHours.toFixed(2)}</span>
              </p>
              <p className="text-sm text-gray-600">
                Showing {timeEntries.length} entries
              </p>
              <p className="text-sm text-gray-600">
                Across {Object.keys(entriesByDate).length} days
              </p>
              {totalHours > 0 && (
                <p className="text-sm text-gray-600">
                  Average per day: {(totalHours / Math.max(Object.keys(entriesByDate).length, 1)).toFixed(2)} hours
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {dailyTotals.length === 0 ? (
              <p className="text-sm text-gray-600">No data available</p>
            ) : (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {dailyTotals.slice(0, 5).map(({ date, totalHours, entries }) => (
                  <div key={date} className="flex justify-between text-sm">
                    <span>{date}</span>
                    <span>{totalHours.toFixed(2)}h ({entries} entries)</span>
                  </div>
                ))}
                {dailyTotals.length > 5 && (
                  <p className="text-xs text-gray-500">
                    ... and {dailyTotals.length - 5} more days
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{formatDate(new Date(entry.date))}</TableCell>
                    <TableCell>{formatTime(new Date(entry.startTime))}</TableCell>
                    <TableCell>{formatTime(new Date(entry.endTime))}</TableCell>
                    <TableCell>{entry.totalHours.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteTimeEntry.mutate({ id: entry.id })}
                        disabled={deleteTimeEntry.isPending}
                      >
                        Delete
                      </Button>
                    </TableCell>
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

