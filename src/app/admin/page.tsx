'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { getStoredCms, saveStoredCms, getStoredProducts, saveStoredProducts, getStoredServices, saveStoredServices, CmsConfig, DEFAULT_CMS } from '../../utils/storage';
import { PRODUCTS, IncludedService, INCLUDED_SERVICES } from '../../constants/mockData';
import { 
  loadCmsConfig, 
  saveCmsConfig, 
  getSupabaseProducts, 
  saveSupabaseProduct, 
  deleteSupabaseProduct, 
  getSupabaseServices, 
  saveSupabaseService, 
  deleteSupabaseService, 
  getAnalyticsStats, 
  getLeadsData, 
  updateLeadStatus, 
  getSupabaseTransactions, 
  saveSupabaseTransaction 
} from '../../utils/supabaseData';

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState<'overview' | 'cms' | 'profile' | 'catalog' | 'services' | 'creative_overview' | 'creative_plan' | 'creative_eval' | 'biz_financials' | 'biz_ledger' | 'biz_analysis' | 'settings'>('overview');
  const [cmsConfig, setCmsConfig] = useState<CmsConfig>(DEFAULT_CMS);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<IncludedService[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Analytics Stats
  const [visits, setVisits] = useState<number>(1248);
  const [inquiries, setInquiries] = useState<number>(187);
  const [inquiryLogs, setInquiryLogs] = useState<{ timestamp: string; type: string }[]>([]);

  // CRUD Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  
  // Product Form Fields
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<'sofa' | 'table' | 'lighting' | 'decor'>('sofa');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodSpecs, setProdSpecs] = useState(''); // newline-separated

  // CRUD Service Modal State
  const [isSrvModalOpen, setIsSrvModalOpen] = useState(false);
  const [srvModalMode, setSrvModalMode] = useState<'add' | 'edit'>('add');
  const [editingSrvIdx, setEditingSrvIdx] = useState<number | null>(null);

  // Service Form Fields
  const [srvTitle, setSrvTitle] = useState('');
  const [srvDescription, setSrvDescription] = useState('');

  // Creative Team State
  const [creativeTasks, setCreativeTasks] = useState([
    { id: 1, title: 'Desain Banner Promo Ramadan', category: 'Instagram Feed', status: 'Review', designer: 'Andi', deadline: '2026-06-10' },
    { id: 2, title: 'Video Tiktok Review Rak Single', category: 'TikTok Video', status: 'In Progress', designer: 'Budi', deadline: '2026-06-08' },
    { id: 3, title: 'Desain Brosur Brosur Gondola V2', category: 'Brosur Cetak', status: 'Approved', designer: 'Citra', deadline: '2026-06-04' },
    { id: 4, title: 'Copywriting Landing Page Mulia Rak', category: 'Copywriting', status: 'Published', designer: 'Dina', deadline: '2026-06-01' }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Instagram Feed');
  const [newTaskDesigner, setNewTaskDesigner] = useState('Andi');

  // Business Dashboard Financial State
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2026-06-05', desc: 'Penjualan Rak Gondola Toko Kelontong Depok', type: 'penjualan', amount: 15400000 },
    { id: 2, date: '2026-06-04', desc: 'Biaya Solar Mobil Kargo & Pengiriman', type: 'pengeluaran', amount: 850000 },
    { id: 3, date: '2026-06-03', desc: 'Penambahan Modal Owner (Permodalan)', type: 'permodalan', amount: 50000000 },
    { id: 4, date: '2026-06-02', desc: 'Pembelian Bahan Baku Plat Baja Pabrik', type: 'pengeluaran', amount: 12500000 },
    { id: 5, date: '2026-06-01', desc: 'Penjualan Rak Minimarket Alfamart Bekasi', type: 'penjualan', amount: 34200000 }
  ]);
  const [txDesc, setTxDesc] = useState('');
  const [txType, setTxType] = useState<'penjualan' | 'pengeluaran' | 'permodalan'>('penjualan');
  const [txAmount, setTxAmount] = useState('');

  // Success message state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [leads, setLeads] = useState<any[]>([]);
  const [shippingChecks, setShippingChecks] = useState<number>(0);
  const [screentime, setScreentime] = useState<number>(0);
  const [leadsProduct, setLeadsProduct] = useState<any[]>([]);
  const [leadsService, setLeadsService] = useState<any[]>([]);
  const [visitFilter, setVisitFilter] = useState<'week' | 'month' | 'year'>('month');
  const [leadFilter, setLeadFilter] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    const initData = async () => {
      try {
        const [supabaseCms, supabaseProds, supabaseServices, stats, leadsData, txs] = await Promise.all([
          loadCmsConfig(),
          getSupabaseProducts(),
          getSupabaseServices(),
          getAnalyticsStats(),
          getLeadsData(),
          getSupabaseTransactions()
        ]);

        if (supabaseCms) setCmsConfig(supabaseCms);
        if (supabaseProds && supabaseProds.length > 0) setProducts(supabaseProds);
        if (supabaseServices && supabaseServices.length > 0) setServices(supabaseServices);
        
        if (stats) {
          setVisits(stats.visits + 1248);
          setScreentime(stats.screentime || 320); // Baseline mockup in seconds or minutes
          setShippingChecks(stats.shippingChecks + 412); // Baseline + live count
        }

        if (leadsData && leadsData.length > 0) {
          setLeads(leadsData);
          setInquiries(leadsData.length);
          setLeadsProduct(leadsData.filter((l: any) => l.type === 'product'));
          setLeadsService(leadsData.filter((l: any) => l.type === 'service'));
          setInquiryLogs(leadsData.map((l: any) => ({
            timestamp: l.created_at,
            type: `Leads ${l.type === 'product' ? 'Produk' : 'Layanan'}: ${l.customer_name} (${l.customer_phone})`
          })));
        } else {
          setInquiries(187);
          const defaultLogs = [
            { timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'Produk: Rak Gondola Single (Satu Sisi)' },
            { timestamp: new Date(Date.now() - 7200000).toISOString(), type: 'Cek Ongkir: DKI Jakarta' },
            { timestamp: new Date(Date.now() - 14400000).toISOString(), type: 'Konsultasi Umum WhatsApp' }
          ];
          setInquiryLogs(defaultLogs);
        }

        if (txs && txs.length > 0) {
          setTransactions(txs.map((t: any) => ({
            id: t.id,
            date: t.date,
            desc: t.description || t.category,
            type: t.type === 'income' ? (t.category === 'Suntikan Modal' ? 'permodalan' : 'penjualan') : 'pengeluaran',
            amount: Number(t.amount)
          })));
        }
      } catch (e) {
        console.error('Error fetching Supabase data, falling back to local defaults:', e);
        // Fallback
        setCmsConfig(getStoredCms());
        setProducts(getStoredProducts());
        setServices(getStoredServices());
      }
      setIsClient(true);
    };

    initData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Handle CMS Save
  const handleSaveCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await saveCmsConfig(cmsConfig);
    if (success) {
      showToast('Konten CMS Berhasil Disimpan di Supabase!');
    } else {
      saveStoredCms(cmsConfig);
      showToast('Konten CMS Berhasil Disimpan (Local Fallback)!');
    }
  };

  // Open Add Product Modal
  const openAddModal = () => {
    setModalMode('add');
    setEditingProductId(null);
    setProdName('');
    setProdCategory('sofa');
    setProdPrice('');
    setProdImage('');
    setProdDescription('');
    setProdSpecs('');
    setIsModalOpen(true);
  };

  // Open Edit Product Modal
  const openEditModal = (product: Product) => {
    setModalMode('edit');
    setEditingProductId(product.id);
    setProdName(product.name);
    setProdCategory(product.category);
    // Parse formatting back to integer for form or keep
    const cleanPriceStr = product.price.replace(/[^0-9]/g, '');
    setProdPrice(cleanPriceStr || '0');
    setProdImage(product.image);
    setProdDescription(product.description);
    setProdSpecs(product.specs ? product.specs.join('\n') : '');
    setIsModalOpen(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodDescription) {
      alert('Nama, harga, dan deskripsi produk wajib diisi.');
      return;
    }

    const specArray = prodSpecs
      .split('\n')
      .map(s => s.trim())
      .filter(s => s !== '');

    const priceNum = parseFloat(prodPrice) || 0;

    const success = await saveSupabaseProduct({
      id: editingProductId || undefined,
      name: prodName,
      category: prodCategory,
      minPrice: priceNum,
      maxPrice: priceNum,
      description: prodDescription,
      imageUrl: prodImage || 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=400&q=80',
      height: 180,
      length: 90,
      width: 45,
      additionalInfo: specArray.join('\n'),
      stock: 10 // default initial stock
    });

    if (success) {
      const updatedProds = await getSupabaseProducts();
      setProducts(updatedProds);
      showToast(modalMode === 'add' ? 'Produk Baru Berhasil Ditambahkan!' : 'Detail Produk Berhasil Diperbarui!');
    } else {
      // Local fallback
      let updatedProducts: Product[] = [];
      if (modalMode === 'add') {
        const newProduct: Product = {
          id: `custom-prod-${Date.now()}`,
          name: prodName,
          category: prodCategory,
          price: `Rp ${priceNum.toLocaleString('id-ID')}`,
          image: prodImage || 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=400&q=80',
          description: prodDescription,
          specs: specArray
        };
        updatedProducts = [newProduct, ...products];
      } else {
        updatedProducts = products.map(p => {
          if (p.id === editingProductId) {
            return {
              ...p,
              name: prodName,
              category: prodCategory,
              price: `Rp ${priceNum.toLocaleString('id-ID')}`,
              image: prodImage,
              description: prodDescription,
              specs: specArray
            };
          }
          return p;
        });
      }
      setProducts(updatedProducts);
      saveStoredProducts(updatedProducts);
      showToast('Produk Berhasil Disimpan (Local Fallback)!');
    }

    setIsModalOpen(false);
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus produk "${name}" dari katalog?`)) {
      const success = await deleteSupabaseProduct(id);
      if (success) {
        const updated = await getSupabaseProducts();
        setProducts(updated);
        showToast('Produk Berhasil Dihapus!');
      } else {
        const updated = products.filter(p => p.id !== id);
        setProducts(updated);
        saveStoredProducts(updated);
        showToast('Produk Berhasil Dihapus (Local Fallback)!');
      }
    }
  };

  // Open Add Service Modal
  const openAddSrvModal = () => {
    setSrvModalMode('add');
    setEditingSrvIdx(null);
    setSrvTitle('');
    setSrvDescription('');
    setIsSrvModalOpen(true);
  };

  // Open Edit Service Modal
  const openEditSrvModal = (service: IncludedService, index: number) => {
    setSrvModalMode('edit');
    setEditingSrvIdx(index);
    setSrvTitle(service.title);
    setSrvDescription(service.description);
    setIsSrvModalOpen(true);
  };

  // Save Service
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvTitle || !srvDescription) {
      alert('Judul dan penjelasan layanan wajib diisi.');
      return;
    }

    const serviceData = {
      id: services[editingSrvIdx!]?.id || undefined,
      title: srvTitle,
      description: srvDescription
    };

    const success = await saveSupabaseService(serviceData);

    if (success) {
      const updatedServices = await getSupabaseServices();
      setServices(updatedServices);
      showToast(srvModalMode === 'add' ? 'Layanan Baru Berhasil Ditambahkan!' : 'Layanan Berhasil Diperbarui!');
    } else {
      let updatedServices: IncludedService[] = [];
      if (srvModalMode === 'add') {
        const newService: IncludedService = {
          title: srvTitle,
          description: srvDescription
        };
        updatedServices = [...services, newService];
      } else {
        updatedServices = services.map((s, idx) => {
          if (idx === editingSrvIdx) {
            return {
              title: srvTitle,
              description: srvDescription
            };
          }
          return s;
        });
      }
      setServices(updatedServices);
      saveStoredServices(updatedServices);
      showToast('Layanan Berhasil Disimpan (Local Fallback)!');
    }

    setIsSrvModalOpen(false);
  };

  // Delete Service
  const handleDeleteService = async (index: number, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus layanan "${title}"?`)) {
      const id = services[index]?.id;
      const success = id ? await deleteSupabaseService(id) : false;

      if (success) {
        const updated = await getSupabaseServices();
        setServices(updated);
        showToast('Layanan Berhasil Dihapus!');
      } else {
        const updated = services.filter((_, idx) => idx !== index);
        setServices(updated);
        saveStoredServices(updated);
        showToast('Layanan Berhasil Dihapus (Local Fallback)!');
      }
    }
  };

  // Add Creative Task
  const handleAddCreativeTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      category: newTaskCategory,
      status: 'In Progress',
      designer: newTaskDesigner,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 5 days from now
    };
    setCreativeTasks([...creativeTasks, newTask]);
    setNewTaskTitle('');
    showToast('Tugas Kreatif Baru Berhasil Ditambahkan!');
  };

  // Change Task Status
  const handleUpdateTaskStatus = (id: number, nextStatus: string) => {
    const updated = creativeTasks.map(t => {
      if (t.id === id) {
        return { ...t, status: nextStatus };
      }
      return t;
    });
    setCreativeTasks(updated);
    showToast(`Status tugas diubah ke ${nextStatus}!`);
  };

  // Add Transaction
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(txAmount.replace(/[^0-9.-]+/g, ''));
    if (!txDesc || isNaN(amountNum)) {
      alert('Deskripsi dan jumlah transaksi wajib diisi dengan benar.');
      return;
    }
    const newTx = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      desc: txDesc,
      type: txType,
      amount: amountNum
    };
    setTransactions([newTx, ...transactions]);
    setTxDesc('');
    setTxAmount('');
    showToast('Transaksi Finansial Berhasil Dicatat!');
  };

  // Reset Data to default
  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin mereset seluruh database CMS, Produk & Layanan ke pengaturan default pabrik? Seluruh perubahan kustom Anda akan terhapus.')) {
      localStorage.removeItem('mrs_cms_config');
      localStorage.removeItem('mrs_products');
      localStorage.removeItem('mrs_services');
      localStorage.removeItem('mrs_inquiries');
      localStorage.removeItem('mrs_inquiry_logs');
      localStorage.removeItem('mrs_visits');
      
      setCmsConfig(DEFAULT_CMS);
      setProducts(PRODUCTS);
      setServices(INCLUDED_SERVICES);
      setVisits(1248);
      setInquiries(187);
      setInquiryLogs([
        { timestamp: new Date().toISOString(), type: 'Sistem Direset ke Default' }
      ]);
      showToast('Database Berhasil Direset ke Default!');
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-sans">
        Memuat Dashboard Administrator...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col md:flex-row">

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 animate-bounce text-xs font-bold border border-white/10">
          <span>🔔</span> {toastMessage}
        </div>
      )}

      {/* Sidebar Navigation - Styled after eProduct Solid Blue Theme */}
      <aside className="w-full md:w-64 bg-[#0284c7] text-white flex flex-col justify-between py-6 flex-shrink-0">
        <div>
          {/* Logo Brand Header */}
          <div className="pl-6 pr-6 pb-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white text-[#0284c7] flex items-center justify-center font-black text-xl font-serif">
              M
            </div>
            <div>
              <span className="text-lg font-extrabold text-white tracking-wider font-serif block leading-none">{cmsConfig.brandName}</span>
              <span className="text-[9px] uppercase font-bold text-sky-200 block mt-1">Dashboard Admin</span>
            </div>
          </div>

          {/* Menus List */}
          <nav className="px-4 py-6 space-y-6">
            
            {/* Category: Utama */}
            <div className="space-y-1.5">
              <div className="text-[9px] font-extrabold text-white/40 uppercase tracking-widest pl-3 pb-1">Menu Utama</div>
              
              <button
                onClick={() => setActiveMenu('overview')}
                className={`sidebar-btn w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer rounded-2xl ${
                  activeMenu === 'overview'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <svg className="w-4.5 h-4.5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                </svg>
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveMenu('cms')}
                className={`sidebar-btn w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer rounded-2xl ${
                  activeMenu === 'cms'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Landing Page</span>
              </button>

              <button
                onClick={() => setActiveMenu('catalog')}
                className={`sidebar-btn w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer rounded-2xl ${
                  activeMenu === 'catalog'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Products</span>
              </button>

              <button
                onClick={() => setActiveMenu('services')}
                className={`sidebar-btn w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer rounded-2xl ${
                  activeMenu === 'services'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Services</span>
              </button>

              <button
                onClick={() => setActiveMenu('profile')}
                className={`sidebar-btn w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer rounded-2xl ${
                  activeMenu === 'profile'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile</span>
              </button>
            </div>

            {/* Category: Tim Kreatif */}
            <div className="space-y-1.5">
              <div className="text-[9px] font-extrabold text-white/40 uppercase tracking-widest pl-3 pb-1 pt-1">Tim Kreatif</div>
              
              <button
                onClick={() => setActiveMenu('creative_overview')}
                className={`sidebar-btn w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer rounded-2xl ${
                  activeMenu === 'creative_overview'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <span>Campaigns</span>
              </button>

              <button
                onClick={() => setActiveMenu('creative_plan')}
                className={`sidebar-btn w-full flex items-center gap-3 pl-4 pr-3 py-2.5 text-xs font-bold transition-all cursor-pointer rounded-l-3xl ${
                  activeMenu === 'creative_plan'
                    ? 'active-cutout'
                    : 'text-white/70 hover:bg-white/5 hover:text-white mr-4 rounded-3xl'
                }`}
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span>Content Planner</span>
              </button>

              <button
                onClick={() => setActiveMenu('creative_eval')}
                className={`sidebar-btn w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer rounded-2xl ${
                  activeMenu === 'creative_eval'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Performance</span>
              </button>
            </div>

            {/* Category: Dashboard Bisnis */}
            <div className="space-y-1.5">
              <div className="text-[9px] font-extrabold text-white/40 uppercase tracking-widest pl-3 pb-1 pt-1">Dashboard Bisnis</div>
              
              <button
                onClick={() => setActiveMenu('biz_financials')}
                className={`sidebar-btn w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer rounded-2xl ${
                  activeMenu === 'biz_financials'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Financials</span>
              </button>

              <button
                onClick={() => setActiveMenu('biz_ledger')}
                className={`sidebar-btn w-full flex items-center gap-3 px-4 py-3 text-xs font-bold transition-all cursor-pointer rounded-2xl ${
                  activeMenu === 'biz_ledger'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Cash Ledger</span>
              </button>

              <button
                onClick={() => setActiveMenu('biz_analysis')}
                className={`sidebar-btn w-full flex items-center gap-3 px-4 py-3 text-xs font-bold transition-all cursor-pointer rounded-2xl ${
                  activeMenu === 'biz_analysis'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>ROI Projection</span>
              </button>
            </div>

            {/* Category: Pengaturan */}
            <div className="space-y-1.5">
              <div className="text-[9px] font-extrabold text-white/40 uppercase tracking-widest pl-3 pb-1 pt-1">Sistem</div>
              <button
                onClick={() => setActiveMenu('settings')}
                className={`sidebar-btn w-full flex items-center gap-3 px-4 py-3 text-xs font-bold transition-all cursor-pointer rounded-2xl ${
                  activeMenu === 'settings'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Settings</span>
              </button>
            </div>

          </nav>

        </div>

        {/* Sidebar Footer Link */}
        <div className="pl-4 pr-4 border-t border-white/10 pt-4">
          <a
            href="/"
            className="w-full bg-white/10 text-center text-xs text-white hover:bg-white/20 py-3 rounded-2xl block font-bold transition-colors cursor-pointer uppercase tracking-wider mr-4"
          >
            Lihat Live Website 🔗
          </a>
        </div>
      </aside>

      {/* Main Content Viewport - Flush bg-white */}
      <main className="flex-1 overflow-y-auto max-h-screen flex flex-col bg-white z-0">
        
        {/* TOP HEADER BAR - Styled exactly like Jobie Header */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="text-slate-500 hover:text-slate-800 md:hidden cursor-pointer">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Dashboard</h2>
          </div>

          {/* Search Bar - Center */}
          <div className="hidden md:block relative max-w-sm w-full">
            <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
              🔍
            </span>
            <input 
              type="text" 
              placeholder="Search here..." 
              className="w-full bg-[#f3f4f6] text-slate-800 rounded-full pl-11 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0284c7]/20 border-0"
            />
          </div>

          {/* User profile & notification status */}
          <div className="flex items-center gap-5">
            {/* Messages */}
            <button className="relative p-2 bg-[#f3f4f6] rounded-full text-slate-600 hover:bg-slate-200 cursor-pointer transition-colors">
              💬
              <span className="absolute -top-1.5 -right-1.5 bg-[#0284c7] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                11
              </span>
            </button>
            {/* Notifications */}
            <button className="relative p-2 bg-[#f3f4f6] rounded-full text-slate-600 hover:bg-slate-200 cursor-pointer transition-colors">
              🔔
              <span className="absolute -top-1.5 -right-1.5 bg-[#0ea5e9] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                17
              </span>
            </button>

            {/* Profile bubble */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-900 block leading-tight">Mulia Owner</span>
                <span className="text-[10px] text-slate-400 font-bold">Super Admin</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0284c7] to-sky-400 text-white flex items-center justify-center font-bold text-xs border border-white">
                MO
              </div>
            </div>
          </div>
        </header>

        {/* Content Section Area */}
        <div className="p-6 md:p-8 flex-1 space-y-8">
        
        {/* SECTION 1: OVERVIEW */}
        {activeMenu === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* KPI Metric cards - Gradient colored blocks */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 1. Total Kunjungan */}
              <div className="bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] text-white p-6 rounded-3xl shadow-xl shadow-sky-650/10 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider block">Total Kunjungan</span>
                  <span className="text-3xl font-black block">{visits}</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full inline-block font-semibold">Trafik Aktif</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl">
                  👥
                </div>
              </div>

              {/* 2. Total Percakapan/Leads (Main Card) */}
              <div className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white p-6 rounded-3xl shadow-xl shadow-blue-650/10 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider block">Total Leads / Chat</span>
                  <span className="text-3xl font-black block">{inquiries}</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full inline-block font-semibold">{leadsProduct.length} Produk | {leadsService.length} Layanan</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl">
                  💬
                </div>
              </div>

              {/* 3. Total Cek Ongkir */}
              <div className="bg-gradient-to-br from-[#06b6d4] to-[#0891b2] text-white p-6 rounded-3xl shadow-xl shadow-cyan-650/10 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider block">Total Cek Ongkir</span>
                  <span className="text-3xl font-black block">{shippingChecks}</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full inline-block font-semibold">Kalkulator Logistik</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl">
                  🚚
                </div>
              </div>

              {/* 4. Screentime User */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-750 text-white p-6 rounded-3xl shadow-xl shadow-indigo-650/10 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider block">Screentime User</span>
                  <span className="text-3xl font-black block">{(screentime / 60).toFixed(1)} Mnt</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full inline-block font-semibold">Rata-rata Durasi Sesi</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl">
                  ⏱️
                </div>
              </div>
            </div>

            {/* Sub Leads Tables (a. Leads Produk & b. Leads Layanan) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* a. Leads Produk Table */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span>📦</span> Leads Produk
                  </h3>
                  <span className="bg-sky-50 text-primary-blue text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">
                    {leadsProduct.length} Leads
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100">
                        <th className="p-3">Nama</th>
                        <th className="p-3">Kontak WA</th>
                        <th className="p-3">Detail Percakapan / Deskripsi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {leadsProduct.slice(0, 5).map((l, index) => (
                        <tr key={l.id || index} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-900">{l.customer_name}</td>
                          <td className="p-3 text-sky-600 font-mono">{l.customer_phone}</td>
                          <td className="p-3 truncate max-w-[200px] text-slate-500">{l.message || 'N/A'}</td>
                        </tr>
                      ))}
                      {leadsProduct.length === 0 && (
                        <tr>
                          <td colSpan={3} className="p-6 text-center text-slate-400 italic">Belum ada leads produk masuk.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* b. Leads Layanan Table */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span>🛠️</span> Leads Layanan
                  </h3>
                  <span className="bg-indigo-50 text-indigo-600 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">
                    {leadsService.length} Leads
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100">
                        <th className="p-3">Nama</th>
                        <th className="p-3">Kontak WA</th>
                        <th className="p-3">Detail Percakapan / Deskripsi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {leadsService.slice(0, 5).map((l, index) => (
                        <tr key={l.id || index} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-900">{l.customer_name}</td>
                          <td className="p-3 text-indigo-650 font-mono">{l.customer_phone}</td>
                          <td className="p-3 truncate max-w-[200px] text-slate-500">{l.message || 'N/A'}</td>
                        </tr>
                      ))}
                      {leadsService.length === 0 && (
                        <tr>
                          <td colSpan={3} className="p-6 text-center text-slate-400 italic">Belum ada leads layanan masuk.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Split layout: 2 filterable charts (Kunjungan & Leads) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Chart 1: Grafik Kunjungan per Waktu */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Grafik Kunjungan</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Statistik jumlah kunjungan halaman depan website</p>
                  </div>
                  <div className="flex bg-[#f3f4f6] rounded-xl p-1 text-[9px] font-bold text-slate-500 self-start sm:self-auto">
                    {(['week', 'month', 'year'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setVisitFilter(t)}
                        className={`px-3 py-1.5 rounded-lg uppercase tracking-wider cursor-pointer transition-all ${
                          visitFilter === t ? 'bg-[#0284c7] text-white shadow-sm' : 'hover:text-slate-800'
                        }`}
                      >
                        {t === 'week' ? 'Per Minggu' : t === 'month' ? 'Per Bulan' : 'Per Tahun'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative pt-4">
                  <svg className="w-full h-48" viewBox="0 0 500 200" fill="none">
                    <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                    <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                    <line x1="0" y1="150" x2="500" y2="150" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />

                    {visitFilter === 'week' ? (
                      <path d="M 20 160 C 100 150, 180 60, 260 90 C 340 120, 420 50, 480 40" stroke="#0284c7" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                    ) : visitFilter === 'month' ? (
                      <path d="M 20 120 C 120 140, 220 50, 320 90 C 420 30, 460 70, 480 80" stroke="#0284c7" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                    ) : (
                      <path d="M 20 150 C 120 110, 220 140, 320 70 C 420 80, 460 30, 480 20" stroke="#0284c7" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                    )}
                    <circle cx="480" cy={visitFilter === 'week' ? 40 : visitFilter === 'month' ? 80 : 20} r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                  </svg>
                  <div className="text-center text-[10px] text-slate-400 font-bold mt-2">
                    Trafik Kunjungan (Berdasarkan Filter Terpilih)
                  </div>
                </div>
              </div>

              {/* Chart 2: Grafik Leads Keseluruhan per Waktu */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Grafik Leads Keseluruhan</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Statistik konversi leads produk & layanan ritel</p>
                  </div>
                  <div className="flex bg-[#f3f4f6] rounded-xl p-1 text-[9px] font-bold text-slate-500 self-start sm:self-auto">
                    {(['week', 'month', 'year'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setLeadFilter(t)}
                        className={`px-3 py-1.5 rounded-lg uppercase tracking-wider cursor-pointer transition-all ${
                          leadFilter === t ? 'bg-[#2563eb] text-white shadow-sm' : 'hover:text-slate-800'
                        }`}
                      >
                        {t === 'week' ? 'Per Minggu' : t === 'month' ? 'Per Bulan' : 'Per Tahun'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative pt-4">
                  <svg className="w-full h-48" viewBox="0 0 500 200" fill="none">
                    <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                    <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                    <line x1="0" y1="150" x2="500" y2="150" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />

                    {leadFilter === 'week' ? (
                      <path d="M 20 180 C 100 170, 180 130, 260 150 C 340 160, 420 110, 480 100" stroke="#2563eb" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                    ) : leadFilter === 'month' ? (
                      <path d="M 20 160 C 120 140, 220 110, 320 130 C 420 80, 460 90, 480 95" stroke="#2563eb" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                    ) : (
                      <path d="M 20 170 C 120 150, 220 130, 320 110 C 420 90, 460 60, 480 50" stroke="#2563eb" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                    )}
                    <circle cx="480" cy={leadFilter === 'week' ? 100 : leadFilter === 'month' ? 95 : 50} r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                  </svg>
                  <div className="text-center text-[10px] text-slate-400 font-bold mt-2">
                    Akumulasi Leads Masuk (Berdasarkan Filter Terpilih)
                  </div>
                </div>
              </div>

            </div>

            {/* Row 4: Timeline Activities (Aktivitas Terkini) */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span>📍</span> Aktivitas Terkini / Terbaru
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative before:absolute before:inset-y-1 before:left-3 before:w-0.5 before:bg-slate-100">
                {inquiryLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-4 text-xs relative z-10 pl-4">
                    <div className="w-6.5 h-6.5 rounded-full bg-sky-50 border-2 border-sky-400 flex items-center justify-center flex-shrink-0 font-bold text-[10px]">
                      🔔
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 leading-snug">{log.type}</p>
                      <span className="text-[9px] text-slate-400 block mt-0.5 font-semibold">
                        {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} • {new Date(log.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* SECTION 2: CMS CONTENT */}
        {activeMenu === 'cms' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950">CMS Konten Halaman</h1>
              <p className="text-slate-500 text-xs md:text-sm mt-1">Ubah kata-kata tagline, nomor WhatsApp tujuan, dan detail penjelasan produk pada halaman depan.</p>
            </div>

            <form onSubmit={handleSaveCMS} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Nama Brand Utama</label>
                  <input
                    type="text"
                    value={cmsConfig.brandName}
                    onChange={(e) => setCmsConfig({ ...cmsConfig, brandName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Nama Brand Tambahan (Suffix)</label>
                  <input
                    type="text"
                    value={cmsConfig.brandSuffix}
                    onChange={(e) => setCmsConfig({ ...cmsConfig, brandSuffix: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Nomor WhatsApp Admin (Format Internasional)</label>
                <input
                  type="text"
                  value={cmsConfig.waNumber}
                  onChange={(e) => setCmsConfig({ ...cmsConfig, waNumber: e.target.value })}
                  placeholder="Contoh: 628123456789"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Wajib diawali dengan kode negara (62 untuk Indonesia) tanpa tanda "+" atau spasi.</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Judul Hero (Tagline Utama)</label>
                  <input
                    type="text"
                    value={cmsConfig.heroTitle}
                    onChange={(e) => setCmsConfig({ ...cmsConfig, heroTitle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Sub-judul Hero (Highlight)</label>
                  <input
                    type="text"
                    value={cmsConfig.heroSubTitle}
                    onChange={(e) => setCmsConfig({ ...cmsConfig, heroSubTitle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Deskripsi Hero</label>
                <textarea
                  value={cmsConfig.heroDescription}
                  onChange={(e) => setCmsConfig({ ...cmsConfig, heroDescription: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Deskripsi "About Us" Footer</label>
                <textarea
                  value={cmsConfig.aboutText}
                  onChange={(e) => setCmsConfig({ ...cmsConfig, aboutText: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="bg-primary-blue hover:bg-primary-blue-hover text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-primary-blue/15 cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SECTION 2B: PROFILE / ABOUT US */}
        {activeMenu === 'profile' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950">Profil Perusahaan / About Us</h1>
              <p className="text-slate-500 text-xs md:text-sm mt-1">Ubah penjelasan Profil Perusahaan dan Detail Informasi tentang kami pada halaman About Us.</p>
            </div>

            <form onSubmit={handleSaveCMS} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Penjelasan Singkat Profil (Footer & About Us)</label>
                <textarea
                  value={cmsConfig.aboutText}
                  onChange={(e) => setCmsConfig({ ...cmsConfig, aboutText: e.target.value })}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-blue/60 transition-colors leading-relaxed"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Deskripsi ringkas yang muncul pada bagian bawah halaman utama (Footer) dan bagian atas halaman profil.</span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="bg-primary-blue hover:bg-primary-blue-hover text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-primary-blue/15 cursor-pointer"
                >
                  Simpan Profil
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SECTION 3: PRODUCT CATALOG */}
        {activeMenu === 'catalog' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950">Katalog Produk</h1>
                <p className="text-slate-500 text-xs md:text-sm mt-1">Kelola data item, harga, dan spesifikasi detail produk rak gondola toko Anda.</p>
              </div>
              <button
                onClick={openAddModal}
                className="bg-primary-blue hover:bg-primary-blue-hover text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-primary-blue/15 flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <span>➕</span> Tambah Produk Baru
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                      <th className="p-4 md:p-5">Gambar</th>
                      <th className="p-4 md:p-5">Nama Produk</th>
                      <th className="p-4 md:p-5">Kategori</th>
                      <th className="p-4 md:p-5">Estimasi Harga</th>
                      <th className="p-4 md:p-5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 md:p-5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-9 object-cover rounded-lg border border-slate-200"
                          />
                        </td>
                        <td className="p-4 md:p-5 font-bold text-slate-900">{product.name}</td>
                        <td className="p-4 md:p-5 uppercase text-[10px] tracking-wider font-extrabold text-slate-400">
                          {product.category === 'sofa' ? 'Rak Single' : product.category === 'table' ? 'Rak Double' : product.category === 'lighting' ? 'Meja / Display' : 'Aksesoris'}
                        </td>
                        <td className="p-4 md:p-5 text-primary-blue font-bold">{product.price}</td>
                        <td className="p-4 md:p-5 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase transition-colors cursor-pointer"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: EDIT SERVICES (LAYANAN) */}
        {activeMenu === 'services' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950">Kelola Layanan Termasuk</h1>
                <p className="text-slate-500 text-xs md:text-sm mt-1">Ubah atau tambahkan jenis benefit pelayanan yang didapatkan pembeli secara gratis.</p>
              </div>
              <button
                onClick={openAddSrvModal}
                className="bg-primary-blue hover:bg-primary-blue-hover text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-primary-blue/15 flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <span>➕</span> Tambah Layanan Baru
              </button>
            </div>

            {/* Services Table */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                      <th className="p-4 md:p-5 w-[30%]">Judul Benefit</th>
                      <th className="p-4 md:p-5 w-[55%]">Penjelasan Deskripsi</th>
                      <th className="p-4 md:p-5 text-right w-[15%]">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {services.map((srv, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 md:p-5 font-bold text-slate-900 leading-tight">{srv.title}</td>
                        <td className="p-4 md:p-5 text-slate-500 text-xs leading-relaxed">{srv.description}</td>
                        <td className="p-4 md:p-5 text-right space-x-2">
                          <button
                            onClick={() => openEditSrvModal(srv, index)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteService(index, srv.title)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase transition-colors cursor-pointer"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TIM KREATIF - SUB-MENU 1: OVERVIEW KREATIF */}
        {activeMenu === 'creative_overview' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950">Overview Kreatif</h1>
              <p className="text-slate-500 text-xs md:text-sm mt-1">Status kampanye pemasaran, sebaran beban kerja desainer, dan metrik performa konten kreatif.</p>
            </div>

            {/* Campaign Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-2">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Kampanye Aktif</span>
                <span className="text-2xl font-black text-slate-950 block">4 Kampanye</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-2">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Konten Terbit (Minggu Ini)</span>
                <span className="text-2xl font-black text-slate-950 block">18 Video/Feed</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-2">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Estimasi Jangkauan</span>
                <span className="text-2xl font-black text-primary-blue block">42.5K Views</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-2">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Tugas Dalam Antrian</span>
                <span className="text-2xl font-black text-amber-500 block">{creativeTasks.filter(t => t.status !== 'Published').length} Draft</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Designer Workload */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-5">
                <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">Beban Kerja Tim Desainer</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Andi (Graphic Designer)', count: creativeTasks.filter(t => t.designer === 'Andi' && t.status !== 'Published').length, color: 'bg-primary-blue' },
                    { name: 'Budi (Videographer)', count: creativeTasks.filter(t => t.designer === 'Budi' && t.status !== 'Published').length, color: 'bg-indigo-500' },
                    { name: 'Citra (Illustrator)', count: creativeTasks.filter(t => t.designer === 'Citra' && t.status !== 'Published').length, color: 'bg-purple-500' },
                    { name: 'Dina (Copywriter)', count: creativeTasks.filter(t => t.designer === 'Dina' && t.status !== 'Published').length, color: 'bg-emerald-500' }
                  ].map((designer, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-700">{designer.name}</span>
                        <span className="text-slate-400 font-semibold">{designer.count} Tugas Aktif</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className={`h-full ${designer.color}`} style={{ width: `${Math.min(designer.count * 25, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Campaign Highlight Box */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">Highlight Kampanye Utama</h3>
                <div className="space-y-3">
                  {[
                    { title: 'Promo Launching Gondola Premium', reach: '12,400 jangkauan', conversion: '4.8%' },
                    { title: 'Edukasi Penataan Minimarket Modern', reach: '24,900 jangkauan', conversion: '8.2%' },
                    { title: 'Testimoni Toko Sembako Surabaya', reach: '5,200 jangkauan', conversion: '3.1%' }
                  ].map((camp, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{camp.title}</p>
                        <span className="text-[10px] text-slate-400 font-semibold">{camp.reach}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        {camp.conversion} Conv
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TIM KREATIF - SUB-MENU 2: KONTEN PLAN (KANBAN) */}
        {activeMenu === 'creative_plan' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950">Konten Plan</h1>
                <p className="text-slate-500 text-xs md:text-sm mt-1">Kelola papan Kanban rencana publikasi konten media sosial Mulia Rak Store.</p>
              </div>
            </div>

            {/* Form Tambah Tugas */}
            <form onSubmit={handleAddCreativeTask} className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4 max-w-xl">
              <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">Tambah Tugas Baru</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Judul Project / Konten</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Video TikTok Estetik"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary-blue/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kategori Media</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary-blue/60 transition-colors cursor-pointer"
                  >
                    <option value="Instagram Feed">Instagram Feed</option>
                    <option value="Instagram Story">Instagram Story</option>
                    <option value="TikTok Video">TikTok Video</option>
                    <option value="Brosur Cetak">Brosur Cetak</option>
                    <option value="Copywriting">Copywriting</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Designer / Kreator</label>
                  <select
                    value={newTaskDesigner}
                    onChange={(e) => setNewTaskDesigner(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary-blue/60 transition-colors cursor-pointer"
                  >
                    <option value="Andi">Andi (Graphic Designer)</option>
                    <option value="Budi">Budi (Videographer)</option>
                    <option value="Citra">Citra (Illustrator)</option>
                    <option value="Dina">Dina (Copywriter)</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-primary-blue hover:bg-primary-blue-hover text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-primary-blue/15 cursor-pointer"
                  >
                    🚀 Tambah Tugas
                  </button>
                </div>
              </div>
            </form>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {['In Progress', 'Review', 'Approved', 'Published'].map((status) => (
                <div key={status} className="bg-slate-100/60 p-4 rounded-3xl border border-slate-200/40 space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">{status}</span>
                    <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {creativeTasks.filter(t => t.status === status).length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {creativeTasks.filter(t => t.status === status).map((task) => (
                      <div key={task.id} className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-3.5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] bg-sky-50 text-primary-blue font-bold px-2 py-0.5 rounded">
                            {task.category}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">{task.title}</h4>
                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-500">🧑‍💻 {task.designer}</span>
                          <span>📅 {task.deadline}</span>
                        </div>
                        
                        {/* Quick Status Actions */}
                        <div className="pt-2 border-t border-slate-100 flex justify-end gap-1.5">
                          {status !== 'In Progress' && (
                            <button
                              onClick={() => handleUpdateTaskStatus(task.id, status === 'Review' ? 'In Progress' : status === 'Approved' ? 'Review' : 'Approved')}
                              className="text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-2 py-1 rounded transition-colors"
                            >
                              ⬅️
                            </button>
                          )}
                          {status !== 'Published' && (
                            <button
                              onClick={() => handleUpdateTaskStatus(task.id, status === 'In Progress' ? 'Review' : status === 'Review' ? 'Approved' : 'Published')}
                              className="text-[9px] bg-slate-900 hover:bg-slate-800 text-white font-bold px-2 py-1 rounded transition-colors"
                            >
                              ➡️
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {creativeTasks.filter(t => t.status === status).length === 0 && (
                      <div className="text-center py-8 text-slate-400 text-xs italic">
                        Tidak ada project
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TIM KREATIF - SUB-MENU 3: EVALUASI KONTEN */}
        {activeMenu === 'creative_eval' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950">Evaluasi Konten</h1>
              <p className="text-slate-500 text-xs md:text-sm mt-1">Laporan analitik performa views, likes, dan konversi klik WhatsApp dari postingan kreatif.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">Performa Konten Media Sosial</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                      <th className="p-4">Platform</th>
                      <th className="p-4">Deskripsi Konten</th>
                      <th className="p-4">Views</th>
                      <th className="p-4">Likes</th>
                      <th className="p-4">WhatsApp Leads</th>
                      <th className="p-4 text-right">Status Evaluasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {[
                      { platform: 'TikTok Video', desc: 'Tips menata toko sembako agar terlihat rapi dan luas', views: '28.4K', likes: '1.2K', leads: 43, eval: 'Performa Sangat Baik (High ROI)' },
                      { platform: 'Instagram Feed', desc: 'Detail spesifikasi tebal baja tiang rak gondola Mulia', views: '8.1K', likes: '348', leads: 18, eval: 'Edukasi Produk Cukup Stabil' },
                      { platform: 'TikTok Video', desc: 'Proses pemasangan rak minimarket di kota Malang gratis', views: '14.9K', likes: '760', leads: 31, eval: 'Efektif Menarik Pembeli Daerah' },
                      { platform: 'Instagram Story', desc: 'Q&A Konsultasi layout toko gratis via WA', views: '2.5K', likes: '120', leads: 29, eval: 'Konversi Tinggi (Interaksi Langsung)' }
                    ].map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                            item.platform.includes('TikTok') ? 'bg-black text-white' : 'bg-pink-50 text-pink-600'
                          }`}>
                            {item.platform}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-slate-900">{item.desc}</td>
                        <td className="p-4 text-slate-500">{item.views}</td>
                        <td className="p-4 text-slate-500">{item.likes}</td>
                        <td className="p-4 font-bold text-primary-blue">{item.leads} Leads</td>
                        <td className="p-4 text-right">
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            {item.eval}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD BISNIS - SUB-MENU 1: LAPORAN KEUANGAN */}
        {activeMenu === 'biz_financials' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950">Laporan Keuangan</h1>
              <p className="text-slate-500 text-xs md:text-sm mt-1">Analisis performa finansial permodalan, pengeluaran operasional, dan laba kotor bisnis.</p>
            </div>

            {/* Financial Card Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-650 text-white p-5 rounded-3xl shadow-sm border border-emerald-500/20 space-y-4">
                <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider block">Total Penjualan</span>
                <div className="space-y-1">
                  <span className="text-xl md:text-2xl font-black block">
                    Rp {transactions.filter(t => t.type === 'penjualan').reduce((a, b) => a + b.amount, 0).toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-white/80 block">Dari {transactions.filter(t => t.type === 'penjualan').length} invoice penjualan</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white p-5 rounded-3xl shadow-sm border border-rose-500/20 space-y-4">
                <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider block">Total Pengeluaran</span>
                <div className="space-y-1">
                  <span className="text-xl md:text-2xl font-black block">
                    Rp {transactions.filter(t => t.type === 'pengeluaran').reduce((a, b) => a + b.amount, 0).toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-white/80 block">Bahan baku & operasional kargo</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-5 rounded-3xl shadow-sm border border-indigo-500/20 space-y-4">
                <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider block">Laba Bersih (Net Profit)</span>
                <div className="space-y-1">
                  <span className="text-xl md:text-2xl font-black block">
                    Rp {(transactions.filter(t => t.type === 'penjualan').reduce((a, b) => a + b.amount, 0) - transactions.filter(t => t.type === 'pengeluaran').reduce((a, b) => a + b.amount, 0)).toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-white/80 block">Margin Keuntungan Bersih</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-5 rounded-3xl shadow-sm border border-amber-500/20 space-y-4">
                <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider block">Total Permodalan</span>
                <div className="space-y-1">
                  <span className="text-xl md:text-2xl font-black block">
                    Rp {transactions.filter(t => t.type === 'permodalan').reduce((a, b) => a + b.amount, 0).toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-white/80 block">Injeksi modal & kas owner</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-5 max-w-2xl">
              <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">Persentase Pengeluaran Operasional</h3>
              <div className="space-y-4">
                {[
                  { category: 'Bahan Baku Plat & Baja Pabrik', percent: 65, amount: 'Rp 8,125,000', color: 'bg-rose-500' },
                  { category: 'Logistik Armada & Solar Pengiriman', percent: 25, amount: 'Rp 3,125,000', color: 'bg-amber-500' },
                  { category: 'Iklan Digital & Campaign Kreatif', percent: 10, amount: 'Rp 1,250,000', color: 'bg-primary-blue' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">{item.category} ({item.percent}%)</span>
                      <span className="text-slate-900 font-bold">{item.amount}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD BISNIS - SUB-MENU 2: PENCATATAN KAS */}
        {activeMenu === 'biz_ledger' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950">Pencatatan Buku Kas</h1>
              <p className="text-slate-500 text-xs md:text-sm mt-1">Formulir pembukuan kas harian dan pencatatan histori transaksi permodalan serta penjualan.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form Input Ledger */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4 h-fit">
                <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">Input Transaksi Keuangan</h3>
                <form onSubmit={handleAddTransaction} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Deskripsi Transaksi</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Pembelian Cat Powder Coating"
                      value={txDesc}
                      onChange={(e) => setTxDesc(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary-blue/60 transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tipe</label>
                      <select
                        value={txType}
                        onChange={(e) => setTxType(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary-blue/60 transition-colors cursor-pointer"
                      >
                        <option value="penjualan">Penjualan (+)</option>
                        <option value="pengeluaran">Pengeluaran (-)</option>
                        <option value="permodalan">Permodalan (+)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Jumlah (Rupiah)</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 5000000"
                        value={txAmount}
                        onChange={(e) => setTxAmount(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary-blue/60 transition-colors"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    💾 Catat Transaksi
                  </button>
                </form>
              </div>

              {/* Ledger Table */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm lg:col-span-2 space-y-4">
                <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">Histori Jurnal Buku Kas</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
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
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                              tx.type === 'penjualan' ? 'bg-emerald-50 text-emerald-600' : tx.type === 'pengeluaran' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
                            }`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className={`p-3 text-right font-bold font-mono ${
                            tx.type === 'penjualan' ? 'text-emerald-600' : tx.type === 'pengeluaran' ? 'text-rose-600' : 'text-indigo-600'
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

        {/* DASHBOARD BISNIS - SUB-MENU 3: ANALISIS MODAL & LABA (SIMULATOR PROYEKSI) */}
        {activeMenu === 'biz_analysis' && (
          <div className="space-y-8 animate-fadeIn max-w-3xl">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950">Analisis Modal & Laba</h1>
              <p className="text-slate-500 text-xs md:text-sm mt-1">Simulator proyeksi pengembalian modal (ROI) dan margin laba berdasarkan target penjualan bulanan.</p>
            </div>

            {/* Financial Projection Tool */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">Simulator Finansial Bulanan</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Controls */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-500 uppercase tracking-wider">Target Penjualan (Satu Bulan)</span>
                      <span className="text-primary-blue">Rp 120.000.000</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl font-mono text-sm text-slate-800 text-right">
                      Rp 120,000,000
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-500 uppercase tracking-wider">Estimasi Pengeluaran Pokok & Operasional</span>
                      <span className="text-rose-600">Rp 48.000.000 (40%)</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl font-mono text-sm text-slate-800 text-right">
                      Rp 48,000,000
                    </div>
                  </div>
                </div>

                {/* Right Analytics Outputs */}
                <div className="bg-slate-900 text-slate-300 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6">
                  <div>
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Proyeksi Laba Bersih</span>
                    <span className="text-2xl font-black text-white block mt-1">Rp 72,000,000 / bln</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                    <div>
                      <span className="text-slate-500 text-[9px] font-bold uppercase tracking-wider block">Margin Laba</span>
                      <span className="text-sm font-extrabold text-emerald-400 block mt-0.5">60.00%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[9px] font-bold uppercase tracking-wider block">Proyeksi ROI</span>
                      <span className="text-sm font-extrabold text-sky-400 block mt-0.5">1.5 Tahun (Sehat)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: SETTINGS */}
        {activeMenu === 'settings' && (
          <div className="space-y-8 animate-fadeIn max-w-2xl">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950">Pengaturan Sistem</h1>
              <p className="text-slate-500 text-xs md:text-sm mt-1">Pengaturan internal sistem administrator dan pembersihan data.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">Database Reset Pabrik</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Menyetel ulang seluruh isi konfigurasi CMS, WhatsApp admin, catalog produk, included services, serta statistik analytics logs kembali ke data default pabrik yang pertama kali dibuat.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleResetData}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-red-600/15 cursor-pointer"
                >
                  ⚠ Reset Database ke Default
                </button>
              </div>
            </div>
          </div>
        )}

        </div>
      </main>

      {/* CRUD Product Modal Dialog Backdrop */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200/60 flex flex-col max-h-[85vh] animate-fadeIn">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-base md:text-lg font-extrabold text-slate-950">
                {modalMode === 'add' ? 'Tambah Produk Baru' : 'Edit Detail Produk'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-dark/40 hover:text-slate-dark p-1 cursor-pointer transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Nama Produk</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Contoh: Rak Gondola Single"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary-blue/60 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Kategori</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary-blue/60 transition-colors cursor-pointer"
                  >
                    <option value="sofa">Rak Single</option>
                    <option value="table">Rak Double</option>
                    <option value="lighting">Meja / Display</option>
                    <option value="decor">Aksesoris</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Estimasi Harga / Range</label>
                  <input
                    type="text"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="Contoh: Rp 800.000"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary-blue/60 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">URL Link Gambar Produk</label>
                <input
                  type="text"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  placeholder="Kosongkan jika ingin memakai gambar default"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary-blue/60 transition-colors font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Deskripsi Singkat</label>
                <textarea
                  required
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  rows={3}
                  placeholder="Ketik keterangan ringkasan kegunaan produk..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary-blue/60 transition-colors leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Spesifikasi Detail (Satu Spec Per Baris)</label>
                <textarea
                  value={prodSpecs}
                  onChange={(e) => setProdSpecs(e.target.value)}
                  rows={4}
                  placeholder={`Contoh:\nTinggi Tiang: 180 cm\nPanjang Shelving: 90 cm\nKapasitas Beban: s/d 50 kg`}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary-blue/60 transition-colors leading-relaxed"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-primary-blue hover:bg-primary-blue-hover text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-primary-blue/15 cursor-pointer"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CRUD Service Modal Dialog Backdrop */}
      {isSrvModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsSrvModalOpen(false)} />
          
          <div className="relative bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200/60 flex flex-col max-h-[85vh] animate-fadeIn">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-base md:text-lg font-extrabold text-slate-950">
                {srvModalMode === 'add' ? 'Tambah Layanan Baru' : 'Edit Detail Layanan'}
              </h3>
              <button
                onClick={() => setIsSrvModalOpen(false)}
                className="text-slate-dark/40 hover:text-slate-dark p-1 cursor-pointer transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form onSubmit={handleSaveService} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Judul Layanan / Benefit</label>
                <input
                  type="text"
                  required
                  value={srvTitle}
                  onChange={(e) => setSrvTitle(e.target.value)}
                  placeholder="Contoh: Gratis Ongkir & Pemasangan"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary-blue/60 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Deskripsi Lengkap / Penjelasan</label>
                <textarea
                  required
                  value={srvDescription}
                  onChange={(e) => setSrvDescription(e.target.value)}
                  rows={4}
                  placeholder="Ketik detail benefit dan persyaratan terkait layanan ini..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary-blue/60 transition-colors leading-relaxed"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSrvModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-primary-blue hover:bg-primary-blue-hover text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-primary-blue/15 cursor-pointer"
                >
                  Simpan Layanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
