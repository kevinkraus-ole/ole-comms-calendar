'use client'

import { useCallback, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventClickArg, EventContentArg } from '@fullcalendar/core'
import { CHANNEL_CONFIG, STATUS_CONFIG, type Communication, type ChannelType } from '@/lib/types'
import EventDetail from './EventDetail'

interface Props {
  events: Communication[]
  isAdmin?: boolean
  onEdit?: (event: Communication) => void
  onDelete?: (id: string) => void
  filter?: ChannelType | 'all'
}

function renderEventContent(info: EventContentArg) {
  const channel = info.event.extendedProps.channel as ChannelType
  const cfg = CHANNEL_CONFIG[channel]
  return (
    <div className="flex items-center gap-1 px-1 truncate w-full" title={info.event.title}>
      <span className="text-[10px] font-bold uppercase tracking-wide opacity-80">{cfg.label}</span>
      <span className="truncate text-xs">{info.event.title}</span>
    </div>
  )
}

export default function CommCalendar({ events, isAdmin, onEdit, onDelete, filter = 'all' }: Props) {
  const calendarRef = useRef<FullCalendar>(null)
  const [selected, setSelected] = useState<Communication | null>(null)

  const filtered = filter === 'all' ? events : events.filter(e => e.channel === filter)

  const calendarEvents = filtered.map(e => {
    const cfg = CHANNEL_CONFIG[e.channel]
    return {
      id: e.id,
      title: e.title,
      start: e.scheduled_at,
      end: e.ends_at ?? undefined,
      backgroundColor: cfg.color,
      borderColor: cfg.color,
      extendedProps: e,
    }
  })

  const handleEventClick = useCallback((arg: EventClickArg) => {
    setSelected(arg.event.extendedProps as Communication)
  }, [])

  return (
    <>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="es"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,listMonth',
        }}
        buttonText={{ today: 'Hoy', month: 'Mes', week: 'Semana', list: 'Lista' }}
        events={calendarEvents}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        height="auto"
        dayMaxEvents={4}
      />

      {selected && (
        <EventDetail
          event={selected}
          isAdmin={isAdmin}
          onClose={() => setSelected(null)}
          onEdit={onEdit ? () => { onEdit(selected); setSelected(null) } : undefined}
          onDelete={onDelete ? async () => {
            await onDelete(selected.id)
            setSelected(null)
          } : undefined}
        />
      )}
    </>
  )
}
