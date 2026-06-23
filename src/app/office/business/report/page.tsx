'use strict';
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../utils/supabase';

// Transaction types including 'prive' and 'capex'
interface Transaction {
  id: string;
  date: string;
  desc: string;
  type: 'penjualan' | 'pengeluaran' | 'permodalan' | 'prive' | 'capex';
  amount: number;
  qty?: number;
}

interface SVGLineChartProps {
  data: number[];
  labels: string[];
  gradientColors: [string, string];
  strokeColor: string;
  gradientId: string;
  valueSuffix?: string;
}

function SVGLineChart({
  data,
  labels,
  gradientColors,
  strokeColor,
  gradientId,
  valueSuffix = ''
}: SVGLineChartProps) {
  const width = 500;
  const height = 160;
  const paddingLeftRight = 30;
  const paddingTop = 15;
  const paddingBottom = 30;
  const chartWidth = width - paddingLeftRight * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxVal = Math.max(...data, 1);

  const points = data.map((val, idx) => {
    const x = paddingLeftRight + (idx / (data.length - 1 || 1)) * chartWidth;
    const y = height - paddingBottom - (val / maxVal) * chartHeight;
    return { x, y, val };
  });

  const curvePath = points.length > 0 ? (() => {
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return path;
  })() : '';

  const fillPath = curvePath
    ? `${curvePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`
    : '';

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={gradientColors[0]} stopOpacity="0.45" />
            <stop offset="100%" stopColor={gradientColors[1]} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = paddingTop + ratio * chartHeight;
          return (
            <line
              key={i}
              x1={paddingLeftRight}
              y1={y}
              x2={width - paddingLeftRight}
              y2={y}
              stroke="#f1f5f9"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Area fill */}
        {fillPath && <path d={fillPath} fill={`url(#${gradientId})`} />}

        {/* Line stroke */}
        {curvePath && (
          <path
            d={curvePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Interactive dots */}
        {points.map((pt, idx) => (
          <g key={idx} className="group/dot cursor-pointer">
            <circle
              cx={pt.x}
              cy={pt.y}
              r="4"
              fill={strokeColor}
              stroke="#fff"
              strokeWidth="2.5"
              className="transition-all duration-200 group-hover/dot:r-6"
            />
            <g className="opacity-0 group-hover/dot:opacity-100 transition-opacity duration-200 pointer-events-none">
              <rect
                x={pt.x - 35}
                y={pt.y - 30}
                width="70"
                height="18"
                rx="6"
                fill="#0f172a"
              />
              <text
                x={pt.x}
                y={pt.y - 18}
                fill="#fff"
                fontSize="8"
                fontWeight="bold"
                textAnchor="middle"
                className="font-mono"
              >
                {pt.val.toLocaleString('id-ID')}{valueSuffix}
              </text>
            </g>
          </g>
        ))}

        {/* X Axis Labels */}
        {points.map((pt, idx) => {
          const step = labels.length > 12 ? 4 : labels.length > 7 ? 2 : 1;
          const shouldShow = idx % step === 0 || idx === labels.length - 1;
          if (!shouldShow) return null;
          return (
            <text
              key={idx}
              x={pt.x}
              y={height - 8}
              fill="#94a3b8"
              fontSize="8.5"
              fontWeight="extrabold"
              textAnchor="middle"
              className="select-none font-sans uppercase tracking-wider"
            >
              {labels[idx]}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function SVGGaugeChart({ value, label, color = '#6366f1' }: { value: number; label: string; color?: string }) {
  const percentage = Math.min(100, Math.max(0, value));
  const radius = 35;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const angle = (percentage / 100) * Math.PI + Math.PI;
  const needleLength = 28;
  const needleX = 50 + needleLength * Math.cos(angle);
  const needleY = 80 + needleLength * Math.sin(angle);

  return (
    <div className="w-full flex flex-col items-center justify-center p-2">
      <div className="relative w-36 h-24">
        <svg viewBox="0 0 100 90" className="w-full h-full">
          <path
            d="M 15 80 A 35 35 0 0 1 85 80"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 15 80 A 35 35 0 0 1 85 80"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
          <circle cx="50" cy="80" r="4.5" fill="#1e293b" />
          <line
            x1="50"
            y1="80"
            x2={needleX}
            y2={needleY}
            stroke="#1e293b"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute bottom-1 inset-x-0 flex flex-col items-center justify-center text-center">
          <span className="text-sm font-black font-mono text-slate-800 leading-none">{value}%</span>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{label}</span>
        </div>
      </div>
    </div>
  );
}

interface SVGStackedBarChartProps {
  data: {
    label: string;
    segments: { name: string; val: number; color: string }[];
  }[];
  valueSuffix?: string;
}

function SVGStackedBarChart({ data, valueSuffix = '' }: SVGStackedBarChartProps) {
  const width = 500;
  const height = 180;
  const paddingLeft = 45;
  const paddingRight = 100;
  const paddingTop = 20;
  const paddingBottom = 30;
  
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxVal = Math.max(...data.map(d => d.segments.reduce((acc, s) => acc + s.val, 0)), 1);

  const uniqueSegments = useMemo(() => {
    const list: { name: string; color: string }[] = [];
    data.forEach(d => {
      d.segments.forEach(s => {
        if (!list.some(item => item.name === s.name)) {
          list.push({ name: s.name, color: s.color });
        }
      });
    });
    return list;
  }, [data]);

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = paddingTop + ratio * chartHeight;
          const labelVal = Math.round(maxVal * (1 - ratio));
          return (
            <g key={i} className="opacity-60">
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#f1f5f9"
                strokeWidth="1.5"
              />
              <text
                x={paddingLeft - 8}
                y={y + 3}
                fill="#94a3b8"
                fontSize="8"
                fontWeight="bold"
                textAnchor="end"
                className="font-mono"
              >
                {labelVal.toLocaleString('id-ID')}{valueSuffix}
              </text>
            </g>
          );
        })}

        {data.map((bar, barIdx) => {
          const colWidth = Math.min(45, chartWidth / (data.length || 1) - 15);
          const x = paddingLeft + (barIdx / (data.length || 1)) * chartWidth + (chartWidth / (data.length || 1) - colWidth) / 2;
          let currentYOffset = 0;

          return (
            <g key={barIdx}>
              {bar.segments.map((seg, segIdx) => {
                const segHeight = (seg.val / maxVal) * chartHeight;
                const y = height - paddingBottom - currentYOffset - segHeight;
                currentYOffset += segHeight;

                return (
                  <g key={segIdx} className="group/rect cursor-pointer">
                    <rect
                      x={x}
                      y={y}
                      width={colWidth}
                      height={segHeight}
                      fill={seg.color}
                      rx="3"
                      className="transition-all duration-300 hover:opacity-90"
                    />
                    <g className="opacity-0 group-hover/rect:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <rect
                        x={x + colWidth / 2 - 45}
                        y={Math.max(10, y - 25)}
                        width="90"
                        height="20"
                        rx="6"
                        fill="#0f172a"
                      />
                      <text
                        x={x + colWidth / 2}
                        y={Math.max(10, y - 25) + 12}
                        fill="#fff"
                        fontSize="7.5"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="font-sans"
                      >
                        {seg.name}: {seg.val.toLocaleString('id-ID')}{valueSuffix}
                      </text>
                    </g>
                  </g>
                );
              })}
              <text
                x={x + colWidth / 2}
                y={height - paddingBottom + 16}
                fill="#64748b"
                fontSize="9"
                fontWeight="extrabold"
                textAnchor="middle"
                className="font-sans uppercase tracking-wider"
              >
                {bar.label}
              </text>
            </g>
          );
        })}

        {uniqueSegments.map((seg, idx) => {
          const x = width - paddingRight + 12;
          const y = paddingTop + idx * 16 + 5;
          return (
            <g key={idx}>
              <rect x={x} y={y - 5} width="8" height="8" rx="2" fill={seg.color} />
              <text
                x={x + 14}
                y={y + 2}
                fill="#475569"
                fontSize="7.5"
                fontWeight="extrabold"
                className="font-sans uppercase tracking-wider"
              >
                {seg.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

interface DonutSlice {
  name: string;
  qty: number;
  percent: number;
  color: string;
  abbr: string;
}

function StockPieChart() {
  const stockData: DonutSlice[] = [
    { name: 'Rak Single', qty: 120, percent: 30, color: '#0284c7', abbr: 'SGL' },
    { name: 'Rak Double', qty: 160, percent: 40, color: '#6366f1', abbr: 'DBL' },
    { name: 'Meja Kasir', qty: 80, percent: 20, color: '#10b981', abbr: 'KSR' },
    { name: 'Aksesoris/Lainnya', qty: 40, percent: 10, color: '#f59e0b', abbr: 'AKS' },
  ];

  const totalQty = stockData.reduce((acc, s) => acc + s.qty, 0);
  const radius = 35;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;
  let textAccumulatedPercent = 0;

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-4 w-full">
      <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <filter id="donut-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.16" />
            </filter>
          </defs>

          <circle
            cx="50"
            cy="50"
            r="46"
            fill="transparent"
            stroke="#cbd5e1"
            strokeWidth="0.8"
            strokeDasharray="4 3"
            className="opacity-80"
          />
          {stockData.map((slice, idx) => {
            const strokeLength = (slice.percent / 100) * circumference;
            const strokeOffset = circumference - (accumulatedPercent / 100) * circumference;
            accumulatedPercent += slice.percent;

            return (
              <circle
                key={idx}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth="14"
                strokeDasharray={`${strokeLength} ${circumference}`}
                strokeDashoffset={strokeOffset}
                transform="rotate(-90 50 50)"
                filter="url(#donut-shadow)"
                className="transition-all duration-300 hover:stroke-[16] cursor-pointer"
              />
            );
          })}
          {stockData.map((slice, idx) => {
            const midPercent = textAccumulatedPercent + slice.percent / 2;
            textAccumulatedPercent += slice.percent;
            const angle = (midPercent / 100) * 2 * Math.PI - Math.PI / 2;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);

            return (
              <text
                key={idx}
                x={x}
                y={y}
                fill="#ffffff"
                fontSize="6"
                fontWeight="900"
                textAnchor="middle"
                dominantBaseline="central"
                className="font-sans pointer-events-none select-none tracking-wider drop-shadow-sm"
              >
                {slice.abbr}
              </text>
            );
          })}
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-[9px] uppercase font-extrabold text-slate-455 tracking-wider">Total</span>
          <span className="text-base font-black text-slate-900 font-mono leading-none">{totalQty}</span>
          <span className="text-[9px] text-slate-500 font-bold uppercase leading-none mt-0.5">Unit</span>
        </div>
      </div>

      <div className="w-full space-y-2 border-t border-slate-100 pt-3">
        {stockData.map((slice, idx) => (
          <div key={idx} className="flex justify-between items-center text-xs bg-slate-50 hover:bg-slate-100/50 p-2 rounded-xl transition-colors">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: slice.color }} />
              <span className="font-bold text-slate-700">{slice.name} <span className="text-slate-400 font-medium">({slice.abbr})</span></span>
            </div>
            <div className="text-right space-x-1.5 font-mono">
              <span className="text-slate-950 font-black">{slice.qty} Unit</span>
              <span className="text-slate-400 font-semibold">({slice.percent}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegionSharePieChart() {
  const data: DonutSlice[] = [
    { name: 'Depok', qty: 140, percent: 35, color: '#0284c7', abbr: 'DPK' },
    { name: 'Jakarta Timur', qty: 120, percent: 30, color: '#6366f1', abbr: 'JKT' },
    { name: 'Bekasi', qty: 80, percent: 20, color: '#10b981', abbr: 'BKS' },
    { name: 'Bogor', qty: 60, percent: 15, color: '#f59e0b', abbr: 'BGR' },
  ];

  const totalQty = data.reduce((acc, s) => acc + s.qty, 0);
  const radius = 35;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;
  let textAccumulatedPercent = 0;

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-4 w-full">
      <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <filter id="donut-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.16" />
            </filter>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="transparent"
            stroke="#cbd5e1"
            strokeWidth="0.8"
            strokeDasharray="4 3"
            className="opacity-80"
          />
          {data.map((slice, idx) => {
            const strokeLength = (slice.percent / 100) * circumference;
            const strokeOffset = circumference - (accumulatedPercent / 100) * circumference;
            accumulatedPercent += slice.percent;

            return (
              <circle
                key={idx}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth="14"
                strokeDasharray={`${strokeLength} ${circumference}`}
                strokeDashoffset={strokeOffset}
                transform="rotate(-90 50 50)"
                filter="url(#donut-shadow)"
                className="transition-all duration-300 hover:stroke-[16] cursor-pointer"
              />
            );
          })}
          {data.map((slice, idx) => {
            const midPercent = textAccumulatedPercent + slice.percent / 2;
            textAccumulatedPercent += slice.percent;
            const angle = (midPercent / 100) * 2 * Math.PI - Math.PI / 2;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);

            return (
              <text
                key={idx}
                x={x}
                y={y}
                fill="#ffffff"
                fontSize="6"
                fontWeight="900"
                textAnchor="middle"
                dominantBaseline="central"
                className="font-sans pointer-events-none select-none tracking-wider drop-shadow-sm"
              >
                {slice.abbr}
              </text>
            );
          })}
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider">Total</span>
          <span className="text-base font-black text-slate-900 font-mono leading-none">{totalQty}</span>
          <span className="text-[9px] text-slate-500 font-bold uppercase leading-none mt-0.5">Unit</span>
        </div>
      </div>

      <div className="w-full space-y-2 border-t border-slate-100 pt-3">
        {data.map((slice, idx) => (
          <div key={idx} className="flex justify-between items-center text-xs bg-slate-50 hover:bg-slate-100/50 p-2 rounded-xl transition-colors">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: slice.color }} />
              <span className="font-bold text-slate-700">{slice.name} <span className="text-slate-400 font-medium">({slice.abbr})</span></span>
            </div>
            <div className="text-right space-x-1.5 font-mono">
              <span className="text-slate-950 font-black">{slice.qty} Unit</span>
              <span className="text-slate-400 font-semibold">({slice.percent}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StockValuePieChart() {
  const stockValueData: DonutSlice[] = [
    { name: 'Rak Single', qty: 120, percent: 45, color: '#0284c7', abbr: 'SGL' },
    { name: 'Rak Double', qty: 160, percent: 36, color: '#6366f1', abbr: 'DBL' },
    { name: 'Meja Kasir', qty: 80, percent: 19, color: '#10b981', abbr: 'KSR' },
  ];

  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;
  let textAccumulatedPercent = 0;

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-4 w-full">
      <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <filter id="donut-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.16" />
            </filter>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="transparent"
            stroke="#cbd5e1"
            strokeWidth="0.8"
            strokeDasharray="4 3"
            className="opacity-80"
          />
          {stockValueData.map((slice, idx) => {
            const strokeLength = (slice.percent / 100) * circumference;
            const strokeOffset = circumference - (accumulatedPercent / 100) * circumference;
            accumulatedPercent += slice.percent;

            return (
              <circle
                key={idx}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth="14"
                strokeDasharray={`${strokeLength} ${circumference}`}
                strokeDashoffset={strokeOffset}
                transform="rotate(-90 50 50)"
                filter="url(#donut-shadow)"
                className="transition-all duration-300 hover:stroke-[16] cursor-pointer"
              />
            );
          })}
          {stockValueData.map((slice, idx) => {
            const midPercent = textAccumulatedPercent + slice.percent / 2;
            textAccumulatedPercent += slice.percent;
            const angle = (midPercent / 100) * 2 * Math.PI - Math.PI / 2;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);

            return (
              <text
                key={idx}
                x={x}
                y={y}
                fill="#ffffff"
                fontSize="6"
                fontWeight="900"
                textAnchor="middle"
                dominantBaseline="central"
                className="font-sans pointer-events-none select-none tracking-wider drop-shadow-sm"
              >
                {slice.abbr}
              </text>
            );
          })}
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-[9px] uppercase font-extrabold text-slate-455 tracking-wider">Total</span>
          <span className="text-sm font-black text-slate-900 font-mono leading-none">Rp 33.6M</span>
        </div>
      </div>

      <div className="w-full space-y-2 border-t border-slate-100 pt-3">
        {stockValueData.map((slice, idx) => {
          const val = slice.name === 'Rak Single' ? 15000000 : slice.name === 'Rak Double' ? 12000000 : 6600000;
          return (
            <div key={idx} className="flex justify-between items-center text-xs bg-slate-50 hover:bg-slate-100/50 p-2 rounded-xl transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: slice.color }} />
                <span className="font-bold text-slate-700">{slice.name} <span className="text-slate-400 font-medium">({slice.abbr})</span></span>
              </div>
              <div className="text-right space-x-1.5 font-mono">
                <span className="text-slate-950 font-black">Rp {val.toLocaleString('id-ID')}</span>
                <span className="text-slate-400 font-semibold">({slice.percent}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function LedgerReportPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  const [transactions] = useState<Transaction[]>([
    { id: '1', date: '2026-06-18', desc: 'Penjualan Rak Gondola Single Utama T150 (20 unit)', type: 'penjualan', amount: 17000000, qty: 20 },
    { id: '2', date: '2026-06-17', desc: 'Pembelian Cat Powder Coating (Bahan Baku)', type: 'pengeluaran', amount: 8900050 },
    { id: '3', date: '2026-06-15', desc: 'Injeksi Modal Tambahan Owner Iqbal', type: 'permodalan', amount: 150000000 },
    { id: '4', date: '2026-06-10', desc: 'Penjualan Rak Double Sambung T150 (5 unit)', type: 'penjualan', amount: 6000000, qty: 5 },
    { id: '5', date: '2026-06-05', desc: 'Bensin & Operasional Armada Logistik', type: 'pengeluaran', amount: 1200000 },
    { id: '6', date: '2026-06-03', desc: 'Penarikan Prive Owner Iqbal (Pribadi)', type: 'prive', amount: 5000000 },
    { id: '7', date: '2026-06-02', desc: 'Pembelian Mesin Tekuk Plat Baja Baru', type: 'capex', amount: 45000000 },
  ]);

  const [revenueFilter, setRevenueFilter] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Monthly');

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

  const monthlyRevenue = useMemo(() => {
    return transactions
      .filter(t => t.type === 'penjualan')
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [transactions]);

  const cogsTotal = 8900050;
  const opexTotal = 1200000;

  const netProfit = useMemo(() => {
    const revenue = transactions.filter(t => t.type === 'penjualan').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'pengeluaran').reduce((acc, t) => acc + t.amount, 0);
    return revenue - expense;
  }, [transactions]);

  const monthlyProfitMargin = useMemo(() => {
    if (monthlyRevenue === 0) return 0;
    return (netProfit / monthlyRevenue) * 100;
  }, [monthlyRevenue, netProfit]);

  const getFilterData = (filterType: string, datasets: { Weekly: number[]; Monthly: number[]; Yearly: number[] }) => {
    return datasets[filterType as keyof typeof datasets] || [];
  };

  const getFilterLabels = (filterType: string) => {
    if (filterType === 'Weekly') {
      return ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min', 'M1', 'M2', 'M3', 'M4', 'M5'];
    } else if (filterType === 'Monthly') {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    } else {
      return ['\'12', '\'13', '\'14', '\'15', '\'16', '\'17', '\'18', '\'19', '\'20', '\'21', '\'22', '\'23', '\'24', '\'25', '\'26'];
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500 text-sm">
        🔒 Memverifikasi Akses Keamanan...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 space-y-8 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            📊 Laporan Keuangan Lengkap
          </h1>
          <p className="text-xs text-slate-500 mt-1">Grafik visualisasi detail omset revenue, profit margin, HPP/COGS, & biaya beban operasional Mulia Rak Store.</p>
        </div>
        <button
          onClick={() => router.push('/office/business')}
          className="px-4.5 py-2.5 bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-sm transition-all flex items-center gap-2"
        >
          ⬅️ Kembali ke Buku Kas
        </button>
      </div>

      {/* SECTION 2: ANALISIS PENDAPATAN (REVENUE) */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-2">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">💰 Analisis Pendapatan (Revenue)</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card & Pie Chart */}
          <div className="lg:col-span-5 bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-100/40 hover:shadow-md hover:shadow-slate-250/30 transition-all duration-300 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-extrabold text-slate-455 tracking-wider block">Revenue Keseluruhan (Bulan Ini)</span>
              <span className="text-3xl font-black text-slate-900 font-mono mt-1.5 block">Rp {monthlyRevenue.toLocaleString('id-ID')}</span>
              <span className="text-xs text-slate-500 block mt-2">Berdasarkan total omset penjualan ready di Buku Kas.</span>
            </div>
            <div className="mt-6 border-t border-slate-100 pt-4">
              <h4 className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider mb-2 text-center">Revenue per Produk</h4>
              <StockValuePieChart />
            </div>
          </div>

          {/* Revenue per Periode (Bulan, Tahun) */}
          <div className="lg:col-span-7 bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-100/40 hover:shadow-md hover:shadow-slate-250/30 transition-all duration-300 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm uppercase font-extrabold tracking-wider text-slate-700">📈 Revenue per Periode</h3>
                <p className="text-xs text-slate-500">Perbandingan trend omset berkala.</p>
              </div>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                {['Weekly', 'Monthly', 'Yearly'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setRevenueFilter(f as any)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-all ${
                      revenueFilter === f ? 'bg-white text-[#0284c7] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <SVGLineChart
              data={getFilterData(revenueFilter, {
                Weekly: [15, 18, 14, 22, 25, 19, 28, 30, 27, 35, 32, 40],
                Monthly: [35, 42, 38, 45, 40, 55, 48, 65, 60, 70, 68, 85],
                Yearly: [8, 12, 15, 18, 22, 25, 30, 28, 35, 40, 48, 55, 62, 70, 78, 85, 95, 110, 125, 140]
              })}
              labels={getFilterLabels(revenueFilter)}
              gradientColors={['#0284c7', '#38bdf8']}
              strokeColor="#0284c7"
              gradientId="revenue-grad-2"
              valueSuffix="jt"
            />
          </div>
        </div>

        {/* Revenue per Produk per Periode */}
        <div className="bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-100/40 hover:shadow-md hover:shadow-slate-250/30 transition-all duration-300">
          <h3 className="text-sm uppercase font-extrabold tracking-wider text-slate-700 mb-2">📊 Revenue per Produk per Periode</h3>
          <p className="text-xs text-slate-500 mb-6">Tren pendapatan segmentasi produk dari kuartal pertama.</p>
          <SVGLineChart
            data={[45, 48, 52, 60, 58, 65, 70, 68, 75, 82, 85, 90]}
            labels={['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']}
            gradientColors={['#6366f1', '#a5b4fc']}
            strokeColor="#6366f1"
            gradientId="revenue-prod-periode"
            valueSuffix="jt"
          />
        </div>
      </div>

      {/* SECTION 3: ANALISIS MARJIN LABA */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-2">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">📊 Laporan Keuangan</h3>
        </div>
      </div>
    </div>
  );
}
