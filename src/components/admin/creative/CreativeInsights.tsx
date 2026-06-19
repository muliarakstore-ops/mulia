import React from 'react';

interface VideoStats {
  total: number;
  akanDiuploadCount: number;
  belumDiuploadCount: number;
  sudahDiuploadCount: number;
  hanyaDiProduksiCount: number;
}

interface DesignStats {
  total: number;
  producedCount: number;
  draftCount: number;
}

interface CreativeInsightsProps {
  videoStats: VideoStats;
  designStats: DesignStats;
}

export default function CreativeInsights({ videoStats, designStats }: CreativeInsightsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Video Analytics Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-3xl shadow-xl shadow-slate-900/10 space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">📊 Insight Video</h3>
          <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">TikTok / Reels</span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-white/5 p-3 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Hanya Di Produksi</span>
            <span className="text-2xl font-black block mt-1">{videoStats.hanyaDiProduksiCount}</span>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl border border-amber-500/20">
            <span className="text-[10px] text-amber-400 font-bold block uppercase">Belum Diupload</span>
            <span className="text-2xl font-black text-amber-400 block mt-1">{videoStats.belumDiuploadCount}</span>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl border border-emerald-500/20">
            <span className="text-[10px] text-emerald-400 font-bold block uppercase">Sudah Diupload</span>
            <span className="text-2xl font-black text-emerald-400 block mt-1">{videoStats.sudahDiuploadCount}</span>
          </div>
        </div>

        <div className="text-xs text-slate-400 text-center bg-white/5 py-2 px-3 rounded-xl">
          Total Target Kampanye Video: <span className="text-white font-bold">{videoStats.akanDiuploadCount} Akan Diupload</span>
        </div>
      </div>

      {/* Designs/Photos Analytics Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">🎨 Insight Foto & Desain</h3>
          <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">Visual Feed</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
            <div>
              <span className="text-[9px] text-slate-400 font-bold block uppercase">Total Karya</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{designStats.total} Aset</span>
            </div>
            <span className="text-2xl">📸</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
            <div>
              <span className="text-[9px] text-slate-400 font-bold block uppercase">Siap Produksi</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{designStats.producedCount} Aset</span>
            </div>
            <span className="text-2xl">📐</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/50">
          💡 <strong>Rekomendasi Kreatif:</strong> Optimalisasi materi brosur cetak dan desain banner 3D terbukti mendongkrak konversi leads WhatsApp hingga <strong>15%</strong> pada kuartal ini.
        </p>
      </div>
    </div>
  );
}
