'use strict';
import React from 'react';

interface ConversationProps {
  waMessage: string;
  onSendWhatsApp: () => void;
  cartItemCount: number;
  convMainTitle?: string;
  convSubTitle?: string;
  convCardTitle?: string;
  convCardDescription?: string;
  convPhoneImageUrl?: string;
}

export default function Conversation({
  waMessage,
  onSendWhatsApp,
  cartItemCount,
  convMainTitle,
  convSubTitle,
  convCardTitle,
  convCardDescription,
  convPhoneImageUrl,
}: ConversationProps) {
  return (
    <section id="conversation" className="pt-4 pb-16 md:py-24 px-4 md:px-12 max-w-7xl mx-auto">
      {/* Desktop Header Title (md and above) */}
      <div className="hidden md:block text-center max-w-2xl mx-auto space-y-2 mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-dark">
          {convMainTitle || 'Pemesanan & Konsultasi Langsung'}
        </h2>
        <p className="text-slate-dark/60 text-sm">
          {convSubTitle || 'Kirim detail pesanan Anda ke admin WhatsApp kami hanya dengan sekali klik tanpa ribet mengisi formulir.'}
        </p>
      </div>

      {/* Desktop Layout (md and above) */}
      <div className="hidden md:grid grid-cols-2 gap-12 items-center">
        {/* Simple Call-To-Action Box */}
        <div className="bg-white rounded-3xl p-10 border border-slate-dark/5 shadow-md space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary-blue-light text-primary-blue px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              ⚡ Instan & Praktis
            </div>
            <h3 className="text-2xl font-extrabold text-slate-dark">
              {convCardTitle || 'Hubungi Admin Mulia Rak Store'}
            </h3>
            <p className="text-slate-dark/60 text-sm leading-relaxed">
              {convCardDescription || 'Punya pertanyaan atau ingin berkonsultasi mengenai spesifikasi besi, nego harga, serta tata letak toko? Silakan klik tombol di bawah untuk langsung terhubung dengan layanan pelanggan kami di WhatsApp.'}
            </p>
          </div>

          <button
            onClick={onSendWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer text-sm uppercase tracking-wider active:scale-[0.98]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.433 2.502 1.163 3.463l-.759 2.776 2.842-.746c.929.58 2.023.916 3.195.917h.003c3.179 0 5.764-2.586 5.765-5.766.002-3.18-2.583-5.767-5.764-5.767zM15.42 14.331c-.161.454-.937.892-1.396.948-.415.051-.963.076-1.57-.118-2.39-.768-3.924-3.184-4.043-3.344-.119-.16-.966-1.282-.966-2.447v-.001c0-1.165.611-1.737.83-1.956.16-.16.353-.239.533-.239.18 0 .36.001.516.008.161.008.375-.061.587.449.219.529.749 1.828.813 1.957.065.129.108.28.022.453-.086.173-.129.28-.259.432-.129.151-.271.336-.388.452-.13.129-.265.27-.114.529.151.259.673 1.109 1.442 1.794.992.883 1.823 1.157 2.082 1.286.259.129.41.108.561-.065.151-.173.646-.755.819-1.015.172-.259.345-.216.581-.129.238.087 1.509.712 1.768.842.259.129.431.194.496.302.065.108.065.626-.096 1.08zM12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.117 1.521 5.857L0 24l6.307-1.487C7.944 23.364 9.9 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm.029 21.688c-1.936-.001-3.834-.515-5.502-1.488l-.395-.23-3.784.993 1.011-3.69-.257-.409C2.102 15.187 1.6 13.626 1.6 12.02c.003-5.741 4.678-10.413 10.429-10.413 2.783 0 5.399 1.084 7.368 3.056 1.968 1.972 3.05 4.593 3.047 7.377-.006 5.742-4.68 10.413-10.415 10.413z" />
            </svg>
            Hubungi via WhatsApp
          </button>
        </div>

        {/* Smartphone Live Preview Mockup */}
        <div className="relative mx-auto w-full max-w-sm border-[8px] border-slate-dark/90 bg-slate-dark rounded-[2.5rem] shadow-2xl overflow-hidden aspect-[9/16]">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-dark rounded-full z-20 flex justify-center items-center">
            <div className="w-2 h-2 bg-black rounded-full mr-2" />
            <div className="w-8 h-1 bg-black/40 rounded-full" />
          </div>

          <div className="bg-[#075e54] text-white p-4 pt-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center font-bold text-white text-xs">MRS</div>
              <div>
                <h4 className="text-xs font-bold leading-tight">Mulia Rak Store</h4>
                <span className="text-[9px] opacity-75">Online • Admin CS</span>
              </div>
            </div>
            <div className="flex gap-3 text-white/80">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
            </div>
          </div>

          <div 
            className="h-[calc(100%-100px)] bg-[#efeae2] p-4 flex flex-col justify-between overflow-y-auto pattern-wa bg-cover bg-center"
            style={convPhoneImageUrl ? { backgroundImage: `url('${convPhoneImageUrl}')` } : undefined}
          >
            <div className="space-y-4 flex flex-col items-end">
              <div className="bg-white/80 backdrop-blur-sm self-center text-[10px] text-zinc-600 px-3 py-1 rounded-md shadow-sm mb-2">
                HARI INI
              </div>
              <div className="bg-[#d9fdd3] text-zinc-800 text-[11px] p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[85%] space-y-1.5 border border-zinc-200/50">
                <div className="whitespace-pre-line leading-relaxed font-sans text-left">{waMessage}</div>
                <span className="text-[8px] text-zinc-500 float-right mt-1">
                  {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div className="flex gap-2 items-center bg-white p-2 rounded-full shadow-sm border border-zinc-200 mt-2">
              <div className="text-zinc-400 flex-1 text-[10px] pl-2 overflow-hidden truncate text-left">
                {waMessage.slice(0, 24)}...
              </div>
              <button onClick={onSendWhatsApp} className="w-6 h-6 bg-[#00a884] text-white rounded-full flex items-center justify-center cursor-pointer flex-shrink-0">
                <svg className="w-3 rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout (Minimal Single Card ONLY, screen < md) */}
      <div className="md:hidden w-full max-w-sm mx-auto bg-white rounded-2xl p-5 border border-slate-dark/15 shadow-sm space-y-4">
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-1.5 bg-primary-blue-light text-primary-blue px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider mx-auto">
            ⚡ Hubungi Instan
          </div>
          <h3 className="text-sm font-extrabold text-slate-dark">
            {convCardTitle || 'Tanya / Konsultasi Sekarang'}
          </h3>
          <p className="text-slate-dark/65 text-[11px] leading-relaxed max-w-xs mx-auto">
            {convCardDescription || 'Punya pertanyaan seputar ukuran rak kustom, nego harga borongan, atau layout ruangan toko? Langsung hubungi admin via WhatsApp.'}
          </p>
        </div>

        <button
          onClick={onSendWhatsApp}
          className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-[10px] font-bold py-3.5 rounded-xl transition-all cursor-pointer text-center uppercase tracking-wider shadow-sm shadow-emerald-500/15 flex items-center justify-center gap-2 block"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.433 2.502 1.163 3.463l-.759 2.776 2.842-.746c.929.58 2.023.916 3.195.917h.003c3.179 0 5.764-2.586 5.765-5.766.002-3.18-2.583-5.767-5.764-5.767zM15.42 14.331c-.161.454-.937.892-1.396.948-.415.051-.963.076-1.57-.118-2.39-.768-3.924-3.184-4.043-3.344-.119-.16-.966-1.282-.966-2.447v-.001c0-1.165.611-1.737.83-1.956.16-.16.353-.239.533-.239.18 0 .36.001.516.008.161.008.375-.061.587.449.219.529.749 1.828.813 1.957.065.129.108.28.022.453-.086.173-.129.28-.259.432-.129.151-.271.336-.388.452-.13.129-.265.27-.114.529.151.259.673 1.109 1.442 1.794.992.883 1.823 1.157 2.082 1.286.259.129.41.108.561-.065.151-.173.646-.755.819-1.015.172-.259.345-.216.581-.129.238.087 1.509.712 1.768.842.259.129.431.194.496.302.065.108.065.626-.096 1.08zM12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.117 1.521 5.857L0 24l6.307-1.487C7.944 23.364 9.9 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm.029 21.688c-1.936-.001-3.834-.515-5.502-1.488l-.395-.23-3.784.993 1.011-3.69-.257-.409C2.102 15.187 1.6 13.626 1.6 12.02c.003-5.741 4.678-10.413 10.429-10.413 2.783 0 5.399 1.084 7.368 3.056 1.968 1.972 3.05 4.593 3.047 7.377-.006 5.742-4.68 10.413-10.415 10.413z" />
          </svg>
          Hubungi via WhatsApp
        </button>
      </div>
    </section>
  );
}
