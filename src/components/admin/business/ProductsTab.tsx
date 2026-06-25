'use strict';
'use client';

import React, { useMemo, useState } from 'react';
import { Transaction, SVGLineChart, StockValuePieChart, ShippingTypePieChart, DeliveryCalendar } from './Charts';

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
  products?: any[];
  rawSales?: any[];
  shippingOpex?: any[];
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
  setRegionSalesFilter,
  products = [],
  rawSales = [],
  shippingOpex = []
}: ProductsTabProps) {

  // 1. Total Stock Units
  const totalStockUnits = useMemo(() => {
    if (products.length === 0) return 0;
    return products.reduce((acc, p) => acc + (p.stock || 0), 0);
  }, [products]);

  // 2. Total Shipments
  const totalShipmentsCount = useMemo(() => {
    return rawSales.filter(s => s.jenis_pengiriman === '#Pasang' || s.jenis_pengiriman === '#Ekspedisi').length;
  }, [rawSales]);

  // 3. Dynamic Product Sales Aggregation
  const productSalesData = useMemo(() => {
    if (rawSales.length === 0 || products.length === 0) {
      return [];
    }

    const map: Record<string, number> = {};
    rawSales.forEach(sale => {
      sale.detail_penjualan_produk?.forEach((item: any) => {
        const prodId = item.id_produk;
        map[prodId] = (map[prodId] || 0) + (item.qty_terjual || 0);
      });
    });

    return Object.entries(map).map(([id, qty]) => {
      const p = products.find(prod => prod.id === id);
      return {
        name: p ? p.name : 'Produk Custom',
        qty
      };
    }).sort((a, b) => b.qty - a.qty);
  }, [rawSales, products]);

  // 4. Dynamic Region Sales Aggregation
  const regionSalesData = useMemo(() => {
    if (rawSales.length === 0) {
      return [];
    }

    const map: Record<string, number> = {};
    rawSales.forEach(sale => {
      const qty = sale.detail_penjualan_produk?.reduce((acc: number, item: any) => acc + (item.qty_terjual || 0), 0) || 0;
      const region = sale.daerah_tujuan || 'Lainnya';
      map[region] = (map[region] || 0) + qty;
    });

    return Object.entries(map).map(([name, qty]) => ({ name, qty })).sort((a, b) => b.qty - a.qty);
  }, [rawSales]);

  // 5. Dynamic Stock Availability Progress Bars
  const stockBars = useMemo(() => {
    if (products.length === 0) {
      return [];
    }

    const colors = [
      'from-sky-600 to-sky-400 border border-sky-400/30',
      'from-indigo-600 to-indigo-400 border border-indigo-400/30',
      'from-emerald-600 to-emerald-450 border border-emerald-400/30',
      'from-amber-500 to-amber-400 border border-amber-400/30',
      'from-violet-600 to-violet-400 border border-violet-400/30'
    ];

    return products.map((p, idx) => ({
      name: p.name,
      cur: p.stock || 0,
      max: Math.max(100, (p.stock || 0) * 2),
      color: colors[idx % colors.length]
    }));
  }, [products]);

  // 6. Dynamic Self Deliveries (#Pasang)
  const selfShippingRows = useMemo(() => {
    if (rawSales.length === 0) {
      return [];
    }

    return rawSales
      .filter(s => s.jenis_pengiriman === '#Pasang')
      .map(s => {
        const opex = shippingOpex.find(o => o.nama_pelanggan_terkait === s.id_transaksi);
        const cost = opex ? Number(opex.nominal_opex || 0) : 0;
        const qty = s.detail_penjualan_produk?.reduce((acc: number, item: any) => acc + (item.qty_terjual || 0), 0) || 0;
        const total = s.detail_penjualan_produk?.reduce((acc: number, item: any) => acc + (Number(item.total_revenue_produk || 0)), 0) || 0;
        return {
          name: s.nama_pelanggan,
          area: s.daerah_tujuan,
          cost,
          time: new Date(s.waktu_transaksi).toISOString().split('T')[0],
          qty,
          total
        };
      });
  }, [rawSales, shippingOpex]);

  // 7. Dynamic Expedition Deliveries (#Ekspedisi)
  const expShippingRows = useMemo(() => {
    if (rawSales.length === 0) {
      return [];
    }

    return rawSales
      .filter(s => s.jenis_pengiriman === '#Ekspedisi')
      .map(s => {
        const opex = shippingOpex.find(o => o.nama_pelanggan_terkait === s.id_transaksi);
        const cost = opex ? Number(opex.nominal_opex || 0) : 0;
        const qty = s.detail_penjualan_produk?.reduce((acc: number, item: any) => acc + (item.qty_terjual || 0), 0) || 0;
        const total = s.detail_penjualan_produk?.reduce((acc: number, item: any) => acc + (Number(item.total_revenue_produk || 0)), 0) || 0;
        return {
          name: s.nama_pelanggan,
          area: s.daerah_tujuan,
          cost,
          time: new Date(s.waktu_transaksi).toISOString().split('T')[0],
          qty,
          exp: s.nama_ekspedisi || 'Ekspedisi',
          total
        };
      });
  }, [rawSales, shippingOpex]);

  // 8. Low Stock Restock Alerts
  const restockAlerts = useMemo(() => {
    if (products.length === 0) {
      return [];
    }

    return products
      .filter(p => (p.stock || 0) < 20)
      .map(p => ({
        name: p.name,
        stock: `Sisa ${p.stock} Pcs`,
        action: p.stock < 10 ? 'Segera kulak hari ini!' : 'Jadwalkan restock minggu ini',
        isUrgent: p.stock < 10,
        date: new Date().toISOString().split('T')[0]
      }));
  }, [products]);

  const [salesChartFilter, setSalesChartFilter] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [indicator, setIndicator] = useState<'revenue' | 'unit'>('revenue');

  const dynamicSalesChartData = useMemo(() => {
    const monthlyRevenue = Array(12).fill(0);
    const monthlyUnits = Array(12).fill(0);
    const yearlyRevenue = Array(20).fill(0);
    const yearlyUnits = Array(20).fill(0);

    rawSales.forEach(s => {
      const tDate = new Date(s.waktu_transaksi);
      const revAmt = s.detail_penjualan_produk?.reduce((acc: number, item: any) => acc + Number(item.total_revenue_produk || 0), 0) || 0;
      const unitQty = s.detail_penjualan_produk?.reduce((acc: number, item: any) => acc + Number(item.qty_terjual || 0), 0) || 0;

      const revAmtJt = revAmt / 1000000; // in millions

      // Month matching (2026)
      if (tDate.getFullYear() === 2026) {
        const m = tDate.getMonth();
        if (m >= 0 && m < 12) {
          monthlyRevenue[m] += revAmtJt;
          monthlyUnits[m] += unitQty;
        }
      }

      // Year matching (2007 - 2026)
      const yr = tDate.getFullYear();
      if (yr >= 2007 && yr <= 2026) {
        yearlyRevenue[yr - 2007] += revAmtJt;
        yearlyUnits[yr - 2007] += unitQty;
      }
    });

    const roundVal = (arr: number[]) => arr.map(v => Math.round(v * 10) / 10);

    return {
      Monthly: {
        revenue: roundVal(monthlyRevenue),
        unit: monthlyUnits
      },
      Yearly: {
        revenue: roundVal(yearlyRevenue),
        unit: yearlyUnits
      }
    };
  }, [rawSales]);

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
          <span className="text-2xl md:text-3xl font-black text-sky-600 font-mono block">{totalStockUnits} Unit</span>
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
          <span className="text-xl md:text-2xl font-black text-violet-650 font-mono block">{totalShipmentsCount} Pengiriman</span>
          <span className="text-xs text-slate-500 block font-medium">Mandiri & Ekspedisi terkirim</span>
        </div>
      </div>

      {/* Dynamic Sales Chart (Revenue vs Unit) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-500 flex items-center gap-1.5">
              📈 Grafik Penjualan Keseluruhan
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Tren penjualan berdasarkan nilai transaksi (Revenue) dan kuantitas barang terjual (Unit).</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Indicator Toggle (Revenue vs Unit) */}
            <div className="flex gap-1 bg-slate-100 p-0.5 rounded-xl">
              <button
                onClick={() => setIndicator('revenue')}
                className={`px-2.5 py-1 text-[9px] font-bold rounded-lg cursor-pointer transition-all ${
                  indicator === 'revenue' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                💰 Revenue (Rp)
              </button>
              <button
                onClick={() => setIndicator('unit')}
                className={`px-2.5 py-1 text-[9px] font-bold rounded-lg cursor-pointer transition-all ${
                  indicator === 'unit' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                📦 Unit
              </button>
            </div>

            {/* Time Filter (Monthly vs Yearly) */}
            <div className="flex gap-1 bg-slate-100 p-0.5 rounded-xl">
              <button
                onClick={() => setSalesChartFilter('Monthly')}
                className={`px-2.5 py-1 text-[9px] font-bold rounded-lg cursor-pointer transition-all ${
                  salesChartFilter === 'Monthly' ? 'bg-white text-[#0284c7] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSalesChartFilter('Yearly')}
                className={`px-2.5 py-1 text-[9px] font-bold rounded-lg cursor-pointer transition-all ${
                  salesChartFilter === 'Yearly' ? 'bg-white text-[#0284c7] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <SVGLineChart
            data={dynamicSalesChartData[salesChartFilter][indicator]}
            labels={
              salesChartFilter === 'Monthly'
                ? ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']
                : Array.from({ length: 20 }, (_, i) => (2007 + i).toString())
            }
            gradientColors={indicator === 'revenue' ? ['#0284c7', '#38bdf8'] : ['#10b981', '#34d399']}
            strokeColor={indicator === 'revenue' ? '#0284c7' : '#10b981'}
            gradientId="sales-tab-overall-grad"
            valueSuffix={indicator === 'revenue' ? 'jt' : ' unit'}
          />
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
          <ShippingTypePieChart sales={rawSales} />
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
            {productSalesData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs font-semibold py-12">
                🛍️ Tidak ada data penjualan produk
              </div>
            ) : (
              productSalesData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100/70 transition-colors shadow-2xs">
                  <span className="font-bold text-slate-800 text-xs">{item.name}</span>
                  <span className="font-mono font-black text-xs text-[#0284c7]">{item.qty.toLocaleString('id-ID')} Pcs</span>
                </div>
              ))
            )}
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
            {regionSalesData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs font-semibold py-12">
                📍 Tidak ada data penjualan daerah
              </div>
            ) : (
              regionSalesData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-indigo-50/20 rounded-xl hover:bg-indigo-50/40 transition-colors border border-indigo-100/10 shadow-2xs">
                  <span className="font-bold text-slate-800 text-xs">{item.name}</span>
                  <span className="font-mono font-black text-xs text-indigo-600">{item.qty.toLocaleString('id-ID')} Pcs</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-100/40 hover:shadow-md hover:shadow-slate-250/30 transition-all duration-300 flex flex-col justify-between h-full">
          <div>
            <h3 className="text-sm uppercase font-extrabold tracking-wider text-slate-700">💰 Nilai Aset Stok per Produk</h3>
            <p className="text-xs text-slate-500">Total nilai rupiah aset stok yang tersedia.</p>
          </div>
          <StockValuePieChart products={products} />
        </div>

        <div className="lg:col-span-7 bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-100/40 hover:shadow-md hover:shadow-slate-250/30 transition-all duration-300 flex flex-col justify-between h-full">
          <div>
            <h3 className="text-sm uppercase font-extrabold tracking-wider text-slate-700">📦 Jumlah Stok Tersedia per Produk</h3>
            <p className="text-xs text-slate-500">Volume fisik unit barang ready di gudang.</p>
          </div>
          <div className="space-y-5 py-4">
            {stockBars.length === 0 ? (
              <div className="text-center text-slate-400 text-xs font-semibold py-12">
                Tidak ada produk terdaftar
              </div>
            ) : (
              stockBars.map((p, idx) => {
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
              })
            )}
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
                {selfShippingRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold text-xs bg-white">
                      Tidak ada data pengiriman mandiri
                    </td>
                  </tr>
                ) : (() => {
                  const totalCost = selfShippingRows.reduce((acc, curr) => acc + curr.cost, 0);
                  const totalQty = selfShippingRows.reduce((acc, curr) => acc + curr.qty, 0);
                  const totalAmt = selfShippingRows.reduce((acc, curr) => acc + curr.total, 0);
                  const totalShipments = selfShippingRows.length;
                  
                  return (
                    <>
                      {selfShippingRows.map((row, idx) => (
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
                {expShippingRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 font-semibold text-xs bg-white">
                      Tidak ada data pengiriman ekspedisi
                    </td>
                  </tr>
                ) : (() => {
                  const totalCost = expShippingRows.reduce((acc, curr) => acc + curr.cost, 0);
                  const totalQty = expShippingRows.reduce((acc, curr) => acc + curr.qty, 0);
                  const totalAmt = expShippingRows.reduce((acc, curr) => acc + curr.total, 0);
                  const totalShipments = expShippingRows.length;
                  
                  return (
                    <>
                      {expShippingRows.map((row, idx) => (
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
          {restockAlerts.length === 0 ? (
            <div className="col-span-4 text-center text-slate-400 text-xs font-semibold py-8 bg-white border border-slate-200/50 rounded-2xl">
              ✅ Semua stok produk dalam batas aman
            </div>
          ) : (
            restockAlerts.map((alertItem, idx) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
