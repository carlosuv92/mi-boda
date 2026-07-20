'use client';

import { useState, useEffect } from 'react';
import { getSongs } from '@/lib/api';

interface Song {
  guest_id: string;
  guest_name: string;
  cancion: string;
  artista: string;
  comentario: string;
}

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSongs()
      .then((data) => setSongs(data))
      .catch((err) => {
        console.error('Error al cargar canciones:', err);
        setError('No se pudieron cargar las canciones.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-text-secondary">Cargando canciones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 font-cormorant text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-cormorant text-2xl font-semibold text-text-primary">
          Canciones Sugeridas
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          {songs.length} canciones sugeridas por invitados
        </p>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream-dark">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-secondary">
                  Canción
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-secondary">
                  Artista
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-secondary hidden sm:table-cell">
                  Invitado
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-secondary hidden md:table-cell">
                  Comentario
                </th>
              </tr>
            </thead>
            <tbody>
              {songs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-text-secondary">
                    No hay canciones sugeridas aún
                  </td>
                </tr>
              ) : (
                songs.map((song, index) => (
                  <tr key={index} className="border-t border-cream-dark/30">
                    <td className="px-4 py-3 font-medium text-text-primary">
                      {song.cancion}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {song.artista}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary hidden sm:table-cell">
                      {song.guest_name || 'Anónimo'}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-light hidden md:table-cell">
                      {song.comentario || '-'}
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
