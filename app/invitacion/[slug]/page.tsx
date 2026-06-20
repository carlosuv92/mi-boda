'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { getConfig, getTimeline, getGallery, getGuestBySlug } from '@/lib/sheet-api';
import { Countdown } from '@/components/ui/Countdown';
import { Section } from '@/components/ui/Section';
import { FloralDivider } from '@/components/ui/FloralDivider';
import { LocationCard } from '@/components/ui/LocationCard';
import { Timeline } from '@/components/ui/Timeline';
import { DressCode } from '@/components/sections/DressCode';
import { GiftTable } from '@/components/sections/GiftTable';
import { Gallery } from '@/components/sections/Gallery';
import { SongRequest } from '@/components/sections/SongRequest';
import { RSVP } from '@/components/sections/RSVP';
import { AdultsOnly } from '@/components/sections/AdultsOnly';
import { MusicPlayer } from '@/components/ui/MusicPlayer';

export default function InvitationPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [config, setConfig] = useState<Record<string, string>>({});
  const [timeline, setTimeline] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [guest, setGuest] = useState<{
    id: string;
    nombre: string;
    apellidos: string;
    acompanantes_autorizados: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getConfig(), getTimeline(), getGallery(), getGuestBySlug(slug)])
      .then(([configData, timelineData, galleryData, guestData]) => {
        setConfig(configData);
        setTimeline(timelineData);
        setGallery(galleryData);
        if (guestData) {
          setGuest({
            id: guestData.id,
            nombre: guestData.nombre,
            apellidos: guestData.apellidos,
            acompanantes_autorizados: parseInt(guestData.acompanantes_autorizados) || 0,
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const fotoPrincipal = config.fotoPrincipal || '/images/principal.webp';

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
        <img
          src={fotoPrincipal}
          alt="Cargando"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center">
          <div className="animate-pulse text-detalle font-playfair text-2xl md:text-3xl">
            Felipe & Lilian
          </div>
        </div>
      </div>
    );
  }

  const weddingDate = config.fecha || '2027-04-15';
  const novio = config.novio || 'Felipe';
  const novia = config.novia || 'Lilian';

  return (
    <>
    <main className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Full-screen background image */}
        <div className="absolute inset-0">
          <img
            src={fotoPrincipal}
            alt={`${novio} & ${novia}`}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="relative z-10 px-6 flex flex-col items-center"
        >
          {/* Personalized welcome */}
          {guest && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-sm md:text-base mb-4 font-cormorant tracking-wide"
            >
              Bienvenido/a <span className="text-white font-medium">{guest.nombre} {guest.apellidos}</span> y familia
            </motion.p>
          )}

          {/* Initials L & F at top */}
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="h-px w-10 bg-detalle/50" />
            <span className="font-playfair text-4xl md:text-5xl font-semibold text-white">
              {novio.charAt(0)}
            </span>
            <span className="text-detalle text-2xl md:text-3xl font-light">&</span>
            <span className="font-playfair text-4xl md:text-5xl font-semibold text-white">
              {novia.charAt(0)}
            </span>
            <div className="h-px w-10 bg-detalle/50" />
          </div>

          {/* Nos casamos */}
          <p className="text-white/90 text-xs uppercase tracking-[0.3em] mb-10 font-cormorant">
            ¡Nos casamos!
          </p>

          {/* Bible verse */}
          <p className="text-white/90 text-xs md:text-sm mb-8 uppercase tracking-[0.2em] font-cormorant font-bold">
            {config.biblia || '"Y sobre todo vístanse de amor" — Colosenses 3:14'}
          </p>

          {/* Names */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-10"
          >
            <h1 className="font-great-vibes text-4xl md:text-6xl lg:text-7xl text-white mb-3 drop-shadow-lg">
              {novio} <span className="text-detalle-light">&</span> {novia}
            </h1>
          </motion.div>

          {/* Date */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-16 bg-white/30" />
            <span className="font-playfair text-lg md:text-xl text-white tracking-wide">
              {new Date(weddingDate).toLocaleDateString('es-PE', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <div className="h-px w-16 bg-white/30" />
          </div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <p className="text-white/90 text-xs uppercase tracking-[0.3em] mb-4 font-cormorant">
              Faltan
            </p>
            <Countdown targetDate={weddingDate} variant="dark" />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-detalle rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Welcome Message */}
      <Section className="bg-white-off">
        <FloralDivider className="mb-8" />
        <p className="text-center text-text-secondary italic leading-relaxed font-cormorant text-lg md:text-xl">
          {config.mensajeBienvenida ||
            'Con nuestro amor, la bendición de Dios y en compañía de nuestros padres, los invitamos a celebrar el día más especial de nuestras vidas.'}
        </p>
        <FloralDivider className="mt-8" />
      </Section>

      {/* Ceremony & Reception */}
      <Section id="ubicacion">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-text-primary mb-2">
            Ubicación
          </h2>
          <p className="text-text-secondary font-cormorant text-lg">
            Ceremonia y recepción
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <LocationCard
            type="ceremonia"
            foto={config.fotoIglesia}
            titulo={config.nombreIglesia || 'Ceremonia Religiosa'}
            direccion={config.direccionIglesia || ''}
            hora={config.horaCeremonia || '11:00 AM'}
            estacionamiento={config.estacionamientoIglesia}
            mapsUrl={config.mapsIglesia || '#'}
          />
          <LocationCard
            type="recepcion"
            foto={config.fotoRecepcion}
            titulo={config.nombreRecepcion || 'Recepción'}
            direccion={config.direccionRecepcion || ''}
            hora={config.horaRecepcion || '1:00 PM'}
            estacionamiento={config.estacionamientoRecepcion}
            mapsUrl={config.mapsRecepcion || '#'}
          />
        </div>
      </Section>

      {/* Dress Code */}
      <Section id="dresscode" className="bg-white-off">
        <DressCode
          vestimentaHombres={config.vestimentaHombres || 'Formal'}
          vestimentaMujeres={config.vestimentaMujeres || 'Formal'}
          coloresSugeridos={config.coloresSugeridos?.split(',')}
          coloresReservados={config.coloresReservados?.split(',') || ['Blanco', 'Crema']}
          restricciones={config.restriccionesColores}
        />
      </Section>

      {/* Timeline */}
      <Section id="itinerario">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-text-primary mb-2">
            Itinerario
          </h2>
          <p className="text-text-secondary font-cormorant text-lg">
            Cronograma de actividades
          </p>
        </div>
        <Timeline events={timeline} />
      </Section>

      {/* Gift Table */}
      <Section id="regalos" className="bg-white-off">
        <GiftTable
          mensaje={config.mensajeRegalos || 'Nuestro mejor regalo será compartir este día contigo, pero si deseas tener un detalle con nosotros, aquí te dejamos nuestros datos.'}
          cuentaBancaria={config.cuentaBancaria}
          yape={config.yape}
          plin={config.plin}
          qrUrl={config.qrRegalo}
        />
      </Section>

      {/* Gallery */}
      <Section id="galeria">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-text-primary mb-2">
            Galería
          </h2>
          <p className="text-text-secondary font-cormorant text-lg">
            Algunos momentos especiales
          </p>
        </div>
        <Gallery images={gallery} />
      </Section>

      {/* Song Request */}
      <Section id="canciones" className="bg-white-off">
        <div className="text-center mb-8">
          <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-text-primary mb-2">
            Playlist
          </h2>
          <p className="text-text-secondary font-cormorant text-lg">
            Ayúdanos con la música, sugiere esa canción que no puede faltar
          </p>
        </div>
        <SongRequest />
      </Section>

      {/* RSVP */}
      <Section id="confirmar">
        <div className="text-center mb-8">
          <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-text-primary mb-2">
            Confirmar Asistencia
          </h2>
          <p className="text-text-secondary font-cormorant text-lg">
            Por favor confirma tu asistencia antes del {config.fechaLimiteRSVP || '10 de mayo'}
          </p>
        </div>
        <RSVP
          guestId={guest?.id}
          guestNombre={guest?.nombre}
          guestApellidos={guest?.apellidos}
          acompanantesAutorizados={guest?.acompanantes_autorizados}
        />
      </Section>

      {/* Adults Only */}
      <AdultsOnly mensaje={config.mensajeAdultos} />

      {/* Footer */}
      <footer className="py-16 text-center bg-gradient-to-t from-charcoal to-charcoal-light text-white">
        <div className="max-w-2xl mx-auto px-6">
          <h3 className="font-great-vibes text-5xl md:text-6xl mb-4">
            {novio} & {novia}
          </h3>
          <p className="text-white/60 mb-8 font-cormorant text-lg">
            Esperamos contar con su presencia
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-principal/40" />
            <div className="w-2 h-2 bg-principal/60 rounded-full" />
            <div className="h-px w-12 bg-principal/40" />
          </div>
          <p className="text-white/40 text-sm mt-8 font-cormorant">
            Muchas gracias
          </p>
        </div>
      </footer>
    </main>
    <MusicPlayer src="/music/risk-bruno-mars.mp3" title="Risk - Bruno Mars" />
    </>
  );
}
