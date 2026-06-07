import React from 'react';
import { Product } from '../types';

export const WA_NUMBER = '6281234567890';

export const PRODUCTS: Product[] = [
  {
    id: 'rak-single',
    name: 'Rak Gondola Single (Satu Sisi)',
    price: 'Rp 825.000 - Rp 950.000',
    description: 'Rak minimarket satu sisi berkualitas tinggi untuk dipasang merapat ke dinding. Terbuat dari bahan besi baja kokoh dengan finishing powder coating anti karat.',
    category: 'sofa',
    image: '/img/katalog/rak-single.jpeg',
    specs: [
      'Tinggi Tiang: 180 cm (opsional 120/150/200 cm)',
      'Panjang Shelving: 90 cm per unit',
      'Lebar Shelving Dasar: 35 cm (shelving atas 30 cm)',
      'Kapasitas Beban: s/d 50 kg per tingkat ambalan',
      'Ketebalan Plat Shelving: 0.7 mm baja canai dingin',
      'Finishing: Powder Coating EPOXY tahan gores & pudar'
    ]
  },
  {
    id: 'rak-muka-end',
    name: 'Rak Gondola Muka End',
    price: 'Rp 775.000 - Rp 900.000',
    description: 'Rak penutup lorong dipasang di bagian depan atau belakang rak double sebagai display promo/produk unggulan. Menarik perhatian pelanggan dengan posisi strategis.',
    category: 'sofa',
    image: '/img/katalog/rak-muka-end.jpeg',
    specs: [
      'Tinggi Tiang: 150 cm / 180 cm (menyesuaikan rak tengah)',
      'Panjang Shelving: 90 cm',
      'Lebar Shelving: Dasar 35 cm (shelving atas 30 cm)',
      'Kapasitas Beban: s/d 50 kg per tingkat',
      'Bahan: Besi baja berkualitas premium standar SNI',
      'Pemasangan: Knockdown (sistem kait tanpa baut)'
    ]
  },
  {
    id: 'rak-double',
    name: 'Rak Gondola Double (Dua Sisi)',
    price: 'Rp 1.000.000 - Rp 1.350.000',
    description: 'Rak lorong tengah minimarket dengan dua sisi shelving berhadapan. Struktur penahan kokoh untuk memaksimalkan kapasitas penyimpanan display produk ritel.',
    category: 'table',
    image: '/img/katalog/rak-double.jpeg',
    specs: [
      'Tinggi Tiang: 150 cm (opsional 120/180/200 cm)',
      'Panjang Shelving: 90 cm (dua sisi bolak-balik)',
      'Lebar Shelving Dasar: 35 cm (shelving atas 30 cm)',
      'Kapasitas Beban: s/d 50 kg per tingkat ambalan',
      'Ketebalan Plat Tiang: 1.8 mm plat baja profil U',
      'Sistem Pemasangan: Knockdown modular (bisa disambung)'
    ]
  },
  {
    id: 'rak-gudang',
    name: 'Rak Gudang Besi Heavy Duty',
    price: 'Rp 800.000',
    description: 'Rak penyimpanan stok gudang toko berkapasitas beban berat. Menggunakan struktur tiang besi tebal dan shelving yang luas untuk menyimpan dus karton besar.',
    category: 'table',
    image: '/img/katalog/rak-gudang.jpeg',
    specs: [
      'Tinggi Tiang: 200 cm',
      'Panjang Shelving: 100 cm',
      'Lebar Shelving: 40 cm',
      'Kapasitas Beban: s/d 150 kg per tingkat ambalan',
      'Jumlah Susun: 4 Tingkat ambalan besi tebal',
      'Sistem Penguncian: Beam berkunci pengait pengaman'
    ]
  },
  {
    id: 'meja-kasir-std',
    name: 'Meja Kasir Tipe Lurus',
    price: 'Rp 1.500.000',
    description: 'Meja kasir ritel dilapisi plat stainless steel tebal tahan gores dan karat pada permukaannya. Memiliki ruang kaki luas dan struktur kokoh.',
    category: 'lighting',
    image: '/img/katalog/meja-kasir.jpeg',
    specs: [
      'Dimensi: Panjang 120 cm, Lebar 60 cm, Tinggi 80 cm',
      'Bahan Permukaan Atas: Plat Stainless Steel anti karat',
      'Bahan Bodi: Plat Besi tebal 0.8 mm standar pabrik',
      'Laci Kasir (Cash Drawer): Dilengkapi kunci pengaman manual',
      'Pelindung Samping: Karet bumper peredam benturan troli'
    ]
  },
  {
    id: 'meja-kasir-tipe-L',
    name: 'Meja Kasir Komputer Tipe L',
    price: 'Rp 3.500.000',
    description: 'Meja kasir dengan sudut siku L untuk menempatkan monitor komputer, printer kasir, dan laci uang secara rapi dan profesional.',
    category: 'lighting',
    image: '/img/katalog/meja-kasir-tipe-L.jpeg',
    specs: [
      'Dimensi Utama: P 160 cm x L 120 cm x T 80 cm (Tipe L Siku)',
      'Bahan Atas: Stainless Steel hairline finishing premium',
      'Laci Komputer: Laci gantung slide rails untuk keyboard',
      'Kelistrikan: Dilengkapi lubang jalur kabel (cable grommet)',
      'Ruang Simpan: Kabinet penyimpanan CPU komputer terproteksi'
    ]
  },
  {
    id: 'rak-snack',
    name: 'Rak Display Snack & Chiki',
    price: 'Rp 400.000',
    description: 'Rak keranjang kawat khusus display snack ringan, roti, atau chiki. Memudahkan pelanggan mengambil barang dengan jangkauan terbuka.',
    category: 'decor',
    image: '/img/katalog/rak-snack.jpeg',
    specs: [
      'Tinggi Tiang: 140 cm',
      'Jumlah Basket/Keranjang: 4 tingkat basket kawat gantung',
      'Bahan: Kawat besi baja tebal lapis coating anti gores',
      'Mobilitas: Dilengkapi 4 unit roda nilon (2 roda berpengunci)',
      'Kegunaan: Sangat cocok untuk display snack, ciki, dan mi instan'
    ]
  },
];

export interface IncludedService {
  id?: string;
  title: string;
  description: string;
}

export const INCLUDED_SERVICES: IncludedService[] = [
  {
    title: 'Konsultasi Pembukaan Toko',
    description: 'Bimbingan komprehensif mulai dari pemilihan tipe rak, estimasi jumlah rak yang dibutuhkan, hingga penempatan posisi meja kasir untuk alur belanja optimal.',
  },
  {
    title: 'Gratis Ongkir & Instalasi',
    description: 'Layanan gratis pengiriman barang dan pemasangan langsung oleh tim profesional kami ke lokasi toko Anda. (*S&K Berlaku: Khusus pengiriman wilayah Jawa & Bali dengan minimal pemesanan rak tertentu*).',
  },
  {
    title: 'Desain Tata Letak Ruangan 3D',
    description: 'Kami buatkan simulasi tata letak rak gondola dalam bentuk visual 3D sesuai ukuran toko Anda agar Anda mendapat gambaran jelas sebelum melakukan pemesanan.',
  },
];
