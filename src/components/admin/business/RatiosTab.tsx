'use strict';
'use client';

import { useMemo } from 'react';
import { SVGLineChart } from './Charts';

interface RatiosTabProps {
  cogsTotal: number;
  totalPenjualan: number;
  opexTotal: number;
  monthlyProfitMargin: number;
  netProfit: number;
  stockValue: number;
  rawPermodalan: any[];
  rawPrives: any[];
  rawRepairs: any[];
  rawOpex: any[];
  cashOnHand: number;
  rawSales: any[];
  rawRestocks: any[];
}

export default function RatiosTab({
  cogsTotal,
  totalPenjualan,
  opexTotal,
  monthlyProfitMargin,
  netProfit,
  stockValue,
  rawPermodalan,
  rawPrives,
  rawRepairs,
  rawOpex,
  cashOnHand,
  rawSales,
  rawRestocks
}: RatiosTabProps) {
  // 1. Fresh Cash Injeksi
  const freshCash = useMemo(() => {
    return rawPermodalan
      .filter(c => c.jenis_permodalan === '#Injeksi Modal')
      .reduce((acc, c) => acc + Number(c.nominal_tunai || 0), 0);
  }, [rawPermodalan]);

  // 2. Gross Asset Value
  const rawAssetsValue = useMemo(() => {
    return rawPermodalan
      .filter(c => c.jenis_permodalan === '#Penempatan Aset')
      .reduce((acc, c) => acc + Number(c.nilai_buku_aset || 0), 0);
  }, [rawPermodalan]);

  // Helper: Depreciation calculation for a given asset at a given reference date
  const calculateDepreciation = (asset: any, relativeToDate: Date = new Date()) => {
    if (asset.jenis_permodalan !== '#Penempatan Aset') return 0;
    const nilaiBuku = Number(asset.nilai_buku_aset || 0);
    const tarif = Number(asset.tarif_depresiasi || 0) / 100;
    if (nilaiBuku <= 0 || tarif <= 0) return 0;

    const inputDate = new Date(asset.waktu_input);
    const timeDiff = relativeToDate.getTime() - inputDate.getTime();
    const daysDiff = Math.max(0, timeDiff / (1000 * 3600 * 24));
    const depVal = nilaiBuku * tarif * (daysDiff / 365);
    return Math.min(nilaiBuku, depVal);
  };

  // 3. Accumulated Depreciation
  const totalDepreciation = useMemo(() => {
    return rawPermodalan
      .filter(c => c.jenis_permodalan === '#Penempatan Aset')
      .reduce((acc, c) => acc + calculateDepreciation(c), 0);
  }, [rawPermodalan]);

  const netAssetsValue = Math.max(0, rawAssetsValue - totalDepreciation);

  // 4. Total Prive
  const totalPrive = useMemo(() => {
    return rawPrives.reduce((acc, p) => acc + Number(p.nominal_prive || 0), 0);
  }, [rawPrives]);

  // 5. Retained Earnings (Laba Ditahan)
  const retainedEarnings = netProfit - totalPrive;

  // 6. Total Equity (Ekuitas)
  const totalEquity = freshCash + netAssetsValue + retainedEarnings;

  // 7. Total Assets
  const totalAssets = cashOnHand + stockValue + netAssetsValue;

  // 8. Financial Ratios
  const roe = totalEquity > 0 ? (netProfit / totalEquity) * 100 : 0;
  const roa = totalAssets > 0 ? (netProfit / totalAssets) * 100 : 0;

  // Ad Spend from OPEX using description matching
  const adSpend = useMemo(() => {
    return rawOpex
      .filter(o => {
        const desc = (o.kebutuhan_opex || '').toLowerCase();
        const cat = (o.kategori_operasional || '').toLowerCase();
        return desc.includes('iklan') || desc.includes('ads') || desc.includes('marketing') || desc.includes('facebook') || desc.includes('google') || desc.includes('tiktok') || desc.includes('promosi') || cat.includes('marketing') || cat.includes('iklan');
      })
      .reduce((acc, o) => acc + Number(o.nominal_opex || 0), 0);
  }, [rawOpex]);

  const roas = adSpend > 0 ? totalPenjualan / adSpend : 0;
  const inventoryTurnover = stockValue > 0 ? cogsTotal / stockValue : 0;

  // Helper: Currency format
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // 9. Chronological monthly data aggregation for SVGLineCharts (Year 2026)
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    const equityData: number[] = [];
    const retainedData: number[] = [];
    const depData: number[] = [];

    const targetYear = 2026;

    months.forEach((_, idx) => {
      // Create date boundaries for the end of the month
      const upToDate = new Date(targetYear, idx, 31, 23, 59, 59);

      // Fresh cash up to this month
      const fCash = rawPermodalan
        .filter(c => c.jenis_permodalan === '#Injeksi Modal' && new Date(c.waktu_input) <= upToDate)
        .reduce((acc, c) => acc + Number(c.nominal_tunai || 0), 0);

      // Assets Net Book Value up to this month
      const assetsNBV = rawPermodalan
        .filter(c => c.jenis_permodalan === '#Penempatan Aset' && new Date(c.waktu_input) <= upToDate)
        .reduce((acc, c) => {
          const gross = Number(c.nilai_buku_aset || 0);
          const dep = calculateDepreciation(c, upToDate);
          return acc + (gross - dep);
        }, 0);

      // Asset depreciation up to this month
      const totalDep = rawPermodalan
        .filter(c => c.jenis_permodalan === '#Penempatan Aset' && new Date(c.waktu_input) <= upToDate)
        .reduce((acc, c) => acc + calculateDepreciation(c, upToDate), 0);

      // Prive up to this month
      const privs = rawPrives
        .filter(p => new Date(p.waktu_prive) <= upToDate)
        .reduce((acc, p) => acc + Number(p.nominal_prive || 0), 0);

      // Cumulative Sales up to this month
      const cumSales = rawSales
        .filter(s => new Date(s.waktu_transaksi) <= upToDate)
        .reduce((acc, s) => {
          const totalAmt = s.detail_penjualan_produk?.reduce((sum: number, item: any) => sum + Number(item.total_revenue_produk || 0), 0) || 0;
          return acc + totalAmt;
        }, 0);

      // Cumulative OPEX up to this month
      const cumOpex = rawOpex
        .filter(o => new Date(o.waktu_opex) <= upToDate)
        .reduce((acc, o) => acc + Number(o.nominal_opex || 0), 0);

      // Cumulative Restocks (COGS proxies) up to this month
      const cumRestock = rawRestocks
        .filter(r => new Date(r.waktu_kulakan) <= upToDate)
        .reduce((acc, r) => {
          const totalAmt = r.detail_kulakan_produk?.reduce((sum: number, item: any) => sum + Number(item.total_biaya_kulakan || 0), 0) || 0;
          return acc + totalAmt;
        }, 0);

      const cumProfit = cumSales - (cumRestock + cumOpex);
      const cumRetained = cumProfit - privs;
      const cumEquity = fCash + assetsNBV + cumRetained;

      // In Millions (jt)
      equityData.push(Math.max(0, Math.round((cumEquity / 1000000) * 10) / 10));
      retainedData.push(Math.round((cumRetained / 1000000) * 10) / 10);
      depData.push(Math.max(0, Math.round((totalDep / 1000000) * 10) / 10));
    });

    return { equityData, retainedData, depData };
  }, [rawPermodalan, rawPrives, rawSales, rawOpex, rawRestocks]);

  // Filter lists for transaction logs
  const riwayatInjeksiModal = useMemo(() => {
    return [...rawPermodalan]
      .filter(c => c.jenis_permodalan === '#Injeksi Modal')
      .sort((a, b) => b.waktu_input.localeCompare(a.waktu_input));
  }, [rawPermodalan]);

  const riwayatPrive = useMemo(() => {
    return [...rawPrives]
      .sort((a, b) => b.waktu_prive.localeCompare(a.waktu_prive));
  }, [rawPrives]);

  const riwayatRepairs = useMemo(() => {
    return [...rawRepairs]
      .sort((a, b) => b.waktu_perawatan.localeCompare(a.waktu_perawatan));
  }, [rawRepairs]);

  // Asset Depreciation Percentage relative to gross value
  const depreciationPct = rawAssetsValue > 0 ? (totalDepreciation / rawAssetsValue) * 100 : 0;

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
            <span className="text-3xl font-black font-mono mt-2 block">{roe.toFixed(1)}%</span>
          </div>
          <div className="mt-4 text-[11px] text-indigo-200/70 border-t border-indigo-900/60 pt-2">
            Laba Bersih / Total Ekuitas. Mengukur efisiensi pemanfaatan modal owner.
          </div>
        </div>

        {/* ROA Card */}
        <div className="bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block font-sans">Return on Assets (ROA)</span>
            <span className="text-3xl font-black font-mono mt-2 text-slate-900 block">{roa.toFixed(1)}%</span>
          </div>
          <div className="mt-4 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            Laba Bersih / Total Aset. Tingkat pengembalian hasil dari seluruh aset produktif.
          </div>
        </div>

        {/* ROAS Card */}
        <div className="bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block font-sans">Return on Ad Spend (ROAS)</span>
            <span className="text-3xl font-black font-mono mt-2 text-slate-900 block">{roas.toFixed(1)}x</span>
          </div>
          <div className="mt-4 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            Revenue Penjualan / Biaya Iklan (Marketing Opex: {formatIDR(adSpend)}).
          </div>
        </div>

        {/* Inventory Turnover Card */}
        <div className="bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block font-sans">Inventory Turnover</span>
            <span className="text-3xl font-black font-mono mt-2 text-slate-900 block">{inventoryTurnover.toFixed(1)}x</span>
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
              <span className="text-3xl font-black font-mono mt-2 block">{formatIDR(totalEquity)}</span>
            </div>
            <div className="mt-4 text-[11px] text-indigo-200/70 border-t border-indigo-900/60 pt-2 font-medium">
              Akumulasi Injeksi Modal ({formatIDR(freshCash)}) + Laba Ditahan ({formatIDR(retainedEarnings)}) + Nilai Aset Bersih ({formatIDR(netAssetsValue)}).
            </div>
          </div>

          {/* Grafik Total & Perkembangan Nilai Modal per Periode */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h5 className="text-xs uppercase font-extrabold tracking-wider text-slate-700">📈 Perkembangan Nilai Modal per Periode (2026)</h5>
                <p className="text-[11px] text-slate-500">Pertumbuhan ekuitas bulanan terakumulasi secara berkala.</p>
              </div>
            </div>
            <SVGLineChart
              data={monthlyData.equityData}
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
              <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block font-sans">Total Injeksi Modal (Fresh Cash)</span>
              <span className="text-2xl font-black font-mono text-slate-900 mt-1 block">{formatIDR(freshCash)}</span>
            </div>

            {/* Daftar Riwayat Injeksi Modal */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
              <h5 className="text-xs uppercase font-extrabold tracking-wider text-slate-700 border-b border-slate-100 pb-2">📋 Riwayat Injeksi Modal</h5>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {riwayatInjeksiModal.length === 0 ? (
                  <div className="text-xs text-slate-400 italic p-3 text-center">Belum ada injeksi modal.</div>
                ) : (
                  riwayatInjeksiModal.map((c, i) => (
                    <div key={c.id_modal || i} className="flex justify-between items-center text-xs p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                      <div>
                        <span className="font-bold text-slate-700 block">Injeksi Modal</span>
                        <span className="text-[9px] text-slate-400 font-semibold">{c.waktu_input}</span>
                      </div>
                      <span className="font-mono font-black text-slate-900">{formatIDR(Number(c.nominal_tunai || 0))}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Col: Laba Ditahan & Grafik */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block font-sans">Total Laba Ditahan (Retained Earnings)</span>
                <span className="text-2xl font-black font-mono text-slate-900 mt-1 block">{formatIDR(retainedEarnings)}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Laba Bersih - Prive</span>
              </div>
            </div>
            <div>
              <h5 className="text-xs uppercase font-extrabold tracking-wider text-slate-700 mb-2">📈 Perkembangan Laba Ditahan per Periode (2026)</h5>
              <SVGLineChart
                data={monthlyData.retainedData}
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
              <span className="text-2xl font-black font-mono text-slate-900 mt-1 block">{formatIDR(totalPrive)}</span>
            </div>
            <div className="mt-6 space-y-3">
              <h5 className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider border-b border-slate-100 pb-1.5 font-sans">Riwayat Pengambilan Prive</h5>
              <div className="overflow-y-auto max-h-48 pr-1">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-150 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="pb-2">Waktu</th>
                      <th className="pb-2">Nama</th>
                      <th className="pb-2 text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riwayatPrive.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-4 text-slate-400 italic">Belum ada penarikan prive.</td>
                      </tr>
                    ) : (
                      riwayatPrive.map((p, i) => (
                        <tr key={p.id_prive || i} className="border-b border-slate-50 text-slate-700 hover:bg-slate-50 transition-colors">
                          <td className="py-2">{p.waktu_prive}</td>
                          <td className="py-2 font-medium">{p.nama_owner}</td>
                          <td className="py-2 text-right font-mono font-bold text-slate-900">{formatIDR(Number(p.nominal_prive || 0))}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Depreciation Section */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block font-sans">Nilai Depresiasi Aset Pasif (Penyusutan)</span>
                <span className="text-2xl font-black font-mono text-slate-900 mt-1 block">{formatIDR(totalDepreciation)}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-extrabold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">Penyusutan {depreciationPct.toFixed(1)}%</span>
              </div>
            </div>
            <div className="mt-4">
              <h5 className="text-xs uppercase font-extrabold tracking-wider text-slate-700 mb-2">📉 Depresiasi Aset Pasif per Periode (2026)</h5>
              <SVGLineChart
                data={monthlyData.depData}
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
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {riwayatRepairs.length === 0 ? (
              <div className="text-xs text-slate-400 italic p-3 text-center">Belum ada pemeliharaan aset atau Capex.</div>
            ) : (
              riwayatRepairs.map((r, i) => {
                const isCapex = r.jenis_perawatan === '#Peremajaan';
                return (
                  <div key={r.id_perawatan || i} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all">
                    <div>
                      <span className="text-xs font-black text-slate-800">{r.nama_pengeluaran}</span>
                      <span className="block text-[10px] text-slate-400 font-semibold mt-1">Tanggal: {r.waktu_perawatan}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-black text-slate-900 text-sm">{formatIDR(Number(r.nominal_biaya || 0))}</span>
                      <span className={`block text-[9px] uppercase font-bold px-2 py-0.5 rounded-md mt-1 w-max ml-auto ${isCapex ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 bg-slate-150'}`}>
                        {isCapex ? 'Capex (Peremajaan)' : 'Opex (Perbaikan)'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
