const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    env[key] = value;
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  console.log('Resetting all product stocks to 0...');
  
  // Fetch all products first
  const { data: products, error: fetchErr } = await supabase.from('products').select('id, name');
  if (fetchErr) {
    console.error('Error fetching products:', fetchErr);
    return;
  }

  for (const prod of products) {
    const { error: updateErr } = await supabase
      .from('products')
      .update({ stock: 0 })
      .eq('id', prod.id);
      
    if (updateErr) {
      console.error(`Error updating stock for ${prod.name}:`, updateErr);
    } else {
      console.log(`Reset stock to 0 for: ${prod.name}`);
    }
  }

  console.log('Stock reset complete!');
}

run();
