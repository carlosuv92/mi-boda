'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getConfig, getGuestBySlug } from '@/lib/api'
import { InvitationContent } from '@/components/sections/InvitationContent'
import { MusicPlayer } from '@/components/ui/MusicPlayer'

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
  const [error, setError] = useState<string | null>(null)

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
      .catch((err) => {
        console.error('Error al cargar invitación:', err)
        setError('No se pudo cargar la invitación. Verifica el enlace o intenta recargar.')
      })
      .finally(() => setLoading(false))
  }, [slug])

  const fotoPrincipal = config.fotoPrincipal || '/images/principal.webp'

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
          <div className="animate-pulse text-detalle font-cormorant text-2xl md:text-3xl">
            {config.novia || 'Lilian'} & {config.novio || 'Felipe'}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center px-6">
          <p className="text-text-primary font-cormorant text-xl mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-charcoal text-white rounded-xl font-cormorant text-xl hover:bg-charcoal-light transition-colors"
          >
            Recargar
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <InvitationContent config={config} guest={guest} />
      <MusicPlayer src="/music/risk-bruno-mars.mp3" title="Risk - Bruno Mars" />
    </>
  )
}
