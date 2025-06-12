'use client'

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

type FiltersProps = {
  quickFilter: string
  startDateFilter: string
  endDateFilter: string
  setQuickFilter: (value: string) => void
  setStartDateFilter: (value: string) => void
  setEndDateFilter: (value: string) => void
}

export function Filters({
  quickFilter,
  startDateFilter,
  endDateFilter,
  setQuickFilter,
  setStartDateFilter,
  setEndDateFilter,
}: FiltersProps) {

  const handleQuickFilter = (value: string) => {
    setQuickFilter(value)
    const today = new Date()

    switch (value) {
      case 'today':
        const todayStr = today.toISOString().split('T')[0]
        setStartDateFilter(todayStr)
        setEndDateFilter(todayStr)
        break
      case 'yesterday':
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]
        setStartDateFilter(yesterdayStr)
        setEndDateFilter(yesterdayStr)
        break
      case 'this-week':
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        setStartDateFilter(startOfWeek.toISOString().split('T')[0])
        setEndDateFilter(endOfWeek.toISOString().split('T')[0])
        break
      case 'last-week':
        const lastWeekStart = new Date(today)
        lastWeekStart.setDate(today.getDate() - today.getDay() - 7)
        const lastWeekEnd = new Date(lastWeekStart)
        lastWeekEnd.setDate(lastWeekStart.getDate() + 7)
        setStartDateFilter(lastWeekStart.toISOString().split('T')[0])
        setEndDateFilter(lastWeekEnd.toISOString().split('T')[0])
        break
      case 'this-month':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        setStartDateFilter(startOfMonth.toISOString().split('T')[0])
        setEndDateFilter(endOfMonth.toISOString().split('T')[0])
        break
      case 'last-month':
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
        setStartDateFilter(lastMonthStart.toISOString().split('T')[0])
        setEndDateFilter(lastMonthEnd.toISOString().split('T')[0])
        break
      default:
        setStartDateFilter('')
        setEndDateFilter('')
    }
  }


  return (<Card className="mb-8">
    <CardHeader>
      <CardTitle>Filters</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <Label htmlFor="quickFilter">Quick Filter</Label>
          <Select value={quickFilter} onValueChange={handleQuickFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All entries</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="this-week">This week</SelectItem>
              <SelectItem value="last-week">Last week</SelectItem>
              <SelectItem value="this-month">This month</SelectItem>
              <SelectItem value="last-month">Last month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="startDateFilter">Start Date</Label>
          <Input
            id="startDateFilter"
            type="date"
            value={startDateFilter}
            onChange={(e) => {
              setStartDateFilter(e.target.value)
              setQuickFilter('')
            }}
          />
        </div>
        <div>
          <Label htmlFor="endDateFilter">End Date</Label>
          <Input
            id="endDateFilter"
            type="date"
            value={endDateFilter}
            onChange={(e) => {
              setEndDateFilter(e.target.value)
              setQuickFilter('')
            }}
          />
        </div>
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={() => {
              setStartDateFilter('')
              setEndDateFilter('')
              setQuickFilter('')
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>)
}