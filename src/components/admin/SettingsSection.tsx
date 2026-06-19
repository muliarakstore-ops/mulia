'use strict';
import React from 'react';

interface SettingsSectionProps {
  handleResetData: () => void;
}

export default function SettingsSection({ handleResetData }: SettingsSectionProps) {
  return (
    <div className="space-y-8 animate-fadeIn max-w-2xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950">Pengaturan Sistem</h1>
        <p className="text-slate-500 text-xs md:text-sm mt-1">Pengaturan internal sistem administrator dan pembersihan data.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900">Database Reset Pabrik</h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            Menyetel ulang seluruh isi konfigurasi CMS, WhatsApp admin, katalog produk, included services, serta statistik analytics logs kembali ke data default pabrik yang pertama kali dibuat.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={handleResetData}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-red-600/15 cursor-pointer"
          >
            ⚠ Reset Database ke Default
          </button>
        </div>
      </div>
    </div>
  );
}
