const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://octmefsgugjudmdxbyfe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdG1lZnNndWdqdWRtZHhieWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NzQ1ODcsImV4cCI6MjA5NjM1MDU4N30.5sVIhvjLiRIWdGbcMmqGPFeX7xBYyU567JqeEV1FJoU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Fetching active products to relate keys...');
  const { data: products, error: pErr } = await supabase.from('products').select('id, name, min_price');
  if (pErr) {
    console.error('Error fetching products:', pErr);
    return;
  }
  if (!products || products.length === 0) {
    console.log('No products found in DB. Run seed_db.js first.');
    return;
  }

  console.log('Clearing old transaction data in new tables...');
  await supabase.from('transaksi_opex').delete().neq('id_opex', '0000');
  await supabase.from('transaksi_perawatan_aset').delete().neq('id_perawatan', '0000');
  await supabase.from('transaksi_prive').delete().neq('id_prive', '0000');
  await supabase.from('detail_penjualan_produk').delete().neq('id_detail', '00000000-0000-0000-0000-000000000000');
  await supabase.from('transaksi_penjualan').delete().neq('id_transaksi', '0000');
  await supabase.from('detail_kulakan_produk').delete().neq('id_detail', '00000000-0000-0000-0000-000000000000');
  await supabase.from('transaksi_kulakan').delete().neq('id_kulakan', '0000');
  await supabase.from('transaksi_permodalan').delete().neq('id_modal', '0000');

  console.log('1. Seeding Permodalan...');
  const { data: modal1 } = await supabase.from('transaksi_permodalan').insert({
    jenis_permodalan: '#Injeksi Modal',
    nominal_tunai: 250000000,
    waktu_input: '2026-06-01'
  }).select().single();

  const { data: modal2 } = await supabase.from('transaksi_permodalan').insert({
    jenis_permodalan: '#Penempatan Aset',
    nama_aset: 'Mesin Potong Plat CNC',
    nilai_buku_aset: 45000000,
    waktu_input: '2026-06-02'
  }).select().single();

  console.log('2. Seeding Kulakan (Restock) & Unloading (#Bongkar)...');
  // Day 1 Restock
  const { data: klk1 } = await supabase.from('transaksi_kulakan').insert({
    waktu_kulakan: '2026-06-03'
  }).select().single();

  await supabase.from('detail_kulakan_produk').insert([
    { id_kulakan: klk1.id_kulakan, id_produk: products[0].id, qty_kulakan: 50, harga_kulak_satuan: 500000 },
    { id_kulakan: klk1.id_kulakan, id_produk: products[2].id, qty_kulakan: 30, harga_kulak_satuan: 700000 }
  ]);

  // Bongkar cost for Day 1
  await supabase.from('transaksi_opex').insert({
    waktu_opex: '2026-06-03',
    kategori_operasional: '#Bongkar',
    kebutuhan_opex: 'Jasa Bongkar Muatan Baja',
    nominal_opex: 800000
  });

  // Day 2 Restock
  const { data: klk2 } = await supabase.from('transaksi_kulakan').insert({
    waktu_kulakan: '2026-06-10'
  }).select().single();

  await supabase.from('detail_kulakan_produk').insert([
    { id_kulakan: klk2.id_kulakan, id_produk: products[1].id, qty_kulakan: 20, harga_kulak_satuan: 450000 },
    { id_kulakan: klk2.id_kulakan, id_produk: products[4].id, qty_kulakan: 10, harga_kulak_satuan: 1000000 }
  ]);

  // Bongkar cost for Day 2
  await supabase.from('transaksi_opex').insert({
    waktu_opex: '2026-06-10',
    kategori_operasional: '#Bongkar',
    kebutuhan_opex: 'Upah Harian Unloading',
    nominal_opex: 300000
  });

  console.log('3. Seeding Sales & Shipping OPEX...');
  // Sale 1: Mandiri Delivery (#Pasang)
  const { data: sale1 } = await supabase.from('transaksi_penjualan').insert({
    nama_pelanggan: 'Toko Sumber Jaya',
    daerah_tujuan: 'Kota Depok',
    jenis_pengiriman: '#Pasang',
    waktu_transaksi: '2026-06-12T10:00:00Z'
  }).select().single();

  await supabase.from('detail_penjualan_produk').insert([
    { id_transaksi: sale1.id_transaksi, id_produk: products[0].id, qty_terjual: 15, harga_satuan_nego: 850000 },
    { id_transaksi: sale1.id_transaksi, id_produk: products[2].id, qty_terjual: 10, harga_satuan_nego: 1100000 }
  ]);

  // Shipping cost for Sale 1
  await supabase.from('transaksi_opex').insert({
    waktu_opex: '2026-06-12',
    kategori_operasional: '#Pengiriman',
    jenis_pengiriman_opex: '#Pasang',
    nama_pelanggan_terkait: sale1.id_transaksi,
    kebutuhan_opex: 'Bensin & Tol PickUp Depok',
    nominal_opex: 180000
  });

  // Sale 2: Expedition Delivery (#Ekspedisi)
  const { data: sale2 } = await supabase.from('transaksi_penjualan').insert({
    nama_pelanggan: 'CV. Sentosa Abadi',
    daerah_tujuan: 'Bandung',
    jenis_pengiriman: '#Ekspedisi',
    nama_ekspedisi: 'Dakota Cargo',
    waktu_transaksi: '2026-06-18T14:30:00Z'
  }).select().single();

  await supabase.from('detail_penjualan_produk').insert([
    { id_transaksi: sale2.id_transaksi, id_produk: products[1].id, qty_terjual: 8, harga_satuan_nego: 880000 },
    { id_transaksi: sale2.id_transaksi, id_produk: products[4].id, qty_terjual: 4, harga_satuan_nego: 1500000 }
  ]);

  // Shipping opex for Sale 2 (expedition fee)
  await supabase.from('transaksi_opex').insert({
    waktu_opex: '2026-06-18',
    kategori_operasional: '#Pengiriman',
    jenis_pengiriman_opex: '#Ekspedisi',
    nama_pelanggan_terkait: sale2.id_transaksi,
    kebutuhan_opex: 'Resi Dakota Cargo BDG',
    nominal_opex: 450000
  });

  // Sale 3: Takeaway (#Ambil)
  const { data: sale3 } = await supabase.from('transaksi_penjualan').insert({
    nama_pelanggan: 'Pak Joko Mandiri',
    daerah_tujuan: 'Jakarta Selatan',
    jenis_pengiriman: '#Ambil',
    waktu_transaksi: '2026-06-20T09:00:00Z'
  }).select().single();

  await supabase.from('detail_penjualan_produk').insert([
    { id_transaksi: sale3.id_transaksi, id_produk: products[0].id, qty_terjual: 5, harga_satuan_nego: 825000 }
  ]);

  console.log('4. Seeding OPEX (Other), Prive & Perawatan...');
  // Office OPEX
  await supabase.from('transaksi_opex').insert({
    waktu_opex: '2026-06-22',
    kategori_operasional: '#Office/Gudang',
    kebutuhan_opex: 'Listrik & WiFi Kantor',
    nominal_opex: 1200000
  });

  // Prive
  await supabase.from('transaksi_prive').insert({
    waktu_prive: '2026-06-23',
    nama_owner: 'Iqbal',
    keterangan_prive: 'Tarik Tunai Keperluan Pribadi',
    nominal_prive: 5000000
  });

  // Perawatan Aset (Repair)
  await supabase.from('transaksi_perawatan_aset').insert({
    waktu_perawatan: '2026-06-24',
    jenis_perawatan: '#Perbaikan',
    nama_pengeluaran: 'Ganti Aki Mobil PickUp Operasional',
    nominal_biaya: 750000
  });

  console.log('Database Seeding successfully completed for new transaction tables!');
}

seed();
