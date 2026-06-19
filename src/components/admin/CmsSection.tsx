'use strict';
import React from 'react';
import { FullCmsConfig } from '../../utils/supabaseData';

interface CmsSectionProps {
  cmsConfig: FullCmsConfig;
  setCmsConfig: React.Dispatch<React.SetStateAction<FullCmsConfig>>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, field: 'heroBgImageUrl' | 'convPhoneImageUrl') => void;
  handleSaveCMS: (e: React.FormEvent) => void;
}

export default function CmsSection({
  cmsConfig,
  setCmsConfig,
  handleImageUpload,
  handleSaveCMS,
}: CmsSectionProps) {
  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950">CMS Konten Landing Page</h1>
        <p className="text-slate-500 text-xs md:text-sm mt-1">Sesuaikan seluruh teks judul, subjudul, gambar, dan tata letak per halaman.</p>
      </div>

      <form onSubmit={handleSaveCMS} className="space-y-8">
        {/* #Hero Page */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <span>✨</span> Section Hero
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Sub-Top-Title</label>
              <input
                type="text"
                value={cmsConfig.heroSubTopTitle || ''}
                onChange={(e) => setCmsConfig({ ...cmsConfig, heroSubTopTitle: e.target.value })}
                placeholder="Mulia Rak Store"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Main-Title Putih</label>
              <input
                type="text"
                value={cmsConfig.heroTitle || ''}
                onChange={(e) => setCmsConfig({ ...cmsConfig, heroTitle: e.target.value })}
                placeholder="Penyedia Rak Gondola & Meja Kasir Berkualitas"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Main-Title Biru</label>
              <textarea
                value={cmsConfig.heroSubTitle || ''}
                onChange={(e) => setCmsConfig({ ...cmsConfig, heroSubTitle: e.target.value })}
                rows={3}
                placeholder="Menyediakan perlengkapan minimarket terbaik langsung dari pabrik dengan standar SNI."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors leading-relaxed resize-y"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Sub-Title (Paragraf Deskripsi)</label>
              <textarea
                value={cmsConfig.heroDescription || ''}
                onChange={(e) => setCmsConfig({ ...cmsConfig, heroDescription: e.target.value })}
                rows={4}
                placeholder="Menyediakan perlengkapan minimarket terbaik langsung dari pabrik..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors leading-relaxed resize-y"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Image Background Hero (Rekomendasi Rasio 16:9 - e.g. 1920x1080 px)</label>
            <div className="space-y-3">
              {cmsConfig.heroBgImageUrl && (
                <div className="relative w-full max-w-md aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={cmsConfig.heroBgImageUrl} 
                    alt="Hero Background Preview" 
                    className="w-full h-full object-cover" 
                  />
                  <button
                    type="button"
                    onClick={() => setCmsConfig({ ...cmsConfig, heroBgImageUrl: '' })}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs uppercase tracking-wider gap-2 cursor-pointer"
                  >
                    🗑️ Hapus Gambar
                  </button>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <label className="bg-primary-blue hover:bg-primary-blue-hover text-white text-xs font-bold uppercase tracking-wider px-5 py-3.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 shadow-md shadow-primary-blue/15 w-fit">
                  📁 Upload dari Komputer
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'heroBgImageUrl')}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={cmsConfig.heroBgImageUrl || ''}
                  onChange={(e) => setCmsConfig({ ...cmsConfig, heroBgImageUrl: e.target.value })}
                  placeholder="Atau tempel URL gambar di sini..."
                  className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* #Katalog Page */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <span>📦</span> Section Katalog Produk
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Main Title</label>
              <input
                type="text"
                value={cmsConfig.catalogMainTitle || ''}
                onChange={(e) => setCmsConfig({ ...cmsConfig, catalogMainTitle: e.target.value })}
                placeholder="Katalog Produk Kami"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Sub-Title</label>
              <input
                type="text"
                value={cmsConfig.catalogSubTitle || ''}
                onChange={(e) => setCmsConfig({ ...cmsConfig, catalogSubTitle: e.target.value })}
                placeholder="Pilihan produk rak display dan meja kasir terlengkap."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Jumlah Baris Jajar Produk {"{Mobile}"} (Grid Mobile)</label>
              <input
                type="number"
                value={cmsConfig.catalogColsMobile || 1}
                onChange={(e) => setCmsConfig({ ...cmsConfig, catalogColsMobile: parseInt(e.target.value) || 1 })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Jumlah Baris Jajar Produk {"{Desktop}"} (Grid Desktop)</label>
              <input
                type="number"
                value={cmsConfig.catalogColsDesktop || 3}
                onChange={(e) => setCmsConfig({ ...cmsConfig, catalogColsDesktop: parseInt(e.target.value) || 3 })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* #Layanan Page */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <span>🛠️</span> Section Layanan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Main-Title</label>
              <input
                type="text"
                value={cmsConfig.servicesMainTitle || ''}
                onChange={(e) => setCmsConfig({ ...cmsConfig, servicesMainTitle: e.target.value })}
                placeholder="Layanan & Keuntungan"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Sub-Title</label>
              <input
                type="text"
                value={cmsConfig.servicesSubTitle || ''}
                onChange={(e) => setCmsConfig({ ...cmsConfig, servicesSubTitle: e.target.value })}
                placeholder="Mengapa memilih kami sebagai partner bisnis ritel Anda?"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* #Cek Ongkir Page */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <span>🚚</span> Section Cek Ongkir
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Main-Title</label>
              <input
                type="text"
                value={cmsConfig.shippingMainTitle || ''}
                onChange={(e) => setCmsConfig({ ...cmsConfig, shippingMainTitle: e.target.value })}
                placeholder="Cek Estimasi Ongkir"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Sub-Title</label>
              <input
                type="text"
                value={cmsConfig.shippingSubTitle || ''}
                onChange={(e) => setCmsConfig({ ...cmsConfig, shippingSubTitle: e.target.value })}
                placeholder="Hitung biaya pengiriman logistik berdasarkan jarak lokasi Anda."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* #Conversation Page */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <span>💬</span> Section Percakapan (CTA)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Main Title</label>
              <input
                type="text"
                value={cmsConfig.convMainTitle || ''}
                onChange={(e) => setCmsConfig({ ...cmsConfig, convMainTitle: e.target.value })}
                placeholder="Hubungi Kami"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Sub-Title</label>
              <input
                type="text"
                value={cmsConfig.convSubTitle || ''}
                onChange={(e) => setCmsConfig({ ...cmsConfig, convSubTitle: e.target.value })}
                placeholder="Konsultasikan kebutuhan layout toko Anda secara gratis."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Card Title (WhatsApp CTA)</label>
              <input
                type="text"
                value={cmsConfig.convCardTitle || ''}
                onChange={(e) => setCmsConfig({ ...cmsConfig, convCardTitle: e.target.value })}
                placeholder="Chat Whatsapp"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Card Description</label>
              <input
                type="text"
                value={cmsConfig.convCardDescription || ''}
                onChange={(e) => setCmsConfig({ ...cmsConfig, convCardDescription: e.target.value })}
                placeholder="Tim admin kami siap membalas pesan Anda dalam 24 jam."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Image Wallpaper Phone (Rekomendasi Rasio 9:16 - e.g. 1080x1920 px)</label>
            <div className="space-y-3">
              {cmsConfig.convPhoneImageUrl && (
                <div className="relative w-36 aspect-[9/16] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={cmsConfig.convPhoneImageUrl} 
                    alt="Phone Mockup Wallpaper Preview" 
                    className="w-full h-full object-cover" 
                  />
                  <button
                    type="button"
                    onClick={() => setCmsConfig({ ...cmsConfig, convPhoneImageUrl: '' })}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-[10px] uppercase tracking-wider text-center p-2 cursor-pointer"
                  >
                    🗑️ Hapus Gambar
                  </button>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <label className="bg-primary-blue hover:bg-primary-blue-hover text-white text-xs font-bold uppercase tracking-wider px-5 py-3.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 shadow-md shadow-primary-blue/15 w-fit">
                  📁 Upload dari Komputer
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'convPhoneImageUrl')}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={cmsConfig.convPhoneImageUrl || ''}
                  onChange={(e) => setCmsConfig({ ...cmsConfig, convPhoneImageUrl: e.target.value })}
                  placeholder="Atau tempel URL gambar di sini..."
                  className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
          <button
            type="submit"
            className="bg-primary-blue hover:bg-primary-blue-hover text-white font-bold px-8 py-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-primary-blue/15 cursor-pointer"
          >
            💾 Simpan Seluruh Konten CMS
          </button>
        </div>
      </form>
    </div>
  );
}
