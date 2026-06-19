'use strict';
import React from 'react';
import { IncludedService } from '../../constants/mockData';

interface ServicesSectionProps {
  services: IncludedService[];
  openAddSrvModal: () => void;
  openEditSrvModal: (srv: IncludedService, index: number) => void;
  handleDeleteService: (index: number, title: string) => void;
  isSrvModalOpen: boolean;
  setIsSrvModalOpen: (open: boolean) => void;
  srvModalMode: 'add' | 'edit';
  srvTitle: string;
  setSrvTitle: (val: string) => void;
  srvDescription: string;
  setSrvDescription: (val: string) => void;
  handleSaveService: (e: React.FormEvent) => void;
}

export default function ServicesSection({
  services,
  openAddSrvModal,
  openEditSrvModal,
  handleDeleteService,
  isSrvModalOpen,
  setIsSrvModalOpen,
  srvModalMode,
  srvTitle,
  setSrvTitle,
  srvDescription,
  setSrvDescription,
  handleSaveService,
}: ServicesSectionProps) {
  return (
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
