import React from 'react';

interface CreativeUploadFormProps {
  uploadType: 'video' | 'design';
  setUploadType: (type: 'video' | 'design') => void;
  status: 'produced' | 'posted' | 'draft';
  setStatus: (status: any) => void;
  title: string;
  setTitle: (title: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUploadSubmit: (e: React.FormEvent) => void;
  isUploading: boolean;
  uploadError: string | null;
  uploadSuccess: boolean;
}

export default function CreativeUploadForm({
  uploadType,
  setUploadType,
  status,
  setStatus,
  title,
  setTitle,
  handleFileChange,
  handleUploadSubmit,
  isUploading,
  uploadError,
  uploadSuccess
}: CreativeUploadFormProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm max-w-xl space-y-4">
      <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">🚀 Upload Aset ke Google Drive</h3>
      
      <form onSubmit={handleUploadSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tipe Aset</label>
            <select
              value={uploadType}
              onChange={(e) => {
                const type = e.target.value as 'video' | 'design';
                setUploadType(type);
                setStatus(type === 'video' ? 'draft' : 'produced');
                // Reset input file via parent ref/element resetting
                const fileInput = document.getElementById('creative-file-input') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
              }}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary-blue/60 transition-colors cursor-pointer"
            >
              <option value="video">Video Konten</option>
              <option value="design">Foto / Desain</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status Publikasi</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary-blue/60 transition-colors cursor-pointer"
            >
              {uploadType === 'video' ? (
                <>
                  <option value="draft">Akan diupload (Belum diupload)</option>
                  <option value="posted">Akan diupload (Sudah diupload)</option>
                  <option value="produced">Hanya Di Produksi</option>
                </>
              ) : (
                <>
                  <option value="produced">Hanya Di Produksi</option>
                  <option value="draft">Draft (Rencana Awal)</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nama / Judul Project</label>
          <input
            type="text"
            required
            placeholder="Contoh: Video Edukasi Penataan Gondola Minimarket"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary-blue/60 transition-all"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pilih File</label>
          <input
            type="file"
            id="creative-file-input"
            required
            onChange={handleFileChange}
            accept={uploadType === 'video' ? 'video/*' : 'image/*'}
            className="w-full text-slate-500 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 file:cursor-pointer"
          />
        </div>

        {uploadError && <p className="text-xs text-red-500 font-semibold">{uploadError}</p>}
        {uploadSuccess && <p className="text-xs text-emerald-500 font-semibold">🎉 File berhasil diupload dan disimpan!</p>}

        <button
          type="submit"
          disabled={isUploading}
          className={`w-full text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md ${
            isUploading
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-primary-blue hover:bg-primary-blue-hover shadow-primary-blue/15 cursor-pointer'
          }`}
        >
          {isUploading ? '⏳ Mengunggah ke Google Drive...' : '📤 Mulai Upload'}
        </button>
      </form>
    </div>
  );
}
