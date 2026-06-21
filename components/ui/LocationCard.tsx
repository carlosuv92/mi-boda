'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, Car } from 'lucide-react';

interface LocationCardProps {
  type: 'ceremonia' | 'recepcion';
  foto?: string;
  titulo: string;
  direccion: string;
  hora: string;
  estacionamiento?: string;
  mapsUrl: string;
}

export function LocationCard({
  type,
  foto,
  titulo,
  direccion,
  hora,
  estacionamiento,
  mapsUrl,
}: LocationCardProps) {
  const defaultFoto = type === 'ceremonia' ? '/images/iglesia.webp' : '/images/nonita.webp';
  const displayFoto = foto || defaultFoto;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-cream-dark"
    >
      <div className="p-6 md:p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-cream-dark shadow-sm">
            <img
              src={displayFoto}
              alt={titulo}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <h3 className="font-playfair text-xl md:text-2xl font-semibold text-text-primary mb-4">
          {titulo}
        </h3>
        
        <div className="space-y-3 text-text-secondary font-cormorant text-lg">
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-principal" />
            <span>{hora}</span>
          </div>
          
          <div className="flex items-start justify-center gap-2">
            <MapPin className="w-4 h-4 text-principal mt-0.5 flex-shrink-0" />
            <span>{direccion}</span>
          </div>
          
          {estacionamiento && (
            <div className="flex items-center justify-center gap-2">
              <Car className="w-4 h-4 text-principal" />
              <span className="text-base">{estacionamiento}</span>
            </div>
          )}
        </div>
        
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-charcoal text-detalle rounded-full text-sm font-medium hover:bg-charcoal-light transition-colors"
        >
          <MapPin className="w-4 h-4 text-detalle" />
          Ver ubicación
        </a>
      </div>
    </motion.div>
  );
}
