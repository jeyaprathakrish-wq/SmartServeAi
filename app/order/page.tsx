import { tableNumber } from '@/lib/utils';
import { createClient } from '@/lib/supabase/server';
import { CustomerOrderApp } from '@/components/customer/CustomerOrderApp';
export default async function OrderPage({ searchParams }: { searchParams: Promise<{ table?: string }> }) { const params = await searchParams; const table = tableNumber(params.table ?? null); const supabase = await createClient(); const { data: menu } = await supabase.from('menu_items').select('*').eq('is_available', true).gt('stock_quantity', 0).order('name'); return <CustomerOrderApp table={table} initialMenu={menu ?? []} />; }
