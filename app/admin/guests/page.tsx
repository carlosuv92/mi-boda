'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getGuests, createGuest, updateGuest, deleteGuest, getConfig } from '@/lib/api';
import { slugify } from '@/lib/utils';
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
  estado: string;
  lado: string;
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

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    email: '',
    acompanantes_autorizados: 0,
    slug: '',
    lado: 'novio' as 'novio' | 'novia',
  });

  useEffect(() => {
    loadGuests();
    getConfig().then((data) => setMensajeInvitado(data.mensajeInvitado || '')).catch(() => {});
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredGuests(
        guests.filter(
          (g) =>
            g.nombre.toLowerCase().includes(search.toLowerCase()) ||
            g.apellidos.toLowerCase().includes(search.toLowerCase()) ||
            g.slug.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredGuests(guests);
    }
  }, [search, guests]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingGuest) {
        await updateGuest(editingGuest.id, {
          ...formData,
        });
      } else {
        const slug = slugify(`${formData.nombre}-${formData.apellidos}`);
        await createGuest({
          ...formData,
          slug,
          acompanantes_confirmados: 0,
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
      slug: '',
      lado: 'novio',
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
      slug: guest.slug,
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
          <h1 className="font-playfair text-2xl font-semibold text-text-primary">
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
              <h2 className="font-playfair text-xl font-semibold text-text-primary">
                {editingGuest ? 'Editar Invitado' : 'Nuevo Invitado'}
              </h2>
              <button onClick={resetForm} className="p-2 hover:bg-cream rounded-lg">
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Lado
                </label>
                <select
                  value={formData.lado}
                  onChange={(e) => setFormData({ ...formData, lado: e.target.value as 'novio' | 'novia' })}
                  className="w-full px-4 py-2 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-principal/50 bg-white"
                >
                  <option value="novio">Novio</option>
                  <option value="novia">Novia</option>
                </select>
              </div>

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

      {/* Guests Table */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream-dark">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-secondary">
                  Invitado
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-secondary hidden md:table-cell">
                  Contacto
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-text-secondary">
                  Acomp.
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-text-secondary hidden md:table-cell">
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
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="text-sm text-text-secondary">
                        {guest.telefono && <p>{guest.telefono}</p>}
                        {guest.email && <p>{guest.email}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-principal-soft rounded-full text-sm font-medium text-text-primary">
                        {guest.acompanantes_autorizados}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <span className={`text-xs font-medium uppercase tracking-wider ${
                        guest.lado === 'novio' ? 'text-blue-600' : 'text-pink-600'
                      }`}>
                        {guest.lado === 'novio' ? 'Novio' : 'Novia'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
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
    </div>
  );
}
