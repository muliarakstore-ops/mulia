import React, { useState, useMemo } from 'react';
import { Transaction, SVGLineChart, StockPieChart } from './Charts';

interface OverviewTabProps {
  cashOnHand: number;
  stockValue: number;
  monthlyRevenue: number;
  monthlyProfitMargin: number;
  totalSalesQty: number;
  transactions: Transaction[];
  cogsTotal: number;
  opexTotal: number;
  netProfit: number;
  totalModal: number;
  revenueFilter: 'Monthly' | 'Yearly';
  setRevenueFilter: (f: 'Monthly' | 'Yearly') => void;
  getFilterData: (filter: 'Monthly' | 'Yearly', baseData: { Monthly: number[]; Yearly: number[] }) => number[];
  getFilterLabels: (filter: 'Monthly' | 'Yearly') => string[];
  products?: any[];
}

export default function OverviewTab({
  cashOnHand,
  stockValue,
  monthlyRevenue,
  monthlyProfitMargin,
  totalSalesQty,
  transactions,
  cogsTotal,
  opexTotal,
  netProfit,
  totalModal,
  revenueFilter,
  setRevenueFilter,
  getFilterData,
  getFilterLabels,
  products
}: OverviewTabProps) {
  const dynamicRevenueData = useMemo(() => {
    const monthlySales = Array(12).fill(0);
    const yearlySales = Array(20).fill(0);
    const weeklySales = Array(12).fill(0);

    const weeklyIntervals = [
      { start: new Date('2026-03-15'), end: new Date('2026-03-22') },
      { start: new Date('2026-03-22'), end: new Date('2026-03-29') },
      { start: new Date('2026-03-29'), end: new Date('2026-04-05') },
      { start: new Date('2026-04-05'), end: new Date('2026-04-12') },
      { start: new Date('2026-04-12'), end: new Date('2026-04-19') },
      { start: new Date('2026-04-19'), end: new Date('2026-04-26') },
      { start: new Date('2026-04-26'), end: new Date('2026-05-03') },
      { start: new Date('2026-05-03'), end: new Date('2026-05-10') },
      { start: new Date('2026-05-10'), end: new Date('2026-05-17') },
      { start: new Date('2026-05-17'), end: new Date('2026-05-24') },
      { start: new Date('2026-05-24'), end: new Date('2026-05-31') },
      { start: new Date('2026-05-31'), end: new Date('2026-06-07') }
    ];

    transactions.forEach(t => {
      if (t.type !== 'penjualan') return;
      const tDate = new Date(t.date);
      const amt = Number(t.amount || 0) / 1000000; // in millions

      // Month matching (2026)
      if (tDate.getFullYear() === 2026) {
        const m = tDate.getMonth();
        if (m >= 0 && m < 12) {
          monthlySales[m] += amt;
        }
      }

      // Year matching (2007 - 2026)
      const yr = tDate.getFullYear();
      if (yr >= 2007 && yr <= 2026) {
        yearlySales[yr - 2007] += amt;
      }

      // Week matching
      for (let i = 0; i < weeklyIntervals.length; i++) {
        const interval = weeklyIntervals[i];
        if (tDate >= interval.start && tDate < interval.end) {
          weeklySales[i] += amt;
          break;
        }
      }
    });

    const roundValues = (arr: number[]) => arr.map(v => Math.round(v * 10) / 10);

    return {
      Weekly: roundValues(weeklySales),
      Monthly: roundValues(monthlySales),
      Yearly: roundValues(yearlySales)
    };
  }, [transactions]);

  const equityMonthlyData = useMemo(() => {
    const monthlyData: number[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    const targetYear = 2026;

    months.forEach((_, idx) => {
      const upToDate = new Date(targetYear, idx, 31, 23, 59, 59);
      let val = 0;
      transactions.forEach(t => {
        if (new Date(t.date) > upToDate) return;
        
        if (t.type === 'permodalan') {
          val += t.amount;
        } else if (t.type === 'penjualan') {
          val += t.amount;
        } else if (t.type === 'prive') {
          val -= t.amount;
        } else if (t.type === 'pengeluaran') {
          val -= t.amount;
        }
      });
      monthlyData.push(Math.max(0, Math.round((val / 1000000) * 10) / 10));
    });
    return monthlyData;
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-slate-900">Dashboard Overview</h2>
        <p className="text-xs text-slate-500 mt-0.5">Selamat datang Owner Iqbal, berikut ringkasan laporan performa finansial Mulia Rak Store.</p>
      </div>

      {/* KPI Card Metrics - Redesigned like v0 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Cash on Hand Card (Glow Accent) */}
        <div className="bg-gradient-to-br from-[#0284c7] to-[#0369a1] text-white p-5 rounded-2xl border border-blue-600/10 shadow-lg shadow-[#0284c7]/15 flex flex-col justify-between h-36 hover:scale-105 hover:shadow-xl transition-all duration-500 cursor-pointer group">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-100">Cash on Hand</span>
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
          </div>
          <div>
            <span className="text-xl md:text-2xl font-black font-mono tracking-tight block">Rp {cashOnHand.toLocaleString('id-ID')}</span>
            <span className="text-[9px] font-medium text-sky-100/80 block mt-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span> Lancar & Likuid
            </span>
          </div>
        </div>

        {/* Stock Value Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex flex-col justify-between h-36 hover:scale-105 hover:shadow-md transition-all duration-500 cursor-pointer group">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stock Value</span>
            <div className="w-5 h-5 rounded-full bg-[#0284c7]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-3 h-3 text-[#0284c7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-20L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div>
            <span className="text-xl md:text-2xl font-black text-[#0284c7] font-mono tracking-tight block">Rp {stockValue.toLocaleString('id-ID')}</span>
            <span className="text-[9px] font-medium text-slate-400 block mt-1.5">Bahan plat & gondola</span>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex flex-col justify-between h-36 hover:scale-105 hover:shadow-md transition-all duration-500 cursor-pointer group">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Revenue (Monthly)</span>
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center group-hover:-rotate-12 transition-transform duration-300">
              <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1" />
              </svg>
            </div>
          </div>
          <div>
            <span className="text-xl md:text-2xl font-black text-slate-900 font-mono tracking-tight block">Rp {monthlyRevenue.toLocaleString('id-ID')}</span>
            <span className="text-[9px] font-medium text-slate-400 block mt-1.5">Omset kotor terrealisasi</span>
          </div>
        </div>

        {/* Profit Margin Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex flex-col justify-between h-36 hover:scale-105 hover:shadow-md transition-all duration-500 cursor-pointer group">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Profit Margin</span>
            <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-3 h-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
            </div>
          </div>
          <div>
            <span className="text-xl md:text-2xl font-black text-indigo-600 font-mono tracking-tight block">{monthlyProfitMargin.toFixed(1)}%</span>
            <span className="text-[9px] font-medium text-emerald-600 block mt-1.5">▲ Margin sehat</span>
          </div>
        </div>

        {/* Total Sales Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex flex-col justify-between h-36 hover:scale-105 hover:shadow-md transition-all duration-500 cursor-pointer group">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Sales</span>
            <div className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <svg className="w-3 h-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <div>
            <span className="text-xl md:text-2xl font-black text-slate-900 font-mono tracking-tight block">{totalSalesQty} Unit</span>
            <span className="text-[9px] font-medium text-slate-400 block mt-1.5">Rak terkirim / terjual</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Revenue Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-500">📈 Sales Revenue</h3>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              {(['Monthly', 'Yearly'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setRevenueFilter(f)}
                  className={`px-2.5 py-1 text-[9px] font-bold rounded-lg cursor-pointer transition-all ${
                    revenueFilter === f ? 'bg-white text-[#0284c7] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-2">
            <SVGLineChart
              data={dynamicRevenueData[revenueFilter]}
              labels={getFilterLabels(revenueFilter)}
              gradientColors={['#0284c7', '#38bdf8']}
              strokeColor="#0284c7"
              gradientId="revenue-grad"
              valueSuffix="jt"
            />
          </div>
        </div>

        {/* Stock Availability Donut */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
          <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-500 mb-2">📦 Pie Chart Stock Available</h3>
          <div className="flex-1 flex items-center justify-center">
            <StockPieChart products={products} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">
          {/* Transaction History */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs flex flex-col h-[280px]">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-500 mb-4">📖 Transaction History</h3>
            <div className="space-y-3 overflow-y-auto flex-1 pr-1">
              {transactions.filter(t => t.type === 'penjualan' || t.type === 'pengeluaran').map((t) => (
                <div key={t.id} className="flex justify-between items-center text-xs p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100/70 transition-colors">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block truncate max-w-[320px] md:max-w-[500px]">{t.desc}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{t.date}</span>
                  </div>
                  <span className={`font-mono font-bold ${t.type === 'penjualan' ? 'text-emerald-600' : 'text-rose-650'}`}>
                    {t.type === 'penjualan' ? '+' : '-'}Rp {t.amount.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Perkembangan Nilai Modal */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-500">📈 Perkembangan Nilai Modal (Ekuitas)</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Tren pertumbuhan nilai modal bersih bulanan terakumulasi secara berkala (2026).</p>
            </div>
            
            <div className="pt-2">
              <SVGLineChart
                data={equityMonthlyData}
                labels={['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']}
                gradientColors={['#6366f1', '#818cf8']}
                strokeColor="#6366f1"
                gradientId="overview-modal-grad"
                valueSuffix="jt"
              />
            </div>
          </div>
        </div>

        <div className="xl:col-span-1 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-xs space-y-1.5 flex-1 flex flex-col justify-center">
            <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block">Total COGS (Bulan Ini)</span>
            <span className="text-lg font-black text-amber-500 font-mono block">Rp {cogsTotal.toLocaleString('id-ID')}</span>
            <span className="text-[8px] text-slate-400 block font-medium">Bahan Baku & HPP Produksi</span>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-xs space-y-1.5 flex-1 flex flex-col justify-center">
            <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block">Total Opex (Bulan Ini)</span>
            <span className="text-lg font-black text-rose-500 font-mono block">Rp {opexTotal.toLocaleString('id-ID')}</span>
            <span className="text-[8px] text-slate-400 block font-medium">Bensin & Biaya Operasional</span>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-xs space-y-1.5 flex-1 flex flex-col justify-center">
            <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block">Average Margin (Bulan Ini)</span>
            <span className="text-lg font-black text-indigo-600 font-mono block">{monthlyProfitMargin.toFixed(1)}%</span>
            <span className="text-[8px] text-emerald-600 block font-medium">🟢 Margin Kotor Sehat</span>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-xs space-y-1.5 flex-1 flex flex-col justify-center">
            <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block">Total Net (Bulan Ini)</span>
            <span className="text-lg font-black text-emerald-600 font-mono block">Rp {netProfit.toLocaleString('id-ID')}</span>
            <span className="text-[8px] text-slate-400 block font-medium">Laba Bersih Terrealisasi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
