"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { getConfig, getGuestBySlug } from "@/lib/api"
import { Countdown } from "@/components/ui/Countdown"
import { Section } from "@/components/ui/Section"
import { FloralDivider } from "@/components/ui/FloralDivider"
import { LocationCard } from "@/components/ui/LocationCard"
import { Timeline } from "@/components/ui/Timeline"
import { DressCode } from "@/components/sections/DressCode"
import { GiftTable } from "@/components/sections/GiftTable"
import { SongRequest } from "@/components/sections/SongRequest"
import { RSVP } from "@/components/sections/RSVP"
import { AdultsOnly } from "@/components/sections/AdultsOnly"
import { MusicPlayer } from "@/components/ui/MusicPlayer"
import LogoSVG from "@/components/icons/Logo"

const galleryImages = [
  { src: "/gallery/image-1.webp", offset: "center 80%" },
  { src: "/gallery/image-14.webp", offset: "center 35%" },
  { src: "/gallery/image-3.webp", offset: "center 50%" },
  { src: "/gallery/image-2.webp", offset: "center 45%" },
  { src: "/gallery/image-11.webp", offset: "center 50%" },
  { src: "/gallery/image-5.webp", offset: "center 70%" },
  { src: "/gallery/image-10.webp", offset: "center 35%" },
]

export default function InvitationPage() {
  const params = useParams()
  const slug = params.slug as string

  const [config, setConfig] = useState<Record<string, string>>({})
  const [guest, setGuest] = useState<{
    id: string
    nombre: string
    apellidos: string
    acompanantes_autorizados: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getConfig(), getGuestBySlug(slug)])
      .then(([configData, guestData]) => {
        setConfig(configData)
        if (guestData) {
          setGuest({
            id: guestData.id,
            nombre: guestData.nombre,
            apellidos: guestData.apellidos,
            acompanantes_autorizados:
              guestData.acompanantes_autorizados || 0,
          })
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  const fotoPrincipal = config.fotoPrincipal || "/images/principal.webp"

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
    )
  }

  const rawDate = config.fecha || "2027-04-15"
  const [y, m, d] = rawDate.split('-').map(Number);
  const weddingDate = new Date(y, m - 1, d);
  const novio = config.novio || "Felipe"
  const novia = config.novia || "Lilian"

  return (
    <>
      <main className="min-h-screen bg-cream">
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
              {guest && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-white text-md md:text-base mb-4 font-cormorant tracking-wide"
                >
                  Bienvenido/a{" "}
                  <span className="text-detalle font-medium">
                    {guest.nombre} {guest.apellidos}
                  </span>
                  {guest.acompanantes_autorizados > 0 && (
                    <>{" "}y acompañantes</>
                  )}
                </motion.p>
              )}

              <p className="text-white text-sm uppercase tracking-[0.3em] my-6 font-cormorant">
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
                className="mb-2"
              >
                <LogoSVG className="w-36 md:w-48 lg:w-56 mx-auto text-detalle drop-shadow-lg" />
              </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="hidden md:block w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
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
            <p className="text-center text-text-secondary italic leading-relaxed font-cormorant text-lg md:text-xl">
              Queremos que disfruten y celebren con nosotros sin preocupaciones.
              Si pueden, les recomendamos venir sin auto. Si necesitan
              estacionamiento, con gusto les reservaremos un espacio; solo
              avísennos con anticipación, ya que los cupos son limitados.
            </p>
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
          <Timeline />
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
            cuentaBancaria="0064 6896 0000 01"
            cci="091 003 0064 8960 0014 9"
            telefono="993 323 090"
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
          {guest ? (
            <SongRequest guestId={guest.id} guestNombre={guest.nombre} />
          ) : (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mt-4 text-text-light text-sm font-cormorant italic">
                <span>✦</span>
                <span>Requiere enlace de invitación</span>
                <span>✦</span>
              </div>
            </div>
          )}
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

        {/* RSVP */}
        <Section id="confirmar">
          <div className="text-center mb-8">
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-text-primary mb-2">
              Confirmar Asistencia
            </h2>
            <p className="text-text-secondary font-cormorant text-lg">
              Nos encantaría contar con tu presencia en la lista de invitados.
            </p>
            <p className="text-text-secondary font-cormorant text-lg">
              Confirmanos tu asistencia hasta el <strong>31 DE AGOSTO</strong>
            </p>
          </div>
          {guest ? (
            <RSVP
              guestId={guest.id}
              guestNombre={guest.nombre}
              guestApellidos={guest.apellidos}
              acompanantesAutorizados={guest.acompanantes_autorizados}
            />
          ) : (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-text-light text-sm font-cormorant italic">
                <span>✦</span>
                <span>Requiere enlace de invitación</span>
                <span>✦</span>
              </div>
            </div>
          )}
        </Section>

        {/* Footer */}
        <footer className="py-16 text-center bg-gradient-to-t from-charcoal to-charcoal-light text-white">
          <div className="max-w-2xl mx-auto px-6">
            <h3 className="font-great-vibes text-5xl md:text-6xl mb-4">
              {novia} & {novio}
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
  )
}
