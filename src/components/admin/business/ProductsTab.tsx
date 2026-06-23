'use strict';
'use client';

import React from 'react';
import { Transaction, StockValuePieChart, ShippingTypePieChart, DeliveryCalendar } from './Charts';

interface ProductsTabProps {
  stockValue: number;
  totalSalesQty: number;
  transactions: Transaction[];
  shipSelfFilter: 'Monthly' | 'Yearly';
  setShipSelfFilter: (v: 'Monthly' | 'Yearly') => void;
  shipExpFilter: 'Monthly' | 'Yearly';
  setShipExpFilter: (v: 'Monthly' | 'Yearly') => void;
  prodSalesFilter: 'Monthly' | 'Yearly';
  setProdSalesFilter: (v: 'Monthly' | 'Yearly') => void;
  regionSalesFilter: 'Monthly' | 'Yearly';
  setRegionSalesFilter: (v: 'Monthly' | 'Yearly') => void;
}

export default function ProductsTab({
  stockValue,
  totalSalesQty,
  transactions,
  shipSelfFilter,
  setShipSelfFilter,
  shipExpFilter,
  setShipExpFilter,
  prodSalesFilter,
  setProdSalesFilter,
  regionSalesFilter,
  setRegionSalesFilter
}: ProductsTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-slate-900">📦 Produk & Analisis Pasar</h2>
        <p className="text-xs text-slate-500 mt-0.5">Analisis performa penjualan produk, ketersediaan stok gundalan, dan logistik pengiriman barang.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border-t-4 border-t-sky-500 border-x border-b border-slate-200/60 shadow-sm shadow-sky-500/[0.03] space-y-3 hover:scale-[1.02] hover:shadow-md hover:shadow-sky-500/[0.06] transition-all duration-300">
          <span className="text-[10px] uppercase font-extrabold text-slate-455 tracking-wider block">Jumlah Stok Keseluruhan</span>
          <span className="text-2xl md:text-3xl font-black text-sky-600 font-mono block">400 Unit</span>
          <span className="text-xs text-slate-500 block font-medium">Gondola & Meja Kasir ready</span>
        </div>
        
        <div className="bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border-t-4 border-t-indigo-500 border-x border-b border-slate-200/60 shadow-sm shadow-indigo-500/[0.03] space-y-3 hover:scale-[1.02] hover:shadow-md hover:shadow-indigo-500/[0.06] transition-all duration-300">
          <span className="text-[10px] uppercase font-extrabold text-slate-455 tracking-wider block">Nilai Stok Keseluruhan</span>
          <span className="text-2xl md:text-3xl font-black text-indigo-600 font-mono block">Rp {stockValue.toLocaleString('id-ID')}</span>
          <span className="text-xs text-emerald-600 block font-semibold">🟢 Nilai aset likuid</span>
        </div>

        <div className="bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border-t-4 border-t-emerald-500 border-x border-b border-slate-200/60 shadow-sm shadow-emerald-500/[0.03] space-y-3 hover:scale-[1.02] hover:shadow-md hover:shadow-emerald-500/[0.06] transition-all duration-300">
          <span className="text-[10px] uppercase font-extrabold text-slate-455 tracking-wider block">Jumlah Penjualan Keseluruhan</span>
          <span className="text-2xl md:text-3xl font-black text-emerald-600 font-mono block">{totalSalesQty} Unit</span>
          <span className="text-xs text-slate-500 block font-medium">Rak & aksesoris terjual</span>
        </div>

        <div className="bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border-t-4 border-t-violet-500 border-x border-b border-slate-200/60 shadow-sm shadow-violet-500/[0.03] space-y-3 hover:scale-[1.02] hover:shadow-md hover:shadow-violet-500/[0.06] transition-all duration-300">
          <span className="text-[10px] uppercase font-extrabold text-slate-455 tracking-wider block">Jumlah Pengiriman Keseluruhan</span>
          <span className="text-xl md:text-2xl font-black text-violet-650 font-mono block">42 Pengiriman</span>
          <span className="text-xs text-slate-500 block font-medium">Mandiri & Ekspedisi terkirim</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <DeliveryCalendar transactions={transactions} />
        </div>
        <div className="lg:col-span-4 bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-100/40 hover:shadow-md hover:shadow-slate-250/30 transition-all duration-300 flex flex-col justify-between h-full">
          <div>
            <h3 className="text-sm uppercase font-extrabold tracking-wider text-slate-700">📊 Perbandingan Jenis Pengiriman</h3>
            <p className="text-xs text-slate-500">Total armada logistik yang digunakan.</p>
          </div>
          <ShippingTypePieChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Penjualan per Produk */}
        <div className="lg:col-span-6 bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-100/40 hover:shadow-md hover:shadow-slate-250/30 transition-all duration-300 flex flex-col h-[360px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm uppercase font-extrabold tracking-wider text-slate-700">🛒 Penjualan per Produk</h3>
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
              {(['Monthly', 'Yearly'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setProdSalesFilter(f)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                    prodSalesFilter === f ? 'bg-white text-[#0284c7] shadow-xs' : 'text-slate-500'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3 overflow-y-auto flex-1 pr-1 text-xs">
            {(prodSalesFilter === 'Monthly' ? [
              { name: 'Rak Gondola Single Utama', qty: 120 },
              { name: 'Rak Gondola Double Sambung', qty: 85 },
              { name: 'Meja Kasir Kayu Minimalis', qty: 12 },
              { name: 'Keranjang Belanja Plastik', qty: 240 }
            ] : [
              { name: 'Rak Gondola Single Utama', qty: 1450 },
              { name: 'Rak Gondola Double Sambung', qty: 980 },
              { name: 'Meja Kasir Kayu Minimalis', qty: 150 },
              { name: 'Keranjang Belanja Plastik', qty: 2800 }
            ]).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100/70 transition-colors shadow-2xs">
                <span className="font-bold text-slate-800 text-xs">{item.name}</span>
                <span className="font-mono font-black text-xs text-[#0284c7]">{item.qty.toLocaleString('id-ID')} Pcs</span>
              </div>
            ))}
          </div>
        </div>

        {/* Region Sales */}
        <div className="lg:col-span-6 bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-100/40 hover:shadow-md hover:shadow-slate-250/30 transition-all duration-300 flex flex-col h-[360px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm uppercase font-extrabold tracking-wider text-slate-700">📍 Penjualan per Daerah</h3>
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
              {(['Monthly', 'Yearly'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setRegionSalesFilter(f)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                    regionSalesFilter === f ? 'bg-white text-indigo-650 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3 overflow-y-auto flex-1 pr-1 text-xs">
            {(regionSalesFilter === 'Monthly' ? [
              { name: 'Kota Depok', qty: 140 },
              { name: 'Jakarta Timur', qty: 110 },
              { name: 'Bekasi', qty: 85 },
              { name: 'Kabupaten Bogor', qty: 65 }
            ] : [
              { name: 'Kota Depok', qty: 1650 },
              { name: 'Jakarta Timur', qty: 1200 },
              { name: 'Bekasi', qty: 950 },
              { name: 'Kabupaten Bogor', qty: 720 }
            ]).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-indigo-50/20 rounded-xl hover:bg-indigo-50/40 transition-colors border border-indigo-100/10 shadow-2xs">
                <span className="font-bold text-slate-800 text-xs">{item.name}</span>
                <span className="font-mono font-black text-xs text-indigo-600">{item.qty.toLocaleString('id-ID')} Pcs</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-100/40 hover:shadow-md hover:shadow-slate-250/30 transition-all duration-300 flex flex-col justify-between h-full">
          <div>
            <h3 className="text-sm uppercase font-extrabold tracking-wider text-slate-700">💰 Nilai Aset Stok per Produk</h3>
            <p className="text-xs text-slate-500">Total nilai rupiah aset stok yang tersedia.</p>
          </div>
          <StockValuePieChart />
        </div>

        <div className="lg:col-span-7 bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-100/40 hover:shadow-md hover:shadow-slate-250/30 transition-all duration-300 flex flex-col justify-between h-full">
          <div>
            <h3 className="text-sm uppercase font-extrabold tracking-wider text-slate-700">📦 Jumlah Stok Tersedia per Produk</h3>
            <p className="text-xs text-slate-500">Volume fisik unit barang ready di gudang.</p>
          </div>
          <div className="space-y-5 py-4">
            {[
              { name: 'Rak Gondola Single Utama', cur: 120, max: 200, color: 'from-sky-600 to-sky-400 border border-sky-400/30' },
              { name: 'Rak Gondola Double Sambung', cur: 160, max: 200, color: 'from-indigo-600 to-indigo-400 border border-indigo-400/30' },
              { name: 'Meja Kasir Kayu Minimalis', cur: 80, max: 100, color: 'from-emerald-600 to-emerald-450 border border-emerald-400/30' },
              { name: 'Aksesoris/Lainnya', cur: 40, max: 50, color: 'from-amber-500 to-amber-400 border border-amber-400/30' },
            ].map((p, idx) => {
              const pct = Math.min(100, Math.round((p.cur / p.max) * 100));
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-705">
                    <span>{p.name}</span>
                    <span className="font-mono text-slate-900 font-extrabold">{p.cur} / {p.max} Unit <span className="text-slate-400 font-medium">({pct}%)</span></span>
                  </div>
                  <div className="w-full bg-slate-50 border border-slate-200/70 p-[3px] rounded-full h-5 flex items-center shadow-inner">
                    <div 
                      className={`bg-gradient-to-r ${p.color} h-full rounded-full transition-all duration-700 relative shadow-xs flex items-center justify-end pr-2`} 
                      style={{ width: `${pct}%` }}
                    >
                      <span className="absolute inset-x-0 top-0 h-[30%] bg-white/20 rounded-full" />
                      {pct > 15 && (
                        <span className="text-[7.5px] font-black text-white font-mono tracking-wider select-none opacity-90 drop-shadow-xs">
                          {pct}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-100/40 hover:shadow-md hover:shadow-slate-250/30 transition-all duration-300 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm uppercase font-extrabold tracking-wider text-slate-700">🚛 Pengiriman Mandiri (Armada Mrs)</h3>
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
              {(['Monthly', 'Yearly'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setShipSelfFilter(f)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                    shipSelfFilter === f ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto max-h-64 rounded-xl border border-slate-200/80">
            <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider border-b border-slate-200 text-[10px] font-extrabold">
                  <th className="p-3 border-r border-slate-200">Nama</th>
                  <th className="p-3 border-r border-slate-200">Daerah</th>
                  <th className="p-3 border-r border-slate-200">Biaya</th>
                  <th className="p-3 border-r border-slate-200">Waktu</th>
                  <th className="p-3 border-r border-slate-200">Unit</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(() => {
                  const selfData = shipSelfFilter === 'Monthly' ? [
                    { name: 'Toko Bu Sri', area: 'Depok', cost: 150000, time: '2026-06-18', qty: 20, total: 17150000 },
                    { name: 'CV. Maju', area: 'Cibinong', cost: 200000, time: '2026-06-10', qty: 5, total: 6200000 }
                  ] : [
                    { name: 'Toko Bu Sri', area: 'Depok', cost: 1800000, time: '12x Kirim', qty: 240, total: 205800000 },
                    { name: 'Ritel Sentosa', area: 'Bogor', cost: 2400000, time: '8x Kirim', qty: 160, total: 137600000 }
                  ];
                  const totalCost = selfData.reduce((acc, curr) => acc + curr.cost, 0);
                  const totalQty = selfData.reduce((acc, curr) => acc + curr.qty, 0);
                  const totalAmt = selfData.reduce((acc, curr) => acc + curr.total, 0);
                  const totalShipments = selfData.reduce((acc, curr) => {
                    if (curr.time.includes('x Kirim')) {
                       return acc + parseInt(curr.time);
                    }
                    return acc + 1;
                  }, 0);
                  
                  return (
                    <>
                      {selfData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 font-bold text-slate-900 border-r border-slate-200">{row.name}</td>
                          <td className="p-3 border-r border-slate-200">{row.area}</td>
                          <td className="p-3 font-mono text-slate-500 border-r border-slate-200">Rp {row.cost.toLocaleString('id-ID')}</td>
                          <td className="p-3 text-slate-400 font-mono border-r border-slate-200">{row.time}</td>
                          <td className="p-3 font-mono text-slate-500 border-r border-slate-200">{row.qty} Pcs</td>
                          <td className="p-3 text-right font-mono font-black text-[#0284c7]">Rp {row.total.toLocaleString('id-ID')}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-55/90 font-black border-t-2 border-slate-250 text-slate-900 text-xs">
                        <td className="p-3 border-r border-slate-200" colSpan={2}>TOTAL</td>
                        <td className="p-3 font-mono text-slate-900 border-r border-slate-200">Rp {totalCost.toLocaleString('id-ID')}</td>
                        <td className="p-3 font-bold text-indigo-650 border-r border-slate-200">{totalShipments}x Kirim</td>
                        <td className="p-3 font-mono text-slate-900 border-r border-slate-200">{totalQty} Pcs</td>
                        <td className="p-3 text-right font-mono text-[#0284c7]">Rp {totalAmt.toLocaleString('id-ID')}</td>
                      </tr>
                    </>
                  );
                })()}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-6 bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-100/40 hover:shadow-md hover:shadow-slate-250/30 transition-all duration-300 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm uppercase font-extrabold tracking-wider text-slate-700">✈️ Pengiriman Ekspedisi / External</h3>
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
              {(['Monthly', 'Yearly'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setShipExpFilter(f)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                    shipExpFilter === f ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto max-h-64 rounded-xl border border-slate-200/80">
            <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider border-b border-slate-200 text-[10px] font-extrabold">
                  <th className="p-3 border-r border-slate-200">Nama</th>
                  <th className="p-3 border-r border-slate-200">Daerah</th>
                  <th className="p-3 border-r border-slate-200">Biaya</th>
                  <th className="p-3 border-r border-slate-200">Waktu</th>
                  <th className="p-3 border-r border-slate-200">Unit</th>
                  <th className="p-3 border-r border-slate-200">Ekspedisi</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(() => {
                  const expData = shipExpFilter === 'Monthly' ? [
                    { name: 'Minimarket Sejahtera', area: 'Sukabumi', cost: 450000, time: '2026-06-12', qty: 15, exp: 'JNE Trucking', total: 13950000 },
                    { name: 'Koperasi Mandiri', area: 'Bandung', cost: 600000, time: '2026-06-05', qty: 12, exp: 'Dakota Cargo', total: 11400000 }
                  ] : [
                    { name: 'Minimarket Sejahtera', area: 'Sukabumi', cost: 4500000, time: '10x Kirim', qty: 150, exp: 'JNE Trucking', total: 139500000 },
                    { name: 'Koperasi Mandiri', area: 'Bandung', cost: 6000000, time: '10x Kirim', qty: 120, exp: 'Dakota Cargo', total: 114000000 }
                  ];
                  const totalCost = expData.reduce((acc, curr) => acc + curr.cost, 0);
                  const totalQty = expData.reduce((acc, curr) => acc + curr.qty, 0);
                  const totalAmt = expData.reduce((acc, curr) => acc + curr.total, 0);
                  const totalShipments = expData.reduce((acc, curr) => {
                    if (curr.time.includes('x Kirim')) {
                      return acc + parseInt(curr.time);
                    }
                    return acc + 1;
                  }, 0);
                  
                  return (
                    <>
                      {expData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 font-bold text-slate-900 border-r border-slate-200">{row.name}</td>
                          <td className="p-3 border-r border-slate-200">{row.area}</td>
                          <td className="p-3 font-mono text-slate-500 border-r border-slate-200">Rp {row.cost.toLocaleString('id-ID')}</td>
                          <td className="p-3 text-slate-400 font-mono border-r border-slate-200">{row.time}</td>
                          <td className="p-3 font-mono text-slate-500 border-r border-slate-200">{row.qty} Pcs</td>
                          <td className="p-3 border-r border-slate-200"><span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-black text-slate-650 text-[9px] uppercase tracking-wider">{row.exp}</span></td>
                          <td className="p-3 text-right font-mono font-black text-[#0284c7]">Rp {row.total.toLocaleString('id-ID')}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-55/90 font-black border-t-2 border-slate-250 text-slate-900 text-xs">
                        <td className="p-3 border-r border-slate-200" colSpan={2}>TOTAL</td>
                        <td className="p-3 font-mono text-slate-900 border-r border-slate-200">Rp {totalCost.toLocaleString('id-ID')}</td>
                        <td className="p-3 font-bold text-indigo-650 border-r border-slate-200">{totalShipments}x Kirim</td>
                        <td className="p-3 font-mono text-slate-900 border-r border-slate-200">{totalQty} Pcs</td>
                        <td className="p-3 text-slate-450 border-r border-slate-200">-</td>
                        <td className="p-3 text-right font-mono text-[#0284c7]">Rp {totalAmt.toLocaleString('id-ID')}</td>
                      </tr>
                    </>
                  );
                })()}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-100/40 hover:shadow-md hover:shadow-slate-250/30 transition-all duration-300 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm uppercase font-extrabold tracking-wider text-slate-700">⚠️ Riwayat Kulakan & Rencana Restock Produk</h3>
          <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200/65 font-black text-rose-700 text-[9px] uppercase tracking-wider">Log Alert</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {[
            { name: 'Tiang Gondola T150', stock: 'Sisa 8 Pcs', action: 'Segera kulak hari ini!', isUrgent: true, date: '2026-06-23' },
            { name: 'Cat Powder Coating Sky Blue', stock: 'Sisa 5 Kg', action: '3 hari lagi', isUrgent: false, date: '2026-06-20' },
            { name: 'Plat Besi Gulung 1.2mm', stock: 'Sisa 2 Roll', action: '5 hari lagi', isUrgent: false, date: '2026-06-18' },
            { name: 'Baut & Spacer M6', stock: 'Sisa 50 Pcs', action: '7 hari lagi', isUrgent: false, date: '2026-06-15' }
          ].map((alertItem, idx) => (
            <div key={idx} className={`p-4.5 rounded-2xl border flex flex-col justify-between gap-4 transition-colors ${
              alertItem.isUrgent ? 'bg-rose-50 border-rose-200/60 text-rose-900' : 'bg-amber-50/60 border-amber-200/60 text-amber-900'
            }`}>
              <div className="flex justify-between items-start font-bold">
                <div className="space-y-0.5">
                  <span className="text-xs md:text-sm block">{alertItem.name}</span>
                  <span className="text-[9px] opacity-60 font-mono block">{alertItem.date}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wide flex-shrink-0 ${
                  alertItem.isUrgent ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                }`}>{alertItem.stock}</span>
              </div>
              <span className="text-xs opacity-90 font-semibold">
                {alertItem.isUrgent ? '🚨 ' : '⚠️ '} **Jadwal:** {alertItem.action}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
