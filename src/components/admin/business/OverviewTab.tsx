'use strict';
'use client';

import React, { useState } from 'react';
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
  revenueFilter: 'Weekly' | 'Monthly' | 'Yearly';
  setRevenueFilter: (f: 'Weekly' | 'Monthly' | 'Yearly') => void;
  getFilterData: (filter: 'Weekly' | 'Monthly' | 'Yearly', baseData: { Weekly: number[]; Monthly: number[]; Yearly: number[] }) => number[];
  getFilterLabels: (filter: 'Weekly' | 'Monthly' | 'Yearly') => string[];
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
  getFilterLabels
}: OverviewTabProps) {
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
              {(['Weekly', 'Monthly', 'Yearly'] as const).map((f) => (
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
              data={getFilterData(revenueFilter, {
                Weekly: [15, 18, 14, 22, 25, 19, 28, 30, 27, 35, 32, 40],
                Monthly: [35, 42, 38, 45, 40, 55, 48, 65, 60, 70, 68, 85],
                Yearly: [8, 12, 15, 18, 22, 25, 30, 28, 35, 40, 48, 55, 62, 70, 78, 85, 95, 110, 125, 140]
              })}
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
            <StockPieChart />
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

          {/* Capital Expenditures */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-500">🏢 Capital Expenditure (CapEx - Lifetime)</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Akumulasi pengeluaran modal aset tetap (Mesin, Pabrik, Kendaraan Armada).</p>
            </div>
            
            <div className="h-44 flex items-end justify-between pt-8 border-b border-slate-100 relative">
              {[
                { label: 'Q1 2025', val: 75, detail: 'Mesin Tekuk Plat' },
                { label: 'Q2 2025', val: 120, detail: 'Oven Powder Coating' },
                { label: 'Q3 2025', val: 95, detail: 'Alat Las Spot Welder' },
                { label: 'Q4 2025', val: 150, detail: 'Armada PickUp Kargo' },
                { label: 'Q1 2026', val: 185, detail: 'Renovasi Pabrik Depok' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center w-full group relative z-10">
                  <div className="text-[8px] font-mono text-indigo-600 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">
                    Rp {item.val}jt ({item.detail})
                  </div>
                  <div className="w-8 bg-slate-900 rounded-t transition-all hover:bg-indigo-600" style={{ height: `${item.val * 0.65}px` }} />
                  <span className="text-[8px] text-slate-400 font-bold mt-2">{item.label}</span>
                </div>
              ))}
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
