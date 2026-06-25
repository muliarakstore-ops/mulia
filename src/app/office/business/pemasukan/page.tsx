'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../utils/supabase';

export interface DBProduct {
  id: string;
  name: string;
  min_price: number;
  max_price: number;
}

export default function PemasukanPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [dbProducts, setDbProducts] = useState<DBProduct[]>([]);
  const [pemasukanType, setPemasukanType] = useState<'penjualan' | 'permodalan'>('penjualan');
  const [submitting, setSubmitting] = useState(false);

  // 1. Penjualan Form States
  const [salesPelanggan, setSalesPelanggan] = useState('');
  const [salesDaerah, setSalesDaerah] = useState('Depok');
  const [salesPengiriman, setSalesPengiriman] = useState<'#Ambil' | '#Pasang' | '#Ekspedisi'>('#Ambil');
  const [salesEkspedisi, setSalesEkspedisi] = useState('');
  const [salesRows, setSalesRows] = useState<{ id_produk: string; qty: number; harga_nego: number }[]>([
    { id_produk: '', qty: 1, harga_nego: 0 }
  ]);

  // 2. Permodalan Form States
  const [modalWaktu, setModalWaktu] = useState(new Date().toISOString().split('T')[0]);
  const [modalJenis, setModalJenis] = useState<'#Injeksi Modal' | '#Penempatan Aset'>('#Injeksi Modal');
  const [modalTunai, setModalTunai] = useState('');
  const [modalAsetNama, setModalAsetNama] = useState('');
  const [modalAsetNilai, setModalAsetNilai] = useState('');
  const [modalTarifDepresiasi, setModalTarifDepresiasi] = useState('25');

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
      setCheckingAuth(false);
    };
    checkAuth();
  }, [router]);

  // Fetch products from Supabase
  useEffect(() => {
    if (checkingAuth) return;
    async function loadProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, min_price, max_price');
      if (data && !error) {
        setDbProducts(data);
      }
    }
    loadProducts();
  }, [checkingAuth]);

  // Handle Sales Row Adding
  const addSalesRow = () => {
    setSalesRows([...salesRows, { id_produk: '', qty: 1, harga_nego: 0 }]);
  };
  const removeSalesRow = (idx: number) => {
    setSalesRows(salesRows.filter((_, i) => i !== idx));
  };
  const updateSalesRow = (idx: number, field: string, val: any) => {
    const updated = [...salesRows];
    updated[idx] = { ...updated[idx], [field]: val };
    
    if (field === 'id_produk') {
      const prod = dbProducts.find(p => p.id === val);
      if (prod) {
        updated[idx].harga_nego = Number(prod.min_price) || 0;
      }
    }
    setSalesRows(updated);
  };

  // Submit Handler
  const handlePemasukanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (pemasukanType === 'penjualan') {
        if (!salesPelanggan.trim()) {
          alert('Nama pelanggan wajib diisi.');
          setSubmitting(false);
          return;
        }

        const salesData = {
          nama_pelanggan: salesPelanggan,
          daerah_tujuan: salesDaerah,
          jenis_pengiriman: salesPengiriman,
          nama_ekspedisi: salesPengiriman === '#Ekspedisi' ? salesEkspedisi : null
        };

        const { data: invRecord, error: invError } = await supabase
          .from('transaksi_penjualan')
          .insert(salesData)
          .select()
          .single();

        if (invError) throw invError;

        const detailsPayload = salesRows.map(row => ({
          id_transaksi: invRecord.id_transaksi,
          id_produk: row.id_produk,
          qty_terjual: Number(row.qty),
          harga_satuan_nego: Number(row.harga_nego)
        }));

        const { error: dError } = await supabase
          .from('detail_penjualan_produk')
          .insert(detailsPayload);

        if (dError) throw dError;

        alert('Transaksi penjualan berhasil disimpan ke Supabase!');
        router.push('/office/business');

      } else {
        const isAset = modalJenis === '#Penempatan Aset';
        const payload = {
          waktu_input: modalWaktu,
          jenis_permodalan: modalJenis,
          nominal_tunai: isAset ? null : Number(modalTunai) || 0,
          nama_aset: isAset ? modalAsetNama : null,
          nilai_buku_aset: isAset ? Number(modalAsetNilai) || 0 : null,
          tarif_depresiasi: isAset ? Number(modalTarifDepresiasi) || 0 : null
        };

        const { error } = await supabase
          .from('transaksi_permodalan')
          .insert(payload);

        if (error) throw error;
        alert('Transaksi modal berhasil disimpan ke Supabase!');
        router.push('/office/business');
      }
    } catch (err: any) {
      console.error(err);
      alert(`Gagal menyimpan transaksi: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 font-sans">
        <div className="animate-spin text-2xl">⏳</div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-2">Memverifikasi Otorisasi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header Navigation */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900">📥 Ruang Input Pemasukan</h1>
            <p className="text-xs text-slate-500 mt-0.5">Catat transaksi penjualan nota dinamis atau penambahan permodalan bisnis.</p>
          </div>
          <button
            onClick={() => router.push('/office/business')}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase border border-slate-200 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            ← Kembali
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 p-1.5 bg-slate-200/60 rounded-2xl">
          <button
            type="button"
            onClick={() => setPemasukanType('penjualan')}
            className={`flex-1 py-3 text-xs md:text-sm font-black rounded-xl transition-all cursor-pointer ${
              pemasukanType === 'penjualan' ? 'bg-white text-[#0284c7] shadow-sm' : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            🛒 1. Form Penjualan (Sistem Nota Dinamis)
          </button>
          <button
            type="button"
            onClick={() => setPemasukanType('permodalan')}
            className={`flex-1 py-3 text-xs md:text-sm font-black rounded-xl transition-all cursor-pointer ${
              pemasukanType === 'permodalan' ? 'bg-white text-[#0284c7] shadow-sm' : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            💰 2. Form Permodalan
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handlePemasukanSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6 text-xs font-semibold text-slate-700">
          {pemasukanType === 'penjualan' ? (
            <>
              {/* Data Utama */}
              <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/50 space-y-4">
                <span className="text-[10px] font-black uppercase text-slate-450 tracking-wider block">A. Data Utama Nota (Cukup Diisi 1 Kali)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] font-bold text-slate-450 uppercase mb-1">Nama Pelanggan</label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama pelanggan"
                      value={salesPelanggan}
                      onChange={(e) => setSalesPelanggan(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-sky-500 shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-slate-450 uppercase mb-1">Daerah Tujuan</label>
                    <select
                      value={salesDaerah}
                      onChange={(e) => setSalesDaerah(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="Depok">Depok</option>
                      <option value="Jakarta Timur">Jakarta Timur</option>
                      <option value="Bekasi">Bekasi</option>
                      <option value="Bogor">Bogor</option>
                      <option value="Sukabumi">Sukabumi</option>
                      <option value="Bandung">Bandung</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Jenis Pengiriman</label>
                    <select
                      value={salesPengiriman}
                      onChange={(e) => setSalesPengiriman(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="#Ambil">#Ambil</option>
                      <option value="#Pasang">#Pasang</option>
                      <option value="#Ekspedisi">#Ekspedisi</option>
                    </select>
                  </div>
                  {salesPengiriman === '#Ekspedisi' && (
                    <div>
                      <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Nama Ekspedisi (Wajib)</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Dakota Cargo / Indah Cargo"
                        value={salesEkspedisi}
                        onChange={(e) => setSalesEkspedisi(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-sky-500 shadow-2xs"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Data Produk Dinamis */}
              <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/50 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-slate-455 tracking-wider block">B. Data Baris Produk (Dapat Ditambah Dinamis)</span>
                  <button
                    type="button"
                    onClick={addSalesRow}
                    className="px-3 py-1.5 bg-[#0284c7] hover:bg-sky-600 text-white font-bold text-[9px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    ➕ Tambah Baris Produk
                  </button>
                </div>

                <div className="space-y-4">
                  {salesRows.map((row, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-3 items-stretch md:items-end border-b border-slate-200/60 pb-4 last:border-0 last:pb-0">
                      <div className="flex-1">
                        <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Produk</label>
                        <select
                          required
                          value={row.id_produk}
                          onChange={(e) => updateSalesRow(idx, 'id_produk', e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
                        >
                          <option value="">-- Pilih Produk --</option>
                          {dbProducts.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-full md:w-20">
                        <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Qty</label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={row.qty}
                          onChange={(e) => updateSalesRow(idx, 'qty', e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs text-center focus:outline-none"
                        />
                      </div>
                      <div className="flex-1 col-span-2">
                        <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Harga Nego Satuan (Rp)</label>
                        <input
                          type="number"
                          required
                          value={row.harga_nego}
                          onChange={(e) => updateSalesRow(idx, 'harga_nego', e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-4 py-2 w-full md:w-36">
                        <span className="md:hidden text-slate-400 font-bold uppercase text-[8px]">Total:</span>
                        <span className="font-mono font-black text-xs text-[#0284c7]">
                          Rp {(row.qty * row.harga_nego).toLocaleString('id-ID')}
                        </span>
                        {salesRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSalesRow(idx)}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl cursor-pointer"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            // Permodalan
            <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/50 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] font-bold text-slate-450 uppercase mb-1">Waktu Input</label>
                  <input
                    type="date"
                    required
                    value={modalWaktu}
                    onChange={(e) => setModalWaktu(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-bold text-slate-450 uppercase mb-1">Jenis Permodalan</label>
                  <select
                    value={modalJenis}
                    onChange={(e) => setModalJenis(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="#Injeksi Modal">#Injeksi Modal</option>
                    <option value="#Penempatan Aset">#Penempatan Aset</option>
                  </select>
                </div>
              </div>

              {modalJenis === '#Injeksi Modal' ? (
                <div>
                  <label className="block text-[8px] font-bold text-slate-450 uppercase mb-1">Nominal Tunai (Rp)</label>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 150000000"
                    value={modalTunai}
                    onChange={(e) => setModalTunai(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none shadow-2xs"
                  />
                </div>
              ) : (
                <div className="border-t border-slate-200/60 pt-4 space-y-4">
                  <div>
                    <label className="block text-[8px] font-bold text-slate-450 uppercase mb-1">Nama Aset</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: iPhone 17 / Mesin Potong Baru"
                      value={modalAsetNama}
                      onChange={(e) => setModalAsetNama(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none shadow-2xs"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Nilai Buku Aset (Rp)</label>
                      <input
                        type="number"
                        required
                        placeholder="Masukkan nilai wajar aset"
                        value={modalAsetNilai}
                        onChange={(e) => setModalAsetNilai(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Tarif Depresiasi (% / tahun)</label>
                      <input
                        type="number"
                        required
                        placeholder="Contoh: 25 untuk 25%"
                        value={modalTarifDepresiasi}
                        onChange={(e) => setModalTarifDepresiasi(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none shadow-2xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            {submitting ? '⏳ Menyimpan data...' : '💾 Simpan Pemasukan'}
          </button>
        </form>
      </div>
    </div>
  );
}
