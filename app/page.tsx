import { createClient } from '@/lib/supabase/server'
import type { Communication, ChannelType } from '@/lib/types'
import PublicCalendarClient from './PublicCalendarClient'

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('mkt_comms_communications')
    .select('*')
    .order('scheduled_at', { ascending: true })

  const events: Communication[] = error ? [] : (data ?? [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900 leading-none">Marketing Calendar</h1>
              <p className="text-xs text-gray-500 mt-0.5">Comunicaciones de Olé Life</p>
            </div>
          </div>
          <a
            href="/admin"
            className="text-xs font-medium text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-gray-400 transition-colors"
          >
            Acceso Marketing →
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        <PublicCalendarClient events={events} />
      </main>
    </div>
  )
}
