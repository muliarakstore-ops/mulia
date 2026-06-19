'use strict';
import React from 'react';

interface NavbarProps {
  brandName?: string;
  brandSuffix?: string;
}

export default function Navbar({ brandName = 'MULIA', brandSuffix = 'Rak Store' }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-primary-blue/10 py-4 px-4 md:px-12 flex justify-between items-center">
      <a href="/" className="flex items-center gap-2">
        <span className="text-xl md:text-2xl font-bold tracking-wider text-primary-blue font-serif">{brandName}</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-dark/70 font-sans border-l border-slate-dark/20 pl-2">{brandSuffix}</span>
      </a>

      {/* Right Aligned Navigation Group */}
      <div className="flex items-center gap-6 md:gap-8">
        <a href="/about" className="hover:text-primary-blue transition-colors text-slate-dark/85 text-sm font-semibold">
          About Us
        </a>
        <a
          href="#conversation"
          className="bg-primary-blue text-white hover:bg-primary-blue-hover px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-md shadow-primary-blue/25 transition-all font-semibold text-xs md:text-sm text-center flex items-center gap-1.5"
        >
          {/* Mobile version (WhatsApp logo + "Order") */}
          <span className="md:hidden flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.433 2.502 1.163 3.463l-.759 2.776 2.842-.746c.929.58 2.023.916 3.195.917h.003c3.179 0 5.764-2.586 5.765-5.766.002-3.18-2.583-5.767-5.764-5.767zM15.42 14.331c-.161.454-.937.892-1.396.948-.415.051-.963.076-1.57-.118-2.39-.768-3.924-3.184-4.043-3.344-.119-.16-.966-1.282-.966-2.447v-.001c0-1.165.611-1.737.83-1.956.16-.16.353-.239.533-.239.18 0 .36.001.516.008.161.008.375-.061.587.449.219.529.749 1.828.813 1.957.065.129.108.28.022.453-.086.173-.129.28-.259.432-.129.151-.271.336-.388.452-.13.129-.265.27-.114.529.151.259.673 1.109 1.442 1.794.992.883 1.823 1.157 2.082 1.286.259.129.41.108.561-.065.151-.173.646-.755.819-1.015.172-.259.345-.216.581-.129.238.087 1.509.712 1.768.842.259.129.431.194.496.302.065.108.065.626-.096 1.08zM12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.117 1.521 5.857L0 24l6.307-1.487C7.944 23.364 9.9 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm.029 21.688c-1.936-.001-3.834-.515-5.502-1.488l-.395-.23-3.784.993 1.011-3.69-.257-.409C2.102 15.187 1.6 13.626 1.6 12.02c.003-5.741 4.678-10.413 10.429-10.413 2.783 0 5.399 1.084 7.368 3.056 1.968 1.972 3.05 4.593 3.047 7.377-.006 5.742-4.68 10.413-10.415 10.413z" />
            </svg>
            <span>Order</span>
          </span>
          <span className="hidden md:inline">
            Tanya Admin
          </span>
        </a>
      </div>
    </nav>
  );
}
