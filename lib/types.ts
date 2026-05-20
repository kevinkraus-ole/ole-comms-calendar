export type ChannelType = 'push' | 'email' | 'sms' | 'whatsapp' | 'in_app'
export type StatusType = 'planned' | 'sent' | 'cancelled'

export interface Communication {
  id: string
  title: string
  description: string | null
  channel: ChannelType
  segment: string
  scheduled_at: string
  ends_at: string | null
  status: StatusType
  created_by: string | null
  created_at: string
  updated_at: string
}

export const CHANNEL_CONFIG: Record<ChannelType, { label: string; color: string; bg: string; border: string }> = {
  push:     { label: 'Push',     color: '#7C3AED', bg: '#EDE9FE', border: '#7C3AED' },
  email:    { label: 'Email',    color: '#0369A1', bg: '#E0F2FE', border: '#0369A1' },
  sms:      { label: 'SMS',      color: '#065F46', bg: '#D1FAE5', border: '#065F46' },
  whatsapp: { label: 'WhatsApp', color: '#15803D', bg: '#DCFCE7', border: '#15803D' },
  in_app:   { label: 'In-App',   color: '#B45309', bg: '#FEF3C7', border: '#B45309' },
}

export const STATUS_CONFIG: Record<StatusType, { label: string; color: string }> = {
  planned:   { label: 'Planificado', color: '#6B7280' },
  sent:      { label: 'Enviado',     color: '#059669' },
  cancelled: { label: 'Cancelado',   color: '#DC2626' },
}
