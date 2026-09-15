import type { PaymentStatus } from '@/types/domain';
export interface PaymentAdapter { createPayment(input: { orderId:string; amount:number; method:string }): Promise<{ status:PaymentStatus; providerReference?:string }>; }
export class DemoPaymentAdapter implements PaymentAdapter { async createPayment() { return { status:'PENDING' as const }; } }
export function paymentAdapter() { return new DemoPaymentAdapter(); }
