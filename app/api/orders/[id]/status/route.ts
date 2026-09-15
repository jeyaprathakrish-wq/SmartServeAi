import { NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/orders/service';
import { requireStaff } from '@/lib/auth/server';
export async function PATCH(request: Request, context: { params: Promise<{ id:string }> }) { try { await requireStaff(); const { id } = await context.params; const { status } = await request.json(); const result = await updateOrderStatus(id, status); if (result.error) return NextResponse.json({ error:result.error.message }, { status:400 }); return NextResponse.json({ data:result.data }); } catch (error) { const message=error instanceof Error?error.message:'Request failed'; return NextResponse.json({ error:message }, { status:message==='Unauthorized'?401:403 }); } }
