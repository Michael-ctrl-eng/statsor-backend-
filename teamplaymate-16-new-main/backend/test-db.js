const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('Testing Supabase connection...');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Testing connection to players table...');
    const { data, error } = await supabase
      .from('players')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('Error details:', error);
      if (error.code === 'PGRST116') {
        console.log('Table "players" does not exist - need to run migrations');
      }
    } else {
      console.log('Connection successful! Players table exists.');
    }
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

testConnection();