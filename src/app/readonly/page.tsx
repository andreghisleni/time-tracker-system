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

export default function ReadOnlyPage() {
  const { data: timeEntries = [], isLoading } = trpc.getTimeEntries.useQuery({})

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

  const totalHours = timeEntries.reduce((sum:number, entry) => sum + entry.totalHours, 0)

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Time Tracker - Read Only</h1>
      
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

