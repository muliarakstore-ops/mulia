import React from 'react';

interface GalleryItem {
  id: string;
  title: string;
  url?: string;
  type: 'video' | 'design';
  status: 'produced' | 'posted' | 'draft';
  createdAt: string;
}

interface CreativeGalleryProps {
  galleryItems: GalleryItem[];
  galleryFilter: 'all' | 'video' | 'design';
  setGalleryFilter: (filter: 'all' | 'video' | 'design') => void;
  handleVideoStatusChange: (id: string, status: any) => Promise<void>;
  setEditingItem: (item: any) => void;
  handleDeleteItem: (id: string, type: 'video' | 'design', title: string) => Promise<void>;
}

export default function CreativeGallery({
  galleryItems,
  galleryFilter,
  setGalleryFilter,
  handleVideoStatusChange,
  setEditingItem,
  handleDeleteItem
}: CreativeGalleryProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
        <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">🖼️ Galeri Aset Tim Kreatif</h3>
        
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'video', label: 'Video Konten' },
            { id: 'design', label: 'Foto/Desain' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setGalleryFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                galleryFilter === tab.id
                  ? 'bg-primary-blue text-white shadow-sm shadow-primary-blue/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <div key={item.id} className="bg-slate-50 rounded-2xl border border-slate-200/50 overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all">
            <div>
              {/* Media Preview */}
              <div className="h-44 bg-slate-900 flex items-center justify-center relative overflow-hidden">
                {item.type === 'design' && item.url ? (
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                ) : item.type === 'video' && item.url ? (
                  <iframe
                    src={`https://drive.google.com/file/d/${(() => {
                      const url = item.url;
                      if (!url) return '';
                      if (url.includes('googleusercontent.com/d/')) return url.split('googleusercontent.com/d/')[1] || '';
                      if (url.includes('/file/d/')) return url.split('/file/d/')[1]?.split('/')[0] || '';
                      if (url.includes('?id=')) return url.split('?id=')[1]?.split('&')[0] || '';
                      return url;
                    })()}/preview`}
                    className="w-full h-full border-0"
                    allow="autoplay"
                  />
                ) : (
                  <span className="text-3xl text-slate-600">📽️</span>
                )}
                <span className={`absolute top-3 right-3 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded shadow ${
                  item.type === 'video' ? 'bg-black text-white' : 'bg-indigo-600 text-white'
                }`}>
                  {item.type}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="text-xs font-black text-slate-900 leading-snug line-clamp-2" title={item.title}>
                  {item.title}
                </h4>
                
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>📅 {new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary-blue font-bold hover:underline">
                      Buka Drive 🔗
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Status Update / Display Section */}
            <div className="p-4 border-t border-slate-200/60 bg-white space-y-3">
              {item.type === 'video' ? (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Status:</span>
                  <select
                    value={item.status}
                    onChange={(e) => handleVideoStatusChange(item.id, e.target.value as any)}
                    className="bg-slate-100 text-[10px] font-bold text-slate-700 px-2 py-1 rounded-lg border-0 focus:outline-none cursor-pointer"
                  >
                    <option value="draft">Belum diupload</option>
                    <option value="posted">Sudah diupload</option>
                    <option value="produced">Hanya Di Produksi</option>
                  </select>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Status:</span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    item.status === 'produced' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.status === 'produced' ? 'Hanya Di Produksi' : 'Draft'}
                  </span>
                </div>
              )}

              {/* Edit & Delete Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setEditingItem({
                    id: item.id,
                    title: item.title,
                    type: item.type,
                    status: item.status,
                  })}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 py-1.5 px-3 rounded-lg transition-colors cursor-pointer text-center"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id, item.type, item.title)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-[10px] font-bold text-red-600 py-1.5 px-3 rounded-lg transition-colors cursor-pointer text-center"
                >
                  🗑️ Hapus
                </button>
              </div>
            </div>
          </div>
        ))}

        {galleryItems.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400 text-xs italic">
            Galeri masih kosong. Silakan upload file pertama Anda di atas!
          </div>
        )}
      </div>
    </div>
  );
}
