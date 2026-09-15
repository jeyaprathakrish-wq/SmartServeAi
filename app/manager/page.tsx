import { createClient } from '@/lib/supabase/server';
import { ManagerDashboard } from '@/components/manager/ManagerDashboard';
import { requireStaff } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
export default async function ManagerPage() { try { await requireStaff('MANAGER'); } catch { redirect('/manager/login'); } const supabase = await createClient(); const [{ data: menu }, { data: orders }, { data: feedback }] = await Promise.all([supabase.from('menu_items').select('*').order('name'), supabase.from('orders').select('*').order('created_at',{ascending:false}).limit(50), supabase.from('feedback').select('*').order('created_at',{ascending:false}).limit(20)]); return <ManagerDashboard initialMenu={menu ?? []} orders={orders ?? []} feedback={feedback ?? []} />; }
