'use strict';
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../constants/mockData';

interface CatalogProps {
  onInquireProduct: (product: Product) => void;
  formatIDR: (value: number) => string;
  products: Product[];
}

export default function Catalog({ onInquireProduct, formatIDR, products }: CatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('featured');
  
  // State for detailed product modal
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategory !== 'all') {
      const categoryMapping: Record<string, string> = {
        'single': 'sofa',
        'double': 'table',
        'kasir': 'lighting',
        'aksesoris': 'decor',
      };
      const matchDbCat = categoryMapping[selectedCategory];
      result = result.filter((p) => p.category === matchDbCat);
    }

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    // Sort products
    if (sortOption === 'price-low' || sortOption === 'price-high') {
      const getNumericPrice = (p: Product) => {
        const matches = p.price.replace(/\./g, '').match(/\d+/);
        return matches ? parseInt(matches[0]) : 0;
      };

      result.sort((a, b) => {
        const valA = getNumericPrice(a);
        const valB = getNumericPrice(b);
        return sortOption === 'price-low' ? valA - valB : valB - valA;
      });
    }

    return result;
  }, [selectedCategory, searchQuery, sortOption]);

  return (
    <section id="catalog" className="py-8 md:py-28 px-3 md:px-12 max-w-7xl mx-auto space-y-4 md:space-y-10">
      
      {/* Title Header - Left-aligned, border and padding hidden on mobile */}
      <div className="text-left md:flex justify-between items-end border-b-0 md:border-b border-slate-light pb-0 md:pb-8 space-y-4 md:space-y-0">
        <div className="space-y-1 md:space-y-2">
          <h2 className="text-2xl md:text-5xl font-extrabold text-slate-dark tracking-tight">Katalog Produk</h2>
          
          {/* Subtitle - Hidden on mobile (hidden md:block) */}
          <p className="hidden md:block text-slate-dark/60 text-sm">
            Solusi perlengkapan retail presisi untuk kebutuhan bisnis minimarket Anda.
          </p>
        </div>

        {/* Search & Sort - Hidden on Mobile, Visible on Desktop (md and above) */}
        <div className="hidden md:flex flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-72">
            <input
              type="text"
              placeholder="Cari rak, kasir..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-dark/15 focus:border-primary-blue/60 rounded-full px-4 py-2.5 pl-10 text-xs md:text-sm text-slate-dark focus:outline-none transition-all shadow-sm"
            />
            <svg className="w-4 h-4 text-slate-dark/30 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-white border border-slate-dark/15 text-slate-dark rounded-full px-4 py-2.5 text-xs md:text-sm focus:outline-none focus:border-primary-blue/60 cursor-pointer shadow-sm"
          >
            <option value="featured">Paling Populer</option>
            <option value="price-low">Harga Terendah</option>
            <option value="price-high">Harga Tertinggi</option>
          </select>
        </div>
      </div>

      {/* Categories Bar - Hidden on Mobile, Visible on Desktop (md and above) */}
      <div className="hidden md:flex md:flex-wrap md:overflow-visible md:mx-0 md:px-0 gap-3">
        {[
          { id: 'all', label: 'Semua Produk' },
          { id: 'single', label: 'Rak Gondola Single' },
          { id: 'double', label: 'Rak Gondola Double' },
          { id: 'kasir', label: 'Meja Kasir & Display' },
          { id: 'aksesoris', label: 'Aksesoris Toko' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-5 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm inline-block ${
              selectedCategory === cat.id
                ? 'bg-primary-blue text-white shadow-md shadow-primary-blue/25 scale-105'
                : 'bg-white text-slate-dark/70 hover:bg-slate-light border border-slate-dark/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Negotiable Info Badge - Placed tightly below header on mobile with minimal spacing */}
      <div className="bg-primary-blue-light/50 border border-primary-blue/20 text-primary-blue-hover text-[11px] md:text-sm rounded-2xl md:rounded-3xl p-4 md:p-6 flex items-start gap-3 md:gap-4 shadow-sm mt-1">
        <span className="text-lg mt-0.5">💡</span>
        <p className="font-medium leading-relaxed">
          <strong>Kabar Baik:</strong> Seluruh harga produk dalam katalog ini bersifat fleksibel dan <strong>masih dapat dinegosiasikan kembali</strong> saat Anda menghubungi admin kami!
        </p>
      </div>

      {/* Products Grid - 2 columns on Mobile, 4 columns on Desktop */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-slate-light rounded-3xl border border-slate-dark/5">
          <svg className="w-12 h-12 text-slate-dark/25 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-bold text-slate-dark">Produk Tidak Ditemukan</h3>
          <p className="text-slate-dark/50 text-xs mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-10">
          {filteredProducts.map((product) => (
            <div key={product.id} className="glass-card rounded-[1.2rem] md:rounded-3xl overflow-hidden flex flex-col group relative shadow-sm">
              {/* Product Image */}
              <div className="relative aspect-[4/3] bg-slate-light overflow-hidden border-b border-slate-dark/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-2 left-2 bg-primary-blue text-white px-2 py-0.5 rounded-full text-[8px] md:text-[9px] uppercase font-extrabold tracking-wider shadow-sm">
                  {product.category === 'sofa' ? 'Rak Single' : product.category === 'table' ? 'Rak Double' : product.category === 'lighting' ? 'Meja / Display' : 'Aksesoris'}
                </div>
              </div>

              {/* Product Info - Compact on Mobile */}
              <div className="p-3.5 md:p-7 flex-1 flex flex-col justify-between space-y-3 md:space-y-6">
                <div className="space-y-1 md:space-y-2.5">
                  <h3 className="text-xs md:text-lg font-bold text-slate-dark group-hover:text-primary-blue transition-colors line-clamp-1 leading-snug">{product.name}</h3>
                  <p className="text-slate-dark/60 text-[9px] md:text-xs leading-normal line-clamp-2 md:line-clamp-3 font-normal">{product.description}</p>
                </div>

                <div className="space-y-2.5 md:space-y-4 pt-2.5 md:pt-4 border-t border-slate-light/60">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] md:text-[9px] text-slate-dark/40 font-bold uppercase tracking-wider">Estimasi Harga</span>
                    <span className="text-xs md:text-lg font-extrabold text-primary-blue leading-tight tracking-tight">{product.price}</span>
                  </div>
                  
                  {/* Two Buttons */}
                  <div className="grid grid-cols-2 gap-1.5 md:gap-3">
                    <button
                      onClick={() => setActiveDetailProduct(product)}
                      className="bg-slate-light hover:bg-slate-dark/10 text-slate-dark py-2 md:py-3 rounded-lg md:rounded-2xl font-bold text-[9px] md:text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => onInquireProduct(product)}
                      className="bg-primary-blue hover:bg-primary-blue-hover text-white py-2 md:py-3 rounded-lg md:rounded-2xl font-bold text-[9px] md:text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-0.5 md:gap-1.5 shadow-sm shadow-primary-blue/15"
                    >
                      <svg className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.57 1.978 14.1 1.053 11.479 1.053c-5.439 0-9.863 4.371-9.867 9.8.001 1.73.457 3.42 1.32 4.922L1.87 20.27l4.777-1.116z" />
                      </svg>
                      Tanya
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Modal Backdrop */}
      {activeDetailProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 pb-20 md:p-4">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setActiveDetailProduct(null)} />
          
          <div className="relative bg-white rounded-[2rem] w-full max-w-2xl md:max-w-5xl shadow-2xl overflow-hidden border border-slate-dark/5 flex flex-col md:flex-row max-h-[72vh] md:max-h-[85vh]">
            
            {/* Absolute positioned close button at the very top-right of the entire modal */}
            <button
              onClick={() => setActiveDetailProduct(null)}
              className="absolute top-4 right-4 z-20 bg-white/85 backdrop-blur-sm text-slate-dark/60 hover:text-slate-dark p-2 rounded-full cursor-pointer transition-all shadow-md hover:scale-105 border border-slate-dark/5 flex items-center justify-center"
            >
              <svg className="w-4.5 h-4.5 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Image Section */}
            <div className="relative md:w-1/2 bg-slate-light aspect-[16/10] md:aspect-auto overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeDetailProduct.image}
                alt={activeDetailProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-primary-blue text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
                {activeDetailProduct.category === 'sofa' ? 'Rak Single' : activeDetailProduct.category === 'table' ? 'Rak Double' : activeDetailProduct.category === 'lighting' ? 'Meja / Display' : 'Aksesoris'}
              </div>
            </div>

            {/* Modal Details Section */}
            <div className="p-5 md:p-12 md:w-1/2 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex justify-between items-start mb-3 md:mb-5">
                  <h3 className="text-base md:text-3xl font-extrabold text-slate-dark leading-tight pr-6">{activeDetailProduct.name}</h3>
                </div>
                
                <span className="text-base md:text-2xl font-extrabold text-primary-blue block mb-4 md:mb-6">{activeDetailProduct.price}</span>
                
                <p className="text-slate-dark/70 text-[11px] md:text-sm leading-relaxed mb-6">
                  {activeDetailProduct.description}
                </p>

                {activeDetailProduct.specs && activeDetailProduct.specs.length > 0 && (
                  <div className="space-y-3 mb-6">
                    <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-dark/40">Spesifikasi Detail</h4>
                    <ul className="space-y-2 text-[11px] md:text-sm text-slate-dark/80">
                      {activeDetailProduct.specs.map((spec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary-blue mt-0.5">•</span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-slate-light">
                <button
                  onClick={() => {
                    onInquireProduct(activeDetailProduct);
                    setActiveDetailProduct(null);
                  }}
                  className="w-full bg-primary-blue hover:bg-primary-blue-hover text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 text-[10px] md:text-xs md:text-sm uppercase tracking-wider shadow-md shadow-primary-blue/15"
                >
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.57 1.978 14.1 1.053 11.479 1.053c-5.439 0-9.863 4.371-9.867 9.8.001 1.73.457 3.42 1.32 4.922L1.87 20.27l4.777-1.116z" />
                  </svg>
                  Tanya Penawaran via WA
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
