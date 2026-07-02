'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getGuestGallery, updateGalleryImage, deleteGalleryImage } from '@/lib/api';
import { Check, X, Trash2, Image as ImageIcon } from 'lucide-react';
import type { GalleryImage } from '@/types';

export default function GalleryAdminPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [pending, setPending] = useState<GalleryImage[]>([]);
  const [approved, setApproved] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'pending' | 'approved'>('pending');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const [allImages, approvedImages] = await Promise.all([
        getGuestGallery(false),
        getGuestGallery(true),
      ]);
      setImages(allImages);
      setPending(allImages.filter((img) => !img.aprobado));
      setApproved(approvedImages);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateGalleryImage(id, { aprobado: true });
      await loadImages();
    } catch (error) {
      console.error('Error approving image:', error);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('¿Eliminar esta foto?')) return;
    try {
      await deleteGalleryImage(id);
      await loadImages();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-text-secondary font-cormorant text-lg">
          Cargando galería...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-playfair text-2xl font-semibold text-text-primary">
          Galería de Invitados
        </h1>
        <p className="text-text-secondary text-sm mt-1 font-cormorant">
          {pending.length} fotos pendientes · {approved.length} aprobadas
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('pending')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all font-cormorant ${
            tab === 'pending'
              ? 'bg-charcoal text-white'
              : 'bg-white text-text-secondary hover:bg-cream border border-cream-dark'
          }`}
        >
          Pendientes ({pending.length})
        </button>
        <button
          onClick={() => setTab('approved')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all font-cormorant ${
            tab === 'approved'
              ? 'bg-charcoal text-white'
              : 'bg-white text-text-secondary hover:bg-cream border border-cream-dark'
          }`}
        >
          Aprobadas ({approved.length})
        </button>
      </div>

      {/* Grid */}
      {tab === 'pending' && pending.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl">
          <div className="w-16 h-16 mx-auto bg-cream-dark rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-text-secondary font-cormorant text-lg">
            No hay fotos pendientes
          </p>
        </div>
      )}

      {tab === 'approved' && approved.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl">
          <div className="w-16 h-16 mx-auto bg-cream-dark rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-text-light" />
          </div>
          <p className="text-text-secondary font-cormorant text-lg">
            No hay fotos aprobadas aún
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {(tab === 'pending' ? pending : approved).map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="group relative aspect-square rounded-xl overflow-hidden bg-cream-dark"
          >
            <img
              src={image.url}
              alt={image.descripcion || ''}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setSelectedImage(image)}
              loading="lazy"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
              {tab === 'pending' ? (
                <>
                  <button
                    onClick={() => handleApprove(image.id)}
                    className="p-2.5 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
                    title="Aprobar"
                  >
                    <Check className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => handleReject(image.id)}
                    className="p-2.5 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    title="Rechazar"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleReject(image.id)}
                  className="p-2.5 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              )}
            </div>

            {/* Info */}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white/90 text-xs font-cormorant truncate">
                {image.subido_por || 'Invitado'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedImage.url}
            alt=""
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-6 text-center">
            <p className="text-white/60 font-cormorant text-lg">
              {selectedImage.subido_por && `Foto de ${selectedImage.subido_por}`}
            </p>
            <p className="text-white/40 text-sm font-cormorant mt-1">
              {selectedImage.createdAt
                ? new Date(selectedImage.createdAt).toLocaleDateString('es-PE', {
                    dateStyle: 'long',
                  })
                : ''}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
