'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GuestPhotoUpload } from '@/components/sections/GuestPhotoUpload';
import { GuestPhotoGallery } from '@/components/sections/GuestPhotoGallery';
import { getConfig } from '@/lib/api';

export default function SubeTusFotosPage() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getConfig()
      .then(setConfig)
      .catch((err) => {
        console.error('Error al cargar configuración:', err);
      });
  }, []);

  const novia = config.novia || 'Lilian';
  const novio = config.novio || 'Felipe';

  const handleUploadSuccess = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <main className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative min-h-[70vh] md:min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/principal.webp"
            alt="Boda"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <div className="relative z-10 w-full px-6 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-detalle text-sm uppercase tracking-[0.3em] mb-4 font-cormorant">
              Comparte tus fotos
            </p>

            <h1 className="font-cormorant text-4xl md:text-6xl text-white mb-4 drop-shadow-lg">
              {novia} <span className="text-detalle">&</span> {novio}
            </h1>

            <p className="text-white/80 font-cormorant text-lg md:text-xl max-w-md mx-auto mb-8">
              Sube tus fotos de este día tan especial y sé parte de nuestro álbum de recuerdos
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-sm mx-auto"
          >
            <GuestPhotoUpload onUploadSuccess={handleUploadSuccess} />
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 md:py-16 px-4 md:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-cormorant text-2xl md:text-3xl font-semibold text-text-primary mb-2">
            Fotos de nuestros invitados
          </h2>
          <p className="text-text-secondary font-cormorant text-lg">
            Todas las fotos compartidas hasta ahora
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-12 bg-detalle/40" />
            <div className="w-2 h-2 bg-detalle/60 rounded-full" />
            <div className="h-px w-12 bg-detalle/40" />
          </div>
        </div>

        <GuestPhotoGallery showAll refreshTrigger={refreshKey} />
      </section>

      {/* Footer */}
      <footer className="py-12 text-center bg-gradient-to-t from-charcoal to-charcoal-light text-white">
        <h3 className="font-cormorant text-3xl md:text-4xl mb-2">
          {novia} <span className="text-detalle">&</span> {novio}
        </h3>
        <p className="text-white/50 font-cormorant text-base">
          Gracias por compartir este día con nosotros
        </p>
      </footer>
    </main>
  );
}
