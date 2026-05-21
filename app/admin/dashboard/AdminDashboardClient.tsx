'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { ChannelType, Communication } from '@/lib/types'
import { CHANNEL_CONFIG, STATUS_CONFIG } from '@/lib/types'
import ChannelLegend from '@/components/ChannelLegend'
import EventForm from '@/components/EventForm'
import { createClient } from '@/lib/supabase/client'

const CommCalendar = dynamic(() => import('@/components/CommCalendar'), { ssr: false })

interface Props {
  events: Communication[]
}

export default function AdminDashboardClient({ events: initial }: Props) {
  const [events, setEvents] = useState(initial)
  const [filter, setFilter] = useState<ChannelType | 'all'>('all')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Communication | null>(null)

  const supabase = createClient()

  async function handleSave(data: Partial<Communication>) {
    if (editing) {
      const { data: updated, error } = await supabase
        .from('mkt_comms_communications')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', editing.id)
        .select()
        .single()
      if (error) throw error
      setEvents(prev => prev.map(e => e.id === editing.id ? updated : e))
      setEditing(null)
    } else {
      const { data: created, error } = await supabase
        .from('mkt_comms_communications')
        .insert({ ...data, created_by: 'marketing@olelife.com' })
        .select()
        .single()
      if (error) throw error
      setEvents(prev => [...prev, created])
      setShowForm(false)
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('mkt_comms_communications').delete().eq('id', id)
    if (error) throw error
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  const stats = {
    total: events.length,
    planned: events.filter(e => e.status === 'planned').length,
    sent: events.filter(e => e.status === 'sent').length,
    thisMonth: events.filter(e => {
      const d = new Date(e.scheduled_at)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length,
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1A1A2E] flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900 leading-none">Marketing Calendar</h1>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5">
              Ver público
            </a>
            <button
              onClick={() => setShowForm(true)}
              className="text-xs font-medium bg-[#1A1A2E] text-white rounded-lg px-3 py-1.5 hover:bg-[#2d2d4e] transition-colors"
            >
              + Nueva comunicación
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Este mes" value={stats.thisMonth} color="text-blue-600" />
          <StatCard label="Planificadas" value={stats.planned} color="text-amber-600" />
          <StatCard label="Enviadas" value={stats.sent} color="text-green-600" />
        </div>

        {/* Filters */}
        <ChannelLegend active={filter} onChange={setFilter} />

        {/* Calendar + Sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
          <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <CommCalendar
              events={events}
              filter={filter}
              isAdmin
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          </div>

          {/* Event list */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Todas las comunicaciones</h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {events.length === 0 && (
                <p className="text-sm text-gray-400">Sin registros</p>
              )}
              {events.map(e => (
                <EventListItem
                  key={e.id}
                  event={e}
                  onEdit={() => setEditing(e)}
                  onDelete={() => handleDelete(e.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Forms */}
      {showForm && (
        <EventForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
      {editing && (
        <EventForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  )
}

function StatCard({ label, value, color = 'text-gray-900' }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

function EventListItem({ event, onEdit, onDelete }: { event: Communication; onEdit: () => void; onDelete: () => void }) {
  const chCfg = CHANNEL_CONFIG[event.channel]
  const stCfg = STATUS_CONFIG[event.status]
  const date = new Date(event.scheduled_at)

  return (
    <div className="p-2.5 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors group">
      <div className="flex items-start gap-2">
        <div className="w-1 h-full min-h-[2rem] rounded-full shrink-0" style={{ background: chCfg.color }} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-800 truncate">{event.title}</p>
          <p className="text-xs text-gray-500">{event.segment}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: chCfg.bg, color: chCfg.color }}>
              {chCfg.label}
            </span>
            <span className="text-[10px] text-gray-400">
              {date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="text-xs text-gray-500 hover:text-gray-800 px-1">✏️</button>
          <button onClick={onDelete} className="text-xs text-red-400 hover:text-red-600 px-1">🗑</button>
        </div>
      </div>
    </div>
  )
}
