'use client'

import { CHANNEL_CONFIG, STATUS_CONFIG, type Communication } from '@/lib/types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Props {
  event: Communication
  isAdmin?: boolean
  onClose: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export default function EventDetail({ event, isAdmin, onClose, onEdit, onDelete }: Props) {
  const chCfg = CHANNEL_CONFIG[event.channel]
  const stCfg = STATUS_CONFIG[event.status]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                style={{ background: chCfg.bg, color: chCfg.color }}
              >
                {chCfg.label}
              </span>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: '#F3F4F6', color: stCfg.color }}
              >
                {stCfg.label}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 leading-snug">{event.title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm text-gray-700">
          <Row label="Segmento" value={event.segment} />
          <Row
            label="Fecha"
            value={format(new Date(event.scheduled_at), "d 'de' MMMM yyyy, HH:mm", { locale: es })}
          />
          {event.ends_at && (
            <Row
              label="Fin"
              value={format(new Date(event.ends_at), "d 'de' MMMM yyyy, HH:mm", { locale: es })}
            />
          )}
          {event.description && (
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Descripción</p>
              <p className="text-gray-700">{event.description}</p>
            </div>
          )}
          {event.created_by && (
            <Row label="Creado por" value={event.created_by} />
          )}
        </div>

        {/* Actions */}
        {isAdmin && (
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex-1 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="flex-1 py-2 text-sm font-medium rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
              >
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}: </span>
      <span>{value}</span>
    </div>
  )
}
