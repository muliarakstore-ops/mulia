'use strict';
import React from 'react';
import { Product } from '../../types';

interface CatalogSectionProps {
  products: Product[];
  openAddModal: () => void;
  openEditModal: (product: Product) => void;
  handleDeleteProduct: (id: string, name: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  modalMode: 'add' | 'edit';
  prodName: string;
  setProdName: (val: string) => void;
  prodCategory: 'sofa' | 'table' | 'lighting' | 'decor';
  setProdCategory: (val: 'sofa' | 'table' | 'lighting' | 'decor') => void;
  prodPrice: string;
  setProdPrice: (val: string) => void;
  prodImage: string;
  setProdImage: (val: string) => void;
  prodDescription: string;
  setProdDescription: (val: string) => void;
  prodSpecs: string;
  setProdSpecs: (val: string) => void;
  handleSaveProduct: (e: React.FormEvent) => void;
}

export default function CatalogSection({
  products,
  openAddModal,
  openEditModal,
  handleDeleteProduct,
  isModalOpen,
  setIsModalOpen,
  modalMode,
  prodName,
  setProdName,
  prodCategory,
  setProdCategory,
  prodPrice,
  setProdPrice,
  prodImage,
  setProdImage,
  prodDescription,
  setProdDescription,
  prodSpecs,
  setProdSpecs,
  handleSaveProduct,
}: CatalogSectionProps) {
  return (
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
                  placeholder="Contoh:&#10;Tinggi: 180 cm&#10;Lebar: 45 cm&#10;Kapasitas: 80kg/shelving"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary-blue/60 transition-colors leading-relaxed font-mono"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-primary-blue hover:bg-primary-blue-hover text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md shadow-primary-blue/15 cursor-pointer"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
