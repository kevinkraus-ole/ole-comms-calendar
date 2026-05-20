import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Communication } from '@/lib/types'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data } = await supabase
    .from('mkt_comms_communications')
    .select('*')
    .order('scheduled_at', { ascending: true })

  const events: Communication[] = data ?? []

  return <AdminDashboardClient events={events} user={user} />
}
