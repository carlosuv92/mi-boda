'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getConfig, getTimeline } from '@/lib/api';
import type { TimelineEvent } from '@/types';
import { Countdown } from '@/components/ui/Countdown';
import { Section } from '@/components/ui/Section';
import { FloralDivider } from '@/components/ui/FloralDivider';
import { LocationCard } from '@/components/ui/LocationCard';
import { Timeline } from '@/components/ui/Timeline';
import { DressCode } from '@/components/sections/DressCode';
import { GiftTable } from '@/components/sections/GiftTable';
import { SongRequest } from '@/components/sections/SongRequest';
import { RSVP } from '@/components/sections/RSVP';
import { AdultsOnly } from '@/components/sections/AdultsOnly';
import { MusicPlayer } from '@/components/ui/MusicPlayer';
import { Music, Heart } from 'lucide-react';

const galleryImages = [
  { src: "/gallery/image-1.webp", offset: "center 80%" },
  { src: "/gallery/image-14.webp", offset: "center 35%" },
  { src: "/gallery/image-3.webp", offset: "center 50%" },
  { src: "/gallery/image-2.webp", offset: "center 45%" },
  { src: "/gallery/image-11.webp", offset: "center 50%" },
  { src: "/gallery/image-5.webp", offset: "center 70%" },
  { src: "/gallery/image-10.webp", offset: "center 35%" },
]

export default function WeddingPage() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getConfig(), getTimeline()])
      .then(([configData, timelineData]) => {
        setConfig(configData);
        setTimeline(timelineData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
            Lilian & Felipe
          </div>
        </div>
      </div>
    );
  }

  const rawDate = config.fecha || '2027-04-15';
  const [y, m, d] = rawDate.split('-').map(Number);
  const weddingDate = new Date(y, m - 1, d);
  const novio = config.novio || 'Felipe';
  const novia = config.novia || 'Lilian';

  return (
    <>
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={fotoPrincipal}
              alt={`${novia} & ${novio}`}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
          </div>

          <div className="relative z-10 w-full flex flex-col items-center justify-between min-h-screen py-12">
            {/* Texto arriba */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="px-6 text-center"
            >
              <div className="flex items-center justify-center gap-4 mb-3">
                <div className="h-px w-10 bg-detalle/50" />
                <span className="font-playfair text-4xl md:text-5xl font-semibold text-white">
                  {novia.charAt(0)}
                </span>
                <span className="text-detalle text-2xl md:text-3xl font-light">
                  &
                </span>
                <span className="font-playfair text-4xl md:text-5xl font-semibold text-white">
                  {novio.charAt(0)}
                </span>
                <div className="h-px w-10 bg-detalle/50" />
              </div>

              <p className="text-white/90 text-xs uppercase tracking-[0.3em] mb-10 font-cormorant">
                ¡Nos casamos!
              </p>

              <p className="text-white text-xs md:text-sm mb-8 uppercase tracking-[0.2em] font-cormorant">
                {config.biblia ||
                  '"Y sobre todo vístanse de amor" — Colosenses 3:14'}
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mb-2"
              >
                <h1 className="font-great-vibes text-4xl md:text-6xl lg:text-7xl text-white mb-3 drop-shadow-lg">
                  {novia} <span className="text-detalle-light">&</span> {novio}
                </h1>
              </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="flex flex-col items-center gap-2"
            >
              {/* Desktop: scroll icon */}
              <div className="hidden md:block w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1 h-3 bg-detalle rounded-full ml-2"
                />
              </div>
              {/* Mobile: flechas abajo */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="md:hidden text-white/50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="-mt-3 opacity-40"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Countdown + Welcome Message */}
        <Section className="bg-white-off">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 bg-detalle/40" />
              <span className="font-playfair text-lg md:text-xl text-text-primary tracking-wide">
                {weddingDate.toLocaleDateString("es-PE", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <div className="h-px w-16 bg-detalle/40" />
            </div>

            <p className="text-text-primary text-md uppercase tracking-[0.3em] mb-4 font-cormorant font-extrabold">
              PREPÁRATE!
            </p>
            <p className="text-text-primary text-sm uppercase tracking-[0.3em] mb-4 font-cormorant font-extrabold">
              Nos vemos en..
            </p>
            <Countdown targetDate={weddingDate} />
          </div>
        </Section>

        {/* Imagen entre secciones */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden"
        >
          <img
            src={galleryImages[0].src}
            alt="Momento especial"
            className="w-full h-[45vh] md:h-[55vh] object-cover"
            style={{ objectPosition: galleryImages[0].offset }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/30" />
        </motion.div>

        <Section id="mensaje" className="bg-white-off">
          <FloralDivider className="mb-8" />
          <p className="text-center text-text-secondary italic leading-relaxed font-cormorant text-lg md:text-xl">
            {config.mensajeBienvenida ||
              "Con nuestro amor, la bendición de Dios y en compañía de nuestros padres, los invitamos a celebrar el día más especial de nuestras vidas."}
          </p>
          <FloralDivider className="mt-8" />
        </Section>

        {/* Imagen entre secciones */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden"
        >
          <img
            src={galleryImages[1].src}
            alt="Momento especial"
            className="w-full h-[45vh] md:h-[55vh] object-cover"
            style={{ objectPosition: galleryImages[1].offset }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/30" />
        </motion.div>

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
              titulo={config.nombreIglesia || "Ceremonia Religiosa"}
              direccion={config.direccionIglesia || ""}
              hora={config.horaCeremonia || "11:00 AM"}
              estacionamiento={config.estacionamientoIglesia}
              mapsUrl={config.mapsIglesia || "#"}
            />
            <LocationCard
              type="recepcion"
              foto={config.fotoRecepcion}
              titulo={config.nombreRecepcion || "Recepción"}
              direccion={config.direccionRecepcion || ""}
              hora={config.horaRecepcion || "1:00 PM"}
              estacionamiento={config.estacionamientoRecepcion}
              mapsUrl={config.mapsRecepcion || "#"}
            />
          </div>
        </Section>

        {/* Imagen entre secciones */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden"
        >
          <img
            src={galleryImages[2].src}
            alt="Momento especial"
            className="w-full h-[45vh] md:h-[55vh] object-cover"
            style={{ objectPosition: galleryImages[2].offset }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/30" />
        </motion.div>

        {/* Dress Code */}
        <Section id="dresscode" className="bg-white-off">
          <DressCode
            vestimentaHombres={config.vestimentaHombres || "Formal"}
            vestimentaMujeres={config.vestimentaMujeres || "Formal"}
            coloresSugeridos={config.coloresSugeridos?.split(",")}
            coloresReservados={
              config.coloresReservados?.split(",") || ["Blanco", "Crema"]
            }
            restricciones={config.restriccionesColores}
          />
        </Section>

        {/* Imagen entre secciones */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden"
        >
          <img
            src={galleryImages[3].src}
            alt="Momento especial"
            className="w-full h-[45vh] md:h-[55vh] object-cover"
            style={{ objectPosition: galleryImages[3].offset }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/30" />
        </motion.div>

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

        {/* Imagen entre secciones */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden"
        >
          <img
            src={galleryImages[4].src}
            alt="Momento especial"
            className="w-full h-[45vh] md:h-[55vh] object-cover"
            style={{ objectPosition: galleryImages[4].offset }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/30" />
        </motion.div>

        {/* Gift Table */}
        <Section id="regalos" className="bg-white-off">
          <GiftTable
            mensaje={
              config.mensajeRegalos ||
              "Nuestro mejor regalo será compartir este día contigo, pero si deseas tener un detalle con nosotros, aquí te dejamos nuestros datos."
            }
            cuentaBancaria={config.cuentaBancaria}
            yape={config.yape}
            plin={config.plin}
            qrUrl={config.qrRegalo}
          />
        </Section>

        {/* Imagen entre secciones */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden"
        >
          <img
            src={galleryImages[5].src}
            alt="Momento especial"
            className="w-full h-[45vh] md:h-[55vh] object-cover"
            style={{ objectPosition: galleryImages[5].offset }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/30" />
        </motion.div>

        {/* Song Request - Invitation only */}
        <Section id="canciones" className="bg-white-off">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-charcoal rounded-full mb-6">
              <Music className="w-8 h-8 text-detalle" />
            </div>
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-text-primary mb-4">
              Playlist
            </h2>
            <p className="text-text-secondary font-cormorant text-lg max-w-md mx-auto">
              Desde tu invitación personal podrás sugerir esa canción que no
              puede faltar
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-text-light text-sm font-cormorant italic">
              <span>✦</span>
              <span>Requiere enlace de invitación</span>
              <span>✦</span>
            </div>
          </div>
        </Section>

        {/* Imagen entre secciones */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden"
        >
          <img
            src={galleryImages[6].src}
            alt="Momento especial"
            className="w-full h-[45vh] md:h-[55vh] object-cover"
            style={{ objectPosition: galleryImages[6].offset }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/30" />
        </motion.div>

        {/* Adults Only */}
        <AdultsOnly mensaje={config.mensajeAdultos} />

        {/* RSVP - Invitation only */}
        <Section id="confirmar">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-charcoal rounded-full mb-6">
              <Heart className="w-8 h-8 text-detalle" />
            </div>
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-text-primary mb-4">
              Confirmar Asistencia
            </h2>
            <p className="text-text-secondary font-cormorant text-lg max-w-md mx-auto">
              Desde tu invitación personal podrás confirmar tu asistencia
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-text-light text-sm font-cormorant italic">
              <span>✦</span>
              <span>Requiere enlace de invitación</span>
              <span>✦</span>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <footer className="py-16 text-center bg-gradient-to-t from-charcoal to-charcoal-light text-white">
          <div className="max-w-2xl mx-auto px-6">
            <h3 className="font-great-vibes text-5xl md:text-6xl mb-4">
              {novia} <span className="text-detalle">&</span> {novio}
            </h3>
            <p className="text-white/60 mb-8 font-cormorant text-lg">
              Esperamos contar con su presencia
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-detalle/40" />
              <div className="w-2 h-2 bg-detalle/60 rounded-full" />
              <div className="h-px w-12 bg-detalle/40" />
            </div>
            <p className="text-white/40 text-sm mt-8 font-cormorant">
              Muchas gracias
            </p>
          </div>
        </footer>
      </main>
      <MusicPlayer src="/music/risk-bruno-mars.mp3" title="Risk - Bruno Mars" />
    </>
  )
}
