import { createAdminClient } from '@/lib/supabase/admin';
import type { OrderStatus } from '@/types/domain';
const transitions: Record<OrderStatus, OrderStatus[]> = { NEW: ['ACCEPTED', 'CANCELLED'], ACCEPTED: ['PREPARING', 'CANCELLED'], PREPARING: ['READY', 'CANCELLED'], READY: ['SERVED'], SERVED: [], CANCELLED: [] };
export function canTransition(from: OrderStatus, to: OrderStatus) { return transitions[from]?.includes(to) ?? false; }
export async function updateOrderStatus(id: string, status: OrderStatus) { const admin = createAdminClient(); const { data: current, error } = await admin.from('orders').select('status').eq('id', id).single(); if (error || !current || !canTransition(current.status, status)) throw new Error('Invalid order status transition'); return admin.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select().single(); }
