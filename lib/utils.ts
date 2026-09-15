import type { CartLine } from '@/types/domain';
export const GST_RATE = 0.05;
export function calculateTotals(lines: CartLine[]) { const subtotal = lines.reduce((sum, line) => sum + line.menuItem.price * line.quantity, 0); const tax = Math.round(subtotal * GST_RATE * 100) / 100; return { subtotal, tax, total: Math.round((subtotal + tax) * 100) / 100 }; }
export function escapeHtml(value: string) { return value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] ?? c)); }
export function tableNumber(value: string | null) { const n = Number(value); return Number.isInteger(n) && n >= 1 && n <= 10 ? n : null; }
