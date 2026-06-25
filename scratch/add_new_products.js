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
  console.log('Inserting new requested products...');

  const newProducts = [
    {
      name: 'Backwall',
      category: 'lighting', // kasir
      min_price: 2100000,
      max_price: 2500000,
      image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=400&q=80',
      description: 'Backwall display ritel premium untuk dipasang di belakang meja kasir. Sangat cocok untuk display rokok, kosmetik, atau produk bernilai tinggi lainnya dengan pencahayaan dan kompartemen teratur.',
      height: 200,
      length: 120,
      width: 40,
      additional_info: 'Bahan: Plat Besi & Frame Aluminium tebal\nKompartemen: Dilengkapi sekat akrilik rokok\nKeamanan: Dilengkapi pintu sliding kaca berkunci\nPemasangan: Knockdown kokoh',
      stock: 0
    },
    {
      name: 'RAM 120',
      category: 'decor', // aksesoris
      min_price: 160000,
      max_price: 180000,
      image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80',
      description: 'Pagar jaring RAM besi baja untuk gantungan aksesoris minimarket. Tinggi tiang 120 cm.',
      height: 120,
      length: 90,
      width: 5,
      additional_info: 'Tinggi: 120 cm\nBahan: Kawat baja las tebal dengan frame kokoh\nFinishing: Chrome plating tahan karat\nKegunaan: Gantungan hanger aksesoris minimarket',
      stock: 0
    },
    {
      name: 'RAM 150',
      category: 'decor',
      min_price: 180000,
      max_price: 200000,
      image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80',
      description: 'Pagar jaring RAM besi baja untuk gantungan aksesoris minimarket. Tinggi tiang 150 cm.',
      height: 150,
      length: 90,
      width: 5,
      additional_info: 'Tinggi: 150 cm\nBahan: Kawat baja las tebal dengan frame kokoh\nFinishing: Chrome plating tahan karat\nKegunaan: Gantungan hanger aksesoris minimarket',
      stock: 0
    },
    {
      name: 'RAM 170',
      category: 'decor',
      min_price: 200000,
      max_price: 220000,
      image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80',
      description: 'Pagar jaring RAM besi baja untuk gantungan aksesoris minimarket. Tinggi tiang 170 cm.',
      height: 170,
      length: 90,
      width: 5,
      additional_info: 'Tinggi: 170 cm\nBahan: Kawat baja las tebal dengan frame kokoh\nFinishing: Chrome plating tahan karat\nKegunaan: Gantungan hanger aksesoris minimarket',
      stock: 0
    },
    {
      name: 'Tiang Penyangga',
      category: 'decor',
      min_price: 120000,
      max_price: 140000,
      image_url: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=400&q=80',
      description: 'Tiang penyangga utama untuk modul rak gondola, terbuat dari besi hollow berkualitas tinggi.',
      height: 180,
      length: 5,
      width: 5,
      additional_info: 'Tebal Plat: 1.8 mm plat baja profil U\nLubang Pitch: Presisi untuk kait bracket knockdown\nFinishing: Powder Coating EPOXY anti gores',
      stock: 0
    },
    {
      name: 'Price Tag',
      category: 'decor',
      min_price: 1900000,
      max_price: 2100000,
      image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80',
      description: 'Mika Price Tag merah pelindung label harga pada shelving ambalan rak gondola. Minimal pembelian bundle isi 200 pcs.',
      height: 4,
      length: 90,
      width: 1,
      additional_info: 'Isi Paket: 200 Pcs\nWarna: Merah / Biru / Kuning transparan\nBahan: Mika PVC tebal fleksibel\nPemasangan: Sistem jepit langsung ke bibir shelving',
      stock: 0
    },
    {
      name: 'Papan Flat',
      category: 'decor',
      min_price: 390000,
      max_price: 420000,
      image_url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=400&q=80',
      description: 'Papan flat/flat divider pembatas barang di shelving ambalan agar produk pajangan rapi. Minimal pembelian bundle isi 5 pcs.',
      height: 10,
      length: 30,
      width: 1,
      additional_info: 'Isi Paket: 5 Pcs\nBahan: Akrilik Bening tebal 2mm\nFungsi: Divider pembatas antar varian produk di ambalan',
      stock: 0
    }
  ];

  const { data, error } = await supabase.from('products').insert(newProducts).select();
  if (error) {
    console.error('Error inserting new products:', error);
  } else {
    console.log('Successfully inserted new products:', data.map(p => p.name));
  }
}

run();
