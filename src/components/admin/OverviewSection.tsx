'use strict';
import React, { useState } from 'react';

interface Lead {
  id?: string;
  type: 'product' | 'service';
  created_at: string;
  message?: string;
}

interface OverviewSectionProps {
  visits: number;
  inquiries: number;
  leadsProduct: Lead[];
  leadsService: Lead[];
  shippingChecks: number;
  screentime: number;
  inquiryLogs: { timestamp: string; type: string }[];
  rawVisits?: { created_at: string }[];
}

export default function OverviewSection({
  visits,
  inquiries,
  leadsProduct,
  leadsService,
  shippingChecks,
  screentime,
  inquiryLogs,
  rawVisits,
}: OverviewSectionProps) {
  const [visitFilter, setVisitFilter] = useState<'week' | 'month' | 'year'>('month');
  const [leadFilter, setLeadFilter] = useState<'week' | 'month' | 'year'>('month');
  const [hoveredVisitIdx, setHoveredVisitIdx] = useState<number | null>(null);
  const [hoveredLeadIdx, setHoveredLeadIdx] = useState<number | null>(null);

  // Helper to group events by filter
  const groupEventsByFilter = (
    events: { created_at?: string; timestamp?: string }[],
    filter: 'week' | 'month' | 'year'
  ) => {
    const now = new Date();
    const currentYear = now.getFullYear();

    if (filter === 'week') {
      const points: { label: string; value: number }[] = [];
      for (let i = 11; i >= 0; i--) {
        const startOfWeek = new Date();
        startOfWeek.setDate(now.getDate() - i * 7 - startOfWeek.getDay() + 1); // Monday
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const formatDayMonth = (d: Date) => {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
          return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]}`;
        };

        const label = `${formatDayMonth(startOfWeek)}-${formatDayMonth(endOfWeek)}`;

        const count = events.filter((e) => {
          const dateStr = e.created_at || e.timestamp;
          if (!dateStr) return false;
          const eDate = new Date(dateStr);
          return eDate >= startOfWeek && eDate <= endOfWeek;
        }).length;

        points.push({ label, value: count });
      }
      return points;
    } else if (filter === 'month') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      return months.map((monthName, monthIndex) => {
        const startOfMonth = new Date(currentYear, monthIndex, 1, 0, 0, 0, 0);
        const endOfMonth = new Date(currentYear, monthIndex + 1, 0, 23, 59, 59, 999);

        const count = events.filter((e) => {
          const dateStr = e.created_at || e.timestamp;
          if (!dateStr) return false;
          const eDate = new Date(dateStr);
          return eDate >= startOfMonth && eDate <= endOfMonth;
        }).length;

        return { label: monthName, value: count };
      });
    } else {
      const points: { label: string; value: number }[] = [];
      const startYear = 2024;
      const endYear = Math.max(currentYear, 2026);
      for (let yr = startYear; yr <= endYear; yr++) {
        const startOfYear = new Date(yr, 0, 1, 0, 0, 0, 0);
        const endOfYear = new Date(yr, 11, 31, 23, 59, 59, 999);

        const count = events.filter((e) => {
          const dateStr = e.created_at || e.timestamp;
          if (!dateStr) return false;
          const eDate = new Date(dateStr);
          return eDate >= startOfYear && eDate <= endOfYear;
        }).length;

        points.push({ label: String(yr), value: count });
      }
      return points;
    }
  };

  // Calculate visit points dynamically from real DB data
  const visitChartData = groupEventsByFilter(rawVisits || [], visitFilter);
  const maxVisitVal = Math.max(...visitChartData.map((d) => d.value), 10);
  const visitPoints = visitChartData.map((pt, i) => ({
    x: 60 + i * (700 / (visitChartData.length - 1 || 1)),
    y: 180 - (pt.value / maxVisitVal) * 140,
    label: pt.label,
    value: pt.value
  }));

  // Calculate lead points dynamically from real DB data
  const allLeads = [...leadsProduct, ...leadsService];
  const leadChartData = groupEventsByFilter(allLeads, leadFilter);
  const maxLeadVal = Math.max(...leadChartData.map((d) => d.value), 10);
  const leadPoints = leadChartData.map((pt, i) => ({
    x: 60 + i * (700 / (leadChartData.length - 1 || 1)),
    y: 180 - (pt.value / maxLeadVal) * 140,
    label: pt.label,
    value: pt.value
  }));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* KPI Metric cards - Gradient colored blocks */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1. Total Kunjungan */}
        <div className="bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] text-white p-6 rounded-3xl shadow-xl shadow-sky-600/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider block">Total Kunjungan</span>
            <span className="text-3xl font-black block">{visits}</span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full inline-block font-semibold">Trafik Aktif</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl">
            👥
          </div>
        </div>

        {/* 2. Total Percakapan/Leads */}
        <div className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white p-6 rounded-3xl shadow-xl shadow-blue-600/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider block">Total Leads / Chat</span>
            <span className="text-3xl font-black block">{inquiries}</span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full inline-block font-semibold">
              {leadsProduct.length} Produk | {leadsService.length} Layanan
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl">
            💬
          </div>
        </div>

        {/* 3. Total Cek Ongkir */}
        <div className="bg-gradient-to-br from-[#06b6d4] to-[#0891b2] text-white p-6 rounded-3xl shadow-xl shadow-cyan-600/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider block">Total Cek Ongkir</span>
            <span className="text-3xl font-black block">{shippingChecks}</span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full inline-block font-semibold">Kalkulator Logistik</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl">
            🚚
          </div>
        </div>

        {/* 4. Screentime User */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-800 text-white p-6 rounded-3xl shadow-xl shadow-indigo-600/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider block">Screentime User</span>
            <span className="text-3xl font-black block">{(screentime / 60).toFixed(1)} Mnt</span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full inline-block font-semibold">Rata-rata Durasi Sesi</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl">
            ⏱️
          </div>
        </div>
      </div>

      {/* Sub Leads Tables (a. Leads Produk & b. Leads Layanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* a. Leads Produk Table */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>📦</span> Leads Produk
            </h3>
            <span className="bg-sky-50 text-sky-600 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">
              {leadsProduct.length} Leads
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100">
                  <th className="p-3">Waktu</th>
                  <th className="p-3">Detail Percakapan / Deskripsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {leadsProduct.slice(0, 5).map((l, index) => (
                  <tr key={l.id || index} className="hover:bg-slate-50/50">
                    <td className="p-3 text-slate-400 font-mono">
                      {l.created_at ? new Date(l.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                    </td>
                    <td className="p-3 text-slate-700">{l.message || 'N/A'}</td>
                  </tr>
                ))}
                {leadsProduct.length === 0 && (
                  <tr>
                    <td colSpan={2} className="p-6 text-center text-slate-400 italic">Belum ada leads produk masuk.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* b. Leads Layanan Table */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>🛠️</span> Leads Layanan
            </h3>
            <span className="bg-indigo-50 text-indigo-600 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">
              {leadsService.length} Leads
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100">
                  <th className="p-3">Waktu</th>
                  <th className="p-3">Detail Percakapan / Deskripsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {leadsService.slice(0, 5).map((l, index) => (
                  <tr key={l.id || index} className="hover:bg-slate-50/50">
                    <td className="p-3 text-slate-400 font-mono">
                      {l.created_at ? new Date(l.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                    </td>
                    <td className="p-3 text-slate-700">{l.message || 'N/A'}</td>
                  </tr>
                ))}
                {leadsService.length === 0 && (
                  <tr>
                    <td colSpan={2} className="p-6 text-center text-slate-400 italic">Belum ada leads layanan masuk.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Full-width charts layout */}
      <div className="grid grid-cols-1 gap-8">
        {/* Chart 1: Grafik Kunjungan */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Grafik Kunjungan</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Statistik jumlah kunjungan halaman depan website</p>
            </div>
            <div className="flex bg-[#f3f4f6] rounded-xl p-1 text-[9px] font-bold text-slate-500 self-start sm:self-auto">
              {(['week', 'month', 'year'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setVisitFilter(t)}
                  className={`px-3 py-1.5 rounded-lg uppercase tracking-wider cursor-pointer transition-all ${
                    visitFilter === t ? 'bg-[#0284c7] text-white shadow-sm' : 'hover:text-slate-800'
                  }`}
                >
                  {t === 'week' ? 'Per Minggu' : t === 'month' ? 'Per Bulan' : 'Per Tahun'}
                </button>
              ))}
            </div>
          </div>

          <div className="relative pt-4 overflow-x-auto">
            <svg className="w-full min-w-[760px] h-60" viewBox="0 0 800 250" fill="none">
              <line x1="60" y1="40" x2="760" y2="40" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="4" />
              <line x1="60" y1="75" x2="760" y2="75" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="4" />
              <line x1="60" y1="110" x2="760" y2="110" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="4" />
              <line x1="60" y1="145" x2="760" y2="145" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="4" />
              <line x1="60" y1="180" x2="760" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />

              <text x="25" y="44" className="fill-slate-400 text-[9px] font-bold">200</text>
              <text x="25" y="79" className="fill-slate-400 text-[9px] font-bold">150</text>
              <text x="25" y="114" className="fill-slate-400 text-[9px] font-bold">100</text>
              <text x="30" y="149" className="fill-slate-400 text-[9px] font-bold">50</text>
              <text x="35" y="184" className="fill-slate-400 text-[9px] font-bold">0</text>

              {visitPoints.map((pt, i) => (
                <text
                  key={i}
                  x={pt.x}
                  y="210"
                  transform={`rotate(-25, ${pt.x}, 210)`}
                  textAnchor="end"
                  className="fill-slate-400 text-[9px] font-bold"
                >
                  {pt.label}
                </text>
              ))}

              {visitPoints.length > 0 && (
                <path
                  d={`M ${visitPoints[0].x} ${visitPoints[0].y} ${visitPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}`}
                  stroke="#0284c7"
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {visitPoints.map((pt, i) => (
                <g key={i}>
                  <line
                    x1={pt.x}
                    y1={pt.y}
                    x2={pt.x}
                    y2={180}
                    stroke={hoveredVisitIdx === i ? "#0284c7" : "#e2e8f0"}
                    strokeWidth={hoveredVisitIdx === i ? 1.5 : 0.8}
                    strokeDasharray={hoveredVisitIdx === i ? "3" : "1"}
                  />
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredVisitIdx === i ? 6 : 4}
                    fill={hoveredVisitIdx === i ? "#0284c7" : "#ffffff"}
                    stroke="#0284c7"
                    strokeWidth={hoveredVisitIdx === i ? 3 : 2}
                    style={{ pointerEvents: 'none' }}
                  />
                  <g transform={`translate(${pt.x}, ${pt.y - 12})`}>
                    {hoveredVisitIdx === i && (
                      <rect x={-34} y={-13} width={68} height={16} rx={4} fill="#0f172a" />
                    )}
                    <text
                      x={0}
                      y={hoveredVisitIdx === i ? -2 : 0}
                      textAnchor="middle"
                      className={`text-[9px] font-extrabold ${
                        hoveredVisitIdx === i ? "fill-white" : "fill-[#0284c7]"
                      }`}
                      style={{ pointerEvents: 'none' }}
                    >
                      {hoveredVisitIdx === i ? `${pt.value} Kunj` : pt.value}
                    </text>
                  </g>
                  <rect
                    x={pt.x - 15}
                    y={20}
                    width={30}
                    height={180}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredVisitIdx(i)}
                    onMouseLeave={() => setHoveredVisitIdx(null)}
                  />
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Chart 2: Grafik Leads Keseluruhan */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Grafik Leads Keseluruhan</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Statistik konversi leads produk & layanan ritel</p>
            </div>
            <div className="flex bg-[#f3f4f6] rounded-xl p-1 text-[9px] font-bold text-slate-500 self-start sm:self-auto">
              {(['week', 'month', 'year'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setLeadFilter(t)}
                  className={`px-3 py-1.5 rounded-lg uppercase tracking-wider cursor-pointer transition-all ${
                    leadFilter === t ? 'bg-[#2563eb] text-white shadow-sm' : 'hover:text-slate-800'
                  }`}
                >
                  {t === 'week' ? 'Per Minggu' : t === 'month' ? 'Per Bulan' : 'Per Tahun'}
                </button>
              ))}
            </div>
          </div>

          <div className="relative pt-4 overflow-x-auto">
            <svg className="w-full min-w-[760px] h-60" viewBox="0 0 800 250" fill="none">
              <line x1="60" y1="40" x2="760" y2="40" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="4" />
              <line x1="60" y1="75" x2="760" y2="75" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="4" />
              <line x1="60" y1="110" x2="760" y2="110" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="4" />
              <line x1="60" y1="145" x2="760" y2="145" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="4" />
              <line x1="60" y1="180" x2="760" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />

              <text x="25" y="44" className="fill-slate-400 text-[9px] font-bold">200</text>
              <text x="25" y="79" className="fill-slate-400 text-[9px] font-bold">150</text>
              <text x="25" y="114" className="fill-slate-400 text-[9px] font-bold">100</text>
              <text x="30" y="149" className="fill-slate-400 text-[9px] font-bold">50</text>
              <text x="35" y="184" className="fill-slate-400 text-[9px] font-bold">0</text>

              {leadPoints.map((pt, i) => (
                <text
                  key={i}
                  x={pt.x}
                  y="210"
                  transform={`rotate(-25, ${pt.x}, 210)`}
                  textAnchor="end"
                  className="fill-slate-400 text-[9px] font-bold"
                >
                  {pt.label}
                </text>
              ))}

              {leadPoints.length > 0 && (
                <path
                  d={`M ${leadPoints[0].x} ${leadPoints[0].y} ${leadPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}`}
                  stroke="#2563eb"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {leadPoints.map((pt, i) => (
                <g key={i}>
                  <line
                    x1={pt.x}
                    y1={pt.y}
                    x2={pt.x}
                    y2={180}
                    stroke={hoveredLeadIdx === i ? "#2563eb" : "#e2e8f0"}
                    strokeWidth={hoveredLeadIdx === i ? 1.5 : 0.8}
                    strokeDasharray={hoveredLeadIdx === i ? "3" : "1"}
                  />
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredLeadIdx === i ? 6 : 4}
                    fill={hoveredLeadIdx === i ? "#2563eb" : "#ffffff"}
                    stroke="#2563eb"
                    strokeWidth={hoveredLeadIdx === i ? 3 : 2}
                    style={{ pointerEvents: 'none' }}
                  />
                  <g transform={`translate(${pt.x}, ${pt.y - 12})`}>
                    {hoveredLeadIdx === i && (
                      <rect x={-34} y={-13} width={68} height={16} rx={4} fill="#0f172a" />
                    )}
                    <text
                      x={0}
                      y={hoveredLeadIdx === i ? -2 : 0}
                      textAnchor="middle"
                      className={`text-[9px] font-extrabold ${
                        hoveredLeadIdx === i ? "fill-white" : "fill-[#2563eb]"
                      }`}
                      style={{ pointerEvents: 'none' }}
                    >
                      {hoveredLeadIdx === i ? `${pt.value} Leads` : pt.value}
                    </text>
                  </g>
                  <rect
                    x={pt.x - 15}
                    y={20}
                    width={30}
                    height={180}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredLeadIdx(i)}
                    onMouseLeave={() => setHoveredLeadIdx(null)}
                  />
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Row 4: Timeline Activities */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <span>📍</span> Aktivitas Terkini / Terbaru
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative before:absolute before:inset-y-1 before:left-3 before:w-0.5 before:bg-slate-100">
          {inquiryLogs.map((log, index) => (
            <div key={index} className="flex items-start gap-4 text-xs relative z-10 pl-4">
              <div className="w-6.5 h-6.5 rounded-full bg-sky-50 border-2 border-sky-400 flex items-center justify-center flex-shrink-0 font-bold text-[10px]">
                🔔
              </div>
              <div>
                <p className="font-bold text-slate-800 leading-snug">{log.type}</p>
                <span className="text-[9px] text-slate-400 block mt-0.5 font-semibold">
                  {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} • {new Date(log.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
