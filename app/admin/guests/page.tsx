'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter } from 'lucide-react'
import { getGuests } from '@/lib/api'
import { Guest } from '@/types'

export default function GuestsAdminPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'todos' | 'pendientes' | 'confirmados' | 'novio' | 'novia'>('todos')

  const loadGuests = async () => {
    try {
      const data = await getGuests()
      setGuests(data)
    } catch (error) {
      console.error('Error loading guests:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGuests()
  }, [])

  const filteredGuests = useMemo(() => {
    let result = guests

    if (filter === 'pendientes') {
      result = result.filter((g) => g.estado === 'pendiente')
    } else if (filter === 'confirmados') {
      result = result.filter((g) => g.estado === 'confirmado')
    } else if (filter === 'novio') {
      result = result.filter((g) => g.lado === 'novio')
    } else if (filter === 'novia') {
      result = result.filter((g) => g.lado === 'novia')
    }

    if (search.trim()) {
      const term = search.toLowerCase()
      result = result.filter(
        (g) =>
          g.nombre.toLowerCase().includes(term) ||
          (g.apellidos && g.apellidos.toLowerCase().includes(term))
      )
    }

    return result
  }, [guests, filter, search])

  const stats = useMemo(() => {
    const total = guests.length
    const confirmados = guests.filter((g) => g.estado === 'confirmado').length
    const pendientes = guests.filter((g) => g.estado === 'pendiente').length
    const novio = guests.filter((g) => g.lado === 'novio').length
    const novia = guests.filter((g) => g.lado === 'novia').length
    return { total, confirmados, pendientes, novio, novia }
  }, [guests])

  const filterOptions = [
    { value: 'todos', label: 'Todos', count: guests.length },
    { value: 'pendientes', label: 'Pendientes', count: guests.filter((g) => g.estado === 'pendiente').length },
    { value: 'confirmados', label: 'Confirmados', count: guests.filter((g) => g.estado === 'confirmado').length },
    { value: 'novio', label: 'Familia Novio', count: guests.filter((g) => g.lado === 'novio').length },
    { value: 'novia', label: 'Familia Novia', count: guests.filter((g) => g.lado === 'novia').length },
  ] as const

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-text-secondary font-cormorant text-lg">
          Cargando invitados...
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-cormorant text-2xl font-semibold text-text-primary">
          Invitados
        </h1>
        <p className="text-text-secondary text-sm mt-1 font-cormorant">
          {stats.confirmados} confirmados de {stats.total} invitados ·{' '}
          {stats.novio} del novio · {stats.novia} de la novia
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-cream-dark mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-3xl font-cormorant font-semibold text-principal">
              {stats.total}
            </p>
            <p className="text-xs uppercase tracking-widest text-text-light mt-1 font-cormorant">
              Total
            </p>
          </div>
          <div>
            <p className="text-3xl font-cormorant font-semibold text-green-600">
              {stats.confirmados}
            </p>
            <p className="text-xs uppercase tracking-widest text-text-light mt-1 font-cormorant">
              Confirmados
            </p>
          </div>
          <div>
            <p className="text-3xl font-cormorant font-semibold text-yellow-600">
              {stats.pendientes}
            </p>
            <p className="text-xs uppercase tracking-widest text-text-light mt-1 font-cormorant">
              Pendientes
            </p>
          </div>
          <div>
            <p className="text-3xl font-cormorant font-semibold text-text-primary">
              {guests.reduce((acc, g) => acc + (g.acompanantes_autorizados || 0), 0)}
            </p>
            <p className="text-xs uppercase tracking-widest text-text-light mt-1 font-cormorant">
              Acompañantes
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-cream-dark focus:outline-none focus:ring-2 focus:ring-principal/20 font-cormorant text-text-primary placeholder-text-light"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="pl-10 pr-8 py-2.5 rounded-xl bg-white border border-cream-dark focus:outline-none focus:ring-2 focus:ring-principal/20 appearance-none cursor-pointer font-cormorant text-text-primary"
          >
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label} ({opt.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredGuests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <p className="text-text-secondary font-cormorant text-lg">
            No se encontraron invitados
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredGuests.map((guest, index) => (
            <motion.div
              key={guest.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className="bg-white rounded-2xl p-5 border border-cream-dark"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-cormorant text-lg font-semibold text-text-primary">
                    {guest.nombre} {guest.apellidos}
                  </h3>
                  <p className="text-sm text-text-light font-cormorant mt-0.5">
                    {guest.lado === 'novio' ? 'Familia del Novio' : 'Familia de la Novia'}
                  </p>
                  {(guest.telefono || guest.email) && (
                    <div className="flex gap-3 mt-2 text-xs text-text-secondary font-cormorant">
                      {guest.telefono && <span>{guest.telefono}</span>}
                      {guest.email && <span>{guest.email}</span>}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium font-cormorant ${
                      guest.estado === 'confirmado'
                        ? 'bg-green-50 text-green-700'
                        : guest.estado === 'pendiente'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    {guest.estado}
                  </span>
                  <span className="text-xs text-text-light font-cormorant">
                    +{guest.acompanantes_autorizados || 0} acompañantes
                  </span>
                </div>
              </div>

              {guest.acompanantes_nombres && guest.acompanantes_nombres.length > 0 && (
                <div className="mt-3 pt-3 border-t border-cream-dark">
                  <p className="text-xs uppercase tracking-widest text-text-light font-cormorant mb-1">
                    Acompañantes
                  </p>
                  <p className="text-sm text-text-secondary font-cormorant">
                    {guest.acompanantes_nombres}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
