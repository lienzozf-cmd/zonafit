-- 1. Create sequences
CREATE SEQUENCE IF NOT EXISTS order_id_seq START 46;

-- 2. Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id integer PRIMARY KEY,
  name text NOT NULL,
  price text NOT NULL,
  original_price text,
  availability text NOT NULL,
  description text,
  gender text,
  category text,
  subcategory text,
  brand text,
  fabric_type text,
  is_compression boolean,
  images jsonb,
  options jsonb,
  colors jsonb,
  feature1 text,
  feature2 text,
  feature3 text,
  feature4 text,
  benefits text,
  servings_info text,
  visible boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create product_variants table (for stock management)
CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id integer REFERENCES public.products(id) ON DELETE CASCADE,
  color_name text, -- NULL if no colors/flavors
  option_value text NOT NULL, -- e.g. 'S', 'M', 'Único'
  stock integer NOT NULL DEFAULT 0,
  CONSTRAINT product_variants_unique UNIQUE (product_id, color_name, option_value)
);

-- Enable realtime for product_variants so clients can subscribe to stock changes
alter publication supabase_realtime add table public.product_variants;

-- 4. Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text UNIQUE NOT NULL,
  shipping_info jsonb NOT NULL,
  client_name text,
  phone text,
  address text,
  municipality text,
  department text,
  order_subtotal numeric NOT NULL,
  order_discount numeric NOT NULL DEFAULT 0,
  order_shipping numeric NOT NULL,
  order_commission numeric NOT NULL DEFAULT 0,
  order_total numeric NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text REFERENCES public.orders(order_id) ON DELETE CASCADE,
  product_id integer NOT NULL,
  name text NOT NULL,
  image text,
  price numeric NOT NULL,
  quantity integer NOT NULL,
  option text NOT NULL,
  color text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Helper function to generate next order_id
CREATE OR REPLACE FUNCTION get_next_order_id()
RETURNS text AS $$
BEGIN
  RETURN lpad(nextval('order_id_seq')::text, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- 7. RPC function to decrement stock atomically
CREATE OR REPLACE FUNCTION decrement_stock(
  p_product_id integer,
  p_option_value text,
  p_quantity integer,
  p_color_name text DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
  v_updated integer;
BEGIN
  -- Update stock only if we have enough units
  IF p_color_name IS NULL OR p_color_name = '' OR p_color_name = 'undefined' THEN
    UPDATE public.product_variants
    SET stock = stock - p_quantity
    WHERE product_id = p_product_id
      AND (color_name IS NULL OR color_name = '')
      AND option_value = p_option_value
      AND stock >= p_quantity;
  ELSE
    UPDATE public.product_variants
    SET stock = stock - p_quantity
    WHERE product_id = p_product_id
      AND color_name = p_color_name
      AND option_value = p_option_value
      AND stock >= p_quantity;
  END IF;

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  
  -- If update succeeded, return true, otherwise return false (out of stock/not found)
  RETURN v_updated > 0;
END;
$$ LANGUAGE plpgsql;
