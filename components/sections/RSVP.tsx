'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitRSVP, getGuestBySlug, getRSVPByGuestId, updateRSVP } from '@/lib/sheet-api';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, X, Edit } from 'lucide-react';

const rsvpSchema = z.object({
  estado: z.enum(['ACEPTADO', 'RECHAZADO']),
  acompanantes_confirmados: z.number().min(0).max(10),
  comentario: z.string().optional(),
});

type RSVPForm = z.infer<typeof rsvpSchema>;

interface RSVPProps {
  guestId?: string;
  guestNombre?: string;
  guestApellidos?: string;
  acompanantesAutorizados?: number;
}

export function RSVP({ guestId, guestNombre, guestApellidos, acompanantesAutorizados }: RSVPProps = {}) {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [fetchedGuest, setFetchedGuest] = useState<{
    id: string;
    nombre: string;
    apellidos: string;
    acompanantes_autorizados: number;
  } | null>(null);
  const [existingRSVP, setExistingRSVP] = useState<{
    estado: string;
    acompanantes_confirmados: number;
    comentario: string;
  } | null>(null);

  const searchParams = useSearchParams();
  const slug = searchParams.get('invitado');

  useEffect(() => {
    if (slug) {
      getGuestBySlug(slug)
        .then((data) => {
          if (data) {
            setFetchedGuest({
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

  const guest = guestId
    ? {
        id: guestId,
        nombre: guestNombre || '',
        apellidos: guestApellidos || '',
        acompanantes_autorizados: acompanantesAutorizados || 0,
      }
    : fetchedGuest;

  const loadExistingRSVP = (id: string) => {
    getRSVPByGuestId(id)
      .then((data) => {
        if (data) {
          setExistingRSVP({
            estado: data.estado,
            acompanantes_confirmados: parseInt(data.acompanantes_confirmados) || 0,
            comentario: data.comentario || '',
          });
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (guest?.id) {
      loadExistingRSVP(guest.id);
    }
  }, [guest?.id]);

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
      comentario: '',
    },
  });

  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    if (!guest) return;

    initializedRef.current = true;

    if (existingRSVP) {
      setValue('estado', existingRSVP.estado as 'ACEPTADO' | 'RECHAZADO');
      setValue('acompanantes_confirmados', existingRSVP.acompanantes_confirmados);
      setValue('comentario', existingRSVP.comentario);
    } else if (guest.acompanantes_autorizados > 0) {
      setValue('acompanantes_confirmados', guest.acompanantes_autorizados);
    }
  }, [guest, existingRSVP, setValue]);

  useEffect(() => {
    if (!initializedRef.current) return;
    if (!existingRSVP) return;

    setValue('estado', existingRSVP.estado as 'ACEPTADO' | 'RECHAZADO');
    setValue('acompanantes_confirmados', existingRSVP.acompanantes_confirmados);
    setValue('comentario', existingRSVP.comentario);
  }, [existingRSVP, setValue]);

  const estado = watch('estado');

  const onSubmit = async (data: RSVPForm) => {
    setLoading(true);
    try {
      if (existingRSVP && editing) {
        await updateRSVP(guest?.id || slug || '', {
          ...data,
          comentario: data.comentario || '',
        });
      } else {
        await submitRSVP({
          guest_id: guest?.id || slug || '',
          ...data,
          comentario: data.comentario || '',
        });
      }
      if (guest?.id) {
        loadExistingRSVP(guest.id);
      }
      setEditing(false);
    } catch (error) {
      console.error('Error al enviar RSVP:', error);
    } finally {
      setLoading(false);
    }
  };

  if (existingRSVP && !editing) {
    const isAccepted = existingRSVP.estado === 'ACEPTADO';

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto"
      >
        <div className="rounded-2xl p-6 text-center border bg-charcoal text-white border-charcoal-light">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-4 ${
            isAccepted
              ? 'bg-charcoal-light text-detalle'
              : 'bg-charcoal-light text-red-400'
          }`}>
            {isAccepted ? (
              <Check className="w-4 h-4" />
            ) : (
              <X className="w-4 h-4 text-red-400" />
            )}
            {isAccepted ? 'Asistirás' : 'No asistirás'}
          </div>

          {isAccepted && guest && guest.acompanantes_autorizados > 0 && (
            <p className="text-white/70 font-cormorant text-lg mb-4">
              {1 + (existingRSVP.acompanantes_confirmados || 0)} personas confirmadas
            </p>
          )}

          {!isAccepted && (
            <p className="text-white/70 font-cormorant text-lg mb-4">
              Gracias por avisar
            </p>
          )}

          {existingRSVP.comentario && (
            <p className="text-white/50 text-sm font-cormorant italic mb-4">
              "{existingRSVP.comentario}"
            </p>
          )}

          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors font-cormorant text-detalle hover:bg-charcoal-light"
          >
            <Edit className="w-4 h-4" />
            Editar respuesta
          </button>
        </div>
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
          <select
            value={watch('acompanantes_confirmados')}
            onChange={(e) => setValue('acompanantes_confirmados', parseInt(e.target.value))}
            className="w-full px-4 py-3 bg-white border border-cream-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-principal/50 text-text-primary font-cormorant text-lg appearance-none cursor-pointer"
          >
            {Array.from({ length: guest.acompanantes_autorizados + 1 }, (_, i) => i).map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'acompañante' : 'acompañantes'}
              </option>
            ))}
          </select>
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
          {loading ? 'Enviando...' : (existingRSVP ? 'Actualizar respuesta' : 'Confirmar asistencia')}
        </motion.button>
      </form>
    </div>
  );
}
