import type { Guest, RSVP as RSVPType, SongSuggestion, WeddingConfig, TimelineEvent, GalleryImage } from '@/types';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/* Guests */
export async function getGuests(): Promise<Guest[]> {
  return apiFetch<Guest[]>('/api/guests');
}

export async function getGuestBySlug(slug: string): Promise<Guest | null> {
  return apiFetch<Guest | null>(`/api/guests?slug=${encodeURIComponent(slug)}`);
}

export async function createGuest(guest: Omit<Guest, 'id' | 'estado'>): Promise<Guest> {
  return apiFetch<Guest>('/api/guests', {
    method: 'POST',
    body: JSON.stringify(guest),
  });
}

export async function updateGuest(id: string, guest: Partial<Guest>): Promise<Guest> {
  return apiFetch<Guest>(`/api/guests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(guest),
  });
}

export async function deleteGuest(id: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/api/guests/${id}`, { method: 'DELETE' });
}

/* RSVPs */
export async function getRSVPs(): Promise<RSVPType[]> {
  return apiFetch<RSVPType[]>('/api/rsvps');
}

export async function getRSVPByGuestId(guest_id: string): Promise<RSVPType | null> {
  return apiFetch<RSVPType | null>(`/api/rsvps/${encodeURIComponent(guest_id)}`);
}

export async function submitRSVP(rsvp: Omit<RSVPType, 'total_confirmados' | 'fecha'>): Promise<RSVPType> {
  return apiFetch<RSVPType>('/api/rsvps', {
    method: 'POST',
    body: JSON.stringify(rsvp),
  });
}

export async function updateRSVP(guest_id: string, rsvp: Pick<RSVPType, 'estado' | 'acompanantes_confirmados' | 'comentario'>): Promise<RSVPType> {
  return apiFetch<RSVPType>(`/api/rsvps/${encodeURIComponent(guest_id)}`, {
    method: 'PUT',
    body: JSON.stringify(rsvp),
  });
}

/* Songs */
export async function getSongs(): Promise<SongSuggestion[]> {
  return apiFetch<SongSuggestion[]>('/api/songs');
}

export async function submitSong(song: Omit<SongSuggestion, 'id'>): Promise<SongSuggestion> {
  return apiFetch<SongSuggestion>('/api/songs', {
    method: 'POST',
    body: JSON.stringify(song),
  });
}

/* Config */
export async function getConfig(): Promise<Record<string, string>> {
  return apiFetch<Record<string, string>>('/api/config');
}

export async function updateConfig(key: string, value: string) {
  return apiFetch('/api/config', {
    method: 'PUT',
    body: JSON.stringify({ clave: key, valor: value }),
  });
}

/* Timeline */
export async function getTimeline(): Promise<TimelineEvent[]> {
  return apiFetch<TimelineEvent[]>('/api/timeline');
}

/* Gallery */
export async function getGallery(): Promise<GalleryImage[]> {
  return apiFetch<GalleryImage[]>('/api/gallery');
}
