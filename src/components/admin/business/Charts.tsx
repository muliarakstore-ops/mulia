'use strict';
'use client';

import React, { useMemo, useState } from 'react';

export interface Transaction {
  id: string;
  date: string;
  desc: string;
  type: 'penjualan' | 'pengeluaran' | 'permodalan' | 'prive' | 'capex';
  amount: number;
  qty?: number;
}

export interface SVGLineChartProps {
  data: number[];
  labels: string[];
  gradientColors: [string, string];
  strokeColor: string;
  gradientId: string;
  valueSuffix?: string;
}

export function SVGLineChart({
  data,
  labels,
  gradientColors,
  strokeColor,
  gradientId,
  valueSuffix = ''
}: SVGLineChartProps) {
  const width = 550;
  const height = 160;
  const paddingLeftRight = 25;
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

        {fillPath && <path d={fillPath} fill={`url(#${gradientId})`} />}

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

        {points.map((pt, idx) => {
          const fontSize = labels.length > 12 ? "6.2" : "7.5";
          return (
            <text
              key={idx}
              x={pt.x}
              y={height - 8}
              fill="#64748b"
              fontSize={fontSize}
              fontWeight="bold"
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

export function SVGGaugeChart({ value, label, color = '#6366f1' }: { value: number; label: string; color?: string }) {
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

export interface SVGStackedBarChartProps {
  data: {
    label: string;
    segments: { name: string; val: number; color: string }[];
  }[];
  valueSuffix?: string;
}

export function SVGStackedBarChart({ data, valueSuffix = '' }: SVGStackedBarChartProps) {
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

export interface DonutSlice {
  name: string;
  qty: number;
  percent: number;
  color: string;
  abbr: string;
}

export function StockPieChart({ products }: { products?: any[] }) {
  const stockData = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }

    const total = products.reduce((acc, p) => acc + (p.stock || 0), 0);
    return products.map((p, idx) => {
      const colors = ['#0284c7', '#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#f43f5e'];
      const abbrs = ['SGL', 'END', 'DBL', 'GUD', 'KSR', 'KSL', 'SNC'];
      const nameParts = p.name.split(' ');
      const generatedAbbr = nameParts.length > 1 
        ? nameParts.map((w: string) => w[0]).join('').slice(0, 3).toUpperCase()
        : p.name.slice(0, 3).toUpperCase();
      return {
        name: p.name,
        qty: p.stock || 0,
        percent: total > 0 ? Math.round(((p.stock || 0) / total) * 100) : 0,
        color: colors[idx % colors.length],
        abbr: generatedAbbr || abbrs[idx % abbrs.length]
      };
    });
  }, [products]);

  if (stockData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-xs font-semibold">
        <span>📦 Tidak ada data stok tersedia</span>
      </div>
    );
  }

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
          <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider">Total</span>
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

export function RegionSharePieChart() {
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

export function StockValuePieChart({ products }: { products?: any[] }) {
  const stockValueData = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }

    const values = products.map((p) => ({
      name: p.name,
      val: p.stockValue !== undefined ? p.stockValue : (p.stock || 0) * (p.min_price || 0)
    }));
    const totalVal = values.reduce((acc, v) => acc + v.val, 0);

    return products.map((p, idx) => {
      const colors = ['#0284c7', '#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#f43f5e'];
      const val = p.stockValue !== undefined ? p.stockValue : (p.stock || 0) * (p.min_price || 0);
      const nameParts = p.name.split(' ');
      const generatedAbbr = nameParts.length > 1 
        ? nameParts.map((w: string) => w[0]).join('').slice(0, 3).toUpperCase()
        : p.name.slice(0, 3).toUpperCase();
      return {
        name: p.name,
        qty: p.stock || 0,
        val,
        percent: totalVal > 0 ? Math.round((val / totalVal) * 100) : 0,
        color: colors[idx % colors.length],
        abbr: generatedAbbr || 'PRD'
      };
    });
  }, [products]);

  if (stockValueData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-xs font-semibold">
        <span>💰 Tidak ada aset stok terdaftar</span>
      </div>
    );
  }

  const totalValueSum = useMemo(() => {
    return stockValueData.reduce((acc, s) => acc + (s.val || 0), 0);
  }, [stockValueData]);

  const formattedTotal = useMemo(() => {
    if (totalValueSum >= 1000000000) {
      return `Rp ${(totalValueSum / 1000000000).toFixed(1)}M`;
    }
    if (totalValueSum >= 1000000) {
      return `Rp ${(totalValueSum / 1000000).toFixed(1)} Jt`;
    }
    return `Rp ${totalValueSum.toLocaleString('id-ID')}`;
  }, [totalValueSum]);

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
          <span className="text-[9px] uppercase font-extrabold text-[#0284c7] tracking-wider">Total</span>
          <span className="text-[10px] font-black text-slate-900 font-mono leading-none break-all max-w-[70px] text-center">{formattedTotal}</span>
        </div>
      </div>

      <div className="w-full space-y-2 border-t border-slate-100 pt-3">
        {stockValueData.map((slice, idx) => {
          return (
            <div key={idx} className="flex justify-between items-center text-xs bg-slate-50 hover:bg-slate-100/50 p-2 rounded-xl transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: slice.color }} />
                <span className="font-bold text-slate-700">{slice.name} <span className="text-slate-400 font-medium">({slice.abbr})</span></span>
              </div>
              <div className="text-right space-x-1.5 font-mono">
                <span className="text-slate-950 font-black">Rp {slice.val.toLocaleString('id-ID')}</span>
                <span className="text-slate-400 font-semibold">({slice.percent}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ShippingTypePieChart({ sales }: { sales?: any[] }) {
  const shippingData = useMemo(() => {
    if (!sales || sales.length === 0) {
      return [];
    }

    const qtyMandiri = sales.filter(s => s.jenis_pengiriman === '#Pasang').length;
    const qtyEkspedisi = sales.filter(s => s.jenis_pengiriman === '#Ekspedisi').length;
    const total = qtyMandiri + qtyEkspedisi;

    return [
      { name: 'Mandiri', qty: qtyMandiri, percent: total > 0 ? Math.round((qtyMandiri / total) * 100) : 0, color: '#6366f1', abbr: 'MND' },
      { name: 'Ekspedisi', qty: qtyEkspedisi, percent: total > 0 ? Math.round((qtyEkspedisi / total) * 100) : 0, color: '#10b981', abbr: 'EXP' }
    ];
  }, [sales]);

  if (shippingData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400 text-xs font-semibold">
        <span>🚚 Tidak ada data pengiriman</span>
      </div>
    );
  }

  const totalQty = useMemo(() => {
    return shippingData.reduce((acc, s) => acc + s.qty, 0);
  }, [shippingData]);
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
          {shippingData.map((slice, idx) => {
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
          {shippingData.map((slice, idx) => {
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
          <span className="text-[9px] text-slate-500 font-bold uppercase leading-none mt-0.5">Kirim</span>
        </div>
      </div>

      <div className="w-full space-y-2 border-t border-slate-100 pt-3">
        {shippingData.map((slice, idx) => (
          <div key={idx} className="flex justify-between items-center text-xs bg-slate-50 hover:bg-slate-100/50 p-2 rounded-xl transition-colors">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: slice.color }} />
              <span className="font-bold text-slate-700">{slice.name} <span className="text-slate-400 font-medium">({slice.abbr})</span></span>
            </div>
            <div className="text-right space-x-1.5 font-mono">
              <span className="text-slate-950 font-black">{slice.qty} Kirim</span>
              <span className="text-slate-400 font-semibold">({slice.percent}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface DeliveryCalendarProps {
  transactions: Transaction[];
}

export function DeliveryCalendar({ transactions }: DeliveryCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<number>(18);

  const salesMap = useMemo(() => {
    const map: Record<string, Transaction[]> = {};
    transactions
      .filter(t => t.type === 'penjualan')
      .forEach(t => {
        if (!map[t.date]) {
          map[t.date] = [];
        }
        map[t.date].push(t);
      });
    return map;
  }, [transactions]);

  const daysInMonth = 30;
  const blankDays = 1;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const selectedDateStr = `2026-06-${String(selectedDay).padStart(2, '0')}`;
  const selectedDayName = useMemo(() => {
    try {
      return new Date(2026, 5, selectedDay).toLocaleDateString('en-US', { weekday: 'long' });
    } catch {
      return 'Wednesday';
    }
  }, [selectedDay]);

  const activeDayTransactions = salesMap[selectedDateStr] || [];

  return (
    <div className="bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-100/40 hover:shadow-md hover:shadow-slate-250/30 transition-all duration-300 space-y-5">
      <div>
        <h3 className="text-sm uppercase font-extrabold tracking-wider text-slate-700">📅 Kalender Tracker Pengiriman</h3>
        <p className="text-xs text-slate-500 mt-0.5">Pantau jadwal pengiriman barang secara otomatis berdasarkan Buku Kas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-black text-slate-900 font-sans">
              {selectedDay} Jun, 26 <span className="text-slate-400 font-semibold text-xs ml-1">{selectedDayName}</span>
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedDay(prev => Math.max(1, prev - 1))}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 text-slate-650 cursor-pointer transition-colors"
              >
                &lt;
              </button>
              <button 
                onClick={() => setSelectedDay(prev => Math.min(30, prev + 1))}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 text-slate-650 cursor-pointer transition-colors"
              >
                &gt;
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-455 uppercase mb-4">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center">
            {Array.from({ length: blankDays }).map((_, idx) => (
              <div key={`blank-${idx}`} className="h-10" />
            ))}

            {days.map((day) => {
              const dateStr = `2026-06-${String(day).padStart(2, '0')}`;
              const daySales = salesMap[dateStr];
              const isDeliveryDay = !!daySales;
              const isSelected = selectedDay === day;
              const dotColor = isDeliveryDay ? (day % 3 === 0 ? 'bg-rose-500' : day % 3 === 1 ? 'bg-indigo-500' : 'bg-emerald-500') : '';

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className="group relative flex flex-col items-center justify-center h-10 cursor-pointer select-none"
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-black text-white shadow-md'
                        : isDeliveryDay
                        ? 'text-slate-900 font-extrabold hover:bg-slate-100'
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    {day}
                  </div>
                  {isDeliveryDay && (
                    <span className={`w-1.5 h-1.5 rounded-full absolute bottom-[-4px] ${dotColor}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-5 bg-slate-50/70 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between min-h-[280px]">
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-extrabold text-slate-455 tracking-wider block border-b border-slate-200 pb-1.5">
              📋 Keterangan Jadwal ({selectedDateStr})
            </span>
            <div className="space-y-3 overflow-y-auto max-h-56 pr-1 text-xs">
              {activeDayTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
                  <span className="text-2xl mb-1.5">🚚</span>
                  <p className="font-semibold text-slate-500 text-xs">Tidak Ada Jadwal Pengiriman</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Pilih tanggal bertanda titik untuk melihat rincian.</p>
                </div>
              ) : (
                activeDayTransactions.map((tx, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-100 rounded-xl flex flex-col gap-1.5 shadow-2xs">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-indigo-700 font-mono text-xs">Unit: {tx.qty} Pcs</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-wide">
                        Ready Kirim
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-semibold leading-normal">
                      📍 {tx.desc}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider">
            <span>🟢 Auto-Sync Aktif</span>
            <span>Bulan: Juni 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
