'use strict';
import React from 'react';

interface Transaction {
  id: number;
  date: string;
  desc: string;
  type: 'penjualan' | 'pengeluaran' | 'permodalan';
  amount: number;
}

interface BusinessSectionProps {
  activeMenu: 'biz_financials' | 'biz_ledger' | 'biz_analysis';
  transactions: Transaction[];
  txDesc: string;
  setTxDesc: (val: string) => void;
  txType: 'penjualan' | 'pengeluaran' | 'permodalan';
  setTxType: (val: 'penjualan' | 'pengeluaran' | 'permodalan') => void;
  txAmount: string;
  setTxAmount: (val: string) => void;
  handleAddTransaction: (e: React.FormEvent) => void;
}

export default function BusinessSection({
  activeMenu,
  transactions,
  txDesc,
  setTxDesc,
  txType,
  setTxType,
  txAmount,
  setTxAmount,
  handleAddTransaction,
}: BusinessSectionProps) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* DASHBOARD BISNIS - SUB-MENU 1: LAPORAN KEUANGAN */}
      {activeMenu === 'biz_financials' && (
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950">Laporan Keuangan</h1>
            <p className="text-slate-500 text-xs md:text-sm mt-1">Analisis performa finansial permodalan, pengeluaran operasional, dan laba kotor bisnis.</p>
          </div>

          {/* Financial Card Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-5 rounded-3xl shadow-sm border border-emerald-500/20 space-y-4">
              <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider block">Total Penjualan</span>
              <div className="space-y-1">
                <span className="text-xl md:text-2xl font-black block">
                  Rp {transactions.filter(t => t.type === 'penjualan').reduce((a, b) => a + b.amount, 0).toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-white/80 block">Dari {transactions.filter(t => t.type === 'penjualan').length} invoice penjualan</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-500 to-red-650 text-white p-5 rounded-3xl shadow-sm border border-rose-500/20 space-y-4">
              <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider block">Total Pengeluaran</span>
              <div className="space-y-1">
                <span className="text-xl md:text-2xl font-black block">
                  Rp {transactions.filter(t => t.type === 'pengeluaran').reduce((a, b) => a + b.amount, 0).toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-white/80 block">Bahan baku & operasional kargo</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-700 text-white p-5 rounded-3xl shadow-sm border border-indigo-500/20 space-y-4">
              <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider block">Laba Bersih (Net Profit)</span>
              <div className="space-y-1">
                <span className="text-xl md:text-2xl font-black block">
                  Rp {(transactions.filter(t => t.type === 'penjualan').reduce((a, b) => a + b.amount, 0) - transactions.filter(t => t.type === 'pengeluaran').reduce((a, b) => a + b.amount, 0)).toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-white/80 block">Margin Keuntungan Bersih</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-orange-650 text-white p-5 rounded-3xl shadow-sm border border-amber-500/20 space-y-4">
              <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider block">Total Permodalan</span>
              <div className="space-y-1">
                <span className="text-xl md:text-2xl font-black block">
                  Rp {transactions.filter(t => t.type === 'permodalan').reduce((a, b) => a + b.amount, 0).toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-white/80 block">Injeksi modal & kas owner</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-5 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">Persentase Pengeluaran Operasional</h3>
            <div className="space-y-4">
              {[
                { category: 'Bahan Baku Plat & Baja Pabrik', percent: 65, amount: 'Rp 8,125,000', color: 'bg-rose-500' },
                { category: 'Logistik Armada & Solar Pengiriman', percent: 25, amount: 'Rp 3,125,000', color: 'bg-amber-500' },
                { category: 'Iklan Digital & Campaign Kreatif', percent: 10, amount: 'Rp 1,250,000', color: 'bg-primary-blue' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{item.category} ({item.percent}%)</span>
                    <span className="text-slate-900 font-bold">{item.amount}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-100" style={{ width: `${item.percent}%` }}>
                      <div className={`h-full ${item.color}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD BISNIS - SUB-MENU 2: PENCATATAN KAS */}
      {activeMenu === 'biz_ledger' && (
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950">Pencatatan Buku Kas</h1>
            <p className="text-slate-500 text-xs md:text-sm mt-1">Formulir pembukuan kas harian dan pencatatan histori transaksi permodalan serta penjualan.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Input Ledger */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4 h-fit">
              <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">Input Transaksi Keuangan</h3>
              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Deskripsi Transaksi</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pembelian Cat Powder Coating"
                    value={txDesc}
                    onChange={(e) => setTxDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary-blue/60 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tipe</label>
                    <select
                      value={txType}
                      onChange={(e) => setTxType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary-blue/60 transition-colors cursor-pointer"
                    >
                      <option value="penjualan">Penjualan (+)</option>
                      <option value="pengeluaran">Pengeluaran (-)</option>
                      <option value="permodalan">Permodalan (+)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Jumlah (Rupiah)</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 5000000"
                      value={txAmount}
                      onChange={(e) => setTxAmount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary-blue/60 transition-colors"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  💾 Catat Transaksi
                </button>
              </form>
            </div>

            {/* Ledger Table */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm lg:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">Histori Jurnal Buku Kas</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                      <th className="p-3">Tanggal</th>
                      <th className="p-3">Keterangan</th>
                      <th className="p-3">Tipe</th>
                      <th className="p-3 text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-mono text-slate-400">{tx.date}</td>
                        <td className="p-3 font-bold text-slate-900">{tx.desc}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                            tx.type === 'penjualan' ? 'bg-emerald-50 text-emerald-600' : tx.type === 'pengeluaran' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className={`p-3 text-right font-bold font-mono ${
                          tx.type === 'penjualan' ? 'text-emerald-600' : tx.type === 'pengeluaran' ? 'text-rose-600' : 'text-indigo-600'
                        }`}>
                          {tx.type === 'pengeluaran' ? '-' : '+'}Rp {tx.amount.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD BISNIS - SUB-MENU 3: ANALISIS MODAL & LABA (SIMULATOR PROYEKSI) */}
      {activeMenu === 'biz_analysis' && (
        <div className="space-y-8 max-w-3xl">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950">Target Simulasi Modal & Laba</h1>
            <p className="text-slate-500 text-xs md:text-sm mt-1">Simulator proyeksi pengembalian modal (ROI) dan margin laba berdasarkan target penjualan bulanan.</p>
          </div>

          {/* Financial Projection Tool */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">Simulator Finansial Bulanan</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Controls */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500 uppercase tracking-wider">Target Penjualan (Satu Bulan)</span>
                    <span className="text-primary-blue">Rp 120.000.000</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl font-mono text-sm text-slate-800 text-right">
                    Rp 120,000,000
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500 uppercase tracking-wider">Estimasi Pengeluaran Pokok & Operasional</span>
                    <span className="text-rose-600">Rp 48.000.000 (40%)</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl font-mono text-sm text-slate-800 text-right">
                    Rp 48,000,000
                  </div>
                </div>
              </div>

              {/* Right Analytics Outputs */}
              <div className="bg-slate-900 text-slate-300 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Proyeksi Laba Bersih</span>
                  <span className="text-2xl font-black text-white block mt-1">Rp 72,000,000 / bln</span>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                  <div>
                    <span className="text-slate-500 text-[9px] font-bold uppercase tracking-wider block">Margin Laba</span>
                    <span className="text-sm font-extrabold text-emerald-400 block mt-0.5">60.00%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[9px] font-bold uppercase tracking-wider block">Proyeksi ROI</span>
                    <span className="text-sm font-extrabold text-sky-400 block mt-0.5">1.5 Tahun (Sehat)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
