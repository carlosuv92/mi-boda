'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  getGuests,
  createGuest,
  updateGuest,
  deleteGuest,
  getConfig,
} from '@/lib/api'
import { slugify, sanitizePhone } from '@/lib/utils'
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Link,
  MessageCircle,
  X,
  Check,
  Download,
} from 'lucide-react'
import { Guest } from '@/types'

export default function GuestsAdminPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'todos' | 'pendientes' | 'confirmados' | 'novio' | 'novia'>('todos')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [saving, setSaving] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [confirmGuest, setConfirmGuest] = useState<Guest | null>(null)
  const [confirmNombres, setConfirmNombres] = useState<string[]>([])
  const [confirmAutorizados, setConfirmAutorizados] = useState(0)
  const [confirmSaving, setConfirmSaving] = useState(false)
  const [mensajeInvitado, setMensajeInvitado] = useState('')

  const [formData, setFormData] = useState<{
    nombre: string
    apellidos: string
    telefono: string
    email: string
    acompanantes_autorizados: number
    slug: string
    estado: 'pendiente' | 'confirmado' | 'rechazado'
    lado: 'novio' | 'novia'
  }>({
    nombre: '',
    apellidos: '',
    telefono: '',
    email: '',
    acompanantes_autorizados: 0,
    slug: '',
    estado: 'pendiente',
    lado: 'novia',
  })

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
    getConfig()
      .then((data) => setMensajeInvitado(data.mensajeInvitado || ''))
      .catch(() => {})
  }, [])

  const filteredGuests = useMemo(() => {
    let result = guests
    if (filter === 'pendientes')
      result = result.filter((g) => g.estado === 'pendiente')
    else if (filter === 'confirmados')
      result = result.filter((g) => g.estado === 'confirmado')
    else if (filter === 'novio')
      result = result.filter((g) => g.lado === 'novio')
    else if (filter === 'novia')
      result = result.filter((g) => g.lado === 'novia')

    if (search.trim()) {
      const term = search.toLowerCase()
      result = result.filter(
        (g) =>
          g.nombre.toLowerCase().includes(term) ||
          (g.apellidos && g.apellidos.toLowerCase().includes(term)) ||
          (g.slug && g.slug.toLowerCase().includes(term))
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

  const baseUrl =
    typeof window !== 'undefined' ? window.location.origin : ''

  const copyLink = (guest: Guest) => {
    const url = `${baseUrl}/invitacion/${guest.slug}`
    navigator.clipboard.writeText(url)
    setCopiedId(guest.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const sendMessage = (guest: Guest) => {
    if (!guest.telefono) return
    const link = `${baseUrl}/invitacion/${guest.slug}`
    const texto = mensajeInvitado
      .replace(/\{\{invitado\}\}/g, `${guest.nombre} ${guest.apellidos}`)
      .replace(/\uFE0F/g, '')
    const url = `https://api.whatsapp.com/send?phone=${guest.telefono}&text=${encodeURIComponent(texto + '\n\n' + link)}`
    window.open(url, '_blank')
  }

  const openConfirm = (guest: Guest) => {
    setConfirmGuest(guest)
    setConfirmAutorizados(guest.acompanantes_autorizados || 0)
    setConfirmNombres(
      guest.acompanantes_nombres
        ? [...guest.acompanantes_nombres]
        : Array(guest.acompanantes_autorizados).fill('')
    )
  }

  const handleConfirm = async () => {
    if (!confirmGuest) return
    if (confirmAutorizados > 0) {
      const trimmed = confirmNombres
        .slice(0, confirmAutorizados)
        .map((n) => n.trim())
      if (trimmed.some((n) => !n)) {
        alert('Ingresa los nombres de todos los acompañantes')
        return
      }
    }
    setConfirmSaving(true)
    try {
      await updateGuest(confirmGuest.id, {
        estado: 'confirmado',
        acompanantes_autorizados: confirmAutorizados,
        acompanantes_confirmados: confirmAutorizados,
        acompanantes_nombres: confirmNombres
          .slice(0, confirmAutorizados)
          .map((n) => n.trim()),
      })
      await loadGuests()
      setConfirmGuest(null)
    } catch (error) {
      console.error('Error confirming guest:', error)
    } finally {
      setConfirmSaving(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const data = {
      ...formData,
      telefono: sanitizePhone(formData.telefono),
      acompanantes_confirmados: 0,
      acompanantes_nombres: [] as string[],
    }

    try {
      if (editingGuest) {
        await updateGuest(editingGuest.id, data)
      } else {
        const slug = slugify(`${formData.nombre}-${formData.apellidos}`)
        await createGuest({
          ...data,
          email: '',
          slug,
          acompanantes_confirmados: 0,
          acompanantes_nombres: [],
        })
      }
      await loadGuests()
      resetForm()
    } catch (error) {
      console.error('Error saving guest:', error)
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellidos: '',
      telefono: '',
      email: '',
      acompanantes_autorizados: 0,
      slug: '',
      estado: 'pendiente',
      lado: 'novia',
    })
    setEditingGuest(null)
    setShowForm(false)
  }

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest)
    setFormData({
      nombre: guest.nombre,
      apellidos: guest.apellidos || '',
      telefono: guest.telefono || '',
      email: guest.email || '',
      acompanantes_autorizados: guest.acompanantes_autorizados || 0,
      slug: guest.slug,
      estado: guest.estado,
      lado: guest.lado || 'novia',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este invitado?')) {
      try {
        await deleteGuest(id)
        await loadGuests()
      } catch (error) {
        console.error('Error deleting guest:', error)
      }
    }
  }

  const filterOptions = [
    { value: 'todos', label: 'Todos', count: guests.length },
    {
      value: 'pendientes',
      label: 'Pendientes',
      count: guests.filter((g) => g.estado === 'pendiente').length,
    },
    {
      value: 'confirmados',
      label: 'Confirmados',
      count: guests.filter((g) => g.estado === 'confirmado').length,
    },
    {
      value: 'novio',
      label: 'Novio',
      count: guests.filter((g) => g.lado === 'novio').length,
    },
    {
      value: 'novia',
      label: 'Novia',
      count: guests.filter((g) => g.lado === 'novia').length,
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-text-secondary font-cormorant text-xl">
          Cargando invitados...
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-cormorant text-2xl font-semibold text-text-primary">
            Invitados
          </h1>
          <p className="text-text-secondary text-sm mt-1 font-cormorant">
            {stats.confirmados} confirmados de {stats.total} invitados ·{' '}
            {stats.novio} del novio · {stats.novia} de la novia
          </p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white rounded-lg hover:bg-charcoal-light transition-colors text-sm font-cormorant"
        >
          <Plus className="w-4 h-4" />
          Nuevo
        </button>
      </div>

      {/* Stats */}
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
              {guests.reduce(
                (acc, g) => acc + (g.acompanantes_autorizados || 0),
                0
              )}
            </p>
            <p className="text-xs uppercase tracking-widest text-text-light mt-1 font-cormorant">
              Acompañantes
            </p>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
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
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="pl-4 pr-8 py-2.5 rounded-xl bg-white border border-cream-dark focus:outline-none focus:ring-2 focus:ring-principal/20 appearance-none cursor-pointer font-cormorant text-text-primary"
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
          <p className="text-text-secondary font-cormorant text-xl">
            No se encontraron invitados
          </p>
        </div>
      ) : (
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
                    <th className="text-left px-4 py-3 text-sm font-medium text-text-secondary font-cormorant">
                      Contacto
                    </th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-text-secondary font-cormorant">
                      Acomp.
                    </th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-text-secondary font-cormorant">
                      Lado
                    </th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-text-secondary font-cormorant">
                      Estado
                    </th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-text-secondary font-cormorant">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map((guest) => (
                    <tr
                      key={guest.id}
                      className="border-t border-cream-dark/30 hover:bg-cream-dark/10 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-text-primary font-cormorant">
                          {guest.nombre} {guest.apellidos}
                        </p>
                        <p className="text-xs text-text-light font-cormorant">
                          /{guest.slug}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-text-secondary font-cormorant">
                          {guest.telefono && <p>{guest.telefono}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-principal-soft rounded-full text-sm font-medium text-text-primary">
                          {guest.acompanantes_autorizados || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`text-xs font-medium uppercase tracking-wider font-cormorant ${
                            guest.lado === 'novio'
                              ? 'text-blue-600'
                              : 'text-pink-600'
                          }`}
                        >
                          {guest.lado === 'novio' ? 'Novio' : 'Novia'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium font-cormorant ${
                              guest.estado === 'confirmado'
                                ? 'bg-green-100 text-green-700'
                                : guest.estado === 'rechazado'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {guest.estado || 'pendiente'}
                          </span>
                          {guest.estado === 'pendiente' && (
                            <button
                              onClick={() => openConfirm(guest)}
                              className="text-xs px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium font-cormorant cursor-pointer"
                            >
                              Confirmar
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(guest)}
                            className="p-2 hover:bg-cream rounded-lg transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4 text-text-secondary" />
                          </button>
                          <button
                            onClick={() => copyLink(guest)}
                            className="p-2 hover:bg-cream rounded-lg transition-colors cursor-pointer"
                            title="Copiar link"
                          >
                            {copiedId === guest.id ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Link className="w-4 h-4 text-text-secondary" />
                            )}
                          </button>
                          {guest.telefono && (
                            <button
                              onClick={() => sendMessage(guest)}
                              className="p-2 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                              title="WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4 text-green-600" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(guest.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredGuests.map((guest) => (
              <motion.div
                key={guest.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 border border-cream-dark"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="font-medium text-text-primary font-cormorant text-lg">
                      {guest.nombre} {guest.apellidos}
                    </p>
                    <p className="text-xs text-text-light font-cormorant">
                      /{guest.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium font-cormorant ${
                        guest.estado === 'confirmado'
                          ? 'bg-green-100 text-green-700'
                          : guest.estado === 'rechazado'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {guest.estado || 'pendiente'}
                    </span>
                    {guest.estado === 'pendiente' && (
                      <button
                        onClick={() => openConfirm(guest)}
                        className="text-xs px-2.5 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium font-cormorant cursor-pointer"
                      >
                        Confirmar
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-3 text-sm text-text-secondary font-cormorant">
                  <span className="flex items-center gap-1">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        guest.lado === 'novio'
                          ? 'bg-blue-500'
                          : 'bg-pink-500'
                      }`}
                    />
                    {guest.lado === 'novio' ? 'Novio' : 'Novia'}
                  </span>
                  <span>Acomp: {guest.acompanantes_autorizados || 0}</span>
                  {guest.telefono && <span>{guest.telefono}</span>}
                </div>

                {guest.acompanantes_nombres &&
                  guest.acompanantes_nombres.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {guest.acompanantes_nombres
                        .filter(Boolean)
                        .map((nom, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-cream-dark rounded text-xs text-text-secondary font-cormorant"
                          >
                            {nom}
                          </span>
                        ))}
                    </div>
                  )}

                <div className="flex items-center gap-1 pt-2 border-t border-cream-dark/20">
                  <button
                    onClick={() => handleEdit(guest)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-cream rounded-lg transition-colors font-cormorant"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Editar
                  </button>
                  <button
                    onClick={() => copyLink(guest)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-cream rounded-lg transition-colors font-cormorant"
                  >
                    {copiedId === guest.id ? (
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Link className="w-3.5 h-3.5" />
                    )}
                    {copiedId === guest.id ? 'Copiado' : 'Link'}
                  </button>
                  {guest.telefono && (
                    <button
                      onClick={() => sendMessage(guest)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50 rounded-lg transition-colors font-cormorant"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(guest.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto font-cormorant"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Create/Edit Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-cormorant text-xl font-semibold text-text-primary">
                {editingGuest ? 'Editar Invitado' : 'Nuevo Invitado'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-cream rounded-lg"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Lado toggle */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2 font-cormorant">
                  Lado
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, lado: 'novia' })}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 font-cormorant ${
                      formData.lado === 'novia'
                        ? 'bg-pink-100 text-pink-700 ring-2 ring-pink-300'
                        : 'bg-cream text-text-secondary hover:bg-pink-50'
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                    Novia
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, lado: 'novio' })}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 font-cormorant ${
                      formData.lado === 'novio'
                        ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-300'
                        : 'bg-cream text-text-secondary hover:bg-blue-50'
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                    Novio
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1 font-cormorant">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-principal/50 font-cormorant"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1 font-cormorant">
                  Apellidos *
                </label>
                <input
                  type="text"
                  value={formData.apellidos}
                  onChange={(e) =>
                    setFormData({ ...formData, apellidos: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-principal/50 font-cormorant"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1 font-cormorant">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-principal/50 font-cormorant"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1 font-cormorant">
                  Acompañantes autorizados
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.acompanantes_autorizados}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      acompanantes_autorizados:
                        parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-principal/50 font-cormorant"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                className="flex-1 py-2 border border-cream-dark rounded-lg text-text-secondary hover:bg-cream transition-colors font-cormorant cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 bg-charcoal text-white rounded-lg hover:bg-charcoal-light transition-colors disabled:opacity-50 font-cormorant"
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Confirm Dialog */}
      {confirmGuest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-cormorant text-xl font-semibold text-text-primary">
                Confirmar invitado
              </h2>
              <button
                onClick={() => setConfirmGuest(null)}
                className="p-2 hover:bg-cream rounded-lg"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            <p className="text-text-secondary font-cormorant text-lg mb-4">
              ¿Confirmar asistencia de{' '}
              <span className="font-semibold text-text-primary">
                {confirmGuest.nombre} {confirmGuest.apellidos}
              </span>
              ?
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-1 font-cormorant">
                Acompañantes
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={confirmAutorizados}
                onChange={(e) => {
                  const count = parseInt(e.target.value) || 0
                  setConfirmAutorizados(count)
                  setConfirmNombres((prev) => {
                    if (count > prev.length)
                      return [
                        ...prev,
                        ...Array(count - prev.length).fill(''),
                      ]
                    return prev.slice(0, count)
                  })
                }}
                className="w-full px-4 py-2 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-principal/50 font-cormorant"
              />
            </div>

            {confirmAutorizados > 0 && (
              <div className="space-y-3 mb-4">
                <p className="text-sm font-medium text-text-secondary font-cormorant">
                  Nombres de los acompañantes
                </p>
                {Array.from({ length: confirmAutorizados }, (_, i) => (
                  <input
                    key={i}
                    type="text"
                    value={confirmNombres[i] || ''}
                    onChange={(e) =>
                      setConfirmNombres((prev) => {
                        const next = [...prev]
                        next[i] = e.target.value
                        return next
                      })
                    }
                    placeholder={`Acompañante ${i + 1}`}
                    className="w-full px-4 py-2 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-principal/50 font-cormorant"
                    required
                  />
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmGuest(null)}
                className="flex-1 py-2 border border-cream-dark rounded-lg text-text-secondary hover:bg-cream transition-colors font-cormorant"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={confirmSaving}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-cormorant cursor-pointer"
              >
                {confirmSaving ? 'Guardando...' : 'Confirmar asistencia'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
