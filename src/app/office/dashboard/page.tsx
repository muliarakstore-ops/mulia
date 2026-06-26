'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '../../../types';
import { getStoredCms, saveStoredCms, getStoredProducts, saveStoredProducts, getStoredServices, saveStoredServices, CmsConfig, DEFAULT_CMS } from '../../../utils/storage';
import { PRODUCTS, IncludedService, INCLUDED_SERVICES } from '../../../constants/mockData';
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
  getRawVisits,
  getLeadsData, 
  updateLeadStatus, 
  getSupabaseTransactions, 
  saveSupabaseTransaction,
  getSupabaseVideos,
  saveSupabaseVideo,
  deleteSupabaseVideo,
  getSupabaseDesigns,
  saveSupabaseDesign,
  deleteSupabaseDesign,
  FullCmsConfig
} from '../../../utils/supabaseData';

import OverviewSection from '../../../components/admin/OverviewSection';
import CmsSection from '../../../components/admin/CmsSection';
import ProfileSection from '../../../components/admin/ProfileSection';
import CatalogSection from '../../../components/admin/CatalogSection';
import ServicesSection from '../../../components/admin/ServicesSection';
import CreativeSection from '../../../components/admin/CreativeSection';
import BusinessSection from '../../../components/admin/BusinessSection';
import SettingsSection from '../../../components/admin/SettingsSection';

import { useRouter } from 'next/navigation';
import { supabase } from '../../../utils/supabase';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<'overview' | 'cms' | 'profile' | 'catalog' | 'services' | 'creative' | 'biz_financials' | 'biz_ledger' | 'biz_analysis' | 'settings'>('overview');
  const [cmsConfig, setCmsConfig] = useState<FullCmsConfig>(DEFAULT_CMS);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<IncludedService[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userEmail, setUserEmail] = useState('Mulia Owner');
  const [userRole, setUserRole] = useState('Super Admin');

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/office');
        return;
      }
      
      const user = session.user;
      const email = user.email || '';
      
      if (email.toLowerCase() === 'iqbal@muliarak.store') {
        // Owner must be redirected to their own business page
        router.push('/office/business');
        return;
      }
      
      setUserEmail(email || 'arif@muliarak.store');
      setUserRole('admin');
      setCheckingAuth(false);
    };
    checkAuth();
  }, [router]);

  // Analytics Stats
  const [visits, setVisits] = useState<number>(0);
  const [inquiries, setInquiries] = useState<number>(0);
  const [rawVisits, setRawVisits] = useState<{ created_at: string }[]>([]);
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
  const [creativeVideos, setCreativeVideos] = useState<any[]>([]);
  const [creativeDesigns, setCreativeDesigns] = useState<any[]>([]);

  // Business Dashboard Financial State
  const [transactions, setTransactions] = useState<{
    id: number;
    date: string;
    desc: string;
    type: 'penjualan' | 'pengeluaran' | 'permodalan';
    amount: number;
  }[]>([
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
        const [supabaseCms, supabaseProds, supabaseServices, stats, leadsData, txs, rawVisitsData, videos, designs] = await Promise.all([
          loadCmsConfig(),
          getSupabaseProducts(),
          getSupabaseServices(),
          getAnalyticsStats(),
          getLeadsData(),
          getSupabaseTransactions(),
          getRawVisits(),
          getSupabaseVideos(),
          getSupabaseDesigns()
        ]);

        if (supabaseCms) setCmsConfig(supabaseCms);
        if (supabaseProds && supabaseProds.length > 0) setProducts(supabaseProds);
        if (supabaseServices && supabaseServices.length > 0) setServices(supabaseServices);
        if (videos) setCreativeVideos(videos);
        if (designs) setCreativeDesigns(designs);
        
        if (stats) {
          setVisits(stats.visits);
          setScreentime(stats.screentime || 0); // Active session screentime in seconds
          setShippingChecks(stats.shippingChecks);
        }

        if (rawVisitsData) {
          setRawVisits(rawVisitsData);
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
          setInquiries(0);
          setInquiryLogs([]);
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

  // Handle Image Upload with 2.5MB limit
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'heroBgImageUrl' | 'convPhoneImageUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2.5 * 1024 * 1024) {
      alert('Ukuran file gambar maksimal adalah 2.5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setCmsConfig((prev: FullCmsConfig) => ({
        ...prev,
        [field]: reader.result as string
      }));
      showToast('Gambar berhasil diunggah!');
    };
    reader.readAsDataURL(file);
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

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      // Clear cookies
      document.cookie = 'mrs_session_token=; path=/; max-age=0; SameSite=Lax; Secure';
      document.cookie = 'mrs_session_user=; path=/; max-age=0; SameSite=Lax; Secure';
      await supabase.auth.signOut();
      router.push('/office');
    }
  };

  if (checkingAuth || !isClient) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 font-sans space-y-3">
        <div className="animate-spin text-2xl">⏳</div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Memverifikasi Sesi...</p>
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

      {/* Sidebar Navigation - Premium v0 Light Theme */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 text-slate-700 flex flex-col justify-between py-6 flex-shrink-0">
        <div>
          {/* Logo Brand Header */}
          <div className="pl-6 pr-6 pb-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0284c7] text-white flex items-center justify-center font-black text-lg transition-transform hover:scale-105 duration-300">
              M
            </div>
            <div>
              <span className="text-base font-black text-slate-900 tracking-tight block leading-none">{cmsConfig.brandName}</span>
              <span className="text-[9px] uppercase font-bold text-slate-400 block mt-1 tracking-wider">Dashboard Admin</span>
            </div>
          </div>

          {/* Menus List */}
          <nav className="px-4 py-6 space-y-5">
            
            {/* Category: Utama */}
            <div className="space-y-1.5">
              <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-3 pb-1">Menu Utama</div>
              
              <button
                onClick={() => setActiveMenu('overview')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-all duration-300 cursor-pointer rounded-xl ${
                  activeMenu === 'overview'
                    ? 'bg-[#0284c7] text-white shadow-lg shadow-[#0284c7]/20 font-bold scale-[1.02]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 font-medium'
                }`}
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                </svg>
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveMenu('cms')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-all duration-300 cursor-pointer rounded-xl ${
                  activeMenu === 'cms'
                    ? 'bg-[#0284c7] text-white shadow-lg shadow-[#0284c7]/20 font-bold scale-[1.02]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 font-medium'
                }`}
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Landing Page</span>
              </button>

              <button
                onClick={() => setActiveMenu('catalog')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-all duration-300 cursor-pointer rounded-xl ${
                  activeMenu === 'catalog'
                    ? 'bg-[#0284c7] text-white shadow-lg shadow-[#0284c7]/20 font-bold scale-[1.02]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 font-medium'
                }`}
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Products</span>
              </button>

              <button
                onClick={() => setActiveMenu('services')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-all duration-300 cursor-pointer rounded-xl ${
                  activeMenu === 'services'
                    ? 'bg-[#0284c7] text-white shadow-lg shadow-[#0284c7]/20 font-bold scale-[1.02]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 font-medium'
                }`}
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Services</span>
              </button>

              <button
                onClick={() => setActiveMenu('profile')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-all duration-300 cursor-pointer rounded-xl ${
                  activeMenu === 'profile'
                    ? 'bg-[#0284c7] text-white shadow-lg shadow-[#0284c7]/20 font-bold scale-[1.02]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 font-medium'
                }`}
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile</span>
              </button>
            </div>

            {/* Category: Tim Kreatif */}
            <div className="space-y-1.5">
              <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-3 pb-1 pt-1">Tim Kreatif</div>
              
              <button
                onClick={() => setActiveMenu('creative')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-all duration-300 cursor-pointer rounded-xl ${
                  activeMenu === 'creative'
                    ? 'bg-[#0284c7] text-white shadow-lg shadow-[#0284c7]/20 font-bold scale-[1.02]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-955 font-medium'
                }`}
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <span>Tim Kreatif</span>
              </button>
            </div>

            {/* Category: Pengaturan */}
            <div className="space-y-1.5">
              <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-3 pb-1 pt-1">Sistem</div>
              <button
                onClick={() => setActiveMenu('settings')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-all duration-300 cursor-pointer rounded-xl ${
                  activeMenu === 'settings'
                    ? 'bg-[#0284c7] text-white shadow-lg shadow-[#0284c7]/20 font-bold scale-[1.02]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-955 font-medium'
                }`}
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Settings</span>
              </button>
            </div>

          </nav>
        </div>

        {/* Sidebar Footer Link */}
        <div className="px-4 border-t border-slate-100 pt-4">
          <a
            href="/"
            className="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 text-center text-xs py-3 rounded-xl block font-bold transition-all hover:scale-[1.02] cursor-pointer uppercase tracking-wider"
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
                <span className="text-xs font-bold text-slate-900 block leading-tight truncate max-w-[150px]" title={userEmail}>
                  {userEmail.split('@')[0]}
                </span>
                <span className="text-[10px] text-slate-400 font-bold capitalize">{userRole}</span>
              </div>
              <button 
                onClick={handleLogout}
                title="Keluar / Logout"
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0284c7] to-sky-400 text-white flex items-center justify-center font-bold text-xs border border-white hover:opacity-90 transition-opacity cursor-pointer"
              >
                {userEmail.substring(0, 2).toUpperCase()}
              </button>
            </div>
          </div>
        </header>

        {/* Content Section Area */}
        <div className="p-6 md:p-8 flex-1 space-y-8">
        
        {/* SECTION 1: OVERVIEW */}
        {activeMenu === 'overview' && (
          <OverviewSection
            visits={visits}
            inquiries={inquiries}
            leadsProduct={leadsProduct}
            leadsService={leadsService}
            shippingChecks={shippingChecks}
            screentime={screentime}
            inquiryLogs={inquiryLogs}
            rawVisits={rawVisits}
          />
        )}

        {/* SECTION 2: CMS CONTENT */}
        {activeMenu === 'cms' && (
          <CmsSection
            cmsConfig={cmsConfig}
            setCmsConfig={setCmsConfig}
            handleImageUpload={handleImageUpload}
            handleSaveCMS={handleSaveCMS}
          />
        )}

        {/* SECTION 2B: PROFILE / ABOUT US */}
        {activeMenu === 'profile' && (
          <ProfileSection
            cmsConfig={cmsConfig}
            setCmsConfig={setCmsConfig}
            handleSaveCMS={handleSaveCMS}
          />
        )}

        {/* SECTION 3: PRODUCT CATALOG */}
        {activeMenu === 'catalog' && (
          <CatalogSection
            products={products}
            openAddModal={openAddModal}
            openEditModal={openEditModal}
            handleDeleteProduct={handleDeleteProduct}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            modalMode={modalMode}
            prodName={prodName}
            setProdName={setProdName}
            prodCategory={prodCategory}
            setProdCategory={setProdCategory}
            prodPrice={prodPrice}
            setProdPrice={setProdPrice}
            prodImage={prodImage}
            setProdImage={setProdImage}
            prodDescription={prodDescription}
            setProdDescription={setProdDescription}
            prodSpecs={prodSpecs}
            setProdSpecs={setProdSpecs}
            handleSaveProduct={handleSaveProduct}
          />
        )}

        {/* SECTION 4: EDIT SERVICES (LAYANAN) */}
        {activeMenu === 'services' && (
          <ServicesSection
            services={services}
            openAddSrvModal={openAddSrvModal}
            openEditSrvModal={openEditSrvModal}
            handleDeleteService={handleDeleteService}
            isSrvModalOpen={isSrvModalOpen}
            setIsSrvModalOpen={setIsSrvModalOpen}
            srvModalMode={srvModalMode}
            srvTitle={srvTitle}
            setSrvTitle={setSrvTitle}
            srvDescription={srvDescription}
            setSrvDescription={setSrvDescription}
            handleSaveService={handleSaveService}
          />
        )}
        
        {/* TIM KREATIF */}
        {activeMenu === 'creative' && (
          <CreativeSection
            videos={creativeVideos}
            designs={creativeDesigns}
            onReloadVideos={async () => {
              const vids = await getSupabaseVideos();
              setCreativeVideos(vids);
            }}
            onReloadDesigns={async () => {
              const des = await getSupabaseDesigns();
              setCreativeDesigns(des);
            }}
            onDeleteVideo={deleteSupabaseVideo}
            onDeleteDesign={deleteSupabaseDesign}
          />
        )}

        {/* DASHBOARD BISNIS SUB-MENUS */}
        {(activeMenu === 'biz_financials' || activeMenu === 'biz_ledger' || activeMenu === 'biz_analysis') && (
          <BusinessSection
            activeMenu={activeMenu}
            transactions={transactions}
            txDesc={txDesc}
            setTxDesc={setTxDesc}
            txType={txType}
            setTxType={setTxType}
            txAmount={txAmount}
            setTxAmount={setTxAmount}
            handleAddTransaction={handleAddTransaction}
          />
        )}

        {/* SECTION 5: SETTINGS */}
        {activeMenu === 'settings' && (
          <SettingsSection handleResetData={handleResetData} />
        )}
        </div>
      </main>

    </div>
  );
}
