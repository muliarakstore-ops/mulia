'use strict';
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../utils/supabase';

// Modular Tab Components
import OverviewTab from '../../../components/admin/business/OverviewTab';
import LedgerTab from '../../../components/admin/business/LedgerTab';
import ProductsTab from '../../../components/admin/business/ProductsTab';
import RatiosTab from '../../../components/admin/business/RatiosTab';
import AccountingTab from '../../../components/admin/business/AccountingTab';

interface Transaction {
  id: string;
  date: string;
  desc: string;
  type: 'penjualan' | 'pengeluaran' | 'permodalan' | 'prive' | 'capex';
  amount: number;
  qty?: number;
}

export default function BusinessDashboard() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [activeMenu, setActiveMenu] = useState<'overview' | 'ledger' | 'ratios' | 'products' | 'accounting'>('overview');

  // Input states for ledger
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', date: '2026-06-18', desc: 'Penjualan Rak Gondola Single Utama T150 (20 unit)', type: 'penjualan', amount: 17000000, qty: 20 },
    { id: '2', date: '2026-06-17', desc: 'Pembelian Cat Powder Coating (Bahan Baku)', type: 'pengeluaran', amount: 8900050 },
    { id: '3', date: '2026-06-15', desc: 'Injeksi Modal Tambahan Owner Iqbal', type: 'permodalan', amount: 150000000 },
    { id: '4', date: '2026-06-10', desc: 'Penjualan Rak Double Sambung T150 (5 unit)', type: 'penjualan', amount: 6000000, qty: 5 },
    { id: '5', date: '2026-06-05', desc: 'Bensin & Operasional Armada Logistik', type: 'pengeluaran', amount: 1200000 },
    { id: '6', date: '2026-06-03', desc: 'Penarikan Prive Owner Iqbal (Pribadi)', type: 'prive', amount: 5000000 },
    { id: '7', date: '2026-06-02', desc: 'Pembelian Mesin Tekuk Plat Baja Baru', type: 'capex', amount: 45000000 },
  ]);

  const [txDesc, setTxDesc] = useState('');
  const [txType, setTxType] = useState<'penjualan' | 'pengeluaran' | 'permodalan' | 'prive' | 'capex'>('penjualan');
  const [txAmount, setTxAmount] = useState('');
  const [txQty, setTxQty] = useState('');

  // Graph and Analytics Filters
  const [revenueFilter, setRevenueFilter] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Monthly');

  // Products and Markets Tab Filters
  const [prodSalesFilter, setProdSalesFilter] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [regionSalesFilter, setRegionSalesFilter] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [shipSelfFilter, setShipSelfFilter] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [shipExpFilter, setShipExpFilter] = useState<'Monthly' | 'Yearly'>('Monthly');

  // Ledger (Transaksi & Keuangan) States
  const [filterTxJenis, setFilterTxJenis] = useState<'Semua' | 'pemasukan' | 'pengeluaran'>('Semua');
  const [filterTxSubJenis, setFilterTxSubJenis] = useState<string>('Semua');
  const [isPemasukanModalOpen, setIsPemasukanModalOpen] = useState(false);
  const [isPengeluaranModalOpen, setIsPengeluaranModalOpen] = useState(false);

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
      amount: amountNum,
      qty: txType === 'penjualan' ? parseInt(txQty) || 1 : undefined
    };

    setTransactions([newTx, ...transactions]);
    setTxDesc('');
    setTxAmount('');
    setTxQty('');
    setIsPemasukanModalOpen(false);
    setIsPengeluaranModalOpen(false);
  };

  // 1. Cash on Hand
  const cashOnHand = useMemo(() => {
    let cash = 0;
    transactions.forEach(t => {
      if (t.type === 'penjualan' || t.type === 'permodalan') {
        cash += t.amount;
      } else if (t.type === 'pengeluaran' || t.type === 'prive' || t.type === 'capex') {
        cash -= t.amount;
      }
    });
    return cash;
  }, [transactions]);

  // 2. Stock Value (Mocked dynamic value representing steel stocks + finished racks ready)
  const stockValue = 185200000;

  // 3. Monthly Revenue
  const monthlyRevenue = useMemo(() => {
    return transactions
      .filter(t => t.type === 'penjualan')
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [transactions]);

  // 4. Monthly Profit Margin %
  const monthlyProfitMargin = useMemo(() => {
    const revenue = monthlyRevenue;
    const expense = transactions
      .filter(t => t.type === 'pengeluaran')
      .reduce((acc, curr) => acc + curr.amount, 0);
    if (revenue === 0) return 0;
    return ((revenue - expense) / revenue) * 100;
  }, [transactions, monthlyRevenue]);

  // 5. Total Sales (Monthly quantity sold)
  const totalSalesQty = useMemo(() => {
    return transactions
      .filter(t => t.type === 'penjualan')
      .reduce((acc, curr) => acc + (curr.qty || 0), 0);
  }, [transactions]);

  // Calculations for Accounting/PnL section
  const totalPenjualan = monthlyRevenue;
  
  const totalPengeluaran = useMemo(() => {
    return transactions
      .filter(t => t.type === 'pengeluaran')
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [transactions]);

  const cogsTotal = useMemo(() => {
    return transactions
      .filter(t => t.type === 'pengeluaran' && !t.desc.toLowerCase().includes('operasional') && !t.desc.toLowerCase().includes('bensin'))
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [transactions]);

  const opexTotal = useMemo(() => {
    return transactions
      .filter(t => t.type === 'pengeluaran' && (t.desc.toLowerCase().includes('operasional') || t.desc.toLowerCase().includes('bensin')))
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [transactions]);

  const netProfit = useMemo(() => {
    return totalPenjualan - totalPengeluaran;
  }, [totalPenjualan, totalPengeluaran]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 font-sans space-y-3">
        <div className="animate-spin text-2xl">⏳</div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Memverifikasi Hak Akses Owner...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION - Solid Blue */}
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
              { id: 'ledger', label: '📖 Transaksi & Keuangan', desc: 'Arus Kas & Analisis Keuangan' },
              { id: 'products', label: '📦 Produk & Pasar', desc: 'Stok & Insight Penjualan' },
              { id: 'ratios', label: '📐 Permodalan & Rasio', desc: 'ROE, ROA, ROAS' },
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
          <OverviewTab
            cashOnHand={cashOnHand}
            stockValue={stockValue}
            monthlyRevenue={monthlyRevenue}
            monthlyProfitMargin={monthlyProfitMargin}
            totalSalesQty={totalSalesQty}
            revenueFilter={revenueFilter}
            setRevenueFilter={setRevenueFilter}
            transactions={transactions}
            cogsTotal={cogsTotal}
            opexTotal={opexTotal}
            netProfit={netProfit}
            totalModal={transactions.filter(t => t.type === 'permodalan').reduce((acc, curr) => acc + curr.amount, 0)}
            getFilterData={(filter, baseData) => baseData[filter] || baseData.Monthly}
            getFilterLabels={(filter) => {
              if (filter === 'Weekly') {
                return [
                  '15-22 Mar', '22-29 Mar', '29 Mar-5 Apr', '5-12 Apr',
                  '12-19 Apr', '19-26 Apr', '26 Apr-3 Mei', '3-10 Mei',
                  '10-17 Mei', '17-24 Mei', '24-31 Mei', '31 Mei-7 Jun'
                ];
              }
              if (filter === 'Yearly') {
                return Array.from({ length: 20 }, (_, i) => (2007 + i).toString());
              }
              return ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
            }}
          />
        )}

        {/* LEDGER SECTION */}
        {activeMenu === 'ledger' && (
          <LedgerTab
            cashOnHand={cashOnHand}
            txType={txType}
            setTxType={setTxType}
            isPemasukanModalOpen={isPemasukanModalOpen}
            setIsPemasukanModalOpen={setIsPemasukanModalOpen}
            isPengeluaranModalOpen={isPengeluaranModalOpen}
            setIsPengeluaranModalOpen={setIsPengeluaranModalOpen}
            txDesc={txDesc}
            setTxDesc={setTxDesc}
            txAmount={txAmount}
            setTxAmount={setTxAmount}
            txQty={txQty}
            setTxQty={setTxQty}
            handleAddTransaction={handleAddTransaction}
            filterTxJenis={filterTxJenis}
            setFilterTxJenis={setFilterTxJenis}
            filterTxSubJenis={filterTxSubJenis}
            setFilterTxSubJenis={setFilterTxSubJenis}
            transactions={transactions}
            onLihatLaporan={() => router.push('/office/business/report')}
          />
        )}

        {/* PRODUCTS & MARKET SECTION */}
        {activeMenu === 'products' && (
          <ProductsTab
            stockValue={stockValue}
            totalSalesQty={totalSalesQty}
            transactions={transactions}
            shipSelfFilter={shipSelfFilter}
            setShipSelfFilter={setShipSelfFilter}
            shipExpFilter={shipExpFilter}
            setShipExpFilter={setShipExpFilter}
            prodSalesFilter={prodSalesFilter}
            setProdSalesFilter={setProdSalesFilter}
            regionSalesFilter={regionSalesFilter}
            setRegionSalesFilter={setRegionSalesFilter}
          />
        )}

        {/* RATIOS SECTION */}
        {activeMenu === 'ratios' && (
          <RatiosTab
            cogsTotal={cogsTotal}
            totalPenjualan={totalPenjualan}
            opexTotal={opexTotal}
            monthlyProfitMargin={monthlyProfitMargin}
            netProfit={netProfit}
            stockValue={stockValue}
          />
        )}

        {/* ACCOUNTING SECTION */}
        {activeMenu === 'accounting' && (
          <AccountingTab
            totalPenjualan={totalPenjualan}
            cogsTotal={cogsTotal}
            opexTotal={opexTotal}
            cashOnHand={cashOnHand}
            stockValue={stockValue}
          />
        )}

      </main>
    </div>
  );
}
