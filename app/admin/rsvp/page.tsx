'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Check, X, Clock, Users } from 'lucide-react'
import { getGuests } from '@/lib/api'
import type { Guest } from '@/types'

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  color: string
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-cream-dark text-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${color}`}>
        {icon}
      </div>
      <p className="text-2xl font-cormorant font-semibold text-text-primary">{value}</p>
      <p className="text-xs uppercase tracking-widest text-text-light mt-1 font-cormorant">
        {label}
      </p>
    </div>
  )
}

function GuestRow({ guest }: { guest: Guest }) {
  const confirmados = guest.acompanantes_confirmados ?? 0
  const autorizados = guest.acompanantes_autorizados ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 border border-cream-dark"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-cormorant text-lg font-semibold text-text-primary">
            {guest.nombre} {guest.apellidos}
          </p>
          <p className="text-sm text-text-light font-cormorant mt-0.5">
            {guest.lado === 'novio' ? 'Familia del Novio' : 'Familia de la Novia'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {guest.estado === 'confirmado' ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium font-cormorant">
              <Check className="w-3.5 h-3.5" /> Confirmado
            </span>
          ) : guest.estado === 'pendiente' ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-medium font-cormorant">
              <Clock className="w-3.5 h-3.5" /> Pendiente
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-medium font-cormorant">
              <X className="w-3.5 h-3.5" /> Rechazado
            </span>
          )}
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-cream-dark">
        <div className="flex gap-4 text-sm font-cormorant">
          <span className="text-text-secondary">
            Acompañantes: <strong className="text-text-primary">{confirmados}/{autorizados}</strong>
          </span>
          {guest.telefono && <span className="text-text-light">{guest.telefono}</span>}
        </div>
      </div>
    </motion.div>
  )
}

function calcStats(guests: Guest[]) {
  return {
    total: guests.length,
    confirmados: guests.filter((g) => g.estado === 'confirmado').length,
    pendientes: guests.filter((g) => g.estado === 'pendiente').length,
    rechazados: guests.filter((g) => g.estado === 'rechazado').length,
    totalAcompanantes: guests.reduce((sum, g) => sum + (g.acompanantes_confirmados ?? 0), 0),
  }
}

export default function RSVPAdminPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGuests()
      .then(setGuests)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const stats = calcStats(guests)
  const invitedGuests = guests.filter((g) => g.estado === 'confirmado')

  const exportCSV = () => {
    const headers = ['Nombre', 'Apellidos', 'Teléfono', 'Email', 'Estado', 'Lado', 'Acompañantes Autorizados', 'Acompañantes Confirmados']
    const rows = guests.map((g) => [
      g.nombre,
      g.apellidos || '',
      g.telefono || '',
      g.email || '',
      g.estado,
      g.lado,
      String(g.acompanantes_autorizados ?? 0),
      String(g.acompanantes_confirmados ?? 0),
    ])
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rsvp-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-text-secondary font-cormorant text-lg">
          Cargando respuestas...
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cormorant text-2xl font-semibold text-text-primary">
            Respuestas RSVP
          </h1>
          <p className="text-text-secondary text-sm mt-1 font-cormorant">
            {stats.total} invitados · {stats.totalAcompanantes + stats.confirmados} asistentes totales
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-5 py-2.5 bg-charcoal text-white rounded-xl hover:bg-charcoal/90 transition-colors text-sm font-cormorant"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<Check className="w-5 h-5 text-green-600" />}
          label="Confirmados"
          value={stats.confirmados}
          color="bg-green-50"
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-yellow-600" />}
          label="Pendientes"
          value={stats.pendientes}
          color="bg-yellow-50"
        />
        <StatCard
          icon={<X className="w-5 h-5 text-red-600" />}
          label="Rechazados"
          value={stats.rechazados}
          color="bg-red-50"
        />
        <StatCard
          icon={<Users className="w-5 h-5 text-principal" />}
          label="Asistentes"
          value={stats.totalAcompanantes + stats.confirmados}
          color="bg-principal/10"
        />
      </div>

      <div className="mb-4">
        <h2 className="font-cormorant text-lg font-semibold text-text-primary">
          Invitados Confirmados
        </h2>
        <p className="text-sm text-text-light font-cormorant">
          {invitedGuests.length} invitados han confirmado su asistencia
        </p>
      </div>

      {invitedGuests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <p className="text-text-secondary font-cormorant text-lg">
            No hay invitados confirmados aún
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {invitedGuests.map((guest) => (
            <GuestRow key={guest.id} guest={guest} />
          ))}
        </div>
      )}
    </div>
  )
}
