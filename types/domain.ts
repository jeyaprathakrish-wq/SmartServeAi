export type Language = 'en' | 'ta';
export type Role = 'MANAGER' | 'KITCHEN' | 'CUSTOMER';
export type OrderStatus = 'NEW' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'SERVED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';
export interface MenuItem { id: string; restaurant_id: string; category_id: string; name: string; name_ta: string; description: string; description_ta: string; price: number; image_url: string | null; is_available: boolean; is_featured: boolean; is_special: boolean; is_vegetarian: boolean; preparation_time: number; stock_quantity: number; }
export interface CartLine { menuItem: MenuItem; quantity: number; customizations: string[]; }
export interface OrderItem { menu_item_id: string; item_name_snapshot: string; price_snapshot: number; quantity: number; customizations: string[]; }
export interface Order { id: string; order_number: string; restaurant_id: string; table_id: string; status: OrderStatus; subtotal: number; tax: number; total: number; payment_method: string; payment_status: PaymentStatus; created_at: string; updated_at: string; order_items?: OrderItem[]; }
export interface Feedback { id: string; order_id: string; rating: number; comment: string; created_at: string; }
