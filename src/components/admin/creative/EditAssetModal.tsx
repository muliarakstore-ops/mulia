import React from 'react';

interface EditAssetModalProps {
  editingItem: {
    id: string;
    title: string;
    type: 'video' | 'design';
    status: 'produced' | 'posted' | 'draft';
  } | null;
  setEditingItem: (item: any) => void;
  handleEditSubmit: (e: React.FormEvent) => void;
  isSavingEdit: boolean;
  editError: string | null;
}

export default function EditAssetModal({
  editingItem,
  setEditingItem,
  handleEditSubmit,
  isSavingEdit,
  editError
}: EditAssetModalProps) {
  if (!editingItem) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">
            ✏️ Edit Aset ({editingItem.type === 'video' ? 'Video' : 'Foto/Desain'})
          </h3>
          <button
            onClick={() => setEditingItem(null)}
            className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Nama / Judul Project
            </label>
            <input
              type="text"
              required
              value={editingItem.title}
              onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary-blue/60"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Status Publikasi
            </label>
            <select
              value={editingItem.status}
              onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary-blue/60 cursor-pointer"
            >
              {editingItem.type === 'video' ? (
                <>
                  <option value="draft">Belum diupload</option>
                  <option value="posted">Sudah diupload</option>
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

          {editError && <p className="text-xs text-red-500 font-semibold">{editError}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSavingEdit}
              className={`flex-1 text-white font-bold py-2 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md ${
                isSavingEdit
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-primary-blue hover:bg-primary-blue-hover shadow-primary-blue/15 cursor-pointer'
              }`}
            >
              {isSavingEdit ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
