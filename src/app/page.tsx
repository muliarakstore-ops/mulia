'use strict';
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../constants/mockData';
import { getStoredCms, getStoredProducts, getStoredServices, CmsConfig, DEFAULT_CMS } from '../utils/storage';
import { INCLUDED_SERVICES, IncludedService } from '../constants/mockData';

// Component Imports
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Catalog from '../components/Catalog';
import Services from '../components/Services';
import ShippingCost from '../components/ShippingCost';
import Conversation from '../components/Conversation';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';

export default function Home() {
  const [cmsConfig, setCmsConfig] = useState<CmsConfig>(DEFAULT_CMS);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [services, setServices] = useState<IncludedService[]>(INCLUDED_SERVICES);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setCmsConfig(getStoredCms());
    setProducts(getStoredProducts());
    setServices(getStoredServices());
    setIsClient(true);

    // Track homepage visit analytics
    try {
      const visits = localStorage.getItem('mrs_visits') || '0';
      localStorage.setItem('mrs_visits', (parseInt(visits) + 1).toString());
    } catch (e) {
      console.error(e);
    }
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
  const trackInquiry = (type: string) => {
    try {
      const current = localStorage.getItem('mrs_inquiries') || '0';
      localStorage.setItem('mrs_inquiries', (parseInt(current) + 1).toString());

      const logs = JSON.parse(localStorage.getItem('mrs_inquiry_logs') || '[]');
      logs.unshift({
        timestamp: new Date().toISOString(),
        type
      });
      localStorage.setItem('mrs_inquiry_logs', JSON.stringify(logs.slice(0, 10)));
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
    trackInquiry('Konsultasi Umum WhatsApp');
    const encodedText = encodeURIComponent(waMessage);
    const url = `https://wa.me/${cmsConfig.waNumber}?text=${encodedText}`;
    window.open(url, '_blank');
  };

  // Inquiry for specific product card
  const handleInquireProduct = (product: Product) => {
    trackInquiry(`Produk: ${product.name}`);
    const text = `Halo ${cmsConfig.brandName} ${cmsConfig.brandSuffix},\n\nSaya tertarik dengan produk *${product.name}* (Estimasi Harga: ${product.price}). Mohon informasi ketersediaan stok, spesifikasi bahan baja, opsi warna, serta kemungkinan negosiasi harganya. Terima kasih!`;
    const encodedText = encodeURIComponent(text);
    const url = `https://wa.me/${cmsConfig.waNumber}?text=${encodedText}`;
    window.open(url, '_blank');
  };

  // Inquiry for shipping calculation
  const handleShippingInquiry = (destination: string, vehicle: string, cost: string) => {
    trackInquiry(`Cek Ongkir: ${destination} (${vehicle})`);
    const text = `Halo ${cmsConfig.brandName} ${cmsConfig.brandSuffix},\n\nSaya ingin menanyakan detail biaya pengiriman kargo ke daerah *${destination}* menggunakan armada *${vehicle}*. Berdasarkan hitungan website, perkiraan tarif adalah sekitar *${cost}*. Mohon konfirmasi jadwal kirim dan keakuratan tarifnya. Terima kasih!`;
    const encodedText = encodeURIComponent(text);
    const url = `https://wa.me/${cmsConfig.waNumber}?text=${encodedText}`;
    window.open(url, '_blank');
  };

  // Trigger quick service consultation
  const handleServiceInquiry = (serviceName: string) => {
    trackInquiry(`Layanan: ${serviceName}`);
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
      />

      <Catalog
        onInquireProduct={handleInquireProduct}
        formatIDR={formatIDR}
        products={products}
      />

      <Services
        onTriggerService={handleServiceInquiry}
        services={services}
      />

      <ShippingCost
        onSendWhatsAppShipping={handleShippingInquiry}
      />

      <Conversation
        waMessage={waMessage}
        onSendWhatsApp={handleWhatsAppSend}
        cartItemCount={0}
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
