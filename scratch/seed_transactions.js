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
  console.log('Seeding transaction data with error checking...');

  // Fetch product IDs
  const { data: products } = await supabase.from('products').select('*');
  const getProdId = name => products.find(p => p.name === name)?.id;

  const v_prod_single = getProdId('Rak Gondola Single 120');
  const v_prod_end = getProdId('Rak Gondola Muka End');
  const v_prod_double = getProdId('Rak Gondola Double 120');
  const v_prod_gudang = getProdId('Rak Gudang Besi Heavy Duty');
  const v_prod_kasir_lurus = getProdId('Meja Kasir Tipe Lurus');

  console.log('Product IDs fetched:', { v_prod_single, v_prod_end, v_prod_double, v_prod_gudang, v_prod_kasir_lurus });

  // Insert Permodalan
  const resPermodalan = await supabase.from('transaksi_permodalan').insert([
    { id_modal: 'MDL-001', jenis_permodalan: '#Injeksi Modal', nominal_tunai: 250000000, waktu_input: '2026-06-01' },
    { id_modal: 'MDL-002', jenis_permodalan: '#Penempatan Aset', nama_aset: 'Mesin Potong Plat CNC', nilai_buku_aset: 45000000, tarif_depresiasi: 25.00, waktu_input: '2026-06-02' }
  ]);
  if (resPermodalan.error) console.error('Permodalan Error:', resPermodalan.error);

  // Insert Kulakan 1
  const resKlk1 = await supabase.from('transaksi_kulakan').insert({
    id_kulakan: 'KLK-001',
    waktu_kulakan: '2026-06-03'
  }).select();
  if (resKlk1.error) console.error('Kulakan 1 Error:', resKlk1.error);
  const klk1 = resKlk1.data?.[0];

  if (klk1 && v_prod_single) {
    const res = await supabase.from('detail_kulakan_produk').insert({ id_kulakan: klk1.id_kulakan, id_produk: v_prod_single, qty_kulakan: 50, harga_kulak_satuan: 500000 });
    if (res.error) console.error('Detail Kulakan 1 Single Error:', res.error);
  }
  if (klk1 && v_prod_double) {
    const res = await supabase.from('detail_kulakan_produk').insert({ id_kulakan: klk1.id_kulakan, id_produk: v_prod_double, qty_kulakan: 30, harga_kulak_satuan: 700000 });
    if (res.error) console.error('Detail Kulakan 1 Double Error:', res.error);
  }

  // Unloading Day 1
  const resOpex1 = await supabase.from('transaksi_opex').insert({ waktu_opex: '2026-06-03', kategori_operasional: '#Bongkar', kebutuhan_opex: 'Jasa Bongkar Muatan Baja', nominal_opex: 800000 });
  if (resOpex1.error) console.error('Opex 1 Error:', resOpex1.error);

  // Insert Kulakan 2
  const resKlk2 = await supabase.from('transaksi_kulakan').insert({
    id_kulakan: 'KLK-002',
    waktu_kulakan: '2026-06-10'
  }).select();
  if (resKlk2.error) console.error('Kulakan 2 Error:', resKlk2.error);
  const klk2 = resKlk2.data?.[0];

  if (klk2 && v_prod_end) {
    const res = await supabase.from('detail_kulakan_produk').insert({ id_kulakan: klk2.id_kulakan, id_produk: v_prod_end, qty_kulakan: 20, harga_kulak_satuan: 450000 });
    if (res.error) console.error('Detail Kulakan 2 End Error:', res.error);
  }
  if (klk2 && v_prod_kasir_lurus) {
    const res = await supabase.from('detail_kulakan_produk').insert({ id_kulakan: klk2.id_kulakan, id_produk: v_prod_kasir_lurus, qty_kulakan: 10, harga_kulak_satuan: 1000000 });
    if (res.error) console.error('Detail Kulakan 2 Kasir Error:', res.error);
  }

  // Unloading Day 2
  const resOpex2 = await supabase.from('transaksi_opex').insert({ waktu_opex: '2026-06-10', kategori_operasional: '#Bongkar', kebutuhan_opex: 'Upah Harian Unloading', nominal_opex: 300000 });
  if (resOpex2.error) console.error('Opex 2 Error:', resOpex2.error);

  // Insert Sales
  // Sale 1
  const resInv1 = await supabase.from('transaksi_penjualan').insert({
    id_transaksi: 'INV-001',
    nama_pelanggan: 'Toko Sumber Jaya',
    daerah_tujuan: 'Kota Depok',
    jenis_pengiriman: '#Pasang',
    waktu_transaksi: '2026-06-12T10:00:00Z'
  }).select();
  if (resInv1.error) console.error('Sales 1 Error:', resInv1.error);
  const inv1 = resInv1.data?.[0];

  if (inv1 && v_prod_single) {
    const res = await supabase.from('detail_penjualan_produk').insert({ id_transaksi: inv1.id_transaksi, id_produk: v_prod_single, qty_terjual: 15, harga_satuan_nego: 850000 });
    if (res.error) console.error('Detail Sales 1 Single Error:', res.error);
  }
  if (inv1 && v_prod_double) {
    const res = await supabase.from('detail_penjualan_produk').insert({ id_transaksi: inv1.id_transaksi, id_produk: v_prod_double, qty_terjual: 10, harga_satuan_nego: 1100000 });
    if (res.error) console.error('Detail Sales 1 Double Error:', res.error);
  }

  // Shipping for Sale 1
  if (inv1) {
    const res = await supabase.from('transaksi_opex').insert({ waktu_opex: '2026-06-12', kategori_operasional: '#Pengiriman', jenis_pengiriman_opex: '#Pasang', nama_pelanggan_terkait: inv1.id_transaksi, kebutuhan_opex: 'Bensin & Tol PickUp Depok', nominal_opex: 180000 });
    if (res.error) console.error('Shipping Sales 1 Error:', res.error);
  }

  // Sale 2
  const resInv2 = await supabase.from('transaksi_penjualan').insert({
    id_transaksi: 'INV-002',
    nama_pelanggan: 'CV. Sentosa Abadi',
    daerah_tujuan: 'Bandung',
    jenis_pengiriman: '#Ekspedisi',
    nama_ekspedisi: 'Dakota Cargo',
    waktu_transaksi: '2026-06-18T14:30:00Z'
  }).select();
  if (resInv2.error) console.error('Sales 2 Error:', resInv2.error);
  const inv2 = resInv2.data?.[0];

  if (inv2 && v_prod_end) {
    const res = await supabase.from('detail_penjualan_produk').insert({ id_transaksi: inv2.id_transaksi, id_produk: v_prod_end, qty_terjual: 8, harga_satuan_nego: 880000 });
    if (res.error) console.error('Detail Sales 2 End Error:', res.error);
  }
  if (inv2 && v_prod_kasir_lurus) {
    const res = await supabase.from('detail_penjualan_produk').insert({ id_transaksi: inv2.id_transaksi, id_produk: v_prod_kasir_lurus, qty_terjual: 4, harga_satuan_nego: 1500000 });
    if (res.error) console.error('Detail Sales 2 Kasir Error:', res.error);
  }

  // Shipping for Sale 2
  if (inv2) {
    const res = await supabase.from('transaksi_opex').insert({ waktu_opex: '2026-06-18', kategori_operasional: '#Pengiriman', jenis_pengiriman_opex: '#Ekspedisi', nama_pelanggan_terkait: inv2.id_transaksi, kebutuhan_opex: 'Resi Dakota Cargo BDG', nominal_opex: 450000 });
    if (res.error) console.error('Shipping Sales 2 Error:', res.error);
  }

  // Sale 3
  const resInv3 = await supabase.from('transaksi_penjualan').insert({
    id_transaksi: 'INV-003',
    nama_pelanggan: 'Pak Joko Mandiri',
    daerah_tujuan: 'Jakarta Selatan',
    jenis_pengiriman: '#Ambil',
    waktu_transaksi: '2026-06-20T09:00:00Z'
  }).select();
  if (resInv3.error) console.error('Sales 3 Error:', resInv3.error);
  const inv3 = resInv3.data?.[0];

  if (inv3 && v_prod_single) {
    const res = await supabase.from('detail_penjualan_produk').insert({ id_transaksi: inv3.id_transaksi, id_produk: v_prod_single, qty_terjual: 5, harga_satuan_nego: 825000 });
    if (res.error) console.error('Detail Sales 3 Error:', res.error);
  }

  // Other opex, prive, perawatan
  const resOpx = await supabase.from('transaksi_opex').insert({ waktu_opex: '2026-06-22', kategori_operasional: '#Office/Gudang', kebutuhan_opex: 'Listrik & WiFi Kantor', nominal_opex: 1200000 });
  if (resOpx.error) console.error('General Opex Error:', resOpx.error);
  const resPrv = await supabase.from('transaksi_prive').insert({ waktu_prive: '2026-06-23', nama_owner: 'Iqbal', keterangan_prive: 'Tarik Tunai Keperluan Pribadi', nominal_prive: 5000000 });
  if (resPrv.error) console.error('Prive Error:', resPrv.error);
  const resPrw = await supabase.from('transaksi_perawatan_aset').insert({ waktu_perawatan: '2026-06-24', jenis_perawatan: '#Perbaikan', nama_pengeluaran: 'Ganti Aki Mobil PickUp Operasional', nominal_biaya: 750000 });
  if (resPrw.error) console.error('Perawatan Error:', resPrw.error);

  console.log('Seeding transaction data complete!');
}

run();
