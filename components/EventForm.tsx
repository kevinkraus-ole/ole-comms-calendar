'use client'

import { useState } from 'react'
import { CHANNEL_CONFIG, STATUS_CONFIG, type ChannelType, type StatusType, type Communication } from '@/lib/types'
import { format } from 'date-fns'

interface Props {
  initial?: Partial<Communication>
  onSave: (data: Partial<Communication>) => Promise<void>
  onCancel: () => void
}

const SEGMENTS = [
  'Todos los agentes',
  'Agentes Nuevos',
  'Agentes sin activación',
  'Promotores Alliance',
  'Promotores UFC',
  'Líderes de Agencia',
  'Clientes activos',
  'Prospectos',
]

function toDatetimeLocal(iso: string | undefined) {
  if (!iso) return ''
  return format(new Date(iso), "yyyy-MM-dd'T'HH:mm")
}

export default function EventForm({ initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    channel: (initial?.channel ?? 'email') as ChannelType,
    segment: initial?.segment ?? 'Todos los agentes',
    scheduled_at: toDatetimeLocal(initial?.scheduled_at) || format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    ends_at: toDatetimeLocal(initial?.ends_at ?? undefined),
    status: (initial?.status ?? 'planned') as StatusType,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return setError('El título es requerido')
    setLoading(true)
    setError('')
    try {
      await onSave({
        ...form,
        scheduled_at: new Date(form.scheduled_at).toISOString(),
        ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
      })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onCancel}>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {initial?.id ? 'Editar comunicación' : 'Nueva comunicación'}
          </h2>
          <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

        <Field label="Título *">
          <input
            required
            value={form.title}
            onChange={e => set('title', e.target.value)}
            className="input"
            placeholder="Ej: Push activación nuevos agentes"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Canal">
            <select value={form.channel} onChange={e => set('channel', e.target.value)} className="input">
              {(Object.entries(CHANNEL_CONFIG) as [ChannelType, typeof CHANNEL_CONFIG[ChannelType]][]).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Estado">
            <select value={form.status} onChange={e => set('status', e.target.value)} className="input">
              {(Object.entries(STATUS_CONFIG) as [StatusType, typeof STATUS_CONFIG[StatusType]][]).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Segmento">
          <input
            list="segments"
            value={form.segment}
            onChange={e => set('segment', e.target.value)}
            className="input"
            placeholder="¿A quién va dirigido?"
          />
          <datalist id="segments">
            {SEGMENTS.map(s => <option key={s} value={s} />)}
          </datalist>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Fecha de envío *">
            <input
              required
              type="datetime-local"
              value={form.scheduled_at}
              onChange={e => set('scheduled_at', e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Fecha fin (opcional)">
            <input
              type="datetime-local"
              value={form.ends_at}
              onChange={e => set('ends_at', e.target.value)}
              className="input"
            />
          </Field>
        </div>

        <Field label="Descripción">
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            className="input resize-none"
            rows={3}
            placeholder="Contexto, objetivo, links relevantes..."
          />
        </Field>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-brand text-white text-sm font-medium hover:bg-brand-dark disabled:opacity-50">
            {loading ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #E5E7EB;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
          background: #fff;
        }
        .input:focus {
          border-color: #1A1A2E;
        }
      `}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}
