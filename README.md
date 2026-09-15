# SmartServe AI platform

SmartServe is now structured as a Next.js + TypeScript application backed by Supabase. The original `Smartserve_ai_enhanced.html` remains as a self-contained demo/reference, but the production target is the Next.js app.

## Structure

```text
app/                 Next.js routes: customer, kitchen, manager, API
components/          Customer, kitchen, manager, and auth UI
lib/                 Supabase clients, auth, order rules, AI parser, utilities
types/               Shared TypeScript domain types
supabase/migrations/ PostgreSQL schema, indexes, RLS, realtime publication
supabase/seed.sql    Demo restaurant, tables, categories, menu
public/               Static assets
```

## Local setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and fill in the Supabase URL/key and server-only secrets.
3. Apply `supabase/migrations/001_initial.sql`, then `supabase/seed.sql` in the Supabase SQL editor (or with the Supabase CLI).
4. Create staff users in Supabase Auth and add their IDs to `restaurant_staff` with `MANAGER` or `KITCHEN` roles.
5. Install dependencies and run `npm run dev`.

Customer: `/order?table=7` · Kitchen: `/kitchen` · Manager: `/manager`.

## Production rules

The browser may use only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The service-role key, AI key, and payment secret are server-only. Orders validate table, availability, current price, quantity, totals, and idempotency on the server. Menu availability is controlled by `menu_items.is_available`; kitchen updates use valid status transitions and Supabase Realtime subscriptions.

Payment is intentionally `PENDING` until a payment adapter is configured. Add Razorpay/Stripe server-side verification before changing it to `SUCCESS`. AI should be implemented in a server route using `OPENAI_API_KEY`; the included parser is a deterministic safe fallback that only matches database menu items.

## Vercel

Import the repository, set the variables in `.env.example` in Vercel Project Settings, and deploy. Set `PUBLIC_APP_URL` to the deployed domain for QR generation. Never commit `.env.local` or a service-role key.

## QA checklist

- `/order?table=7` selects Table 7; invalid/missing tables disable ordering.
- Customer menu reads available, in-stock Supabase items only.
- Server order route rejects invalid IDs, quantities, tables, unavailable items, and duplicate idempotency keys.
- Kitchen status transitions are `NEW → ACCEPTED → PREPARING → READY → SERVED`.
- Kitchen subscribes to order inserts/updates; customer subscribes to its order updates.
- Manager availability toggles are authenticated and RLS-protected.
- Supabase RLS protects staff/order/menu data by restaurant and role.
