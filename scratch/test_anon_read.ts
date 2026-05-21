import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env.local') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log('Testing public anon read on product_variants...');
  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .limit(5);

  if (error) {
    console.error('Anon client read failed:', error.message);
  } else {
    console.log(`Anon client read successful. Found ${data?.length} rows:`, data);
  }
}

run();
