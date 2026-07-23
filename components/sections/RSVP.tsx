'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitRSVP, getGuestBySlug, getRSVPByGuestId, updateRSVP } from '@/lib/api';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, X, Edit, User } from 'lucide-react';

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

function RSVPInner({ guestId, guestNombre, guestApellidos, acompanantesAutorizados }: RSVPProps = {}) {
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

  const [nombres, setNombres] = useState<string[]>([]);
  const [nombresError, setNombresError] = useState(false);
  const [nombresTocado, setNombresTocado] = useState(false);

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
              acompanantes_autorizados: data.acompanantes_autorizados || 0,
            });
          }
        })
        .catch((err) => {
          console.error('Error al buscar invitado:', err);
        });
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
            acompanantes_confirmados: data.acompanantes_confirmados || 0,
            comentario: data.comentario || '',
          });
          setNombres(data.acompanantes_nombres || []);
        }
      })
      .catch((err) => {
        console.error('Error al cargar RSVP existente:', err);
      });
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
  const acompanantesCount = watch('acompanantes_confirmados');

  useEffect(() => {
    setNombres((prev) => {
      if (prev.length === acompanantesCount) return prev;
      if (acompanantesCount > prev.length) return [...prev, ...Array(acompanantesCount - prev.length).fill('')];
      return prev.slice(0, acompanantesCount);
    });
  }, [acompanantesCount]);

  useEffect(() => {
    if (nombresError) {
      const allFilled = nombres.slice(0, acompanantesCount).every((n) => n.trim());
      if (allFilled) setNombresError(false);
    }
  }, [nombres, acompanantesCount, nombresError]);

  const onSubmit = async (data: RSVPForm) => {
    setLoading(true);
    const namesTrimmed = nombres.map((n) => n.trim());
    if (data.acompanantes_confirmados > 0 && namesTrimmed.some((n) => !n)) {
      setNombresError(true);
      setLoading(false);
      return;
    }
    const acompanantes_nombres = namesTrimmed.filter(Boolean);
    try {
      if (existingRSVP && editing) {
        await updateRSVP(guest?.id || slug || '', {
          ...data,
          acompanantes_nombres,
          comentario: data.comentario || '',
        });
      } else {
        await submitRSVP({
          guest_id: guest?.id || slug || '',
          ...data,
          acompanantes_nombres,
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

  const canSubmit = !loading && !(estado === 'ACEPTADO' && acompanantesCount > 0 && (nombres.length !== acompanantesCount || nombres.slice(0, acompanantesCount).some((n) => !n.trim())));

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
            <>
              <p className="text-white/70 font-cormorant text-xl mb-2">
                {1 + (existingRSVP.acompanantes_confirmados || 0)} personas confirmadas
              </p>
              {nombres.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {nombres.map((nom, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-charcoal-light rounded-full text-sm text-white/80">
                      <User className="w-3 h-3" />
                      {nom}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}

          {!isAccepted && (
            <p className="text-white/70 font-cormorant text-xl mb-4">
              Gracias por avisar
            </p>
          )}

          {existingRSVP.comentario && (
            <p className="text-white/50 text-sm font-cormorant  mb-4">
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
        <div className="border border-principal rounded-xl p-6 mb-6 text-center">
          <p className="font-cormorant text-2xl font-semibold text-text-primary">
            {guest.nombre} {guest.apellidos}
          </p>
          {guest.acompanantes_autorizados > 0 && (
            <p className="font-cormorant text-lg text-text-secondary font-semibold mt-2">
             Reservamos un asiento para ti y {guest.acompanantes_autorizados} adicional{guest.acompanantes_autorizados > 1 ? 'es' : ''}.
            </p>
          )}
        </div>
      )}

      <div className="flex gap-3 mb-6">
        <button
          type="button"
          onClick={() => setValue("estado", "ACEPTADO")}
          className={`flex-1 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 font-cormorant text-xl ${
            estado === "ACEPTADO"
              ? "bg-charcoal text-detalle"
              : "bg-white border border-cream-dark text-text-secondary hover:bg-cream"
          }`}
        >
          <Check className="w-5 h-5" />
          Asistiré
        </button>
        <button
          type="button"
          onClick={() => setValue("estado", "RECHAZADO")}
          className={`flex-1 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 font-cormorant text-xl ${
            estado === "RECHAZADO"
              ? "bg-red-400 text-white"
              : "bg-white border border-cream-dark text-text-secondary hover:bg-cream"
          }`}
        >
          <X className="w-5 h-5" />
          No asistiré
        </button>
      </div>

      {estado === "ACEPTADO" && guest && guest.acompanantes_autorizados > 0 && (
        <div className="mb-6">
          <label className="block text-md font-semibold mb-3 font-cormorant">
            ¿Cuántos acompañantes asistirán contigo?
          </label>
          <select
            value={watch("acompanantes_confirmados")}
            onChange={(e) => {
              const count = parseInt(e.target.value)
              setValue("acompanantes_confirmados", count)
              setNombres((prev) => {
                if (count > prev.length)
                  return [...prev, ...Array(count - prev.length).fill("")]
                return prev.slice(0, count)
              })
            }}
            className="w-full px-4 py-3 bg-white border border-cream-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-principal/50 text-text-primary font-cormorant text-xl appearance-none cursor-pointer"
          >
            {Array.from(
              { length: guest.acompanantes_autorizados + 1 },
              (_, i) => i,
            ).map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "acompañante" : "acompañantes"}
              </option>
            ))}
          </select>
        </div>
      )}

      {estado === "ACEPTADO" && watch("acompanantes_confirmados") > 0 && (
        <div className="mb-6 space-y-3">
          <label className="block  text-md font-semibold mb-3 font-cormorant">
            Nombres de tus acompañantes <span className="text-orange-400">*</span>
          </label>
          {Array.from({ length: watch("acompanantes_confirmados") }, (_, i) => {
            const isEmpty = !nombres[i] || !nombres[i].trim()
            const showError = nombresError && isEmpty
            return (
              <div key={i} className="flex items-center gap-2">
                <User
                  className={`w-4 h-4 shrink-0 ${showError ? "text-orange-400" : isEmpty && acompanantesCount > 0 ? "text-orange-400" : "text-nowrap"}`}
                />
                <input
                  type="text"
                  value={nombres[i] || ""}
                  onChange={(e) => {
                    setNombresError(false)
                    setNombres((prev) => {
                      const next = [...prev]
                      next[i] = e.target.value
                      return next
                    })
                  }}
                  placeholder={`Acompañante ${i + 1}`}
                  className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-principal/50 text-text-primary placeholder:text-text-light font-cormorant text-lg ${
                    showError
                      ? "border-orange-400 ring-orange-200"
                      : isEmpty
                        ? "border-orange-400"
                        : "border-cream-dark"
                  }`}
                />
              </div>
            )
          })}
          {nombresError && (
            <p className="text-orange-500 text-md font-cormorant flex items-center gap-1">
              <X className="w-3.5 h-3.5" />
              Ingresa el nombre de todos tus acompañantes
            </p>
          )}
          {!nombresError &&
            acompanantesCount > 0 &&
            nombres.slice(0, acompanantesCount).some((n) => !n.trim()) && (
              <p className="text-orange-500 text-md font-cormorant flex items-center gap-1 font-semibold">
                <span className="w-3.5 h-3.5 inline-flex items-center justify-center rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold">
                  !
                </span>
                Completa los nombres para poder confirmar
              </p>
            )}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <label className="block text-md font-semibold mb-2 font-cormorant ">
            Comentario (opcional)
          </label>
          <textarea
            {...register("comentario")}
            placeholder="Algún mensaje o restricción alimentaria"
            rows={3}
            className="w-full px-4 py-3 bg-white border border-cream-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-principal/50 text-text-primary placeholder:text-text-light resize-none font-cormorant text-lg"
          />
        </div>

        <motion.button
          whileHover={canSubmit ? { scale: 1.02 } : {}}
          whileTap={canSubmit ? { scale: 0.98 } : {}}
          type="submit"
          disabled={!canSubmit}
          onClick={(e) => {
            if (!canSubmit) {
              e.preventDefault()
              setNombresTocado(true)
              setTimeout(() => setNombresTocado(false), 3000)
            }
          }}
          className={`w-full py-3 rounded-xl font-semibold font-cormorant text-xl transition-all ${
            canSubmit
              ? "bg-charcoal text-white hover:bg-charcoal-light"
              : "bg-cream-dark text-text-light cursor-not-allowed"
          }`}
        >
          {loading
            ? "Enviando..."
            : existingRSVP
              ? "Actualizar respuesta"
              : "Confirmar asistencia"}
        </motion.button>

        {nombresTocado && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2"
          >
            <span className="w-5 h-5 inline-flex items-center justify-center rounded-full bg-amber-200 text-amber-700 text-xs font-bold shrink-0 mt-0.5">
              !
            </span>
            <p className="text-sm text-amber-800 font-cormorant font-semibold">
              No olvides escribir los nombres de tus acompañantes para poder
              confirmar tu asistencia
            </p>
          </motion.div>
        )}
      </form>
    </div>
  )
}

export function RSVP(props: RSVPProps = {}) {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto text-center py-8">
        <div className="animate-pulse text-text-light font-cormorant text-xl">Cargando...</div>
      </div>
    }>
      <RSVPInner {...props} />
    </Suspense>
  );
}
