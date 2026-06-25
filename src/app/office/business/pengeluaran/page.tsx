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

export default function PengeluaranPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [dbProducts, setDbProducts] = useState<DBProduct[]>([]);
  const [salesList, setSalesList] = useState<any[]>([]);
  const [pengeluaranType, setPengeluaranType] = useState<'restock' | 'opex' | 'perawatan' | 'prive'>('restock');
  const [submitting, setSubmitting] = useState(false);

  // 1. Restock Form States
  const [restockWaktu, setRestockWaktu] = useState(new Date().toISOString().split('T')[0]);
  const [restockRows, setRestockRows] = useState<{ id_produk: string; qty: number; harga_kulak: number }[]>([
    { id_produk: '', qty: 1, harga_kulak: 0 }
  ]);

  // 2. OPEX Form States
  const [opexWaktu, setOpexWaktu] = useState(new Date().toISOString().split('T')[0]);
  const [opexKategori, setOpexKategori] = useState<'#Pengiriman' | '#Office/Gudang' | '#Bongkar'>('#Pengiriman');
  const [opexJenisPengiriman, setOpexJenisPengiriman] = useState<'#Pasang' | '#Ekspedisi'>('#Pasang');
  const [opexPelangganTerkait, setOpexPelangganTerkait] = useState('');
  const [opexKebutuhan, setOpexKebutuhan] = useState('Sewa Mobil');
  const [opexNominal, setOpexNominal] = useState('');

  // 3. Perawatan Aset Form States
  const [careWaktu, setCareWaktu] = useState(new Date().toISOString().split('T')[0]);
  const [careJenis, setCareJenis] = useState<'#Perbaikan' | '#Peremajaan'>('#Perbaikan');
  const [careNama, setCareNama] = useState('');
  const [careAtetap, setCareAtetap] = useState('');
  const [careBiaya, setCareBiaya] = useState('');

  // 4. Prive Form States
  const [priveWaktu, setPriveWaktu] = useState(new Date().toISOString().split('T')[0]);
  const [priveOwner, setPriveOwner] = useState('Iqbal');
  const [priveKeterangan, setPriveKeterangan] = useState('');
  const [priveNominal, setPriveNominal] = useState('');

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

  // Fetch products and active sales invoices
  useEffect(() => {
    if (checkingAuth) return;
    async function loadData() {
      // Load products catalog
      const { data: pData } = await supabase
        .from('products')
        .select('id, name, min_price, max_price');
      if (pData) setDbProducts(pData);

      // Load sales list for opex dropdown
      const { data: sData } = await supabase
        .from('transaksi_penjualan')
        .select('id_transaksi, waktu_transaksi, nama_pelanggan, daerah_tujuan')
        .order('waktu_transaksi', { ascending: false });
      if (sData) setSalesList(sData);
    }
    loadData();
  }, [checkingAuth]);

  // Dynamic opex items list logic
  useEffect(() => {
    if (opexKategori === '#Pengiriman') {
      if (opexJenisPengiriman === '#Pasang') {
        setOpexKebutuhan('Sewa Mobil');
      } else {
        setOpexKebutuhan('Biaya Ekspedisi/Ongkir');
      }
    } else if (opexKategori === '#Office/Gudang') {
      setOpexKebutuhan('Gaji Karyawan Bulanan');
    } else if (opexKategori === '#Bongkar') {
      setOpexKebutuhan('Biaya Transport Bongkar');
    }
  }, [opexKategori, opexJenisPengiriman]);

  // Restock list row operations
  const addRestockRow = () => {
    setRestockRows([...restockRows, { id_produk: '', qty: 1, harga_kulak: 0 }]);
  };
  const removeRestockRow = (idx: number) => {
    setRestockRows(restockRows.filter((_, i) => i !== idx));
  };
  const updateRestockRow = (idx: number, field: string, val: any) => {
    const updated = [...restockRows];
    updated[idx] = { ...updated[idx], [field]: val };
    if (field === 'id_produk') {
      const prod = dbProducts.find(p => p.id === val);
      if (prod) {
        updated[idx].harga_kulak = Math.round((Number(prod.min_price) || 0) * 0.7);
      }
    }
    setRestockRows(updated);
  };

  const handlePengeluaranSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (pengeluaranType === 'restock') {
        const { data: klkRecord, error: klkError } = await supabase
          .from('transaksi_kulakan')
          .insert({ waktu_kulakan: restockWaktu })
          .select()
          .single();

        if (klkError) throw klkError;

        const details = restockRows.map(r => ({
          id_kulakan: klkRecord.id_kulakan,
          id_produk: r.id_produk,
          qty_kulakan: Number(r.qty),
          harga_kulak_satuan: Number(r.harga_kulak)
        }));

        const { error: dError } = await supabase
          .from('detail_kulakan_produk')
          .insert(details);

        if (dError) throw dError;

        alert('Transaksi kulakan berhasil disimpan ke Supabase!');
        router.push('/office/business');

      } else if (pengeluaranType === 'opex') {
        const payload = {
          waktu_opex: opexWaktu,
          kategori_operasional: opexKategori,
          jenis_pengiriman_opex: opexKategori === '#Pengiriman' ? opexJenisPengiriman : null,
          nama_pelanggan_terkait: (opexKategori === '#Pengiriman' && opexPelangganTerkait) ? opexPelangganTerkait : null,
          kebutuhan_opex: opexKebutuhan,
          nominal_opex: Number(opexNominal) || 0
        };

        const { error } = await supabase
          .from('transaksi_opex')
          .insert(payload);

        if (error) throw error;
        alert('Biaya operasional berhasil disimpan!');
        router.push('/office/business');

      } else if (pengeluaranType === 'perawatan') {
        const payload = {
          waktu_perawatan: careWaktu,
          jenis_perawatan: careJenis,
          nama_pengeluaran: careNama,
          id_aset_tetap: careAtetap || null,
          nominal_biaya: Number(careBiaya) || 0
        };

        const { error } = await supabase
          .from('transaksi_perawatan_aset')
          .insert(payload);

        if (error) throw error;
        alert('Biaya perawatan aset berhasil disimpan!');
        router.push('/office/business');

      } else {
        const payload = {
          waktu_prive: priveWaktu,
          nama_owner: priveOwner,
          keterangan_prive: priveKeterangan,
          nominal_prive: Number(priveNominal) || 0
        };

        const { error } = await supabase
          .from('transaksi_prive')
          .insert(payload);

        if (error) throw error;
        alert('Penarikan Prive berhasil disimpan!');
        router.push('/office/business');
      }
    } catch (err: any) {
      console.error(err);
      alert(`Gagal menyimpan pengeluaran: ${err.message}`);
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
            <h1 className="text-xl md:text-2xl font-black text-slate-900">📤 Ruang Input Pengeluaran</h1>
            <p className="text-xs text-slate-500 mt-0.5">Catat pos pengeluaran modal kulakan, biaya operasional opex, atau penarikan prive owner.</p>
          </div>
          <button
            onClick={() => router.push('/office/business')}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase border border-slate-200 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            ← Kembali
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 p-1.5 bg-slate-200/60 rounded-2xl flex-wrap">
          {[
            { id: 'restock', label: '📦 1. Form Restock (Kulakan Stok)' },
            { id: 'opex', label: '⚡ 2. Form Biaya Operasional (OPEX)' },
            { id: 'perawatan', label: '🔧 3. Form Perawatan Aset' },
            { id: 'prive', label: '👋 4. Form Pengambilan Prive' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPengeluaranType(tab.id as any)}
              className={`flex-1 min-w-[140px] py-3 text-xs font-black rounded-xl transition-all cursor-pointer ${
                pengeluaranType === tab.id ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-650 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Container */}
        <form onSubmit={handlePengeluaranSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6 text-xs font-semibold text-slate-700">
          {pengeluaranType === 'restock' && (
            <>
              <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/50 space-y-4">
                <div>
                  <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Tanggal Kulakan</label>
                  <input
                    type="date"
                    required
                    value={restockWaktu}
                    onChange={(e) => setRestockWaktu(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Restock Baris Dinamis */}
              <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/50 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-slate-455 tracking-wider block">B. Data Baris Kulakan (Dapat Ditambah Dinamis)</span>
                  <button
                    type="button"
                    onClick={addRestockRow}
                    className="px-3 py-1.5 bg-rose-650 hover:bg-rose-500 text-white font-bold text-[9px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    ➕ Tambah Baris Kulakan
                  </button>
                </div>

                <div className="space-y-4">
                  {restockRows.map((row, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-3 items-stretch md:items-end border-b border-slate-200/60 pb-4 last:border-0 last:pb-0">
                      <div className="flex-1">
                        <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Produk</label>
                        <select
                          required
                          value={row.id_produk}
                          onChange={(e) => updateRestockRow(idx, 'id_produk', e.target.value)}
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
                          onChange={(e) => updateRestockRow(idx, 'qty', e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs text-center focus:outline-none"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Harga Modal Satuan (Rp)</label>
                        <input
                          type="number"
                          required
                          value={row.harga_kulak}
                          onChange={(e) => updateRestockRow(idx, 'harga_kulak', e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-4 py-2 w-full md:w-36">
                        <span className="md:hidden text-slate-400 font-bold uppercase text-[8px]">Total:</span>
                        <span className="font-mono font-black text-xs text-rose-600">
                          Rp {(row.qty * row.harga_kulak).toLocaleString('id-ID')}
                        </span>
                        {restockRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRestockRow(idx)}
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
          )}

          {pengeluaranType === 'opex' && (
            <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/50 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Tanggal OPEX</label>
                  <input
                    type="date"
                    required
                    value={opexWaktu}
                    onChange={(e) => setOpexWaktu(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Kategori Operasional</label>
                  <select
                    value={opexKategori}
                    onChange={(e) => setOpexKategori(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="#Pengiriman">#Pengiriman</option>
                    <option value="#Office/Gudang">#Office/Gudang</option>
                    <option value="#Bongkar">#Bongkar</option>
                  </select>
                </div>
              </div>

              {opexKategori === '#Pengiriman' && (
                <div className="border-t border-slate-200 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Jenis Pengiriman OPEX</label>
                    <select
                      value={opexJenisPengiriman}
                      onChange={(e) => setOpexJenisPengiriman(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="#Pasang">#Pasang (Mrs Armada)</option>
                      <option value="#Ekspedisi">#Ekspedisi (Cargo)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Pelanggan Terkait (Nota)</label>
                    <select
                      required
                      value={opexPelangganTerkait}
                      onChange={(e) => setOpexPelangganTerkait(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="">-- Pilih Nota Pelanggan --</option>
                      {salesList.map(s => (
                        <option key={s.id_transaksi} value={s.id_transaksi}>
                          {s.nama_pelanggan} ({s.daerah_tujuan}) - {s.id_transaksi}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Kebutuhan OPEX</label>
                  {opexKategori === '#Pengiriman' ? (
                    opexJenisPengiriman === '#Pasang' ? (
                      <select
                        value={opexKebutuhan}
                        onChange={(e) => setOpexKebutuhan(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="Sewa Mobil">Sewa Mobil</option>
                        <option value="Gaji Tukang">Gaji Tukang</option>
                        <option value="Bensin">Bensin</option>
                        <option value="Toll/Parkir">Toll/Parkir</option>
                        <option value="Konsumsi">Konsumsi</option>
                      </select>
                    ) : (
                      <select
                        value={opexKebutuhan}
                        onChange={(e) => setOpexKebutuhan(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="Biaya Ekspedisi/Ongkir">Biaya Ekspedisi/Ongkir</option>
                      </select>
                    )
                  ) : opexKategori === '#Office/Gudang' ? (
                    <select
                      value={opexKebutuhan}
                      onChange={(e) => setOpexKebutuhan(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="Gaji Karyawan Bulanan">Gaji Karyawan Bulanan</option>
                      <option value="Perawatan & Kebersihan">Perawatan & Kebersihan</option>
                      <option value="Perlengkapan Gudang">Perlengkapan Gudang</option>
                      <option value="Sewa Gudang">Sewa Gudang</option>
                      <option value="Konsumsi Gudang">Konsumsi Gudang</option>
                      <option value="Biaya Marketing/Periklanan">Biaya Marketing/Periklanan</option>
                    </select>
                  ) : (
                    <select
                      value={opexKebutuhan}
                      onChange={(e) => setOpexKebutuhan(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="Biaya Transport Bongkar">Biaya Transport Bongkar</option>
                      <option value="Konsumsi Bongkar">Konsumsi Bongkar</option>
                      <option value="Gaji Bongkar">Gaji Bongkar</option>
                      <option value="Lain-Lain">Lain-Lain</option>
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Nominal Pengeluaran (Rp)</label>
                  <input
                    type="number"
                    required
                    placeholder="Masukkan jumlah rupiah real"
                    value={opexNominal}
                    onChange={(e) => setOpexNominal(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {pengeluaranType === 'perawatan' && (
            <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/50 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Tanggal Perawatan</label>
                  <input
                    type="date"
                    required
                    value={careWaktu}
                    onChange={(e) => setCareWaktu(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Jenis Perawatan</label>
                  <select
                    value={careJenis}
                    onChange={(e) => setCareJenis(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="#Perbaikan">#Perbaikan (OPEX)</option>
                    <option value="#Peremajaan">#Peremajaan (CAPEX)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Nama Tindakan / Detail Pengeluaran</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Perbaikan Oven Coating / Oli Mobil Box"
                  value={careNama}
                  onChange={(e) => setCareNama(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Aset Tetap Terkait (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Masukkan ID aset tetap"
                    value={careAtetap}
                    onChange={(e) => setCareAtetap(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Nominal Biaya (Rp)</label>
                  <input
                    type="number"
                    required
                    placeholder="Masukkan pengeluaran rupiah"
                    value={careBiaya}
                    onChange={(e) => setCareBiaya(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {pengeluaranType === 'prive' && (
            <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/50 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Tanggal Prive</label>
                  <input
                    type="date"
                    required
                    value={priveWaktu}
                    onChange={(e) => setPriveWaktu(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Nama Owner</label>
                  <select
                    value={priveOwner}
                    onChange={(e) => setPriveOwner(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="Iqbal">Iqbal</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Keterangan Penarikan Prive</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Penarikan uang cash keperluan berobat"
                  value={priveKeterangan}
                  onChange={(e) => setPriveKeterangan(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[8px] font-bold text-slate-455 uppercase mb-1">Nominal Prive (Rp)</label>
                <input
                  type="number"
                  required
                  placeholder="Jumlah penarikan"
                  value={priveNominal}
                  onChange={(e) => setPriveNominal(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-rose-600 hover:bg-rose-500 disabled:bg-slate-450 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            {submitting ? '⏳ Menyimpan data...' : '💾 Simpan Pengeluaran'}
          </button>
        </form>
      </div>
    </div>
  );
}
