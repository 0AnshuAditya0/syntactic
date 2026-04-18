import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testConnection() {
  console.log('Testing Supabase REST API connection...');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing URL or Key in .env.local');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log(`Connecting to: ${supabaseUrl}`);

  try {
    const start = Date.now();
    // A simple query to 'posts' table just to test REST API speed/response
    const { data, error } = await supabase.from('posts').select('id').limit(1);
    
    console.log(`Response received in ${Date.now() - start}ms`);

    if (error) {
      console.error('Supabase query error:', error);
    } else {
      console.log('Successfully connected and queried posts. Data:', data);
    }
  } catch (err: any) {
    console.error('Fetch crashed entirely:', err);
  }
}

testConnection();
