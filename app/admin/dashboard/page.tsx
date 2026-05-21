import { createClient } from '@/lib/supabase/server'
import type { Communication } from '@/lib/types'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('mkt_comms_communications')
    .select('*')
    .order('scheduled_at', { ascending: true })

  const events: Communication[] = data ?? []

  return <AdminDashboardClient events={events} />
}
