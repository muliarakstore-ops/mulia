'use strict';
'use client';

import React from 'react';

interface AccountingTabProps {
  totalPenjualan: number;
  cogsTotal: number;
  opexTotal: number;
  cashOnHand: number;
  stockValue: number;
}

export default function AccountingTab({
  totalPenjualan,
  cogsTotal,
  opexTotal,
  cashOnHand,
  stockValue
}: AccountingTabProps) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-slate-900">🧮 Akuntansi & Laporan Keuangan</h2>
        <p className="text-xs text-slate-500 mt-0.5">Kelola Jurnal Umum, Jurnal Penyesuaian, Invoice, serta Laporan Keuangan Standar Akuntansi Mulia Rak Store.</p>
      </div>

      {/* A. JURNAL */}
      <div className="space-y-6">
        <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 border-b border-slate-200 pb-2">a. Jurnal</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Jurnal Umum */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-700 font-sans">📖 Jurnal Umum</h4>
              <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[9px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer">
                📤 Export Jurnal
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                    <th className="pb-2">Tanggal</th>
                    <th className="pb-2">Akun / Keterangan</th>
                    <th className="pb-2 text-right">Debit</th>
                    <th className="pb-2 text-right">Kredit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr className="text-slate-800">
                    <td className="py-2.5 font-mono text-[10px]">18 Jun 2026</td>
                    <td className="py-2.5">
                      <span className="font-bold">Kas di Bank</span>
                      <span className="block pl-4 text-[10px] text-slate-400 italic">Pendapatan Penjualan Rak</span>
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-600">Rp 17.000.000</td>
                    <td className="py-2.5 text-right font-mono text-slate-400">-</td>
                  </tr>
                  <tr className="text-slate-850 bg-slate-50/50">
                    <td className="py-2.5 font-mono text-[10px]">18 Jun 2026</td>
                    <td className="py-2.5">
                      <span className="font-bold pl-4">Pendapatan Usaha</span>
                    </td>
                    <td className="py-2.5 text-right font-mono text-slate-400">-</td>
                    <td className="py-2.5 text-right font-mono font-bold text-rose-600">Rp 17.000.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Jurnal Penyesuaian */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-700 font-sans">⚙️ Jurnal Penyesuaian (Adjusting)</h4>
              <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[9px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer">
                📤 Export Jurnal
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                    <th className="pb-2">Tanggal</th>
                    <th className="pb-2">Akun / Keterangan</th>
                    <th className="pb-2 text-right">Debit</th>
                    <th className="pb-2 text-right">Kredit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr className="text-slate-800">
                    <td className="py-2.5 font-mono text-[10px]">30 Jun 2026</td>
                    <td className="py-2.5">
                      <span className="font-bold">Beban Penyusutan Mesin</span>
                      <span className="block pl-4 text-[10px] text-slate-400 italic">Akum. Depresiasi Bulanan</span>
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-600">Rp 3.500.000</td>
                    <td className="py-2.5 text-right font-mono text-slate-400">-</td>
                  </tr>
                  <tr className="text-slate-855 bg-slate-50/50">
                    <td className="py-2.5 font-mono text-[10px]">30 Jun 2026</td>
                    <td className="py-2.5">
                      <span className="font-bold pl-4">Akumulasi Penyusutan Mesin</span>
                    </td>
                    <td className="py-2.5 text-right font-mono text-slate-400">-</td>
                    <td className="py-2.5 text-right font-mono font-bold text-rose-600">Rp 3.500.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* B. LAPORAN KEUANGAN */}
      <div className="space-y-8">
        <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 border-b border-slate-200 pb-2">b. Laporan Keuangan</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Laba Rugi (PnL) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-black text-slate-800">Laporan Laba Rugi (Profit & Loss Statement)</h4>
                <p className="text-[10px] text-slate-400">Periode berakhir 30 Juni 2026</p>
              </div>
              <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[9px] uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-xs">
                📤 Export PnL (PDF)
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-bold text-slate-800">
                <span>PENDAPATAN USAHA</span>
                <span className="font-mono">Rp {totalPenjualan.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-rose-600 pl-4">
                <span>Harga Pokok Penjualan (HPP / COGS)</span>
                <span className="font-mono">-Rp {cogsTotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between font-black text-slate-900 border-t border-slate-100 pt-1">
                <span>LABA KOTOR (Gross Profit)</span>
                <span className="font-mono">Rp {(totalPenjualan - cogsTotal).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-rose-600 pl-4 pt-1">
                <span>Beban Usaha (Opex)</span>
                <span className="font-mono">-Rp {opexTotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-rose-600 pl-4">
                <span>Beban Depresiasi Aset</span>
                <span className="font-mono">-Rp 3.500.000</span>
              </div>
              <div className="flex justify-between font-black text-emerald-600 border-t-2 border-slate-200 pt-2 text-sm">
                <span>LABA BERSIH (Net Income)</span>
                <span className="font-mono">Rp {(totalPenjualan - cogsTotal - opexTotal - 3500000).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Neraca (Balance Sheet) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-black text-slate-800">Laporan Neraca (Balance Sheet)</h4>
                <p className="text-[10px] text-slate-400">Posisi per 30 Juni 2026</p>
              </div>
              <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[9px] uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-xs">
                📤 Export Neraca
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="font-black text-slate-400 block tracking-wider uppercase text-[9px]">ASET</span>
                <div className="flex justify-between pl-2">
                  <span>Kas & Bank</span>
                  <span className="font-mono font-semibold">Rp {cashOnHand.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between pl-2">
                  <span>Nilai Persediaan (Stok)</span>
                  <span className="font-mono font-semibold">Rp {stockValue.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between pl-2">
                  <span>Aset Tetap (Pabrik & Mesin)</span>
                  <span className="font-mono font-semibold">Rp 45.000.000</span>
                </div>
                <div className="flex justify-between pl-2 text-rose-500">
                  <span>Akumulasi Penyusutan Aset</span>
                  <span className="font-mono font-semibold">-Rp 3.500.000</span>
                </div>
              </div>
              <div className="flex justify-between font-black text-slate-900 border-t border-slate-150 pt-1 text-xs uppercase">
                <span>Total Aset (Aktiva)</span>
                <span className="font-mono">Rp {(cashOnHand + stockValue + 45000000 - 3500000).toLocaleString('id-ID')}</span>
              </div>

              <div className="space-y-1 pt-1">
                <span className="font-black text-slate-400 block tracking-wider uppercase text-[9px]">LIABILITAS & EKUITAS</span>
                <div className="flex justify-between pl-2">
                  <span>Liabilitas (Utang Usaha)</span>
                  <span className="font-mono font-semibold">Rp 0</span>
                </div>
                <div className="flex justify-between pl-2">
                  <span>Modal Pemilik (Ekuitas)</span>
                  <span className="font-mono font-semibold">Rp 210.000.000</span>
                </div>
                <div className="flex justify-between pl-2">
                  <span>Laba Bersih Berjalan</span>
                  <span className="font-mono font-semibold">Rp {(totalPenjualan - cogsTotal - opexTotal - 3500000).toLocaleString('id-ID')}</span>
                </div>
              </div>
              <div className="flex justify-between font-black text-slate-900 border-t border-slate-150 pt-1 text-xs uppercase">
                <span>Total Pasiva</span>
                <span className="font-mono">Rp {(210000000 + (totalPenjualan - cogsTotal - opexTotal - 3500000)).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Laporan Arus Kas (Cashflow Statement) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-black text-slate-800">Laporan Arus Kas (Cashflow Statement)</h4>
                <p className="text-[10px] text-slate-400">Periode Juni 2026</p>
              </div>
              <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-white font-bold text-[9px] uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-xs">
                📤 Export Arus Kas
              </button>
            </div>
            <div className="space-y-3 text-xs font-semibold text-slate-700">
              <div>
                <span className="font-black text-slate-400 block tracking-wider uppercase text-[9px]">Aktivitas Operasional</span>
                <div className="flex justify-between pl-2 mt-1">
                  <span>Kas diterima dari Pelanggan</span>
                  <span className="font-mono text-emerald-600">+Rp {totalPenjualan.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between pl-2 text-rose-600">
                  <span>Kas dibayarkan untuk Opex/HPP</span>
                  <span className="font-mono">-Rp {(cogsTotal + opexTotal).toLocaleString('id-ID')}</span>
                </div>
              </div>
              <div>
                <span className="font-black text-slate-400 block tracking-wider uppercase text-[9px]">Aktivitas Investasi</span>
                <div className="flex justify-between pl-2 mt-1 text-rose-600">
                  <span>Pembelian Mesin Baru</span>
                  <span className="font-mono">-Rp 45.000.000</span>
                </div>
              </div>
              <div>
                <span className="font-black text-slate-400 block tracking-wider uppercase text-[9px]">Aktivitas Pendanaan</span>
                <div className="flex justify-between pl-2 mt-1 text-emerald-600">
                  <span>Injeksi Modal Owner</span>
                  <span className="font-mono">+Rp 150.000.000</span>
                </div>
                <div className="flex justify-between pl-2 text-rose-600">
                  <span>Pengambilan Prive</span>
                  <span className="font-mono">-Rp 5.000.000</span>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-[#0284c7] text-sm">
                <span>Kenaikan Arus Kas Bersih</span>
                <span className="font-mono">Rp {cashOnHand.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Perubahan Modal (Equity Change Statement) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-black text-slate-800">Laporan Perubahan Modal</h4>
                <p className="text-[10px] text-slate-400">Posisi Ekuitas Akhir Juni 2026</p>
              </div>
              <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-855 text-white font-bold text-[9px] uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-xs">
                📤 Export Modal
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Modal Awal (1 Juni 2026)</span>
                <span className="font-mono font-semibold">Rp 0</span>
              </div>
              <div className="flex justify-between text-emerald-600 pl-4">
                <span>Injeksi Modal Baru</span>
                <span className="font-mono">+Rp 150.000.000</span>
              </div>
              <div className="flex justify-between text-emerald-600 pl-4">
                <span>Laba Bersih Berjalan</span>
                <span className="font-mono">+Rp {(totalPenjualan - cogsTotal - opexTotal - 3500000).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-rose-600 pl-4">
                <span>Penarikan Prive Owner</span>
                <span className="font-mono">-Rp 5.000.000</span>
              </div>
              <div className="flex justify-between font-black text-slate-900 border-t-2 border-slate-200 pt-2 text-sm">
                <span>MODAL AKHIR (30 Juni 2026)</span>
                <span className="font-mono">Rp {(150000000 + (totalPenjualan - cogsTotal - opexTotal - 3500000) - 5000000).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* C. FITUR INVOICE */}
      <div className="space-y-6">
        <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 border-b border-slate-200 pb-2">c. Fitur Invoice</h3>
        
        <div className="bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h4 className="text-sm font-black text-slate-800">📄 Pembuat Invoice Tagihan (Invoice Generator)</h4>
              <p className="text-[10px] text-slate-400">Buat, cetak, & export invoice penjualan ready secara cepat.</p>
            </div>
            <button className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-xs transition-colors">
              ➕ Buat Invoice Baru
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs font-semibold text-slate-700">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider border-b border-slate-200 text-[10px] font-extrabold">
                  <th className="p-3">No. Invoice</th>
                  <th className="p-3">Pelanggan</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Jumlah</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-900">#INV-2026001</td>
                  <td className="p-3 text-slate-850">Toko Bu Sri</td>
                  <td className="p-3 font-mono text-slate-400">18 Juni 2026</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-black text-[8px] uppercase tracking-wider">
                      Paid
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-black text-[#0284c7]">Rp 17.000.000</td>
                  <td className="p-3 text-center">
                    <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[9px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer">
                      📥 Cetak PDF
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
