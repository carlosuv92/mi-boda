'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { getConfig, getTimeline, getGuestBySlug } from '@/lib/sheet-api';
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

const galleryImages = [
  { src: "/gallery/image-1.webp", offset: "center 80%" },
  { src: "/gallery/image-3.webp", offset: "center 50%" },
  { src: "/gallery/image-2.webp", offset: "center 45%" },
  { src: "/gallery/image-11.webp", offset: "center 50%" },
  { src: "/gallery/image-5.webp", offset: "center 70%" },
  { src: "/gallery/image-10.webp", offset: "center 35%" },
]

export default function InvitationPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [config, setConfig] = useState<Record<string, string>>({});
  const [timeline, setTimeline] = useState([]);
  const [guest, setGuest] = useState<{ id: string; nombre: string; apellidos: string; acompanantes_autorizados: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getConfig(), getTimeline(), getGuestBySlug(slug)])
      .then(([configData, timelineData, guestData]) => {
        setConfig(configData);
        setTimeline(timelineData);
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
        <img src={fotoPrincipal} alt="Cargando" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center">
          <div className="animate-pulse text-detalle font-playfair text-2xl md:text-3xl">Felipe & Lilian</div>
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
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0">
            <img src={fotoPrincipal} alt={`${novio} & ${novia}`} className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: "easeOut" }} className="relative z-10 px-6 flex flex-col items-center">
            {guest && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-white/60 text-sm md:text-base mb-4 font-cormorant tracking-wide">
                Bienvenido/a <span className="text-white font-medium">{guest.nombre} {guest.apellidos}</span> y familia
              </motion.p>
            )}

            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="h-px w-10 bg-detalle/50" />
              <span className="font-playfair text-4xl md:text-5xl font-semibold text-white">{novio.charAt(0)}</span>
              <span className="text-detalle text-2xl md:text-3xl font-light">&</span>
              <span className="font-playfair text-4xl md:text-5xl font-semibold text-white">{novia.charAt(0)}</span>
              <div className="h-px w-10 bg-detalle/50" />
            </div>

            <p className="text-white/70 text-xs uppercase tracking-[0.3em] mb-10 font-cormorant">¡Nos casamos!</p>

            <p className="text-white/50 text-xs md:text-sm mb-8 uppercase tracking-[0.2em] font-cormorant">
              {config.biblia || '"Y sobre todo vístanse de amor" — Colosenses 3:14'}
            </p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="mb-10">
              <h1 className="font-great-vibes text-4xl md:text-6xl lg:text-7xl text-white mb-3 drop-shadow-lg">
                {novio} <span className="text-detalle-light">&</span> {novia}
              </h1>
              <p className="text-white/70 text-base md:text-lg font-cormorant font-light tracking-wide">Tenemos el honor de invitarte a nuestra boda</p>
            </motion.div>

            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-px w-16 bg-white/30" />
              <span className="font-playfair text-lg md:text-xl text-white tracking-wide">
                {new Date(weddingDate).toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </span>
              <div className="h-px w-16 bg-white/30" />
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }}>
              <p className="text-white/50 text-xs uppercase tracking-[0.3em] mb-4 font-cormorant">Faltan</p>
              <Countdown targetDate={weddingDate} variant="dark" />
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1 h-3 bg-detalle rounded-full mt-2" />
            </div>
          </motion.div>
        </section>

        {/* Welcome Message */}
        <Section className="bg-white-off">
          <FloralDivider className="mb-8" />
          <p className="text-center text-text-secondary italic leading-relaxed font-cormorant text-lg md:text-xl">
            {config.mensajeBienvenida || "Con nuestro amor, la bendición de Dios y en compañía de nuestros padres, los invitamos a celebrar el día más especial de nuestras vidas."}
          </p>
          <FloralDivider className="mt-8" />
        </Section>

        {/* Imagen entre secciones */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative overflow-hidden">
          <img src={galleryImages[0].src} alt="Momento especial" className="w-full h-[45vh] md:h-[55vh] object-cover" style={{ objectPosition: galleryImages[0].offset }} loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/30" />
        </motion.div>

        {/* Ceremony & Reception */}
        <Section id="ubicacion">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-text-primary mb-2">Ubicación</h2>
            <p className="text-text-secondary font-cormorant text-lg">Ceremonia y recepción</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <LocationCard type="ceremonia" foto={config.fotoIglesia} titulo={config.nombreIglesia || "Ceremonia Religiosa"} direccion={config.direccionIglesia || ""} hora={config.horaCeremonia || "11:00 AM"} estacionamiento={config.estacionamientoIglesia} mapsUrl={config.mapsIglesia || "#"} />
            <LocationCard type="recepcion" foto={config.fotoRecepcion} titulo={config.nombreRecepcion || "Recepción"} direccion={config.direccionRecepcion || ""} hora={config.horaRecepcion || "1:00 PM"} estacionamiento={config.estacionamientoRecepcion} mapsUrl={config.mapsRecepcion || "#"} />
          </div>
        </Section>

        {/* Imagen entre secciones */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative overflow-hidden">
          <img src={galleryImages[1].src} alt="Momento especial" className="w-full h-[45vh] md:h-[55vh] object-cover" style={{ objectPosition: galleryImages[1].offset }} loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/30" />
        </motion.div>

        {/* Dress Code */}
        <Section id="dresscode" className="bg-white-off">
          <DressCode vestimentaHombres={config.vestimentaHombres || "Formal"} vestimentaMujeres={config.vestimentaMujeres || "Formal"} coloresSugeridos={config.coloresSugeridos?.split(",")} coloresReservados={config.coloresReservados?.split(",") || ["Blanco", "Crema"]} restricciones={config.restriccionesColores} />
        </Section>

        {/* Imagen entre secciones */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative overflow-hidden">
          <img src={galleryImages[2].src} alt="Momento especial" className="w-full h-[45vh] md:h-[55vh] object-cover" style={{ objectPosition: galleryImages[2].offset }} loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/30" />
        </motion.div>

        {/* Timeline */}
        <Section id="itinerario">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-text-primary mb-2">Itinerario</h2>
            <p className="text-text-secondary font-cormorant text-lg">Cronograma de actividades</p>
          </div>
          <Timeline events={timeline} />
        </Section>

        {/* Imagen entre secciones */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative overflow-hidden">
          <img src={galleryImages[3].src} alt="Momento especial" className="w-full h-[45vh] md:h-[55vh] object-cover" style={{ objectPosition: galleryImages[3].offset }} loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/30" />
        </motion.div>

        {/* Gift Table */}
        <Section id="regalos" className="bg-white-off">
          <GiftTable mensaje={config.mensajeRegalos || "Nuestro mejor regalo será compartir este día contigo, pero si deseas tener un detalle con nosotros, aquí te dejamos nuestros datos."} cuentaBancaria={config.cuentaBancaria} yape={config.yape} plin={config.plin} qrUrl={config.qrRegalo} />
        </Section>

        {/* Imagen entre secciones */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative overflow-hidden">
          <img src={galleryImages[4].src} alt="Momento especial" className="w-full h-[45vh] md:h-[55vh] object-cover" style={{ objectPosition: galleryImages[4].offset }} loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/30" />
        </motion.div>

        {/* Song Request */}
        <Section id="canciones" className="bg-white-off">
          <div className="text-center mb-8">
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-text-primary mb-2">Playlist</h2>
            <p className="text-text-secondary font-cormorant text-lg">Ayúdanos con la música, sugiere esa canción que no puede faltar</p>
          </div>
          <SongRequest />
        </Section>

        {/* Imagen entre secciones */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative overflow-hidden">
          <img src={galleryImages[5].src} alt="Momento especial" className="w-full h-[45vh] md:h-[55vh] object-cover" style={{ objectPosition: galleryImages[5].offset }} loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/30" />
        </motion.div>

        {/* RSVP */}
        <Section id="confirmar">
          <div className="text-center mb-8">
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-text-primary mb-2">Confirmar Asistencia</h2>
            <p className="text-text-secondary font-cormorant text-lg">Por favor confirma tu asistencia antes del {config.fechaLimiteRSVP || '10 de mayo'}</p>
          </div>
          <RSVP guestId={guest?.id} guestNombre={guest?.nombre} guestApellidos={guest?.apellidos} acompanantesAutorizados={guest?.acompanantes_autorizados} />
        </Section>

        {/* Adults Only */}
        <AdultsOnly mensaje={config.mensajeAdultos} />

        {/* Footer */}
        <footer className="py-16 text-center bg-gradient-to-t from-charcoal to-charcoal-light text-white">
          <div className="max-w-2xl mx-auto px-6">
            <h3 className="font-great-vibes text-5xl md:text-6xl mb-4">{novio} & {novia}</h3>
            <p className="text-white/60 mb-8 font-cormorant text-lg">Esperamos contar con su presencia</p>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-principal/40" />
              <div className="w-2 h-2 bg-principal/60 rounded-full" />
              <div className="h-px w-12 bg-principal/40" />
            </div>
            <p className="text-white/40 text-sm mt-8 font-cormorant">Muchas gracias</p>
          </div>
        </footer>
      </main>
      <MusicPlayer src="/music/risk-bruno-mars.mp3" title="Risk - Bruno Mars" />
    </>
  );
}
