'use client';

import { useState, useEffect } from 'react';
import { getRSVPs, getGuests } from '@/lib/api';
import { Download, Check, X, Clock, User, Users } from 'lucide-react';
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

  const getGuestLado = (guestId: string) => {
    const guest = guests.find((g) => g.id === guestId);
    return guest?.lado || 'novia';
  };

  const getGuest = (guestId: string) => guests.find((g) => g.id === guestId);

  const guestsNovio = guests.filter((g) => g.lado === 'novio');
  const guestsNovia = guests.filter((g) => g.lado === 'novia');

  const calcStats = (guestList: any[]) => {
    const total = guestList.length;
    const totalAsignados = guestList.reduce((sum, g) => sum + (g.acompanantes_autorizados || 0) + 1, 0);
    const confirmados = guestList.filter((g) => {
      const rsvp = rsvps.find((r) => r.guest_id === g.id);
      return rsvp?.estado === 'ACEPTADO';
    }).length;
    const rechazados = guestList.filter((g) => {
      const rsvp = rsvps.find((r) => r.guest_id === g.id);
      return rsvp?.estado === 'RECHAZADO';
    }).length;
    const pendientes = total - confirmados - rechazados;
    const totalConfirmados = guestList.reduce((sum, g) => {
      const rsvp = rsvps.find((r) => r.guest_id === g.id);
      if (rsvp?.estado === 'ACEPTADO') return sum + (rsvp.total_confirmados || 1);
      return sum;
    }, 0);
    return { total, totalAsignados, confirmados, rechazados, pendientes, totalConfirmados };
  };

  const statsAll = calcStats(guests);
  const statsNovio = calcStats(guestsNovio);
  const statsNovia = calcStats(guestsNovia);

  const allRsvpGuestIds = new Set(rsvps.map((r) => r.guest_id));
  const pendingGuests = guests.filter((g) => !allRsvpGuestIds.has(g.id));

  const exportToExcel = () => {
    const data = guests.map((g) => {
      const rsvp = rsvps.find((r) => r.guest_id === g.id);
      return {
        Lado: g.lado === 'novio' ? 'Novio' : 'Novia',
        Invitado: `${g.nombre} ${g.apellidos}`,
        Teléfono: g.telefono || '',
        Email: g.email || '',
        'Acomp. Autorizados': g.acompanantes_autorizados || 0,
        'Acomp. Confirmados': rsvp?.acompanantes_confirmados || 0,
        'Total Asignado': (g.acompanantes_autorizados || 0) + 1,
        'Total Confirmado': rsvp?.total_confirmados || 0,
        Estado: rsvp?.estado || 'PENDIENTE',
        Comentarios: rsvp?.comentario || '',
        Fecha: rsvp?.fecha || '',
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Confirmaciones');
    XLSX.writeFile(wb, 'confirmaciones-boda.xlsx');
  };

  const StatCard = ({ title, total, asignados, confirmados, rechazados, pendientes, totalPers, color }: {
    title: string; total: number; asignados: number; confirmados: number;
    rechazados: number; pendientes: number; totalPers: number; color: string;
  }) => (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-cormorant font-semibold text-lg text-text-primary mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-3 bg-cream rounded-xl">
          <p className="text-xl font-cormorant font-semibold text-text-primary">{total}</p>
          <p className="text-[10px] text-text-light uppercase tracking-wider mt-0.5">Invitados</p>
        </div>
        <div className="text-center p-3 bg-cream rounded-xl">
          <p className="text-xl font-cormorant font-semibold text-text-primary">{asignados}</p>
          <p className="text-[10px] text-text-light uppercase tracking-wider mt-0.5">Cupos</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-xl">
          <p className="text-xl font-cormorant font-semibold text-green-700">{confirmados}</p>
          <p className="text-[10px] text-green-600 uppercase tracking-wider mt-0.5">Van</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-xl">
          <p className="text-xl font-cormorant font-semibold text-green-700">{totalPers}</p>
          <p className="text-[10px] text-green-600 uppercase tracking-wider mt-0.5">Personas</p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-xl">
          <p className="text-xl font-cormorant font-semibold text-red-500">{rechazados}</p>
          <p className="text-[10px] text-red-500 uppercase tracking-wider mt-0.5">No van</p>
        </div>
        <div className="text-center p-3 bg-amber-50 rounded-xl">
          <p className="text-xl font-cormorant font-semibold text-amber-600">{pendientes}</p>
          <p className="text-[10px] text-amber-600 uppercase tracking-wider mt-0.5">Faltan</p>
        </div>
      </div>
    </div>
  );

  const renderGuestRow = (guest: any) => {
    const rsvp = rsvps.find((r) => r.guest_id === guest.id);
    const isNovio = guest.lado === 'novio';
    return (
      <tr key={guest.id} className={`border-t border-cream-dark/30 ${isNovio ? 'bg-blue-50/30' : 'bg-pink-50/30'}`}>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full shrink-0 ${isNovio ? 'bg-blue-500' : 'bg-pink-500'}`} />
            <span className="font-medium text-text-primary text-sm">{guest.nombre} {guest.apellidos}</span>
          </div>
        </td>
        <td className="px-4 py-3 text-center">
          <span className={`text-[10px] font-medium uppercase tracking-wider ${isNovio ? 'text-blue-600' : 'text-pink-600'}`}>
            {isNovio ? 'Novio' : 'Novia'}
          </span>
        </td>
        <td className="px-4 py-3 text-center">
          {rsvp ? (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
              rsvp.estado === 'ACEPTADO' ? 'bg-green-100 text-green-700' :
              rsvp.estado === 'RECHAZADO' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {rsvp.estado === 'ACEPTADO' ? <Check className="w-3 h-3" /> :
               rsvp.estado === 'RECHAZADO' ? <X className="w-3 h-3" /> :
               <Clock className="w-3 h-3" />}
              {rsvp.estado === 'ACEPTADO' ? 'Confirmó' :
               rsvp.estado === 'RECHAZADO' ? 'Rechazó' : 'Pendiente'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
              <Clock className="w-3 h-3" />
              Sin respuesta
            </span>
          )}
        </td>
        <td className="px-4 py-3 text-center text-sm text-text-secondary">
          {guest.acompanantes_autorizados || 0}
        </td>
        <td className="px-4 py-3 text-center text-sm font-semibold text-text-primary">
          {rsvp?.total_confirmados || '-'}
        </td>
        <td className="px-4 py-3 text-sm text-text-secondary hidden lg:table-cell">
          {rsvp?.comentario || '-'}
        </td>
      </tr>
    );
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
          <h1 className="font-cormorant text-2xl font-semibold text-text-primary">
            Confirmaciones
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Estado de asistencia por lado
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="👰 Novia"
          total={statsNovia.total}
          asignados={statsNovia.totalAsignados}
          confirmados={statsNovia.confirmados}
          rechazados={statsNovia.rechazados}
          pendientes={statsNovia.pendientes}
          totalPers={statsNovia.totalConfirmados}
          color="pink"
        />
        <StatCard
          title="🤵 Novio"
          total={statsNovio.total}
          asignados={statsNovio.totalAsignados}
          confirmados={statsNovio.confirmados}
          rechazados={statsNovio.rechazados}
          pendientes={statsNovio.pendientes}
          totalPers={statsNovio.totalConfirmados}
          color="blue"
        />
        <StatCard
          title="📊 Total"
          total={statsAll.total}
          asignados={statsAll.totalAsignados}
          confirmados={statsAll.confirmados}
          rechazados={statsAll.rechazados}
          pendientes={statsAll.pendientes}
          totalPers={statsAll.totalConfirmados}
          color="gray"
        />
      </div>

      {/* Pending Guests */}
      {pendingGuests.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-amber-600" />
            <h2 className="font-cormorant font-semibold text-amber-800">
              Faltan confirmar ({pendingGuests.length})
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {pendingGuests.map((g) => (
              <span key={g.id} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                g.lado === 'novio' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${g.lado === 'novio' ? 'bg-blue-500' : 'bg-pink-500'}`} />
                {g.nombre} {g.apellidos}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* All Guests Table */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Invitado
                </th>
                <th className="text-center px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Lado
                </th>
                <th className="text-center px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-center px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Acomp.
                </th>
                <th className="text-center px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Total
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider hidden lg:table-cell">
                  Comentario
                </th>
              </tr>
            </thead>
            <tbody>
              {guests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-text-secondary">
                    No hay invitados registrados
                  </td>
                </tr>
              ) : (
                guests.map((g) => renderGuestRow(g))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary footer */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-green-700 mb-1">
            <Check className="w-4 h-4" />
            <span className="font-cormorant font-semibold text-lg">{statsAll.confirmados}</span>
          </div>
          <p className="text-[10px] text-green-600 uppercase tracking-wider">Confirmaron</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-red-500 mb-1">
            <X className="w-4 h-4" />
            <span className="font-cormorant font-semibold text-lg">{statsAll.rechazados}</span>
          </div>
          <p className="text-[10px] text-red-500 uppercase tracking-wider">Rechazaron</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-amber-600 mb-1">
            <Clock className="w-4 h-4" />
            <span className="font-cormorant font-semibold text-lg">{statsAll.pendientes}</span>
          </div>
          <p className="text-[10px] text-amber-600 uppercase tracking-wider">Sin respuesta</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-blue-700 mb-1">
            <Users className="w-4 h-4" />
            <span className="font-cormorant font-semibold text-lg">{statsAll.totalConfirmados}</span>
          </div>
          <p className="text-[10px] text-blue-600 uppercase tracking-wider">Personas confirman</p>
        </div>
      </div>
    </div>
  );
}
