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
  console.log('Running unified migration: clearing transactions & updating products...');

  // 1. Delete transactions first
  await supabase.from('transaksi_opex').delete().neq('id_opex', '');
  await supabase.from('transaksi_perawatan_aset').delete().neq('id_perawatan', '');
  await supabase.from('transaksi_prive').delete().neq('id_prive', '');
  await supabase.from('detail_penjualan_produk').delete().neq('id_detail', '00000000-0000-0000-0000-000000000000');
  await supabase.from('transaksi_penjualan').delete().neq('id_transaksi', '');
  await supabase.from('detail_kulakan_produk').delete().neq('id_detail', '00000000-0000-0000-0000-000000000000');
  await supabase.from('transaksi_kulakan').delete().neq('id_kulakan', '');
  await supabase.from('transaksi_permodalan').delete().neq('id_modal', '');

  // 2. Delete all existing products
  await supabase.from('products').delete().neq('name', '');

  // 3. Insert unified base products (all starting with 0 stock)
  const baseProducts = [
    {
      name: 'Rak Gondola 120',
      category: 'sofa',
      min_price: 825000,
      max_price: 1000000,
      image_url: '/img/katalog/rak-single.jpeg',
      description: 'Rak minimarket modular dengan tinggi tiang 120 cm. Cocok untuk display retail di lorong tengah (Double) maupun dinding (Single).',
      height: 120,
      length: 90,
      width: 35,
      additional_info: 'Tinggi Tiang: 120 cm\nPanjang Shelving: 90 cm per unit\nLebar Shelving Dasar: 35 cm (shelving atas 30 cm)\nKapasitas Beban: s/d 50 kg per tingkat ambalan\nKetebalan Plat Shelving: 0.7 mm baja canai dingin\nFinishing: Powder Coating EPOXY tahan gores & pudar',
      stock: 0
    },
    {
      name: 'Rak Gondola 150',
      category: 'sofa',
      min_price: 900000,
      max_price: 1200000,
      image_url: '/img/katalog/rak-single.jpeg',
      description: 'Rak minimarket modular dengan tinggi tiang 150 cm. Standar ukuran lorong ritel modern yang efisien.',
      height: 150,
      length: 90,
      width: 35,
      additional_info: 'Tinggi Tiang: 150 cm\nPanjang Shelving: 90 cm per unit\nLebar Shelving Dasar: 35 cm (shelving atas 30 cm)\nKapasitas Beban: s/d 50 kg per tingkat ambalan\nKetebalan Plat Shelving: 0.7 mm baja canai dingin\nFinishing: Powder Coating EPOXY tahan gores & pudar',
      stock: 0
    },
    {
      name: 'Rak Gondola 170',
      category: 'sofa',
      min_price: 950000,
      max_price: 1350000,
      image_url: '/img/katalog/rak-single.jpeg',
      description: 'Rak minimarket modular dengan tinggi tiang 170 cm. Maksimalkan kapasitas penyimpanan display vertikal Anda.',
      height: 170,
      length: 90,
      width: 35,
      additional_info: 'Tinggi Tiang: 170 cm\nPanjang Shelving: 90 cm per unit\nLebar Shelving Dasar: 35 cm (shelving atas 30 cm)\nKapasitas Beban: s/d 50 kg per tingkat ambalan\nKetebalan Plat Shelving: 0.7 mm baja canai dingin\nFinishing: Powder Coating EPOXY tahan gores & pudar',
      stock: 0
    },
    {
      name: 'Rak Gondola Muka End',
      category: 'sofa',
      min_price: 775000,
      max_price: 900000,
      image_url: '/img/katalog/rak-muka-end.jpeg',
      description: 'Rak penutup lorong dipasang di bagian depan atau belakang rak double sebagai display promo/produk unggulan. Menarik perhatian pelanggan dengan posisi strategis.',
      height: 150,
      length: 90,
      width: 35,
      additional_info: 'Tinggi Tiang: 150 cm / 180 cm (menyesuaikan rak tengah)\nPanjang Shelving: 90 cm\nLebar Shelving: Dasar 35 cm (shelving atas 30 cm)\nKapasitas Beban: s/d 50 kg per tingkat\nBahan: Besi baja berkualitas premium standar SNI\nPemasangan: Knockdown (sistem kait tanpa baut)',
      stock: 0
    },
    {
      name: 'Meja Kasir',
      category: 'lighting',
      min_price: 1500000,
      max_price: 3500000,
      image_url: '/img/katalog/meja-kasir.jpeg',
      description: 'Meja kasir retail premium dengan bodi plat besi kokoh dan permukaan stainless steel hairline anti karat. Tersedia dalam konfigurasi Tipe Lurus maupun Komputer Tipe L.',
      height: 80,
      length: 120,
      width: 60,
      additional_info: 'Dimensi Lurus: P 120 cm x L 60 cm x T 80 cm\nDimensi Tipe L: P 160 cm x L 120 cm x T 80 cm\nBahan Permukaan Atas: Plat Stainless Steel anti karat\nBahan Bodi: Plat Besi tebal 0.8 mm standar pabrik\nLaci Kasir (Cash Drawer): Dilengkapi kunci pengaman manual\nPelindung Samping: Karet bumper peredam benturan troli',
      stock: 0
    },
    {
      name: 'Rak Gudang Besi Heavy Duty',
      category: 'table',
      min_price: 800000,
      max_price: 800000,
      image_url: '/img/katalog/rak-gudang.jpeg',
      description: 'Rak penyimpanan stok gudang toko berkapasitas beban berat. Menggunakan struktur tiang besi tebal dan shelving yang luas untuk menyimpan dus karton besar.',
      height: 200,
      length: 100,
      width: 40,
      additional_info: 'Tinggi Tiang: 200 cm\nPanjang Shelving: 100 cm\nLebar Shelving: 40 cm\nKapasitas Beban: s/d 150 kg per tingkat ambalan\nJumlah Susun: 4 Tingkat ambalan besi tebal\nSistem Penguncian: Beam berkunci pengait pengaman',
      stock: 0
    },
    {
      name: 'Rak Display Snack & Chiki',
      category: 'decor',
      min_price: 400000,
      max_price: 400000,
      image_url: '/img/katalog/rak-snack.jpeg',
      description: 'Rak keranjang kawat khusus display snack ringan, roti, atau chiki. Memudahkan pelanggan mengambil barang dengan jangkauan terbuka.',
      height: 140,
      length: 90,
      width: 35,
      additional_info: 'Tinggi Tiang: 140 cm\nJumlah Basket/Keranjang: 4 tingkat basket kawat gantung\nBahan: Kawat besi baja tebal lapis coating anti gores\nMobilitas: Dilengkapi 4 unit roda nilon (2 roda berpengunci)\nKegunaan: Sangat cocok untuk display snack, ciki, dan mi instan',
      stock: 0
    }
  ];

  const { data, error } = await supabase.from('products').insert(baseProducts).select();
  if (error) {
    console.error('Error inserting base products:', error);
  } else {
    console.log('Successfully inserted base products:', data.map(p => p.name));
  }
}

run();
