import http from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { URL } from 'node:url';

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = process.env.SMARTSERVE_DATA_DIR || './data';
const DB_FILE = `${DATA_DIR}/smartserve.json`;
const GST_RATE = 0.05;
const menu = [
  { id: 1, name: 'Masala Dosa', price: 90, category: 'tiffin', vegetarian: true, stock: 15 },
  { id: 2, name: 'Idli (2 pcs)', price: 50, category: 'tiffin', vegetarian: true, stock: 20 },
  { id: 3, name: 'Ghee Podi Dosa', price: 110, category: 'tiffin', vegetarian: true, stock: 12 },
  { id: 4, name: 'South Indian Meals', price: 150, category: 'meals', vegetarian: true, stock: 15 },
  { id: 5, name: 'Veg Fried Rice', price: 140, category: 'meals', vegetarian: true, stock: 10 },
  { id: 6, name: 'Chicken Biryani', price: 240, category: 'biryani', vegetarian: false, stock: 7 },
  { id: 7, name: 'Veg Biryani', price: 180, category: 'biryani', vegetarian: true, stock: 10 },
  { id: 8, name: 'Filter Coffee', price: 40, category: 'drinks', vegetarian: true, stock: 30 },
  { id: 9, name: 'Rose Milk', price: 60, category: 'drinks', vegetarian: true, stock: 20 },
  { id: 10, name: 'Fresh Lime Soda', price: 50, category: 'drinks', vegetarian: true, stock: 20 }
];
let db = { orders: [], feedback: [], menu, tables: Array.from({ length: 10 }, (_, i) => ({ number: i + 1, active: true })) };
async function loadDb() { await mkdir(DATA_DIR, { recursive: true }); if (existsSync(DB_FILE)) db = { ...db, ...JSON.parse(await readFile(DB_FILE, 'utf8')) }; }
const saveDb = () => writeFile(DB_FILE, JSON.stringify(db, null, 2));
const json = (res, status, body) => { res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': process.env.ALLOWED_ORIGIN || '*', 'access-control-allow-headers': 'content-type, authorization, idempotency-key' }); res.end(JSON.stringify(body)); };
const body = req => new Promise((resolve, reject) => { let raw = ''; req.on('data', chunk => { raw += chunk; if (raw.length > 1e6) reject(new Error('Payload too large')); }); req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(new Error('Invalid JSON')); } }); });
function totals(items) { const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0); const tax = Math.round(subtotal * GST_RATE * 100) / 100; return { subtotal, tax, total: subtotal + tax }; }
function validateOrder(input) { if (!Number.isInteger(Number(input.table)) || Number(input.table) < 1 || Number(input.table) > 10) throw new Error('Invalid table'); if (!Array.isArray(input.items) || !input.items.length) throw new Error('Cart is empty'); const items = input.items.map(line => { const food = db.menu.find(item => item.id === Number(line.foodId)); if (!food) throw new Error('Invalid food ID'); const quantity = Number(line.quantity); if (!Number.isInteger(quantity) || quantity < 1 || quantity > food.stock) throw new Error(`Invalid quantity for ${food.name}`); return { foodId: food.id, name: food.name, price: food.price, quantity, customizations: Array.isArray(line.customizations) ? line.customizations.slice(0, 10) : [] }; }); return { table: Number(input.table), items, ...totals(items) }; }
async function handler(req, res) { const url = new URL(req.url, `http://${req.headers.host}`); if (req.method === 'OPTIONS') return json(res, 204, {}); try {
  if (req.method === 'GET' && url.pathname === '/api/health') return json(res, 200, { ok: true, mode: process.env.SMARTSERVE_MODE || 'demo' });
  if (req.method === 'GET' && url.pathname === '/api/menu') return json(res, 200, { data: db.menu });
  if (req.method === 'GET' && url.pathname.startsWith('/api/tables/')) { const n = Number(url.pathname.split('/').pop()); const table = db.tables.find(t => t.number === n); return table ? json(res, 200, { data: table }) : json(res, 404, { error: 'Invalid table' }); }
  if (req.method === 'POST' && url.pathname === '/api/orders') { const requestId = req.headers['idempotency-key']; if (!requestId) return json(res, 400, { error: 'Idempotency-Key is required' }); const prior = db.orders.find(order => order.requestId === requestId); if (prior) return json(res, 200, { data: prior, replayed: true }); const order = await body(req).then(validateOrder); order.items.forEach(line => { db.menu.find(item => item.id === line.foodId).stock -= line.quantity; }); const saved = { ...order, id: `ORD-${randomUUID().slice(0, 8).toUpperCase()}`, requestId, status: 'NEW', paymentStatus: 'PENDING', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; db.orders.unshift(saved); await saveDb(); return json(res, 201, { data: saved }); }
  if (req.method === 'GET' && url.pathname.startsWith('/api/orders/')) { const order = db.orders.find(item => item.id === url.pathname.split('/').pop()); return order ? json(res, 200, { data: order }) : json(res, 404, { error: 'Order not found' }); }
  if (req.method === 'PATCH' && url.pathname.startsWith('/api/orders/') && url.pathname.endsWith('/status')) { const id = url.pathname.split('/')[3]; const order = db.orders.find(item => item.id === id); const next = (await body(req)).status; if (!order || !['NEW', 'PREPARING', 'READY', 'SERVED', 'CANCELLED'].includes(next)) return json(res, 400, { error: 'Invalid order/status' }); order.status = next; order.updatedAt = new Date().toISOString(); await saveDb(); return json(res, 200, { data: order }); }
  if (req.method === 'POST' && url.pathname === '/api/feedback') { const input = await body(req); const rating = Number(input.rating); if (!Number.isInteger(rating) || rating < 1 || rating > 5) return json(res, 400, { error: 'Rating must be 1-5' }); const item = { id: randomUUID(), rating, comment: String(input.comment || '').slice(0, 1000), orderId: String(input.orderId || ''), table: Number(input.table) || null, createdAt: new Date().toISOString() }; db.feedback.unshift(item); await saveDb(); return json(res, 201, { data: item }); }
  return json(res, 404, { error: 'Not found' });
} catch (error) { return json(res, 400, { error: error.message || 'Request failed' }); } }
await loadDb(); http.createServer(handler).listen(PORT, () => console.log(`SmartServe API listening on http://localhost:${PORT}`));
