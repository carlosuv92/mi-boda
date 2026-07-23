'use client'

import { motion } from 'framer-motion'
import { Section } from '@/components/ui/Section'
import { FloralDivider } from '@/components/ui/FloralDivider'
import { LocationCard } from '@/components/ui/LocationCard'
import { Timeline } from '@/components/ui/Timeline'
import { DressCode } from '@/components/sections/DressCode'
import { GiftTable } from '@/components/sections/GiftTable'
import { SongRequest } from '@/components/sections/SongRequest'
import { RSVP } from '@/components/sections/RSVP'
import { AdultsOnly } from '@/components/sections/AdultsOnly'
import { Countdown } from '@/components/ui/Countdown'
import { Music, Heart } from 'lucide-react'
import LogoSVG from '@/components/icons/Logo'
import { SectionHeader } from '@/components/ui/SectionHeader'
import Playlist from '@/components/icons/Playlist'
import Invitacion from "@/components/icons/Invitacion"

const galleryImages = [
  { src: '/gallery/image-1.webp', offset: 'center 80%' },
  { src: '/gallery/image-3.webp', offset: 'center 50%' },
  { src: '/gallery/image-14.webp', offset: 'center 35%' },
  { src: '/gallery/image-2.webp', offset: 'center 45%' },
  { src: '/gallery/image-11.webp', offset: 'center 50%' },
  { src: '/gallery/image-5.webp', offset: 'center 70%' },
  { src: '/gallery/image-10.webp', offset: 'center 35%' },
]

interface GuestData {
  id: string
  nombre: string
  apellidos: string
  acompanantes_autorizados: number
}

interface InvitationContentProps {
  config: Record<string, string>
  guest?: GuestData | null
}

function SectionImage({ src, offset }: { src: string; offset: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden"
    >
      <img
        src={src}
        alt="Momento especial"
        className="w-full h-[45vh] md:h-[55vh] object-cover"
        style={{ objectPosition: offset }}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/10 to-black/30" />
    </motion.div>
  )
}

function HeroSection({
  config,
  guest,
  novia,
  novio,
  fotoPrincipal,
}: {
  config: Record<string, string>
  guest?: GuestData | null
  novia: string
  novio: string
  fotoPrincipal: string
}) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={fotoPrincipal}
          alt={`${novia} & ${novio}`}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-between min-h-screen py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="px-6 text-center"
        >
          {guest && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white text-md md:text-base mb-4 font-cormorant tracking-wide"
            >
              Bienvenido/a{' '}
              <span className="text-detalle font-medium">
                {guest.nombre} {guest.apellidos}
              </span>
              {guest.acompanantes_autorizados > 0 && (
                <>
                  {' '}
                  y acompañante
                  {guest.acompanantes_autorizados > 1 ? 's' : ''}
                </>
              )}
            </motion.p>
          )}

          <p className="text-white text-xl uppercase tracking-[0.3em] my-4 font-cormorant font-bold">
            ¡Nos casamos!
          </p>

          <p className="text-white text-sm md:text-sm mb-2 uppercase tracking-[0.2em] font-cormorant">
            {config.biblia ||
              '"Y sobre todo vístanse de amor" — Colosenses 3:14'}
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-0"
          >
            <LogoSVG className="w-36 md:w-48 lg:w-56 mx-auto text-detalle drop-shadow-lg" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="hidden md:block w-6 h-10 border-2 border-white/30 rounded-full justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-detalle rounded-full mt-2 ml-2"
            />
          </div>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="md:hidden text-white/50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="-mt-3 opacity-40">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function CountdownSection({
  y,
  m,
  d,
  weddingDate,
  novia,
  novio,
}: {
  y: number
  m: number
  d: number
  weddingDate: Date
  novia: string
  novio: string
}) {
  return (
    <Section className="bg-white-off">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <div className="w-16 h-px mx-auto" />
          <p className="font-dancing-script text-6xl md:text-6xl  leading-tight mb-4">
            {novia} <span className="px-3">y</span> {novio}
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-detalle/40" />
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center px-3">
                <span className="font-cormorant text-4xl md:text-5xl text-text-primary font-bold">
                  {String(d).padStart(2, '0')}
                </span>
                <div className="text-xs md:text-sm uppercase tracking-widest text-text-secondary mt-1">
                  DIA
                </div>
              </div>
              <div className="text-4xl text-text-primary font-bold">.</div>
              <div className="flex flex-col items-center px-3">
                <span className="font-cormorant text-4xl md:text-5xl text-text-primary font-bold">
                  {String(m).padStart(2, '0')}
                </span>
                <div className="text-xs md:text-sm uppercase tracking-widest text-text-secondary mt-1">
                  MES
                </div>
              </div>
              <div className="text-4xl text-text-primary font-bold">.</div>
              <div className="flex flex-col items-center px-3">
                <span className="font-cormorant text-4xl md:text-5xl text-text-primary font-bold">
                  {String(y).slice(-2)}
                </span>
                <div className="text-xs md:text-sm uppercase tracking-widest text-text-secondary mt-1">
                  AÑO
                </div>
              </div>
            </div>
            <div className="h-px w-16 bg-detalle/40" />
          </div>
        </div>

        <p className="text-text-primary text-xl uppercase tracking-[0.3em] mb-4 mt-6 font-cormorant font-extrabold">
          PREPÁRATE!
        </p>
        <p className="text-text-primary text-md uppercase tracking-[0.3em] mb-4 font-cormorant font-extrabold">
          Nos vemos en..
        </p>
        <Countdown targetDate={weddingDate} />
      </div>
    </Section>
  )
}

export function InvitationContent({ config, guest }: InvitationContentProps) {
  const rawDate = config.fecha || '2027-04-15'
  const [y, m, d] = rawDate.split('-').map(Number)
  const weddingDate = new Date(y, m - 1, d)
  const novio = config.novio || 'Felipe'
  const novia = config.novia || 'Lilian'
  const isPersonalized = !!guest
  const fechaLimiteRSVP = config.fechaLimiteRSVP

  return (
    <main className="min-h-screen bg-cream">
      <HeroSection
        config={config}
        guest={guest}
        novia={novia}
        novio={novio}
        fotoPrincipal={config.fotoPrincipal || "/images/principal.webp"}
      />

      <CountdownSection
        y={y}
        m={m}
        d={d}
        weddingDate={weddingDate}
        novia={novia}
        novio={novio}
      />

      <SectionImage
        src={galleryImages[0].src}
        offset={galleryImages[0].offset}
      />

      <Section id="mensaje" className="bg-white-off">
        <FloralDivider className="mb-8" />
        <p className="text-center text-xl md:text-xl">
          {config.mensajeBienvenida ||
            "Con nuestro amor, la bendición de Dios y en compañía de nuestros padres, los invitamos a celebrar el día más especial de nuestras vidas."}
        </p>
        <FloralDivider className="mt-8" />
      </Section>

      <SectionImage
        src={galleryImages[1].src}
        offset={galleryImages[1].offset}
      />

      <Section id="ubicacion">
        <div className="text-center mb-12">
          <h2 className="font-cormorant text-3xl md:text-4xl font-semibold text-text-primary mb-2">
            Ubicación
          </h2>
          <p className="font-cormorant text-xl">Ceremonia y recepción</p>
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
        <p className="text-center mt-4 leading-relaxed font-cormorant text-lg md:text-xl">
          Habrá bebida y baile, así que nos encantaría que vengan sin auto. Si
          necesitan estacionamiento, con gusto se lo reservamos; avísennos con
          tiempo.
        </p>
      </Section>

      <SectionImage
        src={galleryImages[2].src}
        offset={galleryImages[2].offset}
      />

      <Section id="dresscode" className="bg-white-off">
        <DressCode />
      </Section>

      <SectionImage
        src={galleryImages[3].src}
        offset={galleryImages[3].offset}
      />

      <Section id="itinerario">
        <SectionHeader title="Itinerario" text="Cronograma de actividades" />
        <Timeline />
      </Section>

      <SectionImage
        src={galleryImages[4].src}
        offset={galleryImages[4].offset}
      />

      <Section id="regalos" className="bg-white-off">
        <GiftTable
          cuentaBancaria="0064 6896 0000 01"
          cci="091 003 0064 8960 0014 9"
          telefono="993 323 090"
          qrUrl={config.qrRegalo}
        />
      </Section>

      <SectionImage
        src={galleryImages[5].src}
        offset={galleryImages[5].offset}
      />

      <Section id="canciones" className="bg-white-off">
        {isPersonalized ? (
          <SectionHeader
            title="Playlist"
            icon={
              <Playlist className="w-50 text-principal mx-auto mb-4" />
            }
            text="Aquí puedes sugerir esa canción que no puede faltar en nuestra boda"
          />
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-charcoal rounded-full mb-6">
              <Music className="w-8 h-8 text-detalle" />
            </div>
            <h2 className="font-cormorant text-3xl md:text-4xl font-semibold text-text-primary mb-4">
              Playlist
            </h2>
            <p className="text-text-secondary font-cormorant text-xl max-w-md mx-auto">
              Desde tu invitación personal podrás sugerir esa canción que no
              puede faltar
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-text-light text-sm font-cormorant">
              <span>✦</span>
              <span>Requiere enlace de invitación</span>
              <span>✦</span>
            </div>
          </div>
        )}
        {isPersonalized && (
          <SongRequest guestId={guest!.id} guestNombre={guest!.nombre} />
        )}
      </Section>

      <SectionImage
        src={galleryImages[6].src}
        offset={galleryImages[6].offset}
      />

      <AdultsOnly mensaje={config.mensajeAdultos} />

      <Section id="confirmar">
        {isPersonalized ? (
          <>
            <SectionHeader
              title="Confirmar Asistencia"
              icon={
                <Invitacion className="w-30 text-principal mx-auto mb-4" />
              }
              text="Nos encantaría contar con tu presencia en la lista de invitados."
              textInvitacion={
                <>Confirmanos tu asistencia hasta el <strong>{fechaLimiteRSVP}</strong></>
              }
            />
            <RSVP
              guestId={guest!.id}
              guestNombre={guest!.nombre}
              guestApellidos={guest!.apellidos}
              acompanantesAutorizados={guest!.acompanantes_autorizados}
            />
          </>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-charcoal rounded-full mb-6">
              <Heart className="w-8 h-8 text-detalle" />
            </div>
            <h2 className="font-cormorant text-3xl md:text-4xl font-semibold text-text-primary mb-4">
              Confirmar Asistencia
            </h2>
            <p className="text-text-secondary font-cormorant text-xl max-w-md mx-auto">
              Desde tu invitación personal podrás confirmar tu asistencia
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-text-light text-sm font-cormorant">
              <span>✦</span>
              <span>Requiere enlace de invitación</span>
              <span>✦</span>
            </div>
          </div>
        )}
      </Section>

      <footer className="py-16 text-center bg-linear-to-t from-charcoal to-charcoal-light text-white">
        <div className="max-w-2xl mx-auto px-6">
          <h3 className="font-cormorant text-5xl md:text-6xl mb-4">
            {novia} <span className="text-detalle">&</span> {novio}
          </h3>
          <p className="text-white/60 mb-8 font-cormorant text-xl">
            Esperamos contar con su presencia
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-detalle/40" />
            <div className="w-2 h-2 bg-detalle/60 rounded-full" />
            <div className="h-px w-12 bg-detalle/40" />
          </div>
          <p className="text-white/40 text-md mt-8 font-cormorant">
            Muchas gracias
          </p>
        </div>
      </footer>
    </main>
  )
}
