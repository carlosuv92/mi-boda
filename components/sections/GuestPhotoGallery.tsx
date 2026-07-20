'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ImageIcon } from 'lucide-react';
import { getGuestGallery } from '@/lib/api';
import type { GalleryImage } from '@/types';

interface GuestPhotoGalleryProps {
  showAll?: boolean;
  refreshTrigger?: number;
}

const MAX_IMAGES = 8;

export function GuestPhotoGallery({ showAll = false, refreshTrigger = 0 }: GuestPhotoGalleryProps) {
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const prevCount = useRef(0);

  useEffect(() => {
    getGuestGallery(!showAll)
      .then((data) => {
        prevCount.current = allImages.length;
        setAllImages(data);
      })
      .catch((err) => {
        console.error('Error al cargar galería:', err);
      })
      .finally(() => setLoading(false));
  }, [showAll, refreshTrigger]);

  const images = allImages.slice(0, MAX_IMAGES);
  const hiddenCount = allImages.length - MAX_IMAGES;

  const closeLightbox = useCallback(() => setSelectedIndex(null), []);

  const goToPrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null || prev === 0 ? allImages.length - 1 : prev - 1
    );
  }, [allImages.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null || prev === allImages.length - 1 ? 0 : prev + 1
    );
  }, [allImages.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, closeLightbox, goToPrev, goToNext]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-text-light font-cormorant">Cargando fotos...</div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto rounded-full bg-cream-dark flex items-center justify-center mb-4">
          <ImageIcon className="w-8 h-8 text-text-light" />
        </div>
        <p className="text-text-light font-cormorant text-lg">
          Aún no hay fotos de invitados
        </p>
        <p className="text-text-light text-sm font-cormorant mt-1">
          ¡Sé el primero en compartir!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <AnimatePresence mode="popLayout">
          {images.map((image, index) => {
            const isLastWithOverlay = index === MAX_IMAGES - 1 && hiddenCount > 0;
            return (
              <motion.button
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.04,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                onClick={() => setSelectedIndex(isLastWithOverlay ? MAX_IMAGES : index)}
                className="aspect-square rounded-xl overflow-hidden group cursor-pointer relative bg-cream-dark shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={image.url}
                  alt={image.descripcion || `Foto de ${image.subido_por || 'invitado'}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                {image.subido_por && !isLastWithOverlay && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-xs font-cormorant truncate block">
                      {image.subido_por}
                    </span>
                  </div>
                )}
                {isLastWithOverlay && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/60 transition-colors duration-300">
                    <span className="text-white font-cormorant text-3xl md:text-4xl font-bold">
                      +{hiddenCount}
                    </span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {hiddenCount > 0 && (
        <p className="text-center text-text-light text-sm font-cormorant mt-4">
          Mostrando las últimas {MAX_IMAGES} de {allImages.length} fotos
        </p>
      )}

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="absolute left-2 md:left-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 md:right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div
              className="max-w-4xl max-h-[90vh] px-4 md:px-20"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={allImages[selectedIndex].url}
                alt={allImages[selectedIndex].descripcion || ''}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
              <div className="text-center mt-3">
                {allImages[selectedIndex].descripcion && (
                  <p className="text-white/60 font-cormorant text-lg">
                    {allImages[selectedIndex].descripcion}
                  </p>
                )}
                {allImages[selectedIndex].subido_por && (
                  <p className="text-white/40 text-sm font-cormorant">
                    Foto de {allImages[selectedIndex].subido_por}
                  </p>
                )}
              </div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm font-cormorant">
              {selectedIndex + 1} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
