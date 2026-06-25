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

      {/* KPI Card Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-xs space-y-3">
          <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block">Cash on Hand</span>
          <span className="text-xl font-black text-slate-900 font-mono">Rp {cashOnHand.toLocaleString('id-ID')}</span>
          <span className="text-[9px] text-emerald-600 block">🟢 Lancar & Likuid</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-xs space-y-3">
          <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block">Stock Value</span>
          <span className="text-xl font-black text-[#0284c7] font-mono">Rp {stockValue.toLocaleString('id-ID')}</span>
          <span className="text-[9px] text-slate-400 block">Bahan plat & gondola</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-xs space-y-3">
          <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block">Revenue (Monthly)</span>
          <span className="text-xl font-black text-emerald-600 font-mono">Rp {monthlyRevenue.toLocaleString('id-ID')}</span>
          <span className="text-[9px] text-slate-400 block">Omset kotor terrealisasi</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-xs space-y-3">
          <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block">Profit Margin (Monthly)</span>
          <span className="text-xl font-black text-indigo-600 font-mono">{monthlyProfitMargin.toFixed(1)}%</span>
          <span className="text-[9px] text-emerald-600 block">▲ Margin sehat</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-xs space-y-3">
          <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block">Total Sales (Monthly)</span>
          <span className="text-xl font-black text-amber-500 font-mono">{totalSalesQty} Unit</span>
          <span className="text-[9px] text-slate-400 block">Rak terkirim / terjual</span>
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
