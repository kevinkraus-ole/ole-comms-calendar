'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import ChannelLegend from '@/components/ChannelLegend'
import type { ChannelType, Communication } from '@/lib/types'

const CommCalendar = dynamic(() => import('@/components/CommCalendar'), { ssr: false })

export default function PublicCalendarClient({ events }: { events: Communication[] }) {
  const [filter, setFilter] = useState<ChannelType | 'all'>('all')

  const upcoming = events
    .filter(e => new Date(e.scheduled_at) >= new Date())
    .slice(0, 5)

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <ChannelLegend active={filter} onChange={setFilter} />
        <p className="text-sm text-gray-500">
          {events.length} comunicación{events.length !== 1 ? 'es' : ''} registrada{events.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {/* Calendar */}
        <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <CommCalendar events={events} filter={filter} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Próximas comunicaciones</h3>
            {upcoming.length === 0 ? (
              <p className="text-sm text-gray-400">Sin comunicaciones programadas</p>
            ) : (
              <ul className="space-y-3">
                {upcoming.map(e => (
                  <UpcomingItem key={e.id} event={e} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function UpcomingItem({ event }: { event: Communication }) {
  const { CHANNEL_CONFIG } = require('@/lib/types')
  const cfg = CHANNEL_CONFIG[event.channel]
  const date = new Date(event.scheduled_at)
  const days = Math.ceil((date.getTime() - Date.now()) / 86400000)

  return (
    <li className="flex gap-3 items-start">
      <div
        className="shrink-0 w-1.5 h-full min-h-[2.5rem] rounded-full mt-1"
        style={{ background: cfg.color }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{event.title}</p>
        <p className="text-xs text-gray-500">
          {event.segment} · en {days === 0 ? 'hoy' : `${days}d`}
        </p>
        <span
          className="inline-block text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded mt-0.5"
          style={{ background: cfg.bg, color: cfg.color }}
        >
          {cfg.label}
        </span>
      </div>
    </li>
  )
}
