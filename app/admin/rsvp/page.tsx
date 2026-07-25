'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Download, Check, X, Clock, Users, List, LayoutGrid } from 'lucide-react'
import { getGuests } from '@/lib/api'
import type { Guest } from '@/types'
import * as XLSX from 'xlsx'

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
  const [view, setView] = useState<'tabla' | 'confirmados'>('tabla')
  const [filter, setFilter] = useState<'todos' | 'confirmado' | 'pendiente' | 'rechazado'>('todos')

  useEffect(() => {
    getGuests()
      .then(setGuests)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const stats = calcStats(guests)

  const filteredGuests = useMemo(() => {
    if (filter === 'todos') return guests
    return guests.filter((g) => g.estado === filter)
  }, [guests, filter])

  const exportExcel = () => {
    const data = guests.map((g) => ({
      Nombre: g.nombre,
      Apellidos: g.apellidos || '',
      Teléfono: g.telefono || '',
      Estado: g.estado,
      Lado: g.lado === 'novio' ? 'Novio' : 'Novia',
      'Acomp. Autorizados': g.acompanantes_autorizados ?? 0,
      'Acomp. Confirmados': g.acompanantes_confirmados ?? 0,
      'Nombres Acompañantes': (g.acompanantes_nombres || []).join(', ') || '-',
      'Total Personas': 1 + (g.acompanantes_confirmados ?? 0),
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'RSVP')
    XLSX.writeFile(wb, `rsvp-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-text-secondary font-cormorant text-xl">
          Cargando respuestas...
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-cormorant text-2xl font-semibold text-text-primary">
            Respuestas RSVP
          </h1>
          <p className="text-text-secondary text-sm mt-1 font-cormorant">
            {stats.total} invitados · {stats.totalAcompanantes + stats.confirmados} asistentes totales
          </p>
        </div>
        <button
          onClick={exportExcel}
          className="flex items-center gap-2 px-5 py-2.5 bg-charcoal text-white rounded-xl hover:bg-charcoal/90 transition-colors text-sm font-cormorant cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Exportar Excel
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

      {/* View toggle + Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex gap-1 bg-cream-dark rounded-xl p-1">
          <button
            onClick={() => setView('tabla')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors font-cormorant cursor-pointer ${
              view === 'tabla'
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <List className="w-4 h-4" />
            Lista General
          </button>
          <button
            onClick={() => setView('confirmados')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors font-cormorant cursor-pointer ${
              view === 'confirmados'
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Confirmados
          </button>
        </div>

        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="pl-4 pr-8 py-2.5 rounded-xl bg-white border border-cream-dark focus:outline-none focus:ring-2 focus:ring-principal/20 appearance-none cursor-pointer font-cormorant text-text-primary"
          >
            <option value="todos">Todos ({guests.length})</option>
            <option value="confirmado">Confirmados ({stats.confirmados})</option>
            <option value="pendiente">Pendientes ({stats.pendientes})</option>
            <option value="rechazado">Rechazados ({stats.rechazados})</option>
          </select>
        </div>
      </div>

      {/* Tabla General */}
      {view === 'tabla' && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl overflow-hidden border border-cream-dark">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-cream-dark/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-text-secondary font-cormorant">
                      Invitado
                    </th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-text-secondary font-cormorant">
                      Lado
                    </th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-text-secondary font-cormorant">
                      Estado
                    </th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-text-secondary font-cormorant">
                      Acomp.
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-text-secondary font-cormorant">
                      Nombres Acompañantes
                    </th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-text-secondary font-cormorant">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-text-secondary font-cormorant">
                        No se encontraron invitados
                      </td>
                    </tr>
                  ) : (
                    filteredGuests.map((guest) => {
                      const nombres = guest.acompanantes_nombres || []
                      const total = 1 + (guest.acompanantes_confirmados ?? 0)
                      return (
                        <tr key={guest.id} className="border-t border-cream-dark/30 hover:bg-cream-dark/10 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-medium text-[#1e3a5f] font-cormorant">
                              {guest.nombre} {guest.apellidos}
                            </p>
                            {guest.telefono && (
                              <p className="text-xs text-text-light font-cormorant">{guest.telefono}</p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xs font-medium uppercase tracking-wider font-cormorant ${
                              guest.lado === 'novio' ? 'text-blue-600' : 'text-pink-600'
                            }`}>
                              {guest.lado === 'novio' ? 'Novio' : 'Novia'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium font-cormorant ${
                              guest.estado === 'confirmado'
                                ? 'bg-green-100 text-green-700'
                                : guest.estado === 'rechazado'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {guest.estado}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-sm text-text-secondary font-cormorant">
                              {guest.acompanantes_confirmados ?? 0}/{guest.acompanantes_autorizados ?? 0}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {nombres.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {nombres.filter(Boolean).map((nom, i) => (
                                  <span key={i} className="inline-flex items-center px-2 py-0.5 bg-principal/10 text-[#1e3a5f] rounded text-xs font-cormorant">
                                    {nom}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-text-light font-cormorant italic">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-sm font-semibold text-text-primary font-cormorant">
                              {total}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredGuests.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <p className="text-text-secondary font-cormorant text-xl">
                  No se encontraron invitados
                </p>
              </div>
            ) : (
              filteredGuests.map((guest) => {
                const nombres = guest.acompanantes_nombres || []
                const total = 1 + (guest.acompanantes_confirmados ?? 0)
                return (
                  <motion.div
                    key={guest.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-4 border border-cream-dark"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-cormorant text-lg font-semibold text-[#1e3a5f]">
                        {guest.nombre} {guest.apellidos}
                      </p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium font-cormorant shrink-0 ${
                        guest.estado === 'confirmado'
                          ? 'bg-green-100 text-green-700'
                          : guest.estado === 'rechazado'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {guest.estado}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-cormorant text-text-secondary mb-2">
                      <span className={`text-xs font-medium uppercase tracking-wider ${
                        guest.lado === 'novio' ? 'text-blue-600' : 'text-pink-600'
                      }`}>
                        {guest.lado === 'novio' ? 'Novio' : 'Novia'}
                      </span>
                      <span>Acomp: {guest.acompanantes_confirmados ?? 0}/{guest.acompanantes_autorizados ?? 0}</span>
                      <span>Total: {total}</span>
                    </div>
                    {nombres.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-cream-dark/30">
                        {nombres.filter(Boolean).map((nom, i) => (
                          <span key={i} className="inline-flex items-center px-2 py-0.5 bg-principal/10 text-[#1e3a5f] rounded text-xs font-cormorant">
                            {nom}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )
              })
            )}
          </div>
        </>
      )}

      {/* Vista Confirmados */}
      {view === 'confirmados' && (
        <div className="grid gap-3">
          {filteredGuests.filter((g) => g.estado === 'confirmado').length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl">
              <p className="text-text-secondary font-cormorant text-xl">
                No hay invitados confirmados aún
              </p>
            </div>
          ) : (
            filteredGuests
              .filter((g) => g.estado === 'confirmado')
              .map((guest) => {
                const nombres = guest.acompanantes_nombres || []
                return (
                  <motion.div
                    key={guest.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-5 border border-cream-dark"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-cormorant text-xl font-semibold text-[#1e3a5f]">
                          {guest.nombre} {guest.apellidos}
                        </p>
                        <p className="text-sm text-text-light font-cormorant mt-0.5">
                          {guest.lado === 'novio' ? 'Familia del Novio' : 'Familia de la Novia'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium font-cormorant">
                          <Check className="w-3.5 h-3.5" /> Confirmado
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-cream-dark">
                      <div className="flex gap-4 text-sm font-cormorant mb-2">
                        <span className="text-text-secondary">
                          Acompañantes: <strong className="text-text-primary">{guest.acompanantes_confirmados ?? 0}/{guest.acompanantes_autorizados ?? 0}</strong>
                        </span>
                        {guest.telefono && <span className="text-text-light">{guest.telefono}</span>}
                      </div>
                      {nombres.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-cream-dark/30">
                          {nombres.filter(Boolean).map((nom, i) => (
                            <span key={i} className="inline-flex items-center px-2 py-0.5 bg-principal/10 text-[#1e3a5f] rounded text-xs font-cormorant">
                              {nom}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })
          )}
        </div>
      )}
    </div>
  )
}
