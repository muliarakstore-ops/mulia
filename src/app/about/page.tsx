'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import { getStoredCms, CmsConfig, DEFAULT_CMS } from '../../utils/storage';
import { loadCmsConfig } from '../../utils/supabaseData';

export default function AboutUs() {
  const [cmsConfig, setCmsConfig] = useState<CmsConfig>(DEFAULT_CMS);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await loadCmsConfig();
        if (config) {
          setCmsConfig(config);
        }
      } catch (e) {
        console.error('Failed to load Supabase CMS config on About page:', e);
        setCmsConfig(getStoredCms());
      }
      setIsClient(true);
    };
    fetchConfig();
  }, []);

  const handleConsultationClick = () => {
    const text = `Halo ${cmsConfig.brandName} ${cmsConfig.brandSuffix},\n\nSaya ingin berkonsultasi mengenai layout toko minimarket baru saya. Mohon informasi detail tentang produk rak dan jadwal survey ruangan. Terima kasih!`;
    const encodedText = encodeURIComponent(text);
    const url = `https://wa.me/${cmsConfig.waNumber}?text=${encodedText}`;
    window.open(url, '_blank');
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-sans">
        Memuat Halaman About Us...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white text-slate-800 font-sans pt-20">
      
      {/* Background decoration glows */}
      <div className="glow-bg w-[500px] h-[500px] top-[10%] left-[-10%]" />
      <div className="glow-bg w-[600px] h-[600px] top-[50%] right-[-10%]" />

      <Navbar 
        brandName={cmsConfig.brandName} 
        brandSuffix={cmsConfig.brandSuffix} 
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <span className="inline-block bg-[#0284c7]/10 text-[#0284c7] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              Tentang Kami
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none">
              Pabrik & Distributor Utama <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284c7] to-sky-400">Rak Minimarket</span> Premium
            </h1>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
              {cmsConfig.brandName} {cmsConfig.brandSuffix} hadir sebagai mitra terpercaya para pengusaha ritel di Indonesia. Kami memproduksi dan mendistribusikan rak gondola supermarket, meja kasir, serta sistem display dengan standar baja mutu tinggi dan presisi pabrikasi modern.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={handleConsultationClick}
                className="bg-[#0284c7] hover:bg-[#0284c7]/90 text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-lg shadow-[#0284c7]/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                Konsultasi Layout Gratis 🔗
              </button>
            </div>
          </div>

          <div className="relative flex justify-center">
            {/* Visual Graphic Representation of factory rack structures */}
            <div className="w-full max-w-md aspect-square bg-gradient-to-br from-[#0284c7]/5 to-sky-500/10 rounded-[40px] border border-[#0284c7]/10 p-8 flex flex-col justify-between relative shadow-inner overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c7_1px,transparent_1px),linear-gradient(to_bottom,#0284c7_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-15" />
              
              <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-[#0284c7] text-white flex items-center justify-center font-bold text-xl">
                  🏭
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">Diproduksi Langsung Dengan Baja Pilihan</h3>
                <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                  Kami mengontrol setiap tahap produksi mulai dari pemotongan lembaran plat baja dingin hingga pengecatan powder coating anti karat suhu tinggi 200°C.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-200/50 relative z-10">
                <div>
                  <span className="text-3xl font-black text-[#0284c7] block">10+ Year</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pengalaman Industri</span>
                </div>
                <div>
                  <span className="text-3xl font-black text-sky-500 block">1,200+</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Toko Terpasang</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Strength Cards Section */}
      <section className="bg-slate-50 border-y border-slate-200/50 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <span className="text-xs font-extrabold text-[#0284c7] uppercase tracking-widest">Keunggulan Kami</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Mengapa Memilih {cmsConfig.brandName} Rak Store?
            </h2>
            <p className="text-slate-500 text-sm font-semibold">
              Kualitas dan layanan tanpa kompromi untuk investasi jangka panjang properti toko Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284c7] flex items-center justify-center text-xl font-bold">
                🛠️
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">Bahan Baja Tebal</h4>
              <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                Menggunakan bahan Cold-Rolled Steel mutu tinggi yang tebal, menjamin kestabilan dan ketahanan beban maksimal hingga 80kg per shelving.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284c7] flex items-center justify-center text-xl font-bold">
                🎨
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">Powder Coating Tahan Lama</h4>
              <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                Finishing menggunakan cat electrostatic powder coating ramah lingkungan dengan suhu oven tinggi, menghasilkan permukaan anti gores dan mengkilap.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284c7] flex items-center justify-center text-xl font-bold">
                📐
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">Free 3D Layout Simulation</h4>
              <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                Tim desainer kami siap membuat visualisasi denah layout 3D ruangan toko Anda agar penataan letak rak presisi, efisien, dan rapi secara gratis.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284c7] flex items-center justify-center text-xl font-bold">
                🚚
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">Jaminan Kirim & Pasang</h4>
              <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                Kami menyediakan layanan pengiriman langsung ke lokasi Anda di seluruh Indonesia lengkap dengan tim pemasangan ahli dari pabrik kami.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Visi Kami</h3>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              Menjadi perusahaan pabrikasi dan distributor sistem penyimpanan serta rak gondola minimarket terbaik di Asia Tenggara, dengan berkontribusi nyata memajukan ekosistem bisnis ritel lokal melalui produk berkualitas global.
            </p>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Misi Kami</h3>
            <ul className="space-y-3 text-slate-600 text-sm font-medium">
              <li className="flex items-start gap-2.5">
                <span className="text-[#0284c7] font-bold">✔</span>
                <span>Konsisten menghasilkan produk rak gondola yang kokoh, estetik, aman, serta presisi.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#0284c7] font-bold">✔</span>
                <span>Mengembangkan inovasi desain layout rak untuk memaksimalkan efisiensi sirkulasi pelanggan toko.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#0284c7] font-bold">✔</span>
                <span>Memberikan penawaran harga terbaik yang transparan demi menghemat modal investasi awal pelaku usaha baru.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-[#0284c7] to-[#0ea5e9] text-white p-8 md:p-12 rounded-[32px] text-center space-y-6 shadow-xl shadow-[#0284c7]/15">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            Ingin Mengubah Tampilan Toko Anda Menjadi Lebih Menarik?
          </h3>
          <p className="text-white/80 text-sm md:text-base font-semibold max-w-2xl mx-auto leading-relaxed">
            Diskusikan kebutuhan ukuran rak gondola, opsi warna, simulasi layout, serta perkiraan biaya pengiriman kargo hemat langsung dengan supervisor penjualan kami.
          </p>
          <button
            onClick={handleConsultationClick}
            className="bg-white hover:bg-slate-50 text-[#0284c7] px-8 py-3.5 rounded-full font-bold text-sm shadow-md transition-all inline-block cursor-pointer"
          >
            Konsultasi WhatsApp Sekarang 💬
          </button>
        </div>
      </section>

      <Footer 
        brandName={cmsConfig.brandName}
        brandSuffix={cmsConfig.brandSuffix}
        aboutText={cmsConfig.aboutText}
      />
    </div>
  );
}
