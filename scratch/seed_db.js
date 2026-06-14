const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://octmefsgugjudmdxbyfe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdG1lZnNndWdqdWRtZHhieWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NzQ1ODcsImV4cCI6MjA5NjM1MDU4N30.5sVIhvjLiRIWdGbcMmqGPFeX7xBYyU567JqeEV1FJoU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Starting DB seeding via Supabase Client...');

  // 1. Seed Products
  const products = [
    {
      name: 'Rak Gondola Single (Satu Sisi)',
      category: 'sofa',
      min_price: 825000,
      max_price: 950000,
      description: 'Rak minimarket satu sisi berkualitas tinggi untuk dipasang merapat ke dinding. Terbuat dari bahan besi baja kokoh dengan finishing powder coating anti karat.',
      image_url: '/img/katalog/rak-single.jpeg',
      height: 180,
      length: 90,
      width: 35,
      stock: 50,
      additional_info: 'Tinggi Tiang: 180 cm (opsional 120/150/200 cm)\nPanjang Shelving: 90 cm per unit\nLebar Shelving Dasar: 35 cm (shelving atas 30 cm)\nKapasitas Beban: s/d 50 kg per tingkat ambalan\nKetebalan Plat Shelving: 0.7 mm baja canai dingin\nFinishing: Powder Coating EPOXY tahan gores & pudar'
    },
    {
      name: 'Rak Gondola Muka End',
      category: 'sofa',
      min_price: 775000,
      max_price: 900000,
      description: 'Rak penutup lorong dipasang di bagian depan atau belakang rak double sebagai display promo/produk unggulan. Menarik perhatian pelanggan dengan posisi strategis.',
      image_url: '/img/katalog/rak-muka-end.jpeg',
      height: 150,
      length: 90,
      width: 35,
      stock: 35,
      additional_info: 'Tinggi Tiang: 150 cm / 180 cm (menyesuaikan rak tengah)\nPanjang Shelving: 90 cm\nLebar Shelving: Dasar 35 cm (shelving atas 30 cm)\nKapasitas Beban: s/d 50 kg per tingkat\nBahan: Besi baja berkualitas premium standar SNI\nPemasangan: Knockdown (sistem kait tanpa baut)'
    },
    {
      name: 'Rak Gondola Double (Dua Sisi)',
      category: 'table',
      min_price: 1000000,
      max_price: 1350000,
      description: 'Rak lorong tengah minimarket dengan dua sisi shelving berhadapan. Struktur penahan kokoh untuk memaksimalkan kapasitas penyimpanan display produk ritel.',
      image_url: '/img/katalog/rak-double.jpeg',
      height: 150,
      length: 90,
      width: 65,
      stock: 40,
      additional_info: 'Tinggi Tiang: 150 cm (opsional 120/180/200 cm)\nPanjang Shelving: 90 cm (dua sisi bolak-balik)\nLebar Shelving Dasar: 35 cm (shelving atas 30 cm)\nKapasitas Beban: s/d 50 kg per tingkat ambalan\nKetebalan Plat Tiang: 1.8 mm plat baja profil U\nSistem Pemasangan: Knockdown modular (bisa disambung)'
    },
    {
      name: 'Rak Gudang Besi Heavy Duty',
      category: 'table',
      min_price: 800000,
      max_price: 800000,
      description: 'Rak penyimpanan stok gudang toko berkapasitas beban berat. Menggunakan struktur tiang besi tebal dan shelving yang luas untuk menyimpan dus karton besar.',
      image_url: '/img/katalog/rak-gudang.jpeg',
      height: 200,
      length: 100,
      width: 40,
      stock: 20,
      additional_info: 'Tinggi Tiang: 200 cm\nPanjang Shelving: 100 cm\nLebar Shelving: 40 cm\nKapasitas Beban: s/d 150 kg per tingkat ambalan\nJumlah Susun: 4 Tingkat ambalan besi tebal\nSistem Penguncian: Beam berkunci pengait pengaman'
    },
    {
      name: 'Meja Kasir Tipe Lurus',
      category: 'lighting',
      min_price: 1500000,
      max_price: 1500000,
      description: 'Meja kasir ritel dilapisi plat stainless steel tebal tahan gores dan karat pada permukaannya. Memiliki ruang kaki luas dan struktur kokoh.',
      image_url: '/img/katalog/meja-kasir.jpeg',
      height: 80,
      length: 120,
      width: 60,
      stock: 15,
      additional_info: 'Dimensi: Panjang 120 cm, Lebar 60 cm, Tinggi 80 cm\nBahan Permukaan Atas: Plat Stainless Steel anti karat\nBahan Bodi: Plat Besi tebal 0.8 mm standar pabrik\nLaci Kasir (Cash Drawer): Dilengkapi kunci pengaman manual\nPelindung Samping: Karet bumper peredam benturan troli'
    },
    {
      name: 'Meja Kasir Komputer Tipe L',
      category: 'lighting',
      min_price: 3500000,
      max_price: 3500000,
      description: 'Meja kasir dengan sudut siku L untuk menempatkan monitor komputer, printer kasir, dan laci uang secara rapi dan profesional.',
      image_url: '/img/katalog/meja-kasir-tipe-L.jpeg',
      height: 80,
      length: 160,
      width: 120,
      stock: 8,
      additional_info: 'Dimensi Utama: P 160 cm x L 120 cm x T 80 cm (Tipe L Siku)\nBahan Atas: Stainless Steel hairline finishing premium\nLaci Komputer: Laci gantung slide rails untuk keyboard\nKelistrikan: Dilengkapi lubang jalur kabel (cable grommet)\nRuang Simpan: Kabinet penyimpanan CPU komputer terproteksi'
    },
    {
      name: 'Rak Display Snack & Chiki',
      category: 'decor',
      min_price: 400000,
      max_price: 400000,
      description: 'Rak keranjang kawat khusus display snack ringan, roti, atau chiki. Memudahkan pelanggan mengambil barang dengan jangkauan terbuka.',
      image_url: '/img/katalog/rak-snack.jpeg',
      height: 140,
      length: 90,
      width: 35,
      stock: 25,
      additional_info: 'Tinggi Tiang: 140 cm\nJumlah Basket/Keranjang: 4 tingkat basket kawat gantung\nBahan: Kawat besi baja tebal lapis coating anti gores\nMobilitas: Dilengkapi 4 unit roda nilon (2 roda berpengunci)\nKegunaan: Sangat cocok untuk display snack, ciki, dan mi instan'
    }
  ];

  // Clear and insert products
  const { error: delProdErr } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delProdErr) console.error('Error clearing products:', delProdErr);

  const { data: insertedProds, error: insProdErr } = await supabase.from('products').insert(products).select();
  if (insProdErr) {
    console.error('Error inserting products:', insProdErr);
  } else {
    console.log(`Successfully seeded ${insertedProds.length} products!`);
  }

  // 2. Seed Services
  const services = [
    {
      title: 'Konsultasi Pembukaan Toko',
      description: 'Bimbingan komprehensif mulai dari pemilihan tipe rak, estimasi jumlah rak yang dibutuhkan, hingga penempatan posisi meja kasir untuk alur belanja optimal.'
    },
    {
      title: 'Gratis Ongkir & Instalasi',
      description: 'Layanan gratis pengiriman barang dan pemasangan langsung oleh tim profesional kami ke lokasi toko Anda. (*S&K Berlaku: Khusus pengiriman wilayah Jawa & Bali dengan minimal pemesanan rak tertentu*).'
    },
    {
      title: 'Desain Tata Letak Ruangan 3D',
      description: 'Kami buatkan simulasi tata letak rak gondola dalam bentuk visual 3D sesuai ukuran toko Anda agar Anda mendapat gambaran jelas sebelum melakukan pemesanan.'
    }
  ];

  const { error: delSvcErr } = await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delSvcErr) console.error('Error clearing services:', delSvcErr);

  const { data: insertedSvcs, error: insSvcErr } = await supabase.from('services').insert(services).select();
  if (insSvcErr) {
    console.error('Error inserting services:', insSvcErr);
  } else {
    console.log(`Successfully seeded ${insertedSvcs.length} services!`);
  }

  // 3. Seed Transactions
  const transactions = [
    { date: '2026-06-05', category: 'Penjualan', subcategory: '', type: 'income', amount: 15400000, description: 'Penjualan Rak Gondola Toko Kelontong Depok' },
    { date: '2026-06-04', category: 'Ongkos Kirim Internal', subcategory: 'Bensin', type: 'expense', amount: 850000, description: 'Biaya Solar Mobil Kargo & Pengiriman' },
    { date: '2026-06-03', category: 'Suntikan Modal', subcategory: '', type: 'income', amount: 50000000, description: 'Penambahan Modal Owner (Permodalan)' },
    { date: '2026-06-02', category: 'Re-stok', subcategory: '', type: 'expense', amount: 12500000, description: 'Pembelian Bahan Baku Plat Baja Plat Baja Pabrik' },
    { date: '2026-06-01', category: 'Penjualan', subcategory: '', type: 'income', amount: 34200000, description: 'Penjualan Rak Minimarket Alfamart Bekasi' }
  ];

  const { error: delTxErr } = await supabase.from('transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delTxErr) console.error('Error clearing transactions:', delTxErr);

  const { data: insertedTxs, error: insTxErr } = await supabase.from('transactions').insert(transactions).select();
  if (insTxErr) {
    console.error('Error inserting transactions:', insTxErr);
  } else {
    console.log(`Successfully seeded ${insertedTxs.length} transactions!`);
  }

  console.log('Seeding completed!');
}

seed();
