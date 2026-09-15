import { createClient } from '@/lib/supabase/server';
import { KitchenDashboard } from '@/components/kitchen/KitchenDashboard';
import { requireStaff } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
export default async function KitchenPage() { try { await requireStaff('KITCHEN'); } catch { redirect('/kitchen/login'); } const supabase = await createClient(); const { data } = await supabase.from('orders').select('*, order_items(*), tables(table_number)').in('status', ['NEW','ACCEPTED','PREPARING','READY']).order('created_at', { ascending:false }); return <KitchenDashboard initialOrders={data ?? []} />; }
