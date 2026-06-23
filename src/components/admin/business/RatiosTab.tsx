'use strict';
'use client';

import { SVGLineChart } from './Charts';

interface RatiosTabProps {
  cogsTotal: number;
  totalPenjualan: number;
  opexTotal: number;
  monthlyProfitMargin: number;
  netProfit: number;
  stockValue: number;
}

export default function RatiosTab({
  cogsTotal,
  totalPenjualan,
  opexTotal,
  monthlyProfitMargin,
  netProfit,
  stockValue
}: RatiosTabProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-slate-900">📐 Permodalan & Rasio Keuangan</h2>
        <p className="text-xs text-slate-500 mt-0.5">Analisis kesehatan modal, rasio ROA, ROE, ROAS, dan perputaran persediaan (Inventory Turnover) Mulia Rak Store.</p>
      </div>

      {/* KEY FINANCIAL RATIOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* ROE Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-extrabold text-indigo-300 tracking-wider block font-sans">Return on Equity (ROE)</span>
            <span className="text-3xl font-black font-mono mt-2 block">18.4%</span>
          </div>
          <div className="mt-4 text-[11px] text-indigo-200/70 border-t border-indigo-900/60 pt-2">
            Laba Bersih / Total Ekuitas. Mengukur efisiensi pemanfaatan modal owner.
          </div>
        </div>

        {/* ROA Card */}
        <div className="bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-extrabold text-slate-455 tracking-wider block font-sans">Return on Assets (ROA)</span>
            <span className="text-3xl font-black font-mono mt-2 text-slate-900 block">12.8%</span>
          </div>
          <div className="mt-4 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            Laba Bersih / Total Aset. Tingkat pengembalian hasil dari seluruh aset produktif.
          </div>
        </div>

        {/* ROAS Card */}
        <div className="bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-extrabold text-slate-455 tracking-wider block font-sans">Return on Ad Spend (ROAS)</span>
            <span className="text-3xl font-black font-mono mt-2 text-slate-900 block">5.4x</span>
          </div>
          <div className="mt-4 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            Revenue Penjualan / Biaya Iklan. Efisiensi performa kampanye marketing digital.
          </div>
        </div>

        {/* Inventory Turnover Card */}
        <div className="bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-extrabold text-slate-455 tracking-wider block font-sans">Inventory Turnover</span>
            <span className="text-3xl font-black font-mono mt-2 text-slate-900 block">4.2x / thn</span>
          </div>
          <div className="mt-4 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            HPP / Rata-rata Persediaan. Berapa kali stok barang berputar dalam setahun.
          </div>
        </div>
      </div>

      {/* SUB-SECTION A: NILAI MODAL (EKUITAS) */}
      <div className="space-y-6 pt-4">
        <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 border-b border-slate-200 pb-2">a. Nilai Modal (Ekuitas)</h4>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card Nilai Modal Saat Ini */}
          <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-extrabold text-indigo-300 tracking-wider block font-sans">Total Nilai Modal Saat Ini (Ekuitas)</span>
              <span className="text-3xl font-black font-mono mt-2 block">Rp 210.000.000</span>
            </div>
            <div className="mt-4 text-[11px] text-indigo-200/70 border-t border-indigo-900/60 pt-2 font-medium">
              Akumulasi Injeksi Modal + Laba Ditahan - Penarikan Prive.
            </div>
          </div>

          {/* Grafik Total & Perkembangan Nilai Modal per Periode */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h5 className="text-xs uppercase font-extrabold tracking-wider text-slate-700">📈 Perkembangan Nilai Modal per Periode</h5>
                <p className="text-[11px] text-slate-500">Estimasi total pertumbuhan ekuitas berkala (+15% rata-rata).</p>
              </div>
            </div>
            <SVGLineChart
              data={[150, 155, 160, 168, 165, 172, 175, 185, 190, 202, 205, 210]}
              labels={['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']}
              gradientColors={['#6366f1', '#818cf8']}
              strokeColor="#6366f1"
              gradientId="modal-tab-grad"
              valueSuffix="jt"
            />
          </div>
        </div>
      </div>

      {/* SUB-SECTION B: PENAMBAHAN MODAL */}
      <div className="space-y-6">
        <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 border-b border-slate-200 pb-2">b. Penambahan Modal</h4>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Col: Cards & List */}
          <div className="lg:col-span-5 space-y-6">
            {/* Total Injeksi Modal Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
              <span className="text-[10px] uppercase font-extrabold text-slate-455 tracking-wider block font-sans">Total Injeksi Modal (Fresh Cash)</span>
              <span className="text-2xl font-black font-mono text-slate-900 mt-1 block">Rp 150.000.000</span>
            </div>

            {/* Daftar Riwayat Injeksi Modal */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
              <h5 className="text-xs uppercase font-extrabold tracking-wider text-slate-700 border-b border-slate-100 pb-2">📋 Riwayat Injeksi Modal</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                  <span className="font-bold text-slate-700">Owner Iqbal - Injeksi Awal</span>
                  <span className="font-mono font-black text-slate-900">Rp 150.000.000</span>
                </div>
                <div className="text-[10px] text-slate-400 font-bold px-2">Terakhir diperbarui: 15 Juni 2026</div>
              </div>
            </div>
          </div>

          {/* Right Col: Laba Ditahan & Grafik */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-slate-455 tracking-wider block font-sans">Total Laba Ditahan (Retained Earnings)</span>
                <span className="text-2xl font-black font-mono text-slate-900 mt-1 block">Rp 65.000.000</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Pertumbuhan +18%</span>
              </div>
            </div>
            <div>
              <h5 className="text-xs uppercase font-extrabold tracking-wider text-slate-700 mb-2">📈 Perkembangan Laba Ditahan per Periode</h5>
              <SVGLineChart
                data={[10, 15, 20, 24, 28, 35, 42, 45, 50, 55, 60, 65]}
                labels={['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']}
                gradientColors={['#10b981', '#34d399']}
                strokeColor="#10b981"
                gradientId="laba-ditahan-tab-grad"
                valueSuffix="jt"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SUB-SECTION C: PENGAMBILAN & PENGURANGAN MODAL */}
      <div className="space-y-6">
        <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 border-b border-slate-200 pb-2">c. Pengambilan / Pengurangan Modal</h4>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Prive section */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-extrabold text-rose-500 tracking-wider block font-sans">Total Prive Diambil (Pribadi)</span>
              <span className="text-2xl font-black font-mono text-slate-900 mt-1 block">Rp 5.000.000</span>
            </div>
            <div className="mt-6 space-y-3">
              <h5 className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider border-b border-slate-100 pb-1.5 font-sans">Riwayat Pengambilan Prive</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-150 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="pb-2">Waktu</th>
                      <th className="pb-2 text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-50 text-slate-700">
                      <td className="py-2">03 Jun 2026</td>
                      <td className="py-2 text-right font-mono font-bold">Rp 5.000.000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Depreciation Section */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-slate-455 tracking-wider block font-sans">Nilai Depresiasi Aset Pasif (Penyusutan)</span>
                <span className="text-2xl font-black font-mono text-slate-900 mt-1 block">Rp 3.500.000</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-extrabold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">Penyusutan 2.3%</span>
              </div>
            </div>
            <div className="mt-4">
              <h5 className="text-xs uppercase font-extrabold tracking-wider text-slate-700 mb-2">📉 Depresiasi Aset Pasif per Periode</h5>
              <SVGLineChart
                data={[0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.1, 2.4, 2.7, 3.0, 3.2, 3.5]}
                labels={['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']}
                gradientColors={['#f43f5e', '#fda4af']}
                strokeColor="#f43f5e"
                gradientId="depresiasi-tab-grad"
                valueSuffix="jt"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SUB-SECTION D: ALOKASI MODAL */}
      <div className="space-y-6">
        <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 border-b border-slate-200 pb-2">d. Alokasi Modal & Pemeliharaan</h4>
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
          <h5 className="text-xs uppercase font-extrabold tracking-wider text-slate-700 border-b border-slate-100 pb-2">🔧 Riwayat Perbaikan Aset (Maintenance & Capex Allocation)</h5>
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all">
              <div>
                <span className="text-xs font-black text-slate-800">Pembelian Mesin Tekuk Plat Baja Baru (Upgrade Kapasitas)</span>
                <span className="block text-[10px] text-slate-400 font-semibold mt-1">Tanggal: 02 Juni 2026</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-black text-slate-900 text-sm">Rp 45.000.000</span>
                <span className="block text-[9px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md mt-1 w-max ml-auto">Capex</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
