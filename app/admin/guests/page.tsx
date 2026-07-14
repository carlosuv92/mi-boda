'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getGuests, createGuest, updateGuest, deleteGuest, getConfig } from '@/lib/api';
import { slugify, sanitizePhone } from '@/lib/utils';
import { Search, Plus, Edit2, Trash2, Download, Link, MessageCircle, X, Check } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Guest {
  id: string;
  slug: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
  acompanantes_autorizados: number;
  acompanantes_confirmados: number;
  acompanantes_nombres: string[];
  estado: 'pendiente' | 'confirmado' | 'rechazado';
  lado: 'novio' | 'novia';
}

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mensajeInvitado, setMensajeInvitado] = useState('');
  const [tab, setTab] = useState<'todos' | 'novio' | 'novia'>('todos');
  const [confirmGuest, setConfirmGuest] = useState<Guest | null>(null);
  const [confirmNombres, setConfirmNombres] = useState<string[]>([]);
  const [confirmAutorizados, setConfirmAutorizados] = useState(0);
  const [confirmSaving, setConfirmSaving] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    email: '',
    acompanantes_autorizados: 0,
    acompanantes_confirmados: 0,
    acompanantes_nombres: [] as string[],
    slug: '',
    estado: 'pendiente' as 'pendiente' | 'confirmado' | 'rechazado',
    lado: 'novia' as 'novio' | 'novia',
  });

  useEffect(() => {
    loadGuests();
    getConfig().then((data) => setMensajeInvitado(data.mensajeInvitado || '')).catch(() => {});
  }, []);

  useEffect(() => {
    let result = guests;
    if (tab !== 'todos') {
      result = result.filter((g) => g.lado === tab);
    }
    if (search) {
      result = result.filter(
        (g) =>
          g.nombre.toLowerCase().includes(search.toLowerCase()) ||
          g.apellidos.toLowerCase().includes(search.toLowerCase()) ||
          g.slug.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredGuests(result);
  }, [search, guests, tab]);

  const loadGuests = async () => {
    try {
      const data = await getGuests();
      setGuests(data);
      setFilteredGuests(data);
    } catch (error) {
      console.error('Error loading guests:', error);
    } finally {
      setLoading(false);
    }
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const copyLink = (guest: Guest) => {
    const url = `${baseUrl}/invitacion/${guest.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(guest.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sendMessage = (guest: Guest) => {
    if (!guest.telefono) return;
    const link = `${baseUrl}/invitacion/${guest.slug}`;
    const texto = mensajeInvitado
      .replace(/\{\{invitado\}\}/g, `${guest.nombre} ${guest.apellidos}`)
      .replace(/\uFE0F/g, '');
    const url = `https://api.whatsapp.com/send?phone=${guest.telefono}&text=${encodeURIComponent(texto + '\n\n' + link)}`;
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
  };

  const openConfirm = (guest: Guest) => {
    setConfirmGuest(guest);
    setConfirmAutorizados(guest.acompanantes_autorizados);
    setConfirmNombres(guest.acompanantes_nombres ? [...guest.acompanantes_nombres] : Array(guest.acompanantes_autorizados).fill(''));
  };

  const handleConfirm = async () => {
    if (!confirmGuest) return;
    if (confirmAutorizados > 0) {
      const trimmed = confirmNombres.slice(0, confirmAutorizados).map((n) => n.trim());
      if (trimmed.some((n) => !n)) {
        alert('Ingresa los nombres de todos los acompañantes');
        return;
      }
    }
    setConfirmSaving(true);
    try {
      await updateGuest(confirmGuest.id, {
        estado: 'confirmado',
        acompanantes_autorizados: confirmAutorizados,
        acompanantes_confirmados: confirmAutorizados,
        acompanantes_nombres: confirmNombres.slice(0, confirmAutorizados).map((n) => n.trim()),
      });
      await loadGuests();
      setConfirmGuest(null);
    } catch (error) {
      console.error('Error confirming guest:', error);
    } finally {
      setConfirmSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data = { ...formData, telefono: sanitizePhone(formData.telefono) };

    try {
      if (editingGuest) {
        await updateGuest(editingGuest.id, data);
      } else {
        const slug = slugify(`${formData.nombre}-${formData.apellidos}`);
        await createGuest({
          ...data,
          slug,
          acompanantes_confirmados: 0,
          acompanantes_nombres: [],
        });
      }

      await loadGuests();
      resetForm();
    } catch (error) {
      console.error('Error saving guest:', error);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellidos: '',
      telefono: '',
      email: '',
      acompanantes_autorizados: 0,
      acompanantes_confirmados: 0,
      acompanantes_nombres: [],
      slug: '',
      estado: 'pendiente',
      lado: 'novia',
    });
    setEditingGuest(null);
    setShowForm(false);
  };

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({
      nombre: guest.nombre,
      apellidos: guest.apellidos,
      telefono: guest.telefono,
      email: guest.email,
      acompanantes_autorizados: guest.acompanantes_autorizados,
      acompanantes_confirmados: guest.acompanantes_confirmados,
      acompanantes_nombres: guest.acompanantes_nombres || [],
      slug: guest.slug,
      estado: guest.estado,
      lado: guest.lado as 'novio' | 'novia',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este invitado?')) {
      try {
        await deleteGuest(id);
        await loadGuests();
      } catch (error) {
        console.error('Error deleting guest:', error);
      }
    }
  };

  const exportToExcel = () => {
    const data = guests.map((g) => ({
      ID: g.id,
      Slug: g.slug,
      Nombre: g.nombre,
      Apellidos: g.apellidos,
      Teléfono: g.telefono,
      Email: g.email,
      'Acompañantes Autorizados': g.acompanantes_autorizados,
      'Acompañantes Confirmados': g.acompanantes_confirmados,
      'Nombres Acompañantes': (g.acompanantes_nombres || []).join(', '),
      Estado: g.estado,
      Lado: g.lado,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invitados');
    XLSX.writeFile(wb, 'invitados-boda.xlsx');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-text-secondary">Cargando invitados...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-cormorant text-2xl font-semibold text-text-primary">
            Gestión de Invitados
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {guests.length} invitados registrados
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="flex-1 sm:flex-initial relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
            <input
              type="text"
              placeholder="Buscar invitado..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-principal/50 text-sm"
            />
          </div>

          <button
            onClick={exportToExcel}
            className="p-2 bg-white border border-cream-dark rounded-lg hover:bg-cream transition-colors"
            title="Exportar a Excel"
          >
            <Download className="w-5 h-5 text-text-secondary" />
          </button>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white rounded-lg hover:bg-charcoal-light transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo</span>
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-cormorant text-xl font-semibold text-text-primary">
                {editingGuest ? 'Editar Invitado' : 'Nuevo Invitado'}
              </h2>
              <button onClick={resetForm} className="p-2 hover:bg-cream rounded-lg">
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Lado — colorful toggle at top */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Lado
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, lado: 'novia' })}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                      formData.lado === 'novia'
                        ? 'bg-pink-100 text-pink-700 ring-2 ring-pink-300'
                        : 'bg-cream text-text-secondary hover:bg-pink-50'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    Novia
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, lado: 'novio' })}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                      formData.lado === 'novio'
                        ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-300'
                        : 'bg-cream text-text-secondary hover:bg-blue-50'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    Novio
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-principal/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Apellidos *
                </label>
                <input
                  type="text"
                  value={formData.apellidos}
                  onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                  className="w-full px-4 py-2 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-principal/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full px-4 py-2 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-principal/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Acompañantes autorizados
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.acompanantes_autorizados}
                  onChange={(e) =>
                    setFormData({ ...formData, acompanantes_autorizados: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-2 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-principal/50"
                />
              </div>

              {editingGuest && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Acompañantes confirmados
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.acompanantes_confirmados}
                      onChange={(e) => {
                        const count = parseInt(e.target.value) || 0;
                        setFormData((prev) => ({
                          ...prev,
                          acompanantes_confirmados: count,
                          acompanantes_nombres:
                            count > prev.acompanantes_nombres.length
                              ? [...prev.acompanantes_nombres, ...Array(count - prev.acompanantes_nombres.length).fill('')]
                              : prev.acompanantes_nombres.slice(0, count),
                        }));
                      }}
                      className="w-full px-4 py-2 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-principal/50"
                    />
                  </div>

                  {formData.acompanantes_confirmados > 0 && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        Nombres de acompañantes
                      </label>
                      {Array.from({ length: formData.acompanantes_confirmados }, (_, i) => (
                        <input
                          key={i}
                          type="text"
                          value={formData.acompanantes_nombres[i] || ''}
                          onChange={(e) =>
                            setFormData((prev) => {
                              const next = [...prev.acompanantes_nombres];
                              next[i] = e.target.value;
                              return { ...prev, acompanantes_nombres: next };
                            })
                          }
                          placeholder={`Acompañante ${i + 1}`}
                          className="w-full px-4 py-2 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-principal/50"
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-2 border border-cream-dark rounded-lg text-text-secondary hover:bg-cream transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 bg-charcoal text-white rounded-lg hover:bg-charcoal-light transition-colors disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-cream-dark rounded-xl p-1 w-fit">
        {(['todos', 'novio', 'novia'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {t === 'todos' ? 'Todos' : t === 'novio' ? 'Novio' : 'Novia'}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream-dark">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-secondary">
                  Invitado
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-secondary">
                  Contacto
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-text-secondary">
                  Acomp.
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-text-secondary">
                  Lado
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-text-secondary">
                  Estado
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-text-secondary">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-text-secondary">
                    No se encontraron invitados
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="border-t border-cream-dark/30">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-text-primary">
                          {guest.nombre} {guest.apellidos}
                        </p>
                        <p className="text-xs text-text-light">/{guest.slug}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-text-secondary">
                        {guest.telefono && <p>{guest.telefono}</p>}
                        {guest.email && <p className="text-xs">{guest.email}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-principal-soft rounded-full text-sm font-medium text-text-primary">
                        {guest.acompanantes_autorizados}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-medium uppercase tracking-wider ${
                        guest.lado === 'novio' ? 'text-blue-600' : 'text-pink-600'
                      }`}>
                        {guest.lado === 'novio' ? 'Novio' : 'Novia'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
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
                            className="text-xs px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                          >
                            Confirmar
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(guest)}
                          className="p-2 hover:bg-cream rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-text-secondary" />
                        </button>
                        <button
                          onClick={() => handleDelete(guest.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                        <button
                          onClick={() => copyLink(guest)}
                          className="p-2 hover:bg-cream rounded-lg transition-colors"
                          title="Copiar link de invitación"
                        >
                          {copiedId === guest.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Link className="w-4 h-4 text-text-secondary" />
                          )}
                        </button>
                        <button
                          onClick={() => sendMessage(guest)}
                          className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                          title="Enviar mensaje por WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4 text-green-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredGuests.length === 0 ? (
          <div className="text-center py-8 text-text-secondary bg-white rounded-2xl">
            No se encontraron invitados
          </div>
        ) : (
          filteredGuests.map((guest) => (
            <div key={guest.id} className="bg-white rounded-2xl p-4 shadow-sm">
              {/* Header row: name + estado */}
                <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-2">
                  <p className="font-medium text-text-primary truncate">
                    {guest.nombre} {guest.apellidos}
                  </p>
                  <p className="text-xs text-text-light truncate">/{guest.slug}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
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
                      className="text-xs px-2.5 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Confirmar
                    </button>
                  )}
                </div>
              </div>

              {/* Details row */}
              <div className="flex items-center gap-4 mb-3 text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${
                    guest.lado === 'novio' ? 'bg-blue-500' : 'bg-pink-500'
                  }`} />
                  {guest.lado === 'novio' ? 'Novio' : 'Novia'}
                </span>
                <span>Aut: {guest.acompanantes_autorizados}</span>
                <span>Conf: {guest.acompanantes_confirmados}</span>
                {guest.telefono && <span>{guest.telefono}</span>}
              </div>

              {guest.acompanantes_nombres && guest.acompanantes_nombres.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {guest.acompanantes_nombres.filter(Boolean).map((nom, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-cream-dark rounded text-xs text-text-secondary">
                      {nom}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions row */}
              <div className="flex items-center gap-1 pt-2 border-t border-cream-dark/20">
                <button
                  onClick={() => handleEdit(guest)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-cream rounded-lg transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Editar
                </button>
                <button
                  onClick={() => copyLink(guest)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-cream rounded-lg transition-colors"
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
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </button>
                )}
                <button
                  onClick={() => handleDelete(guest.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
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
              <button onClick={() => setConfirmGuest(null)} className="p-2 hover:bg-cream rounded-lg">
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
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Acompañantes
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={confirmAutorizados}
                onChange={(e) => {
                  const count = parseInt(e.target.value) || 0;
                  setConfirmAutorizados(count);
                  setConfirmNombres((prev) => {
                    if (count > prev.length) return [...prev, ...Array(count - prev.length).fill('')];
                    return prev.slice(0, count);
                  });
                }}
                className="w-full px-4 py-2 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-principal/50"
              />
            </div>

            {confirmAutorizados > 0 && (
              <div className="space-y-3 mb-4">
                <p className="text-sm font-medium text-text-secondary">
                  Nombres de los acompañantes
                </p>
                {Array.from({ length: confirmAutorizados }, (_, i) => (
                  <input
                    key={i}
                    type="text"
                    value={confirmNombres[i] || ''}
                    onChange={(e) =>
                      setConfirmNombres((prev) => {
                        const next = [...prev];
                        next[i] = e.target.value;
                        return next;
                      })
                    }
                    placeholder={`Acompañante ${i + 1}`}
                    className="w-full px-4 py-2 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-principal/50"
                    required
                  />
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmGuest(null)}
                className="flex-1 py-2 border border-cream-dark rounded-lg text-text-secondary hover:bg-cream transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={confirmSaving}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {confirmSaving ? 'Guardando...' : 'Confirmar asistencia'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
