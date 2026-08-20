import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env.local') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  const { data, error } = await supabase.from('products').select('*').eq('id', 2671).single();
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Product colors in database:', JSON.stringify(data.colors, null, 2));
    console.log('Product images in database:', JSON.stringify(data.images, null, 2));
  }
}

main().catch(console.error);
