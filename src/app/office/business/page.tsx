'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../utils/supabase';

// Mock types
interface Transaction {
  id: string;
  date: string;
  desc: string;
  type: 'penjualan' | 'pengeluaran' | 'permodalan';
  amount: number;
}

export default function BusinessDashboard() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [activeMenu, setActiveMenu] = useState<'overview' | 'ledger' | 'ratios' | 'products' | 'accounting'>('overview');

  // Input states for ledger
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', date: '2026-06-18', desc: 'Penjualan Rak Gondola Minimarket Jakarta', type: 'penjualan', amount: 24500000 },
    { id: '2', date: '2026-06-17', desc: 'Bahan Baku Plat Baja & Powder Coating', type: 'pengeluaran', amount: 8900000 },
    { id: '3', date: '2026-06-15', desc: 'Injeksi Modal Tambahan Owner', type: 'permodalan', amount: 150000000 },
    { id: '4', date: '2026-06-10', desc: 'Penjualan Rak Minimarket Depok', type: 'penjualan', amount: 12400000 },
    { id: '5', date: '2026-06-05', desc: 'Operasional Armada Logistik Solar', type: 'pengeluaran', amount: 1200000 }
  ]);
  const [txDesc, setTxDesc] = useState('');
  const [txType, setTxType] = useState<'penjualan' | 'pengeluaran' | 'permodalan'>('penjualan');
  const [txAmount, setTxAmount] = useState('');

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/office');
        return;
      }
      
      const email = session.user.email || '';
      if (email.toLowerCase() !== 'iqbal@muliarak.store') {
        // Only owner Iqbal can access this dashboard
        router.push('/office/dashboard');
        return;
      }

      setUserEmail(email);
      setCheckingAuth(false);
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      // Clear cookies
      document.cookie = 'mrs_session_token=; path=/; max-age=0; SameSite=Lax; Secure';
      document.cookie = 'mrs_session_user=; path=/; max-age=0; SameSite=Lax; Secure';
      await supabase.auth.signOut();
      router.push('/office');
    }
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(txAmount.replace(/[^0-9.-]+/g, ''));
    if (!txDesc.trim() || isNaN(amountNum)) {
      alert('Masukkan deskripsi dan nominal transaksi dengan benar.');
      return;
    }

    const newTx: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      desc: txDesc,
      type: txType,
      amount: amountNum
    };

    setTransactions([newTx, ...transactions]);
    setTxDesc('');
    setTxAmount('');
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 font-sans space-y-3">
        <div className="animate-spin text-2xl">⏳</div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Memverifikasi Hak Akses Owner...</p>
      </div>
    );
  }

  // Financial calculations
  const totalPenjualan = transactions.filter(t => t.type === 'penjualan').reduce((a, b) => a + b.amount, 0);
  const totalPengeluaran = transactions.filter(t => t.type === 'pengeluaran').reduce((a, b) => a + b.amount, 0);
  const totalModal = transactions.filter(t => t.type === 'permodalan').reduce((a, b) => a + b.amount, 0);
  const netProfit = totalPenjualan - totalPengeluaran;

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION - Solid Blue (matching admin theme) */}
      <aside className="w-full md:w-64 bg-[#0284c7] text-white flex flex-col justify-between py-6 flex-shrink-0">
        <div>
          {/* Logo Brand Header */}
          <div className="pl-6 pr-6 pb-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white text-[#0284c7] flex items-center justify-center font-black text-xl font-serif">
              M
            </div>
            <div>
              <span className="text-lg font-extrabold text-white tracking-wider font-serif block leading-none">MULIA</span>
              <span className="text-[9px] uppercase font-bold text-sky-200 block mt-1">Business Room 💼</span>
            </div>
          </div>

          {/* Menus List */}
          <nav className="px-4 py-6 space-y-2">
            {[
              { id: 'overview', label: '📊 Overview', desc: 'Rangkuman Performa' },
              { id: 'ledger', label: '📖 Transaksi & Buku Kas', desc: 'Aliran Dana Masuk/Keluar' },
              { id: 'ratios', label: '📐 Permodalan & Rasio', desc: 'ROE, ROA, ROAS' },
              { id: 'products', label: '📦 Produk & Pasar', desc: 'Stok & Insight Penjualan' },
              { id: 'accounting', label: '🧮 Akuntansi', desc: 'PnL, Cashflow & Neraca' },
            ].map((menu) => (
              <button
                key={menu.id}
                onClick={() => setActiveMenu(menu.id as any)}
                className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer block ${
                  activeMenu === menu.id
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{menu.label}</span>
                <span className="block text-[8px] font-normal opacity-60 mt-0.5">{menu.desc}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Link */}
        <div className="px-4 border-t border-white/10 pt-4 flex flex-col gap-2">
          <div className="flex items-center gap-3 px-3 py-2 bg-white/10 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-white text-[#0284c7] font-bold flex items-center justify-center text-xs">
              IQ
            </div>
            <div className="truncate max-w-[120px]">
              <span className="text-[10px] font-black text-white block leading-none">Iqbal Owner</span>
              <span className="text-[8px] font-semibold text-sky-200 uppercase tracking-widest block mt-0.5">Owner</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-white/10 hover:bg-white/20 text-white text-xs py-2.5 rounded-xl block font-bold transition-colors cursor-pointer text-center"
          >
            👋 Logout
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 overflow-y-auto max-h-screen p-6 md:p-8 space-y-8 bg-slate-50 text-slate-800">
        
        {/* OVERVIEW SECTION */}
        {activeMenu === 'overview' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">Dashboard Overview</h2>
              <p className="text-xs text-slate-500 mt-0.5">Selamat datang Owner Iqbal, berikut ikhtisar keuangan terkini Mulia Rak Store.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-xs space-y-3">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">Total Omset Penjualan</span>
                <span className="text-2xl font-black text-emerald-600 font-mono">Rp {totalPenjualan.toLocaleString('id-ID')}</span>
                <span className="text-[9px] text-slate-400 block">Akumulasi penjualan invoice</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-xs space-y-3">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">Total Pengeluaran</span>
                <span className="text-2xl font-black text-rose-650 font-mono">Rp {totalPengeluaran.toLocaleString('id-ID')}</span>
                <span className="text-[9px] text-slate-400 block">Operasional pabrik & logistik</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-xs space-y-3">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">Laba Bersih</span>
                <span className="text-2xl font-black text-primary-blue font-mono">Rp {netProfit.toLocaleString('id-ID')}</span>
                <span className="text-[9px] text-slate-400 block">Margin keuntungan operasional</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-xs space-y-3">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">Kas Permodalan</span>
                <span className="text-2xl font-black text-amber-500 font-mono">Rp {totalModal.toLocaleString('id-ID')}</span>
                <span className="text-[9px] text-slate-400 block">Injeksi aset & dana cadangan</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs space-y-4">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">💡 Alokasi Penggunaan Dana Bulanan</h3>
                <div className="space-y-4 pt-2">
                  {[
                    { title: 'Produksi Rak Minimarket', percent: 65, color: 'bg-[#0284c7]' },
                    { title: 'Armada Pengiriman & Logistik', percent: 20, color: 'bg-sky-500' },
                    { title: 'Campaign Kreatif & Marketing', percent: 15, color: 'bg-emerald-500' }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{item.title}</span>
                        <span>{item.percent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">🎯 Target Break-Even Point (BEP)</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Sistem memproyeksikan pengembalian modal awal (ROI) Mulia Rak Store dalam kurun waktu <strong>11 bulan kedepan</strong> berdasarkan tren laju omset kuartal ini yang meningkat sebanyak 18% dibanding bulan sebelumnya.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold">Rasio Kesehatan Finansial</span>
                  <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-black text-[10px]">SANGAT SEHAT (A+)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LEDGER SECTION */}
        {activeMenu === 'ledger' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">Transaksi & Buku Kas</h2>
              <p className="text-xs text-slate-500 mt-0.5">Input pemasukan, pengeluaran, permodalan, dan tinjau riwayat jurnal harian.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs space-y-4 h-fit">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Input Jurnal Transaksi</h3>
                <form onSubmit={handleAddTransaction} className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Deskripsi</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Pembelian Bahan Plat Besi"
                      value={txDesc}
                      onChange={(e) => setTxDesc(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0284c7]/60"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Tipe</label>
                      <select
                        value={txType}
                        onChange={(e) => setTxType(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-2 text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="penjualan">Penjualan (+)</option>
                        <option value="pengeluaran">Pengeluaran (-)</option>
                        <option value="permodalan">Permodalan (+)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Nominal (Rp)</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 1500000"
                        value={txAmount}
                        onChange={(e) => setTxAmount(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0284c7]/60"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#0284c7] hover:bg-[#0284c7]/90 text-white font-bold py-2 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    💾 Simpan Jurnal
                  </button>
                </form>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs lg:col-span-2 space-y-4">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Jurnal Riwayat Buku Kas</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-450 font-bold uppercase tracking-wider border-b border-slate-100">
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
                            <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider ${
                              tx.type === 'penjualan' ? 'bg-emerald-50 text-emerald-600' : tx.type === 'pengeluaran' ? 'bg-rose-50 text-rose-600' : 'bg-sky-50 text-[#0284c7]'
                            }`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className={`p-3 text-right font-bold font-mono ${
                            tx.type === 'penjualan' ? 'text-emerald-600' : tx.type === 'pengeluaran' ? 'text-rose-600' : 'text-[#0284c7]'
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

        {/* RATIOS SECTION */}
        {activeMenu === 'ratios' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">Permodalan & Rasio Keuangan</h2>
              <p className="text-xs text-slate-500 mt-0.5">Analisis kesehatan modal, rasio ROA, ROE, ROAS, dan leverage keuangan.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Return On Equity (ROE)', desc: 'Pengembalian Modal Bersih', value: '28.4%', target: 'Target Industri: > 15%', color: 'border-sky-500/20' },
                { title: 'Return On Assets (ROA)', desc: 'Efisiensi Pemanfaatan Aset', value: '14.2%', target: 'Target Industri: > 10%', color: 'border-emerald-500/20' },
                { title: 'Return On Ad Spend (ROAS)', desc: 'Efisiensi Anggaran Iklan', value: '4.8x', target: 'Target Toko: > 4.0x', color: 'border-primary-blue/20' },
              ].map((ratio, idx) => (
                <div key={idx} className={`bg-white p-6 rounded-3xl border ${ratio.color} space-y-4 shadow-xs`}>
                  <div>
                    <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">{ratio.title}</h3>
                    <p className="text-[10px] text-slate-500">{ratio.desc}</p>
                  </div>
                  <span className="text-4xl font-black text-slate-900 block font-mono">{ratio.value}</span>
                  <div className="text-[10px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center font-bold">
                    {ratio.target}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs space-y-4 max-w-xl">
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">📊 Struktur Leverage & Debt Ratio</h3>
              <div className="space-y-4 pt-2">
                <div className="flex justify-between text-xs text-slate-700">
                  <span className="font-bold">Total Aset Bersih</span>
                  <span className="font-mono text-emerald-600 font-bold">Rp 650.000.000</span>
                </div>
                <div className="flex justify-between text-xs text-slate-700">
                  <span className="font-bold">Rasio Liabilitas (Utang Dagang)</span>
                  <span className="font-mono text-rose-650 font-bold">Rp 120.000.000 (18.4%)</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                  <div className="bg-[#0284c7] h-full" style={{ width: '81.6%' }} title="Modal Sendiri" />
                  <div className="bg-rose-500 h-full" style={{ width: '18.4%' }} title="Utang Usaha" />
                </div>
                <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                  💡 Rasio utang usaha (Debt-to-Asset Ratio) di bawah **20%** menunjukkan margin risiko yang sangat rendah dan kapasitas permodalan mandiri yang kuat.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS & MARKET SECTION */}
        {activeMenu === 'products' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">Produk & Analisis Pasar</h2>
              <p className="text-xs text-slate-500 mt-0.5">Pantau data stok, performa produk terlaris, dan segmentasi pasar.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Product Stock Table */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs lg:col-span-2 space-y-4">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">📦 Daftar Ketersediaan Stok Utama</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-450 font-bold uppercase tracking-wider border-b border-slate-100">
                        <th className="p-3">Nama Produk</th>
                        <th className="p-3">Kategori</th>
                        <th className="p-3">Stok</th>
                        <th className="p-3 text-right">Harga Satuan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {[
                        { name: 'Rak Gondola Single Utama T150', cat: 'Rak Minimarket', stock: 120, price: 'Rp 850,000' },
                        { name: 'Rak Gondola Double Sambung T150', cat: 'Rak Minimarket', stock: 85, price: 'Rp 1,200,000' },
                        { name: 'Meja Kasir Kayu Minimalis 1M', cat: 'Aksesoris Toko', stock: 12, price: 'Rp 2,450,000' },
                        { name: 'Keranjang Belanja Plastik Tarik', cat: 'Perlengkapan Toko', stock: 240, price: 'Rp 125,000' }
                      ].map((prod, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 font-bold text-slate-900">{prod.name}</td>
                          <td className="p-3 text-slate-400">{prod.cat}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold ${
                              prod.stock > 20 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                            }`}>
                              {prod.stock} Pcs
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-sky-650">{prod.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Market Insights */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">📊 Segmentasi Pasar</h3>
                  <div className="space-y-4 pt-4">
                    {[
                      { title: 'Toko Kelontong / Ritel Tradisional', share: 55, color: 'bg-[#0284c7]' },
                      { title: 'Minimarket Mandiri Modern', share: 30, color: 'bg-emerald-500' },
                      { title: 'Gudang & Industri Swasta', share: 15, color: 'bg-amber-500' }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-700">
                          <span>{item.title}</span>
                          <span className="font-bold">{item.share}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color}`} style={{ width: `${item.share}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed">
                  💡 **Rekomendasi Pasar:** Fokus kampanye digital di area penyangga Bodetabek berpotensi meningkatkan omset retail tradisional hingga **22%**.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACCOUNTING SECTION */}
        {activeMenu === 'accounting' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">Akuntansi & Laporan Keuangan</h2>
              <p className="text-xs text-slate-500 mt-0.5">Tinjau Laporan Laba Rugi (PnL), Arus Kas (Cashflow), dan Neraca Saldo (Balance Sheet).</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* PnL Statement Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs space-y-4">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#0284c7]">📈 Laporan Laba Rugi (PnL)</h3>
                <div className="space-y-3 pt-2 text-xs font-semibold text-slate-700">
                  <div className="flex justify-between">
                    <span>Pendapatan Kotor</span>
                    <span className="font-mono text-slate-900">Rp {totalPenjualan.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-rose-600">
                    <span>Biaya Pokok (HPP)</span>
                    <span className="font-mono">-Rp {totalPengeluaran.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="border-t border-slate-100 pt-2 flex justify-between font-black text-emerald-600">
                    <span>Laba Bersih</span>
                    <span className="font-mono">Rp {netProfit.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              {/* Cashflow Statement Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs space-y-4">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-emerald-600">🌊 Arus Kas (Cashflow Statement)</h3>
                <div className="space-y-3 pt-2 text-xs font-semibold text-slate-700">
                  <div className="flex justify-between">
                    <span>Arus Kas Operasional</span>
                    <span className="font-mono text-slate-900">Rp {netProfit.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Arus Kas Pendanaan</span>
                    <span className="font-mono text-slate-900">Rp {totalModal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="border-t border-slate-100 pt-2 flex justify-between font-black text-[#0284c7]">
                    <span>Saldo Kas Akhir</span>
                    <span className="font-mono">Rp {(netProfit + totalModal).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              {/* Balance Sheet Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs space-y-4">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-amber-500">⚖️ Neraca Saldo (Balance Sheet)</h3>
                <div className="space-y-3 pt-2 text-xs font-semibold text-slate-700">
                  <div className="flex justify-between">
                    <span>Aset Lancar (Kas)</span>
                    <span className="font-mono text-slate-900">Rp {(netProfit + totalModal).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ekuitas Bersih</span>
                    <span className="font-mono text-slate-900">Rp {(netProfit + totalModal).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="border-t border-slate-100 pt-2 flex justify-between font-black text-sky-600">
                    <span>Total Keseimbangan</span>
                    <span className="font-mono">Seimbang (Balance)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
