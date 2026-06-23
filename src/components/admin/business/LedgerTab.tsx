'use strict';
'use client';

import React from 'react';
import { Transaction } from './Charts';

interface LedgerTabProps {
  cashOnHand: number;
  transactions: Transaction[];
  txDesc: string;
  setTxDesc: (v: string) => void;
  txType: 'penjualan' | 'pengeluaran' | 'permodalan' | 'prive' | 'capex';
  setTxType: (v: 'penjualan' | 'pengeluaran' | 'permodalan' | 'prive' | 'capex') => void;
  txAmount: string;
  setTxAmount: (v: string) => void;
  txQty: string;
  setTxQty: (v: string) => void;
  filterTxJenis: 'Semua' | 'pemasukan' | 'pengeluaran';
  setFilterTxJenis: (v: 'Semua' | 'pemasukan' | 'pengeluaran') => void;
  filterTxSubJenis: string;
  setFilterTxSubJenis: (v: string) => void;
  isPemasukanModalOpen: boolean;
  setIsPemasukanModalOpen: (v: boolean) => void;
  isPengeluaranModalOpen: boolean;
  setIsPengeluaranModalOpen: (v: boolean) => void;
  handleAddTransaction: (e: React.FormEvent) => void;
  onLihatLaporan: () => void;
}

export default function LedgerTab({
  cashOnHand,
  transactions,
  txDesc,
  setTxDesc,
  txType,
  setTxType,
  txAmount,
  setTxAmount,
  txQty,
  setTxQty,
  filterTxJenis,
  setFilterTxJenis,
  filterTxSubJenis,
  setFilterTxSubJenis,
  isPemasukanModalOpen,
  setIsPemasukanModalOpen,
  isPengeluaranModalOpen,
  setIsPengeluaranModalOpen,
  handleAddTransaction,
  onLihatLaporan
}: LedgerTabProps) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-slate-900">📖 Transaksi & Keuangan</h2>
        <p className="text-xs text-slate-500 mt-0.5">Analisis arus kas ledger, pendapatan kotor, laba rugi margin, profitabilitas, serta pos beban operasional dalam satu dashboard terpadu.</p>
      </div>

      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-2">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">📋 Laporan Kas & Input Jurnal</h3>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          <div className="flex-1 bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 p-6 rounded-2xl border border-slate-800/80 shadow-lg shadow-indigo-950/20 hover:scale-[1.01] hover:shadow-xl transition-all duration-300 flex flex-col justify-center min-h-[110px] text-white">
            <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">Total Kas & Bank</span>
            <span className="text-3xl font-black text-white font-mono mt-1.5 block">Rp {cashOnHand.toLocaleString('id-ID')}</span>
            <span className="text-xs text-emerald-450 block mt-2 font-medium">🟢 Aliran Kas Aktif & Likuid</span>
          </div>

          <div className="flex gap-4 items-stretch flex-wrap lg:flex-nowrap">
            <button 
              onClick={() => {
                setTxType('penjualan');
                setIsPemasukanModalOpen(true);
              }}
              className="flex-1 lg:w-32 bg-gradient-to-br from-white to-slate-50/50 hover:bg-slate-100 border border-slate-200/70 p-4.5 rounded-2xl shadow-xs hover:scale-[1.02] hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center gap-2 cursor-pointer group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">📥</span>
              <span className="text-[10px] font-black uppercase text-slate-700 tracking-wider">Input Pemasukan</span>
            </button>

            <button 
              onClick={() => {
                setTxType('pengeluaran');
                setIsPengeluaranModalOpen(true);
              }}
              className="flex-1 lg:w-32 bg-gradient-to-br from-white to-slate-50/50 hover:bg-slate-100 border border-slate-200/70 p-4.5 rounded-2xl shadow-xs hover:scale-[1.02] hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center gap-2 cursor-pointer group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">📤</span>
              <span className="text-[10px] font-black uppercase text-slate-700 tracking-wider">Input Pengeluaran</span>
            </button>

            <button 
              onClick={onLihatLaporan}
              className="flex-1 lg:w-32 bg-gradient-to-br from-white to-slate-50/50 hover:bg-slate-100 border border-slate-200/70 p-4.5 rounded-2xl shadow-xs hover:scale-[1.02] hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center gap-2 cursor-pointer group text-slate-850"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">📊</span>
              <span className="text-[10px] font-black uppercase tracking-wider">
                Lihat Laporan
              </span>
            </button>
          </div>
        </div>

        {isPemasukanModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 max-w-md w-full space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">📥 Input Pemasukan Baru</h3>
                <button 
                  onClick={() => setIsPemasukanModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div>
                  <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Tipe Pemasukan</label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="penjualan">Pemasukan (Penjualan)</option>
                    <option value="permodalan">Pemasukan (Permodalan)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Deskripsi / Keterangan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Penjualan 20 Unit Rak..."
                    value={txDesc}
                    onChange={(e) => setTxDesc(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0284c7]/60 shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Jumlah (Rp)</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 17000000"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0284c7]/60 shadow-inner"
                  />
                </div>
                {txType === 'penjualan' && (
                  <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Jumlah Unit Terjual (Qty)</label>
                    <input
                      type="number"
                      required
                      placeholder="Qty..."
                      value={txQty}
                      onChange={(e) => setTxQty(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0284c7]/60 shadow-inner"
                    />
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm mt-2"
                >
                  💾 Simpan Pemasukan
                </button>
              </form>
            </div>
          </div>
        )}

        {isPengeluaranModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 max-w-md w-full space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">📤 Input Pengeluaran Baru</h3>
                <button 
                  onClick={() => setIsPengeluaranModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div>
                  <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Tipe Pengeluaran</label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="pengeluaran">Beban Operasional / COGS (Pengeluaran)</option>
                    <option value="capex">Pembelian Aset / Mesin (Capex)</option>
                    <option value="prive">Penarikan Owner (Prive)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Deskripsi / Keterangan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Operasional Solar Armada..."
                    value={txDesc}
                    onChange={(e) => setTxDesc(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0284c7]/60 shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Jumlah (Rp)</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 1200000"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0284c7]/60 shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm mt-2"
                >
                  💾 Simpan Pengeluaran
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-100/40 hover:shadow-md hover:shadow-slate-250/30 transition-all duration-300 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-sm uppercase font-extrabold tracking-wider text-slate-700">📖 Riwayat Transaksi Jurnal</h3>
            
            <div className="flex flex-wrap gap-2">
              <select
                value={filterTxJenis}
                onChange={(e) => {
                  setFilterTxJenis(e.target.value as any);
                  setFilterTxSubJenis('Semua');
                }}
                className="bg-white border border-slate-200 text-slate-755 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="Semua">Semua Jenis</option>
                <option value="pemasukan">Pemasukan (Kredit)</option>
                <option value="pengeluaran">Pengeluaran (Debit)</option>
              </select>

              <select
                value={filterTxSubJenis}
                onChange={(e) => setFilterTxSubJenis(e.target.value)}
                className="bg-white border border-slate-200 text-slate-755 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="Semua">Semua Sub-Jenis</option>
                {filterTxJenis === 'pemasukan' && (
                  <>
                    <option value="penjualan">Penjualan Produk</option>
                    <option value="permodalan">Permodalan Owner</option>
                  </>
                )}
                {filterTxJenis === 'pengeluaran' && (
                  <>
                    <option value="opex">Operational Expense (Beban Usaha)</option>
                    <option value="cogs">Cat/Plat Bahan Baku (COGS)</option>
                    <option value="capex">Pembelian Mesin (Capital Expense)</option>
                    <option value="prive">Penarikan Owner (Prive)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200/80">
            <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider border-b border-slate-200 text-[10px] font-extrabold">
                  <th className="p-3 border-r border-slate-200">Tanggal</th>
                  <th className="p-3 border-r border-slate-200">Keterangan</th>
                  <th className="p-3 border-r border-slate-200">Jenis</th>
                  <th className="p-3 border-r border-slate-200">Tipe Buku</th>
                  <th className="p-3 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(() => {
                  const filtered = transactions.filter((tx) => {
                    const isPemasukan = ['penjualan', 'permodalan'].includes(tx.type);
                    const isPengeluaran = ['pengeluaran', 'prive', 'capex'].includes(tx.type);

                    if (filterTxJenis === 'pemasukan' && !isPemasukan) return false;
                    if (filterTxJenis === 'pengeluaran' && !isPengeluaran) return false;

                    if (filterTxSubJenis !== 'Semua') {
                      if (filterTxSubJenis === 'penjualan' && tx.type !== 'penjualan') return false;
                      if (filterTxSubJenis === 'permodalan' && tx.type !== 'permodalan') return false;
                      if (filterTxSubJenis === 'prive' && tx.type !== 'prive') return false;
                      if (filterTxSubJenis === 'capex' && tx.type !== 'capex') return false;
                      
                      if (filterTxSubJenis === 'opex') {
                        const isOpex = tx.type === 'pengeluaran' && (tx.desc.toLowerCase().includes('operasional') || tx.desc.toLowerCase().includes('bensin'));
                        if (!isOpex) return false;
                      }
                      if (filterTxSubJenis === 'cogs') {
                        const isCOGS = tx.type === 'pengeluaran' && (tx.desc.toLowerCase().includes('cat') || tx.desc.toLowerCase().includes('bahan'));
                        if (!isCOGS) return false;
                      }
                    }
                    return true;
                  });

                  if (filtered.length === 0) {
                    return (
                      <tr>
                        <td className="p-8 text-center text-slate-400 font-bold" colSpan={5}>
                          🔍 Tidak ada riwayat transaksi yang cocok dengan filter.
                        </td>
                      </tr>
                    );
                  }

                  return filtered.map((tx) => {
                    const isIncoming = ['penjualan', 'permodalan'].includes(tx.type);
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-mono text-slate-450 border-r border-slate-200">{tx.date}</td>
                        <td className="p-3 font-bold text-slate-900 border-r border-slate-200">{tx.desc}</td>
                        <td className="p-3 border-r border-slate-200">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider ${
                            isIncoming ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-650'
                          }`}>
                            {isIncoming ? 'Pemasukan' : 'Pengeluaran'}
                          </span>
                        </td>
                        <td className="p-3 border-r border-slate-200 text-slate-500 uppercase text-[9px] font-black tracking-wider">
                          {tx.type}
                        </td>
                        <td className={`p-3 text-right font-bold font-mono ${
                          isIncoming ? 'text-emerald-600' : 'text-rose-650'
                        }`}>
                          {isIncoming ? '+' : '-'}Rp {tx.amount.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
