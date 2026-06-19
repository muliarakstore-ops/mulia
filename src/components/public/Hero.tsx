'use strict';
import React from 'react';

interface HeroProps {
  heroTitle?: string;
  heroSubTitle?: string;
  heroDescription?: string;
  brandName?: string;
  brandSuffix?: string;
  heroSubTopTitle?: string;
  heroBgImageUrl?: string;
}

export default function Hero({
  heroTitle = 'Peralatan & Rak Toko Premium',
  heroSubTitle = 'Untuk Ritel Modern',
  heroDescription = 'Menyediakan Rak Gondola, Meja Kasir, Rak Rokok, dan aksesoris minimarket berkualitas tinggi langsung dari pabrik dengan standar baja terbaik.',
  brandName = 'MULIA',
  brandSuffix = 'Rak Store',
  heroSubTopTitle = 'Pabrik & Distributor Utama Rak Minimarket / Supermarket',
  heroBgImageUrl,
}: HeroProps) {
  return (
    <div id="hero">
      {/* Desktop Hero Section (md and above) */}
      <section
        className="hidden md:flex relative min-h-screen flex-col justify-center items-center px-4 py-24 text-center overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.75) 100%), url('${heroBgImageUrl || 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=1920&q=80'}')`,
        }}
      >
        <div className="max-w-4xl z-10 space-y-6 px-2">
          <div className="inline-block bg-primary-blue/35 text-sky-200 border border-sky-400/35 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
            {heroSubTopTitle}
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-white">
            {heroTitle} <br />
            <span className="text-sky-300">{heroSubTitle}</span>
          </h1>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
            {heroDescription}
          </p>
 
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-3.5 w-full max-w-sm sm:max-w-none mx-auto">
            <a
              href="#catalog"
              className="w-full sm:w-auto bg-primary-blue hover:bg-primary-blue-hover text-white font-bold px-7 py-3.5 rounded-full shadow-lg shadow-primary-blue/45 transition-all text-center text-xs md:text-sm"
            >
              Jelajahi Katalog Rak
            </a>
            <a
              href="#services"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-medium border border-white/30 px-7 py-3.5 rounded-full transition-all text-center text-xs md:text-sm"
            >
              Lihat Layanan Gratis
            </a>
          </div>
        </div>
 
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/40 animate-pulse">
          <span className="text-[9px] uppercase tracking-widest font-semibold">Scroll</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>
 
      {/* Mobile Hero Section (PWA Landscape Banner Card, screen < md) */}
      <section
        className="md:hidden flex flex-col px-4 pt-20 pb-4"
      >
        <div
          className="w-full aspect-[2/1] rounded-3xl relative overflow-hidden flex items-center p-5 bg-cover bg-center shadow-md border border-slate-dark/5"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95) 45%, rgba(15, 23, 42, 0.3) 100%), url('${heroBgImageUrl || 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=600&q=80'}')`,
          }}
        >
          {/* Content inside the card */}
          <div className="z-10 space-y-1.5 max-w-[65%] text-left">
            <h1 className="text-sm md:text-lg font-black text-white leading-tight tracking-tight uppercase">
              {brandName} {brandSuffix}
            </h1>
            <p className="text-[9px] text-sky-300 font-extrabold uppercase tracking-wider">
              {heroSubTitle}
            </p>
            <p className="text-[9px] text-white/80 leading-normal line-clamp-2 font-light">
              {heroDescription}
            </p>
            <a
              href="#catalog"
              className="inline-block bg-primary-blue hover:bg-primary-blue-hover text-white text-[9px] font-bold px-3 py-1.5 rounded-full transition-all mt-1 shadow-md shadow-primary-blue/20"
            >
              Lihat Katalog
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
