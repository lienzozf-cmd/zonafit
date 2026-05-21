import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env.local') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log('Clearing all order items...');
  const { error: errorItems } = await supabase
    .from('order_items')
    .delete()
    .gt('quantity', 0); // Deletes all rows since quantity is always > 0

  if (errorItems) {
    console.error('Error clearing order_items:', errorItems.message);
  } else {
    console.log('Order items cleared successfully.');
  }

  console.log('Clearing all orders...');
  const { error: errorOrders } = await supabase
    .from('orders')
    .delete()
    .neq('order_id', 'none'); // Deletes all rows since order_id is never 'none'

  if (errorOrders) {
    console.error('Error clearing orders:', errorOrders.message);
  } else {
    console.log('Orders cleared successfully.');
  }
}

run();
