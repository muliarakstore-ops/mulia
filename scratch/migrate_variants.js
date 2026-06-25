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
  console.log('Starting migration...');

  // 1. Delete transactions first (to prevent foreign key errors) since we are in test mode
  console.log('Cleaning old transaction tables for fresh migration...');
  await supabase.from('transaksi_opex').delete().neq('id_opex', '');
  await supabase.from('transaksi_perawatan_aset').delete().neq('id_perawatan', '');
  await supabase.from('transaksi_prive').delete().neq('id_prive', '');
  await supabase.from('detail_penjualan_produk').delete().neq('id_detail', '00000000-0000-0000-0000-000000000000');
  await supabase.from('transaksi_penjualan').delete().neq('id_transaksi', '');
  await supabase.from('detail_kulakan_produk').delete().neq('id_detail', '00000000-0000-0000-0000-000000000000');
  await supabase.from('transaksi_kulakan').delete().neq('id_kulakan', '');
  await supabase.from('transaksi_permodalan').delete().neq('id_modal', '');

  // 2. Delete the old generic products
  console.log('Deleting old generic products...');
  await supabase.from('products').delete().eq('name', 'Rak Gondola Single (Satu Sisi)');
  await supabase.from('products').delete().eq('name', 'Rak Gondola Double (Dua Sisi)');

  // 3. Insert the 6 new size variant products
  console.log('Inserting size-specific variants...');
  const newProducts = [
    {
      name: 'Rak Gondola Single 120',
      category: 'sofa',
      min_price: 825000,
      max_price: 825000,
      image_url: '/img/katalog/rak-single.jpeg',
      description: 'Rak minimarket satu sisi berkualitas tinggi untuk dipasang merapat ke dinding. Terbuat dari bahan besi baja kokoh dengan finishing powder coating anti karat.',
      height: 120,
      length: 90,
      width: 35,
      additional_info: 'Tinggi Tiang: 120 cm\nPanjang Shelving: 90 cm per unit\nLebar Shelving Dasar: 35 cm (shelving atas 30 cm)\nKapasitas Beban: s/d 50 kg per tingkat ambalan\nKetebalan Plat Shelving: 0.7 mm baja canai dingin\nFinishing: Powder Coating EPOXY tahan gores & pudar',
      stock: 25
    },
    {
      name: 'Rak Gondola Single 150',
      category: 'sofa',
      min_price: 900000,
      max_price: 900000,
      image_url: '/img/katalog/rak-single.jpeg',
      description: 'Rak minimarket satu sisi berkualitas tinggi untuk dipasang merapat ke dinding. Terbuat dari bahan besi baja kokoh dengan finishing powder coating anti karat.',
      height: 150,
      length: 90,
      width: 35,
      additional_info: 'Tinggi Tiang: 150 cm\nPanjang Shelving: 90 cm per unit\nLebar Shelving Dasar: 35 cm (shelving atas 30 cm)\nKapasitas Beban: s/d 50 kg per tingkat ambalan\nKetebalan Plat Shelving: 0.7 mm baja canai dingin\nFinishing: Powder Coating EPOXY tahan gores & pudar',
      stock: 25
    },
    {
      name: 'Rak Gondola Single 170',
      category: 'sofa',
      min_price: 950000,
      max_price: 950000,
      image_url: '/img/katalog/rak-single.jpeg',
      description: 'Rak minimarket satu sisi berkualitas tinggi untuk dipasang merapat ke dinding. Terbuat dari bahan besi baja kokoh dengan finishing powder coating anti karat.',
      height: 170,
      length: 90,
      width: 35,
      additional_info: 'Tinggi Tiang: 170 cm\nPanjang Shelving: 90 cm per unit\nLebar Shelving Dasar: 35 cm (shelving atas 30 cm)\nKapasitas Beban: s/d 50 kg per tingkat ambalan\nKetebalan Plat Shelving: 0.7 mm baja canai dingin\nFinishing: Powder Coating EPOXY tahan gores & pudar',
      stock: 25
    },
    {
      name: 'Rak Gondola Double 120',
      category: 'table',
      min_price: 1000000,
      max_price: 1000000,
      image_url: '/img/katalog/rak-double.jpeg',
      description: 'Rak lorong tengah minimarket dengan dua sisi shelving berhadapan. Struktur penahan kokoh untuk memaksimalkan kapasitas penyimpanan display produk ritel.',
      height: 120,
      length: 90,
      width: 65,
      additional_info: 'Tinggi Tiang: 120 cm (dua sisi bolak-balik)\nPanjang Shelving: 90 cm\nLebar Shelving Dasar: 35 cm (shelving atas 30 cm)\nKapasitas Beban: s/d 50 kg per tingkat ambalan\nKetebalan Plat Tiang: 1.8 mm plat baja profil U\nSistem Pemasangan: Knockdown modular (bisa disambung)',
      stock: 25
    },
    {
      name: 'Rak Gondola Double 150',
      category: 'table',
      min_price: 1200000,
      max_price: 1200000,
      image_url: '/img/katalog/rak-double.jpeg',
      description: 'Rak lorong tengah minimarket dengan dua sisi shelving berhadapan. Struktur penahan kokoh untuk memaksimalkan kapasitas penyimpanan display produk ritel.',
      height: 150,
      length: 90,
      width: 65,
      additional_info: 'Tinggi Tiang: 150 cm (dua sisi bolak-balik)\nPanjang Shelving: 90 cm\nLebar Shelving Dasar: 35 cm (shelving atas 30 cm)\nKapasitas Beban: s/d 50 kg per tingkat ambalan\nKetebalan Plat Tiang: 1.8 mm plat baja profil U\nSistem Pemasangan: Knockdown modular (bisa disambung)',
      stock: 25
    },
    {
      name: 'Rak Gondola Double 170',
      category: 'table',
      min_price: 1350000,
      max_price: 1350000,
      image_url: '/img/katalog/rak-double.jpeg',
      description: 'Rak lorong tengah minimarket dengan dua sisi shelving berhadapan. Struktur penahan kokoh untuk memaksimalkan kapasitas penyimpanan display produk ritel.',
      height: 170,
      length: 90,
      width: 65,
      additional_info: 'Tinggi Tiang: 170 cm (dua sisi bolak-balik)\nPanjang Shelving: 90 cm\nLebar Shelving Dasar: 35 cm (shelving atas 30 cm)\nKapasitas Beban: s/d 50 kg per tingkat ambalan\nKetebalan Plat Tiang: 1.8 mm plat baja profil U\nSistem Pemasangan: Knockdown modular (bisa disambung)',
      stock: 25
    }
  ];

  const { data, error } = await supabase.from('products').insert(newProducts).select();
  if (error) {
    console.error('Error inserting variants:', error);
  } else {
    console.log('Successfully inserted new variants:', data.map(p => p.name));
  }
}

run();
