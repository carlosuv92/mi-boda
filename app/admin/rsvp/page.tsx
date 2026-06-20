'use client';

import { useState, useEffect } from 'react';
import { getRSVPs, getGuests } from '@/lib/sheet-api';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface RSVP {
  guest_id: string;
  estado: string;
  acompanantes_confirmados: number;
  total_confirmados: number;
  fecha: string;
  comentario: string;
}

export default function RSVPPage() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getRSVPs(), getGuests()])
      .then(([rsvpData, guestData]) => {
        setRsvps(rsvpData);
        setGuests(guestData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getGuestName = (guestId: string) => {
    const guest = guests.find((g) => g.id === guestId);
    return guest ? `${guest.nombre} ${guest.apellidos}` : 'Desconocido';
  };

  const stats = {
    total: guests.length,
    totalAsignados: guests.reduce((sum, g) => sum + g.acompanantes_autorizados + 1, 0),
    confirmados: rsvps.filter((r) => r.estado === 'ACEPTADO').length,
    rechazados: rsvps.filter((r) => r.estado === 'RECHAZADO').length,
    pendientes: guests.length - rsvps.length,
    totalConfirmados: rsvps
      .filter((r) => r.estado === 'ACEPTADO')
      .reduce((sum, r) => sum + r.total_confirmados, 0),
  };

  const exportToExcel = () => {
    const data = rsvps.map((r) => {
      const guest = guests.find((g) => g.id === r.guest_id);
      return {
        Invitado: getGuestName(r.guest_id),
        Teléfono: guest?.telefono || '',
        Email: guest?.email || '',
        'Acompañantes Autorizados': guest?.acompanantes_autorizados || 0,
        'Acompañantes Confirmados': r.acompanantes_confirmados,
        'Total Asignado': (guest?.acompanantes_autorizados || 0) + 1,
        'Total Confirmado': r.total_confirmados,
        Estado: r.estado,
        Comentarios: r.comentario || '',
        Fecha: r.fecha,
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Confirmaciones');
    XLSX.writeFile(wb, 'confirmaciones-boda.xlsx');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-text-secondary">Cargando confirmaciones...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-2xl font-semibold text-text-primary">
            Confirmaciones
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Estado de asistencia de invitados
          </p>
        </div>

        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white rounded-lg hover:bg-charcoal-light transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          Exportar Excel
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-playfair font-semibold text-text-primary">{stats.total}</p>
          <p className="text-xs text-text-secondary mt-1">Invitados</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-playfair font-semibold text-principal">{stats.totalAsignados}</p>
          <p className="text-xs text-text-secondary mt-1">Asignados</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-playfair font-semibold text-green-600">{stats.confirmados}</p>
          <p className="text-xs text-text-secondary mt-1">Confirmados</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-playfair font-semibold text-blue-600">{stats.totalConfirmados}</p>
          <p className="text-xs text-text-secondary mt-1">Total Confirmados</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-playfair font-semibold text-red-500">{stats.rechazados}</p>
          <p className="text-xs text-text-secondary mt-1">Rechazados</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-playfair font-semibold text-yellow-500">{stats.pendientes}</p>
          <p className="text-xs text-text-secondary mt-1">Pendientes</p>
        </div>
      </div>

      {/* RSVPs Table */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream-dark">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-secondary">
                  Invitado
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-text-secondary">
                  Estado
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-text-secondary hidden sm:table-cell">
                  Acomp. Confirmados
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-text-secondary">
                  Total
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-secondary hidden md:table-cell">
                  Fecha
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-secondary hidden lg:table-cell">
                  Comentario
                </th>
              </tr>
            </thead>
            <tbody>
              {rsvps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-text-secondary">
                    No hay confirmaciones registradas
                  </td>
                </tr>
              ) : (
                rsvps.map((rsvp, index) => (
                  <tr key={index} className="border-t border-cream-dark/30">
                    <td className="px-4 py-3 font-medium text-text-primary">
                      {getGuestName(rsvp.guest_id)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          rsvp.estado === 'ACEPTADO'
                            ? 'bg-green-100 text-green-700'
                            : rsvp.estado === 'RECHAZADO'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {rsvp.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      {rsvp.acompanantes_confirmados}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold">
                      {rsvp.total_confirmados}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary hidden md:table-cell">
                      {rsvp.fecha}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary hidden lg:table-cell">
                      {rsvp.comentario || '-'}
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
