'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitRSVP, getGuestBySlug } from '@/lib/sheet-api';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, X } from 'lucide-react';

const rsvpSchema = z.object({
  estado: z.enum(['ACEPTADO', 'RECHAZADO']),
  acompanantes_confirmados: z.number().min(0).max(10),
  comentario: z.string().optional(),
});

type RSVPForm = z.infer<typeof rsvpSchema>;

export function RSVP() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guest, setGuest] = useState<{
    id: string;
    nombre: string;
    apellidos: string;
    acompanantes_autorizados: number;
  } | null>(null);

  const searchParams = useSearchParams();
  const slug = searchParams.get('invitado');

  useEffect(() => {
    if (slug) {
      getGuestBySlug(slug)
        .then((data) => {
          if (data) {
            setGuest({
              id: data.id,
              nombre: data.nombre,
              apellidos: data.apellidos,
              acompanantes_autorizados: parseInt(data.acompanantes_autorizados) || 0,
            });
          }
        })
        .catch(console.error);
    }
  }, [slug]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RSVPForm>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      estado: 'ACEPTADO',
      acompanantes_confirmados: 0,
    },
  });

  const estado = watch('estado');

  const onSubmit = async (data: RSVPForm) => {
    setLoading(true);
    try {
      await submitRSVP({
        guest_id: guest?.id || slug || '',
        ...data,
        comentario: data.comentario || '',
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error al enviar RSVP:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-charcoal text-white rounded-2xl p-8 text-center"
      >
        <Check className="w-12 h-12 text-principal mx-auto mb-4" />
        <h3 className="font-playfair text-xl font-semibold mb-2">
          ¡Gracias!
        </h3>
        <p className="text-white/60 font-cormorant text-lg">
          Tu respuesta ha sido registrada
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {guest && (
        <p className="text-center text-text-secondary mb-6 font-cormorant text-lg">
          Bienvenido/a <span className="font-semibold text-text-primary">{guest.nombre} {guest.apellidos}</span>
          {guest.acompanantes_autorizados > 0 && (
            <>
              {' '}y acompañantes ({guest.acompanantes_autorizados + 1} lugares reservados)
            </>
          )}
        </p>
      )}

      <div className="flex gap-3 mb-6">
        <button
          type="button"
          onClick={() => setValue('estado', 'ACEPTADO')}
          className={`flex-1 py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 font-cormorant text-lg ${
            estado === 'ACEPTADO'
              ? 'bg-charcoal text-detalle'
              : 'bg-white border border-cream-dark text-text-secondary hover:bg-cream'
          }`}
        >
          <Check className="w-5 h-5" />
          Asistiré
        </button>
        <button
          type="button"
          onClick={() => setValue('estado', 'RECHAZADO')}
          className={`flex-1 py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 font-cormorant text-lg ${
            estado === 'RECHAZADO'
              ? 'bg-red-400 text-white'
              : 'bg-white border border-cream-dark text-text-secondary hover:bg-cream'
          }`}
        >
          <X className="w-5 h-5" />
          No asistiré
        </button>
      </div>

      {estado === 'ACEPTADO' && guest && guest.acompanantes_autorizados > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-secondary mb-3 font-cormorant text-base">
            ¿Cuántos acompañantes asistirán contigo?
          </label>
          <div className="flex gap-3">
            {Array.from({ length: guest.acompanantes_autorizados + 1 }, (_, i) => i).map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setValue('acompanantes_confirmados', num)}
                className={`flex-1 py-3 rounded-xl font-medium transition-all font-cormorant text-lg ${
                  watch('acompanantes_confirmados') === num
                    ? 'bg-principal text-white'
                    : 'bg-white border border-cream-dark text-text-secondary hover:bg-cream'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <p className="text-xs text-text-light mt-2 font-cormorant">
            Total confirmados: {1 + (watch('acompanantes_confirmados') || 0)} personas
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-secondary mb-2 font-cormorant text-base">
            Comentario (opcional)
          </label>
          <textarea
            {...register('comentario')}
            placeholder="Algún mensaje o restricción alimentaria"
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
          {loading ? 'Enviando...' : 'Confirmar asistencia'}
        </motion.button>
      </form>
    </div>
  );
}
