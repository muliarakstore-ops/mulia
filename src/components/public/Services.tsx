import { IncludedService } from '../../constants/mockData';

interface ServicesProps {
  onTriggerService: (serviceName: string) => void;
  services: IncludedService[];
  servicesMainTitle?: string;
  servicesSubTitle?: string;
}

export default function Services({
  onTriggerService,
  services,
  servicesMainTitle,
  servicesSubTitle,
}: ServicesProps) {
  // Helpers for getting inline icons
  const getIcon = (title: string, isMobile: boolean = false) => {
    const iconColorClass = isMobile ? "text-white" : "text-primary-blue";
    if (title.includes('Konsultasi')) {
      return (
        <svg className={`w-6 h-6 md:w-8 md:h-8 ${iconColorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    }
    if (title.includes('Ongkir')) {
      return (
        <svg className={`w-6 h-6 md:w-8 md:h-8 ${iconColorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      );
    }
    return (
      <svg className={`w-6 h-6 md:w-8 md:h-8 ${iconColorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    );
  };

  return (
    <section 
      id="services" 
      className="py-16 md:py-24 border-y border-slate-dark/5 bg-primary-blue md:bg-gradient-to-b md:from-slate-light md:via-sky-50/40 md:to-slate-light"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-12 space-y-10 md:space-y-12">
        
        {/* Title Header - White text on Mobile (bg blue), Slate text on Desktop */}
        <div className="text-left md:text-center md:max-w-2xl md:mx-auto space-y-2">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white md:text-slate-dark tracking-tight">
            {servicesMainTitle || 'Layanan Termasuk (Included)'}
          </h2>
          <p className="text-white/80 md:text-slate-dark/60 text-xs md:text-base">
            {servicesSubTitle || 'Setiap pemesanan rak pertokoan di Mulia Rak Store sudah mencakup paket benefit berikut.'}
          </p>
        </div>

        {/* Desktop Services Layout (md and above) */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-dark/5 shadow-sm space-y-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-primary-blue-light flex items-center justify-center">
                  {getIcon(service.title, false)}
                </div>
                <h3 className="text-xl font-bold text-slate-dark">{service.title}</h3>
                <p className="text-slate-dark/70 text-sm leading-relaxed">{service.description}</p>
              </div>
              <button
                onClick={() => onTriggerService(service.title)}
                className="w-full text-left mt-4 text-xs font-bold uppercase tracking-wider text-primary-blue hover:text-primary-blue-hover flex items-center gap-1 group cursor-pointer"
              >
                Ajukan Konsultasi
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Mobile Services Layout - Horizontal Swipe Slider Carousel (screen < md) */}
        <div className="md:hidden flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scroll-smooth snap-x snap-mandatory scrollbar-none">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="snap-center flex-shrink-0 w-[80%] max-w-[285px] bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-md flex flex-col justify-between space-y-5 whitespace-normal"
            >
              <div className="space-y-3.5">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  {getIcon(service.title, true)}
                </div>
                <h3 className="text-sm font-bold text-white leading-tight">{service.title}</h3>
                <p className="text-[11px] text-white/80 leading-relaxed">
                  {service.description}
                </p>
              </div>
              
              <button
                onClick={() => onTriggerService(service.title)}
                className="w-full bg-white hover:bg-sky-50 text-primary-blue text-[10px] font-bold py-2.5 rounded-xl transition-all text-center block cursor-pointer"
              >
                KONSULTASI INSTAN
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
