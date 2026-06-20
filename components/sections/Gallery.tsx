'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  descripcion: string;
  tipo: 'foto' | 'video';
}

const LOCAL_GALLERY_COUNT = 13;

function getLocalGalleryImages(): GalleryImage[] {
  const images: GalleryImage[] = [];
  for (let i = 1; i <= LOCAL_GALLERY_COUNT; i++) {
    const ext = i === 11 ? 'jpg' : 'webp';
    images.push({
      id: `local-${i}`,
      url: `/gallery/image-${i}.${ext}`,
      descripcion: '',
      tipo: 'foto',
    });
  }
  return images;
}

interface GalleryProps {
  images?: GalleryImage[];
}

export function Gallery({ images }: GalleryProps) {
  const galleryImages = images && images.length > 0 ? images : getLocalGalleryImages();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goToPrev = () => {
    setSelectedIndex((prev) =>
      prev === null || prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setSelectedIndex((prev) =>
      prev === null || prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      <div className="columns-2 md:columns-3 gap-3 space-y-3">
        {galleryImages.map((image, index) => {
          const isLarge = index % 5 === 0;
          return (
            <motion.div
              key={image.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`break-inside-avoid rounded-xl overflow-hidden cursor-pointer group ${
                isLarge ? 'md:col-span-1' : ''
              }`}
              onClick={() => openLightbox(index)}
            >
              <div className="relative overflow-hidden">
                {image.tipo === 'video' ? (
                  <video
                    src={image.url}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={image.url}
                    alt={image.descripcion || `Foto ${index + 1}`}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            </motion.div>
          );
        })}
      </div>

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
            >
              <X className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="absolute left-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div
              className="max-w-4xl max-h-[90vh] px-20"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={galleryImages[selectedIndex].url}
                alt={galleryImages[selectedIndex].descripcion || ''}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
              {galleryImages[selectedIndex].descripcion && (
                <p className="text-white/60 text-center mt-4 font-cormorant text-lg">
                  {galleryImages[selectedIndex].descripcion}
                </p>
              )}
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm font-cormorant">
              {selectedIndex + 1} / {galleryImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
