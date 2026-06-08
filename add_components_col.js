const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/Users/vino/Downloads/NutriScan/backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function run() {
  const { data, error } = await supabase.rpc('run_sql', {
    query: "ALTER TABLE food_logs ADD COLUMN IF NOT EXISTS components JSONB DEFAULT '[]'::jsonb;"
  });
  console.log("Error:", error);
}
run();
