# SmartServe data model

Production storage should use PostgreSQL (or Supabase Postgres) with these tables:

`restaurants(id, name, gst_rate)`, `users(id, restaurant_id, role, email, auth_provider_id)`, `tables(id, restaurant_id, number, active, status)`, `menu_categories(id, restaurant_id, name)`, `menu_items(id, restaurant_id, category_id, name, name_ta, description, description_ta, price, vegetarian, spice_level, preparation_minutes, stock, available)`, `customization_groups(id, menu_item_id, name, required)`, `customization_options(id, group_id, name, price_delta)`, `orders(id, restaurant_id, table_id, customer_id, session_id, request_id UNIQUE, status, subtotal, tax, total, payment_method, payment_status, created_at, updated_at)`, `order_items(id, order_id, menu_item_id, quantity, unit_price)`, `order_item_customizations(order_item_id, option_id)`, `inventory(menu_item_id UNIQUE, quantity, low_stock_threshold)`, `specials(id, menu_item_id, active_date, discount)`, `favourites(user_id, menu_item_id, UNIQUE(user_id, menu_item_id))`, `feedback(id, order_id, customer_id, session_id, rating, comment, created_at)`, and `notifications(id, restaurant_id, type, payload, read_at)`.

The demo server persists to `data/smartserve.json`; it is intentionally not a production database.
