import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env.local') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  const productId = 2664;
  const optionValue = 'Napolitano';
  const newStock = 2;

  console.log(`Updating stock in Supabase for Product ID ${productId}, Variant "${optionValue}" to ${newStock}...`);

  const { data, error } = await supabase
    .from('product_variants')
    .update({ stock: newStock })
    .eq('product_id', productId)
    .eq('option_value', optionValue)
    .select();

  if (error) {
    console.error('Error updating stock:', error);
  } else {
    console.log('Stock updated successfully in Supabase:', data);
  }
}

run();
