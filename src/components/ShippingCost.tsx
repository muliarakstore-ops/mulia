'use strict';
import React, { useState, useMemo } from 'react';

interface ShippingCostProps {
  onSendWhatsAppShipping: (destination: string, vehicle: string, cost: string) => void;
}

const DESTINATIONS = [
  { id: 'jkt', label: 'DKI Jakarta / JABODETABEK', basePrice: 350000, duration: '1-2 Hari' },
  { id: 'jabar', label: 'Jawa Barat (Bandung, Cirebon, dll)', basePrice: 600000, duration: '2-3 Hari' },
  { id: 'jateng', label: 'Jawa Tengah (Semarang, Solo, Jogja)', basePrice: 900000, duration: '2-4 Hari' },
  { id: 'jatim', label: 'Jawa Timur (Surabaya, Malang, dll)', basePrice: 200000, duration: '1-2 Hari' },
  { id: 'bali', label: 'Bali & Lombok (Denpasar, Mataram)', basePrice: 1600000, duration: '3-5 Hari' },
  { id: 'sumatra', label: 'Sumatra (Lampung, Palembang, dll)', basePrice: 2200000, duration: '4-7 Hari' },
  { id: 'other', label: 'Luar Pulau Lainnya (Kalimantan, Sulawesi)', basePrice: 3500000, duration: '5-9 Hari' },
];

const VEHICLES = [
  { id: 'pickup', label: 'Pick-Up Box (Kapasitas s/d 12 Rak)', multiplier: 1.0 },
  { id: 'cde', label: 'Truk Engkel CDE (Kapasitas 13 - 30 Rak)', multiplier: 1.5 },
  { id: 'cdd', label: 'Truk Double CDD (Kapasitas 31 - 60 Rak)', multiplier: 2.2 },
  { id: 'fuso', label: 'Truk Fuso Besar (Kapasitas > 60 Rak)', multiplier: 3.5 },
];

export default function ShippingCost({ onSendWhatsAppShipping }: ShippingCostProps) {
  const [selectedDestId, setSelectedDestId] = useState<string>('jkt');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('pickup');

  const selectedDest = useMemo(() => {
    return DESTINATIONS.find((d) => d.id === selectedDestId) || DESTINATIONS[0];
  }, [selectedDestId]);

  const selectedVehicle = useMemo(() => {
    return VEHICLES.find((v) => v.id === selectedVehicleId) || VEHICLES[0];
  }, [selectedVehicleId]);

  const estimatedCost = useMemo(() => {
    return Math.round(selectedDest.basePrice * selectedVehicle.multiplier);
  }, [selectedDest, selectedVehicle]);

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleInquireShipping = () => {
    const costString = formatIDR(estimatedCost);
    onSendWhatsAppShipping(selectedDest.label, selectedVehicle.label, costString);
  };

  return (
    <section id="shipping" className="pt-16 pb-6 md:py-24 px-4 md:px-12 max-w-7xl mx-auto space-y-8 md:space-y-12">
      
      {/* Title Header - Left aligned on mobile, Center aligned on desktop */}
      <div className="text-left md:text-center md:max-w-2xl md:mx-auto space-y-2">
        <div className="inline-block bg-primary-blue-light text-primary-blue border border-primary-blue/20 px-3.5 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">
          🚚 Distribusi Aman Se-Indonesia
        </div>
        <h2 className="text-2xl md:text-4xl font-extrabold text-slate-dark tracking-tight">Estimasi Cek Ongkir Kargo</h2>
        <p className="text-slate-dark/60 text-[10px] md:text-base">Hitung perkiraan ongkos kirim pengiriman rak gondola besi menggunakan armada kargo darat & laut terbaik.</p>
      </div>

      {/* Desktop Card (md and above) */}
      <div className="hidden md:grid max-w-6xl mx-auto bg-white rounded-3xl p-12 border border-slate-dark/5 shadow-md grid-cols-2 gap-16 items-stretch min-h-[440px]">
        <div className="space-y-8 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-slate-dark border-b border-slate-light pb-3">Pilih Parameter Pengiriman</h3>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-dark/60">Wilayah / Daerah Tujuan</label>
            <select
              value={selectedDestId}
              onChange={(e) => setSelectedDestId(e.target.value)}
              className="w-full bg-slate-light border border-slate-dark/10 focus:border-primary-blue/60 text-slate-dark rounded-xl px-4 py-3.5 text-sm focus:outline-none cursor-pointer transition-colors"
            >
              {DESTINATIONS.map((d) => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-dark/60">Estimasi Kapasitas / Jenis Kendaraan</label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full bg-slate-light border border-slate-dark/10 focus:border-primary-blue/60 text-slate-dark rounded-xl px-4 py-3.5 text-sm focus:outline-none cursor-pointer transition-colors"
            >
              {VEHICLES.map((v) => (
                <option key={v.id} value={v.id}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-primary-blue-light/50 border border-primary-blue/15 rounded-2xl p-8 flex flex-col justify-between h-full">
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary-blue">Hasil Perkiraan Ongkir</h3>
            <div className="space-y-1">
              <span className="text-xs text-slate-dark/60 block">Estimasi Tarif Kargo:</span>
              <span className="text-4xl font-extrabold text-primary-blue block">{formatIDR(estimatedCost)}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-5 border-t border-primary-blue/15 text-xs text-slate-dark/80">
              <div>
                <span className="font-semibold block text-slate-dark/50 mb-1">Waktu Pengiriman:</span>
                <span className="font-bold text-slate-dark text-sm">{selectedDest.duration}</span>
              </div>
              <div>
                <span className="font-semibold block text-slate-dark/50 mb-1">Asal Pabrik:</span>
                <span className="font-bold text-slate-dark text-sm">Surabaya / Sidoarjo</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleInquireShipping}
            className="w-full mt-8 bg-primary-blue hover:bg-primary-blue-hover text-white font-bold py-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-md shadow-primary-blue/15"
          >
            Tanya Ongkir via WhatsApp
          </button>
        </div>
      </div>

      {/* Mobile Card */}
      <div className="md:hidden w-full max-w-sm mx-auto bg-white rounded-2xl p-5 border border-slate-dark/5 shadow-sm space-y-4">
        <div className="space-y-3">
          <div>
            <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-dark/50 mb-1">Tujuan</label>
            <select
              value={selectedDestId}
              onChange={(e) => setSelectedDestId(e.target.value)}
              className="w-full bg-slate-light text-slate-dark rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer border border-transparent"
            >
              {DESTINATIONS.map((d) => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-dark/50 mb-1">Armada</label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full bg-slate-light text-slate-dark rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer border border-transparent"
            >
              {VEHICLES.map((v) => (
                <option key={v.id} value={v.id}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Minimalized compact output block */}
        <div className="bg-primary-blue-light/40 border border-primary-blue/10 rounded-xl p-3.5 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-dark/60 text-[10px]">Estimasi Ongkir:</span>
            <span className="font-extrabold text-primary-blue text-sm">{formatIDR(estimatedCost)}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] border-t border-primary-blue/10 pt-2 text-slate-dark/70">
            <span>Estimasi Waktu:</span>
            <span className="font-bold">{selectedDest.duration}</span>
          </div>
        </div>

        <button
          onClick={handleInquireShipping}
          className="w-full bg-primary-blue text-white text-[10px] font-bold py-3 rounded-xl transition-all cursor-pointer text-center uppercase tracking-wider shadow-sm shadow-primary-blue/15 block"
        >
          Tanya Ongkir via WA
        </button>
      </div>
    </section>
  );
}
