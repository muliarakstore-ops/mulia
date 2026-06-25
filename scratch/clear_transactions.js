const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://octmefsgugjudmdxbyfe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdG1lZnNndWdqdWRtZHhieWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NzQ1ODcsImV4cCI6MjA5NjM1MDU4N30.5sVIhvjLiRIWdGbcMmqGPFeX7xBYyU567JqeEV1FJoU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearAll() {
  console.log('Initiating database cleanup for transactions...');
  try {
    const { error: opexErr } = await supabase.from('transaksi_opex').delete().neq('id_opex', '0000');
    if (opexErr) console.error('Opex clear error:', opexErr);

    const { error: careErr } = await supabase.from('transaksi_perawatan_aset').delete().neq('id_perawatan', '0000');
    if (careErr) console.error('Asset care clear error:', careErr);

    const { error: priveErr } = await supabase.from('transaksi_prive').delete().neq('id_prive', '0000');
    if (priveErr) console.error('Prive clear error:', priveErr);

    const { error: dSaleErr } = await supabase.from('detail_penjualan_produk').delete().neq('id_detail', '00000000-0000-0000-0000-000000000000');
    if (dSaleErr) console.error('Sales detail clear error:', dSaleErr);

    const { error: saleErr } = await supabase.from('transaksi_penjualan').delete().neq('id_transaksi', '0000');
    if (saleErr) console.error('Sales master clear error:', saleErr);

    const { error: dKlkErr } = await supabase.from('detail_kulakan_produk').delete().neq('id_detail', '00000000-0000-0000-0000-000000000000');
    if (dKlkErr) console.error('Restock detail clear error:', dKlkErr);

    const { error: klkErr } = await supabase.from('transaksi_kulakan').delete().neq('id_kulakan', '0000');
    if (klkErr) console.error('Restock master clear error:', klkErr);

    const { error: modalErr } = await supabase.from('transaksi_permodalan').delete().neq('id_modal', '0000');
    if (modalErr) console.error('Permodalan clear error:', modalErr);

    console.log('Successfully cleared all transactional database tables!');
  } catch (err) {
    console.error('An error occurred during database clearance:', err);
  }
}

clearAll();
