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

import {
  startOfDay,
  endOfDay,
  subDays,
  startOfWeek,
  endOfWeek,
  subWeeks,
  startOfMonth,
  endOfMonth,
  subMonths,
  format
} from 'date-fns';
import { ptBR } from 'date-fns/locale'; // Importe o locale para português, se quiser usar para formatação ou outras operações localizadas


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

function handleQuickFilter (value: string){
  setQuickFilter(value);
  const today = new Date();

  // Opções para startOfWeek e endOfWeek para que a semana comece na segunda-feira
  const weekOptions = { weekStartsOn: 1 as 0 | 1 | 2 | 3 | 4 | 5 | 6 }; // 1 representa segunda-feira

  let startDate: Date | null = null;
  let endDate: Date | null = null;

  switch (value) {
    case 'today':
      startDate = startOfDay(today);
      endDate = endOfDay(today);
      break;
    case 'yesterday':
      const yesterday = subDays(today, 1);
      startDate = startOfDay(yesterday);
      endDate = endOfDay(yesterday);
      break;
    case 'this-week':
      startDate = startOfWeek(today, weekOptions);
      endDate = endOfWeek(today, weekOptions);
      break;
    case 'last-week':
      const lastWeek = subWeeks(today, 1);
      startDate = startOfWeek(lastWeek, weekOptions);
      endDate = endOfWeek(lastWeek, weekOptions);
      break;
    case 'this-month':
      startDate = startOfMonth(today);
      endDate = endOfMonth(today);
      break;
    case 'last-month':
      const lastMonth = subMonths(today, 1);
      startDate = startOfMonth(lastMonth);
      endDate = endOfMonth(lastMonth);
      break;
    default:
      // Se 'value' não for uma das opções, limpa os filtros
      setStartDateFilter('');
      setEndDateFilter('');
      return; // Sai da função para não tentar formatar datas nulas
  }

  // Formata as datas para o formato 'YYYY-MM-DD'
  setStartDateFilter(format(startDate, 'yyyy-MM-dd'));
  setEndDateFilter(format(endDate, 'yyyy-MM-dd'));
};

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