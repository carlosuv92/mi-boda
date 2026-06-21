'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitSong } from '@/lib/sheet-api';
import { useState } from 'react';
import { Music } from 'lucide-react';

const songSchema = z.object({
  cancion: z.string().min(1, 'El nombre de la canción es requerido'),
  artista: z.string().min(1, 'El artista es requerido'),
  comentario: z.string().optional(),
});

type SongForm = z.infer<typeof songSchema>;

interface SongRequestProps {
  guestId?: string;
  guestNombre?: string;
}

export function SongRequest({ guestId, guestNombre }: SongRequestProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SongForm>({
    resolver: zodResolver(songSchema),
  });

  const onSubmit = async (data: SongForm) => {
    setLoading(true);
    try {
      await submitSong({
        guest_id: guestId || '',
        guest_name: guestNombre || 'Invitado',
        ...data,
        comentario: data.comentario || '',
      });
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Error al enviar canción:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-charcoal text-white rounded-2xl p-8 text-center"
        >
          <Music className="w-12 h-12 text-principal mx-auto mb-4" />
          <h3 className="font-playfair text-xl font-semibold mb-2">
            ¡Gracias!
          </h3>
          <p className="text-white/60 font-cormorant text-lg">
            Tu sugerencia ha sido enviada
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2 font-cormorant text-base">
              Canción *
            </label>
            <input
              {...register('cancion')}
              type="text"
              placeholder="Nombre de la canción"
              className="w-full px-4 py-3 bg-white border border-cream-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-principal/50 text-text-primary placeholder:text-text-light font-cormorant text-lg"
            />
            {errors.cancion && (
              <p className="text-red-500 text-xs mt-1">{errors.cancion.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2 font-cormorant text-base">
              Artista *
            </label>
            <input
              {...register('artista')}
              type="text"
              placeholder="Nombre del artista"
              className="w-full px-4 py-3 bg-white border border-cream-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-principal/50 text-text-primary placeholder:text-text-light font-cormorant text-lg"
            />
            {errors.artista && (
              <p className="text-red-500 text-xs mt-1">{errors.artista.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2 font-cormorant text-base">
              Comentario (opcional)
            </label>
            <textarea
              {...register('comentario')}
              placeholder="¿Por qué esta canción?"
              rows={3}
              className="w-full px-4 py-3 bg-white border border-cream-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-principal/50 text-text-primary placeholder:text-text-light resize-none font-cormorant text-lg"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-charcoal text-white rounded-xl font-medium hover:bg-charcoal-light transition-colors disabled:opacity-50 font-cormorant text-lg"
          >
            {loading ? 'Enviando...' : 'Sugerir canción'}
          </motion.button>
        </form>
      )}
    </div>
  );
}
