'use strict';
import React, { useState, useMemo } from 'react';
import { saveSupabaseVideo, saveSupabaseDesign } from '../../utils/supabaseData';
import CreativeInsights from './creative/CreativeInsights';
import CreativeUploadForm from './creative/CreativeUploadForm';
import CreativeGallery from './creative/CreativeGallery';
import EditAssetModal from './creative/EditAssetModal';

interface VideoItem {
  id: string;
  title: string;
  video_url?: string;
  status: 'produced' | 'posted' | 'draft';
  posted_at?: string;
  created_at: string;
}

interface DesignItem {
  id: string;
  title: string;
  image_url: string;
  status: 'produced' | 'draft';
  created_at: string;
}

interface CreativeSectionProps {
  videos: VideoItem[];
  designs: DesignItem[];
  onReloadVideos: () => Promise<void>;
  onReloadDesigns: () => Promise<void>;
  onDeleteVideo: (id: string) => Promise<boolean>;
  onDeleteDesign: (id: string) => Promise<boolean>;
}

export default function CreativeSection({
  videos,
  designs,
  onReloadVideos,
  onReloadDesigns,
  onDeleteVideo,
  onDeleteDesign,
}: CreativeSectionProps) {
  // Upload State
  const [uploadType, setUploadType] = useState<'video' | 'design'>('video');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'produced' | 'posted' | 'draft'>('draft');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Edit State
  const [editingItem, setEditingItem] = useState<{
    id: string;
    title: string;
    type: 'video' | 'design';
    status: 'produced' | 'posted' | 'draft';
  } | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Gallery Filter State
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'video' | 'design'>('all');

  // Video Insights
  const videoStats = useMemo(() => {
    const akanDiupload = videos.filter((v) => v.status === 'draft' || v.status === 'posted');
    const belumDiupload = akanDiupload.filter((v) => v.status === 'draft');
    const sudahDiupload = akanDiupload.filter((v) => v.status === 'posted');
    const hanyaDiProduksi = videos.filter((v) => v.status === 'produced');

    return {
      total: videos.length,
      akanDiuploadCount: akanDiupload.length,
      belumDiuploadCount: belumDiupload.length,
      sudahDiuploadCount: sudahDiupload.length,
      hanyaDiProduksiCount: hanyaDiProduksi.length,
    };
  }, [videos]);

  // Design Insights
  const designStats = useMemo(() => {
    return {
      total: designs.length,
      producedCount: designs.filter((d) => d.status === 'produced').length,
      draftCount: designs.filter((d) => d.status === 'draft').length,
    };
  }, [designs]);

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      // Perform strict validation
      if (uploadType === 'video' && !selectedFile.type.startsWith('video/')) {
        setUploadError('Tipe file salah! Harap pilih file video.');
        setFile(null);
        e.target.value = '';
        return;
      }

      if (uploadType === 'design' && !selectedFile.type.startsWith('image/')) {
        setUploadError('Tipe file salah! Harap pilih file gambar (desain/foto).');
        setFile(null);
        e.target.value = '';
        return;
      }

      setFile(selectedFile);
      setUploadError(null);
      setUploadSuccess(false);
    }
  };

  // Handle Form Submit (Upload to Google Drive & Save to Supabase)
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      setUploadError('Judul dan File wajib diisi.');
      return;
    }

    if (uploadType === 'video' && !file.type.startsWith('video/')) {
      setUploadError('File yang dipilih bukan video. Unggahan dibatalkan.');
      return;
    }

    if (uploadType === 'design' && !file.type.startsWith('image/')) {
      setUploadError('File yang dipilih bukan gambar/desain. Unggahan dibatalkan.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      // 1. Prepare form data for API upload-drive
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', uploadType);

      // 2. Call Google Drive API upload endpoint
      const res = await fetch('/api/upload-drive', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal mengunggah file ke Google Drive');
      }

      const fileUrl = data.publicUrl || data.webViewLink;

      // 3. Save metadata to Supabase
      if (uploadType === 'video') {
        const success = await saveSupabaseVideo({
          title,
          videoUrl: fileUrl,
          status: status,
          postedAt: status === 'posted' ? new Date().toISOString() : undefined,
        });
        if (!success) throw new Error('Gagal menyimpan detail video ke database.');
        await onReloadVideos();
      } else {
        const success = await saveSupabaseDesign({
          title,
          imageUrl: fileUrl,
          status: status === 'produced' ? 'produced' : 'draft',
        });
        if (!success) throw new Error('Gagal menyimpan detail foto/desain ke database.');
        await onReloadDesigns();
      }

      // Reset form
      setTitle('');
      setFile(null);
      setUploadSuccess(true);
      // Reset input element
      const fileInput = document.getElementById('creative-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : 'Terjadi kesalahan saat mengunggah file.';
      setUploadError(errMsg);
    } finally {
      setIsUploading(false);
    }
  };

  // Quick Status Update for Videos
  const handleVideoStatusChange = async (id: string, newStatus: 'draft' | 'posted' | 'produced') => {
    const video = videos.find((v) => v.id === id);
    if (!video) return;

    try {
      const success = await saveSupabaseVideo({
        id: video.id,
        title: video.title,
        videoUrl: video.video_url,
        status: newStatus,
        postedAt: newStatus === 'posted' ? new Date().toISOString() : video.posted_at,
      });
      if (success) {
        await onReloadVideos();
      }
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title.trim()) return;

    setIsSavingEdit(true);
    setEditError(null);

    try {
      if (editingItem.type === 'video') {
        const originalVideo = videos.find((v) => v.id === editingItem.id);
        if (!originalVideo) throw new Error('Video tidak ditemukan');

        const success = await saveSupabaseVideo({
          id: editingItem.id,
          title: editingItem.title,
          videoUrl: originalVideo.video_url,
          status: editingItem.status,
          postedAt: editingItem.status === 'posted' 
            ? (originalVideo.posted_at || new Date().toISOString()) 
            : (editingItem.status === 'draft' ? undefined : originalVideo.posted_at),
        });

        if (!success) throw new Error('Gagal memperbarui metadata video');
        await onReloadVideos();
      } else {
        const originalDesign = designs.find((d) => d.id === editingItem.id);
        if (!originalDesign) throw new Error('Desain tidak ditemukan');

        const success = await saveSupabaseDesign({
          id: editingItem.id,
          title: editingItem.title,
          imageUrl: originalDesign.image_url,
          status: editingItem.status === 'produced' ? 'produced' : 'draft',
        });

        if (!success) throw new Error('Gagal memperbarui metadata desain');
        await onReloadDesigns();
      }

      setEditingItem(null);
    } catch (err) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : 'Gagal menyimpan perubahan';
      setEditError(errMsg);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Helper to extract file ID from URL
  const extractFileId = (url?: string): string | null => {
    if (!url) return null;
    if (url.includes('googleusercontent.com/d/')) return url.split('googleusercontent.com/d/')[1] || null;
    if (url.includes('/file/d/')) return url.split('/file/d/')[1]?.split('/')[0] || null;
    if (url.includes('?id=')) return url.split('?id=')[1]?.split('&')[0] || null;
    return null;
  };

  // Handle Item Deletion
  const handleDeleteItem = async (id: string, type: 'video' | 'design', title: string) => {
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus "${title}"?`);
    if (!confirmDelete) return;

    try {
      // 1. Find the item to get its Google Drive URL
      let fileUrl = '';
      if (type === 'video') {
        const item = videos.find((v) => v.id === id);
        fileUrl = item?.video_url || '';
      } else {
        const item = designs.find((d) => d.id === id);
        fileUrl = item?.image_url || '';
      }

      // 2. Extract Google Drive file ID and delete it
      const fileId = extractFileId(fileUrl);
      if (fileId) {
        try {
          const driveRes = await fetch(`/api/delete-drive?fileId=${fileId}`, {
            method: 'DELETE',
          });
          const driveData = await driveRes.json();
          if (!driveRes.ok || !driveData.success) {
            console.warn('Gagal menghapus file dari Google Drive:', driveData.error || 'Unknown error');
          }
        } catch (driveErr) {
          console.error('Error deleting file from Google Drive:', driveErr);
        }
      }

      // 3. Delete from Supabase
      if (type === 'video') {
        const success = await onDeleteVideo(id);
        if (success) {
          await onReloadVideos();
        } else {
          alert('Gagal menghapus video dari database.');
        }
      } else {
        const success = await onDeleteDesign(id);
        if (success) {
          await onReloadDesigns();
        } else {
          alert('Gagal menghapus desain dari database.');
        }
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Terjadi kesalahan saat menghapus item.');
    }
  };

  // Compile combined gallery list
  const galleryItems = useMemo(() => {
    const vids = videos.map((v) => ({
      id: v.id,
      title: v.title,
      url: v.video_url,
      type: 'video' as const,
      status: v.status,
      createdAt: v.created_at,
    }));
    const des = designs.map((d) => ({
      id: d.id,
      title: d.title,
      url: d.image_url,
      type: 'design' as const,
      status: d.status,
      createdAt: d.created_at,
    }));

    const combined = [...vids, ...des];
    combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (galleryFilter === 'all') return combined;
    return combined.filter((item) => item.type === galleryFilter);
  }, [videos, designs, galleryFilter]);

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950">Tim Kreatif</h1>
        <p className="text-slate-500 text-xs md:text-sm mt-1">
          Kelola aset pemasaran digital, upload konten ke Google Drive, dan pantau status publikasi.
        </p>
      </div>

      {/* SECTION 1: INSIGHT CARDS */}
      <CreativeInsights videoStats={videoStats} designStats={designStats} />

      {/* SECTION 2: UPLOAD FORM */}
      <CreativeUploadForm
        uploadType={uploadType}
        setUploadType={setUploadType}
        status={status}
        setStatus={setStatus}
        title={title}
        setTitle={setTitle}
        handleFileChange={handleFileChange}
        handleUploadSubmit={handleUploadSubmit}
        isUploading={isUploading}
        uploadError={uploadError}
        uploadSuccess={uploadSuccess}
      />

      {/* SECTION 3: FULL GALLERY */}
      <CreativeGallery
        galleryItems={galleryItems}
        galleryFilter={galleryFilter}
        setGalleryFilter={setGalleryFilter}
        handleVideoStatusChange={handleVideoStatusChange}
        setEditingItem={setEditingItem}
        handleDeleteItem={handleDeleteItem}
      />

      {/* EDIT MODAL */}
      <EditAssetModal
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        handleEditSubmit={handleEditSubmit}
        isSavingEdit={isSavingEdit}
        editError={editError}
      />
    </div>
  );
}
