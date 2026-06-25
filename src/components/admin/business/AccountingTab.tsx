'use strict';
'use client';

import React, { useMemo } from 'react';

interface AccountingTabProps {
  totalPenjualan: number;
  cogsTotal: number;
  opexTotal: number;
  cashOnHand: number;
  stockValue: number;
  rawPermodalan: any[];
  rawPrives: any[];
  rawRepairs: any[];
  rawOpex: any[];
  rawSales: any[];
  rawRestocks: any[];
  transactions: any[];
}

export default function AccountingTab({
  totalPenjualan,
  cogsTotal,
  opexTotal,
  cashOnHand,
  stockValue,
  rawPermodalan,
  rawPrives,
  rawRepairs,
  rawOpex,
  rawSales,
  rawRestocks,
  transactions
}: AccountingTabProps) {
  // 1. Helper: Currency format
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Helper: Date format
  const formatDate = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
      return new Date(dateStr).toLocaleDateString('id-ID', options);
    } catch {
      return dateStr;
    }
  };

  // 2. Permodalan & Capex Calculations
  const freshCash = useMemo(() => {
    return rawPermodalan
      .filter(c => c.jenis_permodalan === '#Injeksi Modal')
      .reduce((acc, c) => acc + Number(c.nominal_tunai || 0), 0);
  }, [rawPermodalan]);

  const rawAssetsValue = useMemo(() => {
    return rawPermodalan
      .filter(c => c.jenis_permodalan === '#Penempatan Aset')
      .reduce((acc, c) => acc + Number(c.nilai_buku_aset || 0), 0);
  }, [rawPermodalan]);

  // Asset repairs (Capex vs Opex)
  const capexTotal = useMemo(() => {
    return rawRepairs
      .filter(r => r.jenis_perawatan === '#Peremajaan')
      .reduce((acc, r) => acc + Number(r.nominal_biaya || 0), 0);
  }, [rawRepairs]);

  const opexRepairs = useMemo(() => {
    return rawRepairs
      .filter(r => r.jenis_perawatan === '#Perbaikan')
      .reduce((acc, r) => acc + Number(r.nominal_biaya || 0), 0);
  }, [rawRepairs]);

  // Dynamic Depreciation
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

  const totalDepreciation = useMemo(() => {
    return rawPermodalan
      .filter(c => c.jenis_permodalan === '#Penempatan Aset')
      .reduce((acc, c) => acc + calculateDepreciation(c), 0);
  }, [rawPermodalan]);

  // 3. Balance Sheet asset items
  const fixedAssetsGross = rawAssetsValue + capexTotal;
  const fixedAssetsNet = Math.max(0, fixedAssetsGross - totalDepreciation);
  const totalAssets = cashOnHand + stockValue + fixedAssetsNet;

  // 4. PnL Statements
  // Adding dynamic maintenance opex and depreciation load to general opexTotal
  const finalOpex = opexTotal + opexRepairs;
  const netIncome = totalPenjualan - cogsTotal - finalOpex - totalDepreciation;

  // 5. Equity changes
  const totalPrive = useMemo(() => {
    return rawPrives.reduce((acc, p) => acc + Number(p.nominal_prive || 0), 0);
  }, [rawPrives]);

  const retainedEarnings = netIncome - totalPrive;
  const totalCapitalGross = freshCash + rawAssetsValue;
  const finalEquity = totalCapitalGross + retainedEarnings;

  // 6. Dynamic Double-Entry General Journal mapping
  const generalJournal = useMemo(() => {
    interface JournalEntry {
      id: string;
      date: string;
      desc: string;
      debitAccount: string;
      debitAmount: number;
      creditAccount: string;
      creditAmount: number;
    }

    const journalList: JournalEntry[] = [];

    // Sort transactions chronological
    const sortedTx = [...transactions].sort((a, b) => a.date.localeCompare(b.date));

    sortedTx.forEach((t) => {
      if (t.type === 'penjualan') {
        journalList.push({
          id: t.id,
          date: t.date,
          desc: t.desc || 'Penjualan Produk',
          debitAccount: 'Kas & Bank',
          debitAmount: t.amount,
          creditAccount: 'Pendapatan Usaha',
          creditAmount: t.amount
        });
      } else if (t.type === 'pengeluaran') {
        const isRestock = !t.desc.toLowerCase().includes('operasional') &&
                          !t.desc.toLowerCase().includes('bensin') &&
                          !t.desc.toLowerCase().includes('opex') &&
                          !t.desc.toLowerCase().includes('perbaikan');
        journalList.push({
          id: t.id,
          date: t.date,
          desc: t.desc,
          debitAccount: isRestock ? 'Persediaan Stok Barang' : 'Beban Operasional',
          debitAmount: t.amount,
          creditAccount: 'Kas & Bank',
          creditAmount: t.amount
        });
      } else if (t.type === 'permodalan') {
        const isTunai = t.desc.toLowerCase().includes('injeksi');
        journalList.push({
          id: t.id,
          date: t.date,
          desc: t.desc,
          debitAccount: isTunai ? 'Kas & Bank' : 'Aset Tetap (Peralatan/Mesin)',
          debitAmount: t.amount,
          creditAccount: 'Modal Pemilik',
          creditAmount: t.amount
        });
      } else if (t.type === 'prive') {
        journalList.push({
          id: t.id,
          date: t.date,
          desc: t.desc,
          debitAccount: 'Prive Pemilik',
          debitAmount: t.amount,
          creditAccount: 'Kas & Bank',
          creditAmount: t.amount
        });
      } else if (t.type === 'capex') {
        journalList.push({
          id: t.id,
          date: t.date,
          desc: t.desc,
          debitAccount: 'Aset Tetap (Peralatan/Mesin)',
          debitAmount: t.amount,
          creditAccount: 'Kas & Bank',
          creditAmount: t.amount
        });
      }
    });

    return journalList;
  }, [transactions]);

  // Adjusting entries logs (Depreciation)
  const adjustingJournal = useMemo(() => {
    if (totalDepreciation === 0) return [];
    return [
      {
        date: '2026-06-30',
        desc: 'Penyusutan Aset Tetap Bulanan',
        debitAccount: 'Beban Penyusutan Aset',
        debitAmount: totalDepreciation,
        creditAccount: 'Akumulasi Penyusutan Aset',
        creditAmount: totalDepreciation
      }
    ];
  }, [totalDepreciation]);

  // Invoices list mapping from rawSales
  const dynamicInvoices = useMemo(() => {
    return [...rawSales]
      .sort((a, b) => b.waktu_transaksi.localeCompare(a.waktu_transaksi))
      .slice(0, 10); // show top 10 latest invoices
  }, [rawSales]);

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
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-700 font-sans">📖 Jurnal Umum (General Ledger)</h4>
            </div>
            <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[9px] tracking-wider sticky top-0 bg-white">
                    <th className="pb-2">Tanggal</th>
                    <th className="pb-2">Akun / Keterangan</th>
                    <th className="pb-2 text-right">Debit</th>
                    <th className="pb-2 text-right">Kredit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {generalJournal.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400 italic">Belum ada jurnal umum.</td>
                    </tr>
                  ) : (
                    generalJournal.map((entry, idx) => (
                      <React.Fragment key={entry.id + '-' + idx}>
                        <tr className="text-slate-800">
                          <td className="py-2 font-mono text-[10px]">{entry.date}</td>
                          <td className="py-2">
                            <span className="font-bold">{entry.debitAccount}</span>
                            <span className="block pl-4 text-[9px] text-slate-400 italic">{entry.desc}</span>
                          </td>
                          <td className="py-2 text-right font-mono font-bold text-emerald-600">{formatIDR(entry.debitAmount)}</td>
                          <td className="py-2 text-right font-mono text-slate-400">-</td>
                        </tr>
                        <tr className="text-slate-850 bg-slate-50/30">
                          <td className="py-2"></td>
                          <td className="py-2 pl-6">
                            <span className="font-bold text-slate-600">{entry.creditAccount}</span>
                          </td>
                          <td className="py-2 text-right font-mono text-slate-400">-</td>
                          <td className="py-2 text-right font-mono font-bold text-rose-600">{formatIDR(entry.creditAmount)}</td>
                        </tr>
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Jurnal Penyesuaian */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-700 font-sans">⚙️ Jurnal Penyesuaian (Adjusting Entry)</h4>
            </div>
            <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
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
                  {adjustingJournal.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400 italic">Belum ada jurnal penyesuaian (Depresiasi aset modal nol).</td>
                    </tr>
                  ) : (
                    adjustingJournal.map((entry, idx) => (
                      <React.Fragment key={'adj-' + idx}>
                        <tr className="text-slate-800">
                          <td className="py-2 font-mono text-[10px]">{entry.date}</td>
                          <td className="py-2">
                            <span className="font-bold">{entry.debitAccount}</span>
                            <span className="block pl-4 text-[9px] text-slate-400 italic">{entry.desc}</span>
                          </td>
                          <td className="py-2 text-right font-mono font-bold text-emerald-600">{formatIDR(entry.debitAmount)}</td>
                          <td className="py-2 text-right font-mono text-slate-400">-</td>
                        </tr>
                        <tr className="text-slate-855 bg-slate-50/30">
                          <td className="py-2"></td>
                          <td className="py-2 pl-6">
                            <span className="font-bold text-slate-600">{entry.creditAccount}</span>
                          </td>
                          <td className="py-2 text-right font-mono text-slate-400">-</td>
                          <td className="py-2 text-right font-mono font-bold text-rose-600">{formatIDR(entry.creditAmount)}</td>
                        </tr>
                      </React.Fragment>
                    ))
                  )}
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
                <p className="text-[10px] text-slate-400">Periode Tahun Buku 2026</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-bold text-slate-800">
                <span>PENDAPATAN USAHA (Sales Revenue)</span>
                <span className="font-mono">{formatIDR(totalPenjualan)}</span>
              </div>
              <div className="flex justify-between text-rose-600 pl-4">
                <span>Harga Pokok Penjualan (HPP / COGS)</span>
                <span className="font-mono">-{formatIDR(cogsTotal)}</span>
              </div>
              <div className="flex justify-between font-black text-slate-900 border-t border-slate-100 pt-1">
                <span>LABA KOTOR (Gross Profit)</span>
                <span className="font-mono">{formatIDR(totalPenjualan - cogsTotal)}</span>
              </div>
              <div className="flex justify-between text-rose-600 pl-4 pt-1">
                <span>Beban Operasional (OPEX)</span>
                <span className="font-mono">-{formatIDR(opexTotal)}</span>
              </div>
              {opexRepairs > 0 && (
                <div className="flex justify-between text-rose-600 pl-4">
                  <span>Beban Pemeliharaan & Perbaikan Aset</span>
                  <span className="font-mono">-{formatIDR(opexRepairs)}</span>
                </div>
              )}
              <div className="flex justify-between text-rose-600 pl-4">
                <span>Beban Depresiasi Aset Modal</span>
                <span className="font-mono">-{formatIDR(totalDepreciation)}</span>
              </div>
              <div className="flex justify-between font-black text-emerald-600 border-t-2 border-slate-200 pt-2 text-sm">
                <span>LABA BERSIH (Net Income)</span>
                <span className="font-mono">{formatIDR(netIncome)}</span>
              </div>
            </div>
          </div>

          {/* Neraca (Balance Sheet) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-black text-slate-800">Laporan Neraca (Balance Sheet)</h4>
                <p className="text-[10px] text-slate-400">Neraca Seimbang (Aktiva vs Pasiva)</p>
              </div>
            </div>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="font-black text-slate-400 block tracking-wider uppercase text-[9px]">ASET (AKTIVA)</span>
                <div className="flex justify-between pl-2">
                  <span>Kas & Bank (Cash on Hand)</span>
                  <span className="font-mono font-semibold">{formatIDR(cashOnHand)}</span>
                </div>
                <div className="flex justify-between pl-2">
                  <span>Nilai Persediaan (Inventory)</span>
                  <span className="font-mono font-semibold">{formatIDR(stockValue)}</span>
                </div>
                <div className="flex justify-between pl-2">
                  <span>Aset Tetap Gross (Fixed Assets)</span>
                  <span className="font-mono font-semibold">{formatIDR(fixedAssetsGross)}</span>
                </div>
                <div className="flex justify-between pl-2 text-rose-500">
                  <span>Akumulasi Penyusutan Aset Tetap</span>
                  <span className="font-mono font-semibold">-{formatIDR(totalDepreciation)}</span>
                </div>
              </div>
              <div className="flex justify-between font-black text-slate-900 border-t border-slate-150 pt-1 text-xs uppercase">
                <span>Total Aset (Aktiva)</span>
                <span className="font-mono">{formatIDR(totalAssets)}</span>
              </div>

              <div className="space-y-1 pt-1">
                <span className="font-black text-slate-400 block tracking-wider uppercase text-[9px]">LIABILITAS & EKUITAS (PASIVA)</span>
                <div className="flex justify-between pl-2">
                  <span>Liabilitas (Kewajiban/Utang Usaha)</span>
                  <span className="font-mono font-semibold">Rp 0</span>
                </div>
                <div className="flex justify-between pl-2">
                  <span>Modal Pemilik (Owner Capital Injected)</span>
                  <span className="font-mono font-semibold">{formatIDR(totalCapitalGross)}</span>
                </div>
                <div className="flex justify-between pl-2">
                  <span>Laba Ditahan Berjalan (Retained Earnings)</span>
                  <span className="font-mono font-semibold">{formatIDR(retainedEarnings)}</span>
                </div>
              </div>
              <div className="flex justify-between font-black text-slate-900 border-t border-slate-150 pt-1 text-xs uppercase">
                <span>Total Pasiva</span>
                <span className="font-mono">{formatIDR(finalEquity)}</span>
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
                <p className="text-[10px] text-slate-400">Arus Masuk/Keluar Kas Riil</p>
              </div>
            </div>
            <div className="space-y-3 text-xs font-semibold text-slate-700">
              <div>
                <span className="font-black text-slate-400 block tracking-wider uppercase text-[9px]">Aktivitas Operasional</span>
                <div className="flex justify-between pl-2 mt-1">
                  <span>Kas diterima dari Pelanggan</span>
                  <span className="font-mono text-emerald-600">+{formatIDR(totalPenjualan)}</span>
                </div>
                <div className="flex justify-between pl-2 text-rose-600">
                  <span>Kas dibayarkan untuk HPP (Kulakan)</span>
                  <span className="font-mono">-{formatIDR(cogsTotal)}</span>
                </div>
                <div className="flex justify-between pl-2 text-rose-600">
                  <span>Kas dibayarkan untuk Operasional (Opex)</span>
                  <span className="font-mono">-{formatIDR(opexTotal)}</span>
                </div>
                {opexRepairs > 0 && (
                  <div className="flex justify-between pl-2 text-rose-600">
                    <span>Kas dibayarkan untuk Pemeliharaan Aset</span>
                    <span className="font-mono">-{formatIDR(opexRepairs)}</span>
                  </div>
                )}
              </div>
              <div>
                <span className="font-black text-slate-400 block tracking-wider uppercase text-[9px]">Aktivitas Investasi</span>
                <div className="flex justify-between pl-2 mt-1 text-rose-600">
                  <span>Pembelian Aset Baru (Capex Peremajaan)</span>
                  <span className="font-mono">-{formatIDR(capexTotal)}</span>
                </div>
              </div>
              <div>
                <span className="font-black text-slate-400 block tracking-wider uppercase text-[9px]">Aktivitas Pendanaan</span>
                <div className="flex justify-between pl-2 mt-1 text-emerald-600">
                  <span>Injeksi Modal Kas Owner</span>
                  <span className="font-mono">+{formatIDR(freshCash)}</span>
                </div>
                <div className="flex justify-between pl-2 text-rose-600">
                  <span>Pengambilan Prive Owner</span>
                  <span className="font-mono">-{formatIDR(totalPrive)}</span>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-[#0284c7] text-sm">
                <span>Kenaikan Arus Kas Bersih (Saldo Kas)</span>
                <span className="font-mono">{formatIDR(cashOnHand)}</span>
              </div>
            </div>
          </div>

          {/* Laporan Perubahan Modal */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-black text-slate-800">Laporan Perubahan Modal</h4>
                <p className="text-[10px] text-slate-400">Mutasi Nilai Ekuitas Pemilik</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Modal Awal (1 Januari 2026)</span>
                <span className="font-mono font-semibold">Rp 0</span>
              </div>
              <div className="flex justify-between text-emerald-600 pl-4">
                <span>Injeksi Modal Baru (Kas + Aset)</span>
                <span className="font-mono">+{formatIDR(totalCapitalGross)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 pl-4">
                <span>Laba Bersih Berjalan (Setelah Depresiasi)</span>
                <span className="font-mono">+{formatIDR(netIncome)}</span>
              </div>
              <div className="flex justify-between text-rose-600 pl-4">
                <span>Penarikan Prive Owner</span>
                <span className="font-mono">-{formatIDR(totalPrive)}</span>
              </div>
              <div className="flex justify-between font-black text-slate-900 border-t-2 border-slate-200 pt-2 text-sm">
                <span>MODAL AKHIR (Ekuitas Bersih)</span>
                <span className="font-mono">{formatIDR(finalEquity)}</span>
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
              <p className="text-[10px] text-slate-400">Daftar invoice penjualan dari data transaksi nyata.</p>
            </div>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {dynamicInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-3 text-center text-slate-400 italic">Belum ada transaksi penjualan.</td>
                  </tr>
                ) : (
                  dynamicInvoices.map((s, idx) => {
                    const totalAmt = s.detail_penjualan_produk?.reduce((acc: number, item: any) => acc + Number(item.total_revenue_produk || 0), 0) || 0;
                    return (
                      <tr key={s.id_transaksi || idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-mono font-bold text-slate-900">{s.id_transaksi}</td>
                        <td className="p-3 text-slate-850">{s.nama_pelanggan} ({s.daerah_tujuan})</td>
                        <td className="p-3 font-mono text-slate-400">{formatDate(s.waktu_transaksi)}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-black text-[8px] uppercase tracking-wider">
                            Paid
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono font-black text-[#0284c7]">{formatIDR(totalAmt)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
