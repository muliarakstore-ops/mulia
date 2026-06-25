const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://octmefsgugjudmdxbyfe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdG1lZnNndWdqdWRtZHhieWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NzQ1ODcsImV4cCI6MjA5NjM1MDU4N30.5sVIhvjLiRIWdGbcMmqGPFeX7xBYyU567JqeEV1FJoU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function zeroStocks() {
  console.log('Resetting all product stock values to 0...');
  try {
    const { data: products, error: fetchErr } = await supabase
      .from('products')
      .select('id, name');
    if (fetchErr) throw fetchErr;

    if (products) {
      for (const p of products) {
        const { error: updateErr } = await supabase
          .from('products')
          .update({ stock: 0 })
          .eq('id', p.id);
        if (updateErr) {
          console.error(`Failed to zero stock for ${p.name}:`, updateErr);
        } else {
          console.log(`Reset ${p.name} stock to 0.`);
        }
      }
    }
    console.log('Successfully set all database product stocks to 0!');
  } catch (err) {
    console.error('An error occurred while resetting stocks:', err);
  }
}

zeroStocks();
