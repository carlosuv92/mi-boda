'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface GalleryImage {
  id: string;
  url: string;
  descripcion: string;
  tipo: 'foto' | 'video';
}

interface GalleryProps {
  images: GalleryImage[];
}

export function Gallery({ images }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="aspect-square bg-cream-dark rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((image, index) => (
          <motion.div
            key={image.id || index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="aspect-square overflow-hidden rounded-xl cursor-pointer group"
            onClick={() => setSelectedImage(image.url)}
          >
            {image.tipo === 'video' ? (
              <video
                src={image.url}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                muted
                playsInline
              />
            ) : (
              <img
                src={image.url}
                alt={image.descripcion || `Foto ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}
          </motion.div>
        ))}
      </div>

      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Galería"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </motion.div>
      )}
    </>
  );
}
