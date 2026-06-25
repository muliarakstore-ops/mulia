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

  // Unified dynamic transactions read from Supabase tables
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [shippingOpex, setShippingOpex] = useState<any[]>([]);
  const [rawSales, setRawSales] = useState<any[]>([]);
  const [rawRestocks, setRawRestocks] = useState<any[]>([]);
  const [rawOpex, setRawOpex] = useState<any[]>([]);
  const [rawPermodalan, setRawPermodalan] = useState<any[]>([]);
  const [rawPrives, setRawPrives] = useState<any[]>([]);
  const [rawRepairs, setRawRepairs] = useState<any[]>([]);

  // Graph and Analytics Filters
  const [revenueFilter, setRevenueFilter] = useState<'Monthly' | 'Yearly'>('Monthly');

  // Products and Markets Tab Filters
  const [prodSalesFilter, setProdSalesFilter] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [regionSalesFilter, setRegionSalesFilter] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [shipSelfFilter, setShipSelfFilter] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [shipExpFilter, setShipExpFilter] = useState<'Monthly' | 'Yearly'>('Monthly');

  // Function to load all transactions from Supabase and merge them
  const loadTransactionsFromSupabase = async () => {
    setLoadingData(true);
    try {
      const mergedList: Transaction[] = [];

      // 1. Fetch Penjualan
      const { data: sales, error: sErr } = await supabase
        .from('transaksi_penjualan')
        .select(`
          id_transaksi,
          waktu_transaksi,
          nama_pelanggan,
          daerah_tujuan,
          jenis_pengiriman,
          nama_ekspedisi,
          detail_penjualan_produk (
            qty_terjual,
            total_revenue_produk,
            id_produk
          )
        `);
      if (sErr) throw sErr;
      if (sales) {
        sales.forEach((s: any) => {
          const totalAmt = s.detail_penjualan_produk?.reduce((acc: number, item: any) => acc + Number(item.total_revenue_produk || 0), 0) || 0;
          const totalQty = s.detail_penjualan_produk?.reduce((acc: number, item: any) => acc + Number(item.qty_terjual || 0), 0) || 0;
          mergedList.push({
            id: s.id_transaksi,
            date: new Date(s.waktu_transaksi).toISOString().split('T')[0],
            desc: `Penjualan Ke Pelanggan: ${s.nama_pelanggan} (${s.daerah_tujuan})`,
            type: 'penjualan',
            amount: totalAmt,
            qty: totalQty
          });
        });
      }

      // 2. Fetch Permodalan
      const { data: capital, error: capErr } = await supabase
        .from('transaksi_permodalan')
        .select('id_modal, waktu_input, jenis_permodalan, nominal_tunai, nama_aset, nilai_buku_aset, tarif_depresiasi');
      if (capErr) throw capErr;
      if (capital) {
        capital.forEach((c: any) => {
          const isTunai = c.jenis_permodalan === '#Injeksi Modal';
          mergedList.push({
            id: c.id_modal,
            date: c.waktu_input,
            desc: isTunai ? `Injeksi Modal Baru` : `Penempatan Aset Modal: ${c.nama_aset}`,
            type: 'permodalan',
            amount: isTunai ? Number(c.nominal_tunai || 0) : Number(c.nilai_buku_aset || 0)
          });
        });
      }

      // 3. Fetch Restock (Kulakan)
      const { data: restocks, error: rErr } = await supabase
        .from('transaksi_kulakan')
        .select(`
          id_kulakan,
          waktu_kulakan,
          detail_kulakan_produk (
            id_produk,
            qty_kulakan,
            harga_kulak_satuan,
            total_biaya_kulakan
          )
        `);
      if (rErr) throw rErr;
      if (restocks) {
        setRawRestocks(restocks || []);
        restocks.forEach((r: any) => {
          const totalAmt = r.detail_kulakan_produk?.reduce((acc: number, item: any) => acc + Number(item.total_biaya_kulakan || 0), 0) || 0;
          const totalQty = r.detail_kulakan_produk?.reduce((acc: number, item: any) => acc + Number(item.qty_kulakan || 0), 0) || 0;
          mergedList.push({
            id: r.id_kulakan,
            date: r.waktu_kulakan,
            desc: `Restock Kulakan Gudang (Total ${totalQty} unit)`,
            type: 'pengeluaran',
            amount: totalAmt,
            qty: totalQty
          });
        });
      }

      // 4. Fetch OPEX
      const { data: opex, error: opexErr } = await supabase
        .from('transaksi_opex')
        .select('id_opex, waktu_opex, kebutuhan_opex, nominal_opex, kategori_operasional');
      if (opexErr) throw opexErr;
      if (opex) {
        setRawOpex(opex || []);
        opex.forEach((o: any) => {
          mergedList.push({
            id: o.id_opex,
            date: o.waktu_opex,
            desc: `Beban OPEX: ${o.kebutuhan_opex}`,
            type: 'pengeluaran',
            amount: Number(o.nominal_opex || 0)
          });
        });
      }

      // 5. Fetch Perawatan Aset
      const { data: repairs, error: repErr } = await supabase
        .from('transaksi_perawatan_aset')
        .select('id_perawatan, waktu_perawatan, jenis_perawatan, nama_pengeluaran, nominal_biaya');
      if (repErr) throw repErr;
      if (repairs) {
        repairs.forEach((r: any) => {
          const isCapex = r.jenis_perawatan === '#Peremajaan';
          mergedList.push({
            id: r.id_perawatan,
            date: r.waktu_perawatan,
            desc: `${isCapex ? 'Peremajaan' : 'Perbaikan'} Aset: ${r.nama_pengeluaran}`,
            type: isCapex ? 'capex' : 'pengeluaran',
            amount: Number(r.nominal_biaya || 0)
          });
        });
      }

      // 6. Fetch Prive
      const { data: prives, error: priveErr } = await supabase
        .from('transaksi_prive')
        .select('id_prive, waktu_prive, nama_owner, keterangan_prive, nominal_prive');
      if (priveErr) throw priveErr;
      if (prives) {
        prives.forEach((p: any) => {
          mergedList.push({
            id: p.id_prive,
            date: p.waktu_prive,
            desc: `Prive Penarikan Owner: ${p.nama_owner} (${p.keterangan_prive || 'Penarikan Pribadi'})`,
            type: 'prive',
            amount: Number(p.nominal_prive || 0)
          });
        });
      }

      // Fetch Products
      const { data: prodData, error: prodErr } = await supabase
        .from('products')
        .select('id, name, stock, min_price, max_price');
      if (prodErr) throw prodErr;
      setProducts(prodData || []);

      // Fetch Shipping OPEX
      const { data: opData, error: opErr } = await supabase
        .from('transaksi_opex')
        .select('id_opex, waktu_opex, kebutuhan_opex, nominal_opex, nama_pelanggan_terkait')
        .eq('kategori_operasional', '#Pengiriman');
      if (opErr) throw opErr;
      setShippingOpex(opData || []);

      // Save Raw Sales
      setRawSales(sales || []);
      setRawPermodalan(capital || []);
      setRawPrives(prives || []);
      setRawRepairs(repairs || []);

      // Sort by date descending
      mergedList.sort((a, b) => b.date.localeCompare(a.date));
      setTransactions(mergedList);
    } catch (e) {
      console.error('Failed to load transactions:', e);
    } finally {
      setLoadingData(false);
    }
  };

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
      
      // Load initial transactions once authenticated
      loadTransactionsFromSupabase();
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

  // 1.5. Calculate product HPP dynamically
  const productHppMap = useMemo(() => {
    const map: Record<string, number> = {};

    // First group Bongkar opex by date
    const bongkarByDate: Record<string, number> = {};
    rawOpex
      .filter(o => o.kategori_operasional === '#Bongkar')
      .forEach(o => {
        const dateStr = o.waktu_opex;
        bongkarByDate[dateStr] = (bongkarByDate[dateStr] || 0) + Number(o.nominal_opex || 0);
      });

    // Group restock quantities by date
    const restockQtyByDate: Record<string, number> = {};
    rawRestocks.forEach(r => {
      const dateStr = r.waktu_kulakan;
      const totalQty = r.detail_kulakan_produk?.reduce((acc: number, d: any) => acc + Number(d.qty_kulakan || 0), 0) || 0;
      restockQtyByDate[dateStr] = (restockQtyByDate[dateStr] || 0) + totalQty;
    });

    // Calculate unloading cost per unit per date
    const unloadingCostPerUnitByDate: Record<string, number> = {};
    Object.keys(restockQtyByDate).forEach(dateStr => {
      const qty = restockQtyByDate[dateStr];
      const bongkarCost = bongkarByDate[dateStr] || 0;
      unloadingCostPerUnitByDate[dateStr] = qty > 0 ? (bongkarCost / qty) : 0;
    });

    // Group product restock details to compute weighted average HPP
    const prodDetails: Record<string, { totalVal: number; totalQty: number }> = {};
    rawRestocks.forEach(r => {
      const dateStr = r.waktu_kulakan;
      const unloadingCost = unloadingCostPerUnitByDate[dateStr] || 0;
      r.detail_kulakan_produk?.forEach((d: any) => {
        const prodId = d.id_produk;
        const qty = Number(d.qty_kulakan || 0);
        const unitCost = Number(d.harga_kulak_satuan || 0) + unloadingCost;
        if (!prodDetails[prodId]) {
          prodDetails[prodId] = { totalVal: 0, totalQty: 0 };
        }
        prodDetails[prodId].totalVal += qty * unitCost;
        prodDetails[prodId].totalQty += qty;
      });
    });

    // Calculate HPP for each product in catalog, fallback to min_price * 0.7 if no restocks
    products.forEach(p => {
      const details = prodDetails[p.id];
      if (details && details.totalQty > 0) {
        map[p.id] = details.totalVal / details.totalQty;
      } else {
        map[p.id] = Number(p.min_price || 0) * 0.7;
      }
    });

    return map;
  }, [products, rawRestocks, rawOpex]);

  const productsWithHpp = useMemo(() => {
    return products.map(p => {
      const hpp = productHppMap[p.id] || Number(p.min_price || 0) * 0.7;
      return {
        ...p,
        hpp,
        stockValue: (p.stock || 0) * hpp
      };
    });
  }, [products, productHppMap]);

  // 2. Stock Value (Steel stocks + finished racks ready)
  const stockValue = useMemo(() => {
    if (products.length === 0) return 185200000; // fallback to mock
    return productsWithHpp.reduce((acc, p) => acc + (Number(p.stock || 0) * (p.hpp || 0)), 0);
  }, [products, productsWithHpp]);

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
      .filter(t => t.type === 'pengeluaran' && !t.desc.toLowerCase().includes('operasional') && !t.desc.toLowerCase().includes('bensin') && !t.desc.toLowerCase().includes('opex'))
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [transactions]);

  const opexTotal = useMemo(() => {
    return transactions
      .filter(t => t.type === 'pengeluaran' && (t.desc.toLowerCase().includes('operasional') || t.desc.toLowerCase().includes('bensin') || t.desc.toLowerCase().includes('opex')))
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [transactions]);

  const netProfit = useMemo(() => {
    return totalPenjualan - totalPengeluaran;
  }, [totalPenjualan, totalPengeluaran]);

  if (checkingAuth || loadingData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 font-sans space-y-3">
        <div className="animate-spin text-2xl">⏳</div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Memverifikasi Hak Akses & Sinkronisasi DB...</p>
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
              if (filter === 'Yearly') {
                return Array.from({ length: 20 }, (_, i) => (2007 + i).toString());
              }
              return ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
            }}
            products={productsWithHpp}
          />
        )}

        {/* LEDGER SECTION */}
        {activeMenu === 'ledger' && (
          <LedgerTab
            cashOnHand={cashOnHand}
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
            products={productsWithHpp}
            rawSales={rawSales}
            shippingOpex={shippingOpex}
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
            rawPermodalan={rawPermodalan}
            rawPrives={rawPrives}
            rawRepairs={rawRepairs}
            rawOpex={rawOpex}
            cashOnHand={cashOnHand}
            rawSales={rawSales}
            rawRestocks={rawRestocks}
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
            rawPermodalan={rawPermodalan}
            rawPrives={rawPrives}
            rawRepairs={rawRepairs}
            rawOpex={rawOpex}
            rawSales={rawSales}
            rawRestocks={rawRestocks}
            transactions={transactions}
          />
        )}

      </main>
    </div>
  );
}
