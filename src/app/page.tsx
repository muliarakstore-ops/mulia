'use strict';
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../constants/mockData';
import { getStoredCms, getStoredProducts, getStoredServices, CmsConfig, DEFAULT_CMS } from '../utils/storage';
import { INCLUDED_SERVICES, IncludedService } from '../constants/mockData';
import { loadCmsConfig, getSupabaseProducts, getSupabaseServices, insertAnalyticsEvent, insertLeadRecord, FullCmsConfig } from '../utils/supabaseData';

// Component Imports
import Navbar from '../components/public/Navbar';
import Hero from '../components/public/Hero';
import Catalog from '../components/public/Catalog';
import Services from '../components/public/Services';
import ShippingCost from '../components/public/ShippingCost';
import Conversation from '../components/public/Conversation';
import Footer from '../components/public/Footer';
import MobileBottomNav from '../components/public/MobileBottomNav';

export default function Home() {
  const [cmsConfig, setCmsConfig] = useState<FullCmsConfig>(DEFAULT_CMS);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [services, setServices] = useState<IncludedService[]>(INCLUDED_SERVICES);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        const [supabaseCms, supabaseProds, supabaseServices] = await Promise.all([
          loadCmsConfig(),
          getSupabaseProducts(true),
          getSupabaseServices()
        ]);
        
        if (supabaseCms) setCmsConfig(supabaseCms);
        if (supabaseProds && supabaseProds.length > 0) setProducts(supabaseProds);
        if (supabaseServices && supabaseServices.length > 0) setServices(supabaseServices);
      } catch (e) {
        console.error('Error fetching Supabase data, using localStorage fallbacks:', e);
        setCmsConfig(getStoredCms());
        setProducts(getStoredProducts());
        setServices(getStoredServices());
      }
      setIsClient(true);
    };

    initData();

    // Track homepage visit analytics
    try {
      const visits = localStorage.getItem('mrs_visits') || '0';
      localStorage.setItem('mrs_visits', (parseInt(visits) + 1).toString());
      insertAnalyticsEvent('visit', undefined, { path: '/' });
    } catch (e) {
      console.error(e);
    }

    // Monitor active user screentime: send a 10s increment to database every 10 seconds
    const interval = setInterval(() => {
      insertAnalyticsEvent('screentime', 10, { path: '/' });
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Format IDR Currency
  const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Tracking function for analytics
  const trackInquiry = async (type: string, isLead = false, details?: { type?: 'product' | 'service'; id?: string }) => {
    try {
      const current = localStorage.getItem('mrs_inquiries') || '0';
      localStorage.setItem('mrs_inquiries', (parseInt(current) + 1).toString());

      const logs = JSON.parse(localStorage.getItem('mrs_inquiry_logs') || '[]');
      logs.unshift({
        timestamp: new Date().toISOString(),
        type
      });
      localStorage.setItem('mrs_inquiry_logs', JSON.stringify(logs.slice(0, 10)));

      // Log in Supabase
      if (isLead) {
        await insertLeadRecord({
          type: details?.type || 'product',
          referenceId: details?.id,
          customerName: 'Customer Website',
          customerPhone: cmsConfig.waNumber,
          message: type
        });
      } else {
        await insertAnalyticsEvent('shipping_check', undefined, { detail: type });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Compile final general inquiry WhatsApp Message
  const waMessage = useMemo(() => {
    let greeting = `Halo ${cmsConfig.brandName} ${cmsConfig.brandSuffix},\n\n`;
    greeting += `Saya tertarik dengan produk rak gondola dan properti toko Anda. Saya ingin berkonsultasi mengenai layout ruangan, penataan letak rak, serta negosiasi estimasi biaya yang dibutuhkan untuk toko baru saya.\n\n`;
    greeting += `Mohon dibantu info penawaran harga terbaik dan langkah selanjutnya. Terima kasih!`;
    return greeting;
  }, [cmsConfig]);

  // Open WhatsApp Link for general contact
  const handleWhatsAppSend = () => {
    trackInquiry('Konsultasi Umum WhatsApp', true, { type: 'service', id: 'general' });
    const encodedText = encodeURIComponent(waMessage);
    const url = `https://wa.me/${cmsConfig.waNumber}?text=${encodedText}`;
    window.open(url, '_blank');
  };

  // Inquiry for specific product card
  const handleInquireProduct = (product: Product) => {
    trackInquiry(`Produk: ${product.name}`, true, { type: 'product', id: product.id });
    const text = `Halo ${cmsConfig.brandName} ${cmsConfig.brandSuffix},\n\nSaya tertarik dengan produk *${product.name}* (Estimasi Harga: ${product.price}). Mohon informasi ketersediaan stok, spesifikasi bahan baja, opsi warna, serta kemungkinan negosiasi harganya. Terima kasih!`;
    const encodedText = encodeURIComponent(text);
    const url = `https://wa.me/${cmsConfig.waNumber}?text=${encodedText}`;
    window.open(url, '_blank');
  };

  // Inquiry for shipping calculation
  const handleShippingInquiry = (destination: string, vehicle: string, cost: string) => {
    trackInquiry(`Cek Ongkir: ${destination} (${vehicle})`, false);
    const text = `Halo ${cmsConfig.brandName} ${cmsConfig.brandSuffix},\n\nSaya ingin menanyakan detail biaya pengiriman kargo ke daerah *${destination}* menggunakan armada *${vehicle}*. Berdasarkan hitungan website, perkiraan tarif adalah sekitar *${cost}*. Mohon konfirmasi jadwal kirim dan keakuratan tarifnya. Terima kasih!`;
    const encodedText = encodeURIComponent(text);
    const url = `https://wa.me/${cmsConfig.waNumber}?text=${encodedText}`;
    window.open(url, '_blank');
  };

  // Trigger quick service consultation
  const handleServiceInquiry = (serviceName: string) => {
    trackInquiry(`Layanan: ${serviceName}`, true, { type: 'service' });
    const serviceGreeting = `Halo ${cmsConfig.brandName} ${cmsConfig.brandSuffix},\n\nSaya tertarik dengan Layanan Termasuk: *${serviceName}*.\nMohon info detail mengenai persyaratan dan alur konsultasinya. Terima kasih!`;
    const encodedText = encodeURIComponent(serviceGreeting);
    const url = `https://wa.me/${cmsConfig.waNumber}?text=${encodedText}`;
    window.open(url, '_blank');
  };

  return (
    <div className="relative min-h-screen pb-16 md:pb-0">
      {/* Background decoration glows */}
      <div className="glow-bg w-[500px] h-[500px] top-[15%] left-[5%]" />
      <div className="glow-bg w-[600px] h-[600px] top-[45%] right-[5%]" />

      <Navbar 
        brandName={cmsConfig.brandName} 
        brandSuffix={cmsConfig.brandSuffix} 
      />

      <Hero 
        heroTitle={cmsConfig.heroTitle}
        heroSubTitle={cmsConfig.heroSubTitle}
        heroDescription={cmsConfig.heroDescription}
        brandName={cmsConfig.brandName}
        brandSuffix={cmsConfig.brandSuffix}
        heroSubTopTitle={cmsConfig.heroSubTopTitle}
        heroBgImageUrl={cmsConfig.heroBgImageUrl}
      />

      <Catalog
        onInquireProduct={handleInquireProduct}
        formatIDR={formatIDR}
        products={products}
        catalogMainTitle={cmsConfig.catalogMainTitle}
        catalogSubTitle={cmsConfig.catalogSubTitle}
        catalogColsMobile={cmsConfig.catalogColsMobile}
        catalogColsDesktop={cmsConfig.catalogColsDesktop}
      />

      <Services
        onTriggerService={handleServiceInquiry}
        services={services}
        servicesMainTitle={cmsConfig.servicesMainTitle}
        servicesSubTitle={cmsConfig.servicesSubTitle}
      />

      <ShippingCost
        onSendWhatsAppShipping={handleShippingInquiry}
        shippingMainTitle={cmsConfig.shippingMainTitle}
        shippingSubTitle={cmsConfig.shippingSubTitle}
      />

      <Conversation
        waMessage={waMessage}
        onSendWhatsApp={handleWhatsAppSend}
        cartItemCount={0}
        convMainTitle={cmsConfig.convMainTitle}
        convSubTitle={cmsConfig.convSubTitle}
        convCardTitle={cmsConfig.convCardTitle}
        convCardDescription={cmsConfig.convCardDescription}
        convPhoneImageUrl={cmsConfig.convPhoneImageUrl}
      />

      <Footer 
        brandName={cmsConfig.brandName}
        brandSuffix={cmsConfig.brandSuffix}
        aboutText={cmsConfig.aboutText}
      />
      
      <MobileBottomNav />
    </div>
  );
}
