'use strict';
import React from 'react';

interface FooterProps {
  brandName?: string;
  brandSuffix?: string;
  aboutText?: string;
}

export default function Footer({
  brandName = 'MULIA',
  brandSuffix = 'Rak Store',
  aboutText = 'Distributor rak minimarket dan meja kasir berkualitas tinggi dengan jaminan cat powder coating tahan lama serta pemasangan yang presisi.',
}: FooterProps) {
  return (
    <footer id="about" className="bg-slate-dark text-white py-16 px-6 md:px-12 mt-12 border-t border-slate-dark/15 scroll-mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <span className="text-2xl font-bold text-sky-400 tracking-wider font-serif">{brandName} {brandSuffix}</span>
          <div className="md:hidden text-xs uppercase tracking-wider font-extrabold text-sky-400/70">About Us</div>
          <p className="text-white/60 text-sm leading-relaxed">
            {aboutText}
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Hubungi Kami</h4>
          <ul className="text-white/60 text-sm space-y-2">
            <li className="flex items-center gap-2">
              <span>📍</span>
              <span>Kawasan Industri Sentra Rak No. 12, Sidoarjo / Surabaya</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✉️</span>
              <span>sales@muliaraksstore.com</span>
            </li>
            <li className="flex items-center gap-2">
              <span>📞</span>
              <span>+62 812-3456-7890</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Layanan Utama</h4>
          <ul className="text-white/60 text-sm space-y-2">
            <li>Pabrik Rak Gondola Minimarket</li>
            <li>Instalasi Rak Supermarket</li>
            <li>Simulasi layout 3D Gratis</li>
            <li>Konsultasi Pembukaan Toko Baru</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Temukan Kami</h4>
          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-sky-400 hover:text-sky-400 flex items-center justify-center transition-colors text-sm">
              Ig
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-sky-400 hover:text-sky-400 flex items-center justify-center transition-colors text-sm">
              Fb
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-sky-400 hover:text-sky-400 flex items-center justify-center transition-colors text-sm">
              Wa
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 mt-12 pt-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} MULIA Rak Store. Hak Cipta Dilindungi Undang-Undang.
      </div>
    </footer>
  );
}
