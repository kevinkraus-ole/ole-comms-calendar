import { CHANNEL_CONFIG, type ChannelType } from '@/lib/types'

interface Props {
  active: ChannelType | 'all'
  onChange: (v: ChannelType | 'all') => void
}

export default function ChannelLegend({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('all')}
        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
          active === 'all'
            ? 'bg-gray-900 text-white border-gray-900'
            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
        }`}
      >
        Todos
      </button>
      {(Object.entries(CHANNEL_CONFIG) as [ChannelType, typeof CHANNEL_CONFIG[ChannelType]][]).map(([key, cfg]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors`}
          style={
            active === key
              ? { background: cfg.color, color: '#fff', borderColor: cfg.color }
              : { background: cfg.bg, color: cfg.color, borderColor: cfg.border }
          }
        >
          {cfg.label}
        </button>
      ))}
    </div>
  )
}
