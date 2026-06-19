'use strict';
import React from 'react';
import { FullCmsConfig } from '../../utils/supabaseData';

interface ProfileSectionProps {
  cmsConfig: FullCmsConfig;
  setCmsConfig: React.Dispatch<React.SetStateAction<FullCmsConfig>>;
  handleSaveCMS: (e: React.FormEvent) => void;
}

export default function ProfileSection({
  cmsConfig,
  setCmsConfig,
  handleSaveCMS,
}: ProfileSectionProps) {
  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950">Profil Perusahaan / About Us</h1>
        <p className="text-slate-500 text-xs md:text-sm mt-1">Ubah penjelasan Profil Perusahaan dan Detail Informasi tentang kami pada halaman About Us.</p>
      </div>

      <form onSubmit={handleSaveCMS} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Penjelasan Singkat Profil (Footer & About Us)</label>
          <textarea
            value={cmsConfig.aboutText}
            onChange={(e) => setCmsConfig({ ...cmsConfig, aboutText: e.target.value })}
            rows={4}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors leading-relaxed"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">Deskripsi ringkas yang muncul pada bagian bawah halaman utama (Footer) dan bagian atas halaman profil.</span>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="bg-primary-blue hover:bg-primary-blue-hover text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-primary-blue/15 cursor-pointer"
          >
            Simpan Profil
          </button>
        </div>
      </form>
    </div>
  );
}
