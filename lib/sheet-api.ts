const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || '';

async function fetchFromSheet(action: string, data?: Record<string, unknown>) {
  if (!APPS_SCRIPT_URL) {
    throw new Error('NEXT_PUBLIC_APPS_SCRIPT_URL is not configured');
  }

  const response = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify({ action, ...data }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getGuestBySlug(slug: string) {
  const result = await fetchFromSheet('getGuestBySlug', { slug });
  return result.data;
}

export async function getGuests() {
  const result = await fetchFromSheet('getGuests');
  return result.data || [];
}

export async function createGuest(guest: {
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
  acompanantes_autorizados: number;
  slug: string;
}) {
  const result = await fetchFromSheet('createGuest', { guest });
  return result.data;
}

export async function updateGuest(id: string, guest: Partial<{
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
  acompanantes_autorizados: number;
  estado: string;
}>) {
  const result = await fetchFromSheet('updateGuest', { id, guest });
  return result.data;
}

export async function deleteGuest(id: string) {
  const result = await fetchFromSheet('deleteGuest', { id });
  return result;
}

export async function submitRSVP(rsvp: {
  guest_id: string;
  estado: string;
  acompanantes_confirmados: number;
  comentario: string;
}) {
  const result = await fetchFromSheet('submitRSVP', { rsvp });
  return result.data;
}

export async function getRSVPByGuestId(guest_id: string) {
  const result = await fetchFromSheet('getRSVPByGuestId', { guest_id });
  return result.data;
}

export async function updateRSVP(guest_id: string, rsvp: {
  estado: string;
  acompanantes_confirmados: number;
  comentario: string;
}) {
  const result = await fetchFromSheet('updateRSVP', { guest_id, rsvp });
  return result.data;
}

export async function getRSVPs() {
  const result = await fetchFromSheet('getRSVPs');
  return result.data || [];
}

export async function submitSong(song: {
  guest_id: string;
  guest_name: string;
  cancion: string;
  artista: string;
  comentario: string;
}) {
  const result = await fetchFromSheet('submitSong', { song });
  return result.data;
}

export async function getSongs() {
  const result = await fetchFromSheet('getSongs');
  return result.data || [];
}

export async function getConfig() {
  const result = await fetchFromSheet('getConfig');
  const data = result.data || [];
  const config: Record<string, string> = {};
  data.forEach((item: { clave: string; valor: string }) => {
    config[item.clave] = item.valor;
  });
  return config;
}

export async function updateConfig(key: string, value: string) {
  const result = await fetchFromSheet('updateConfig', { key, value });
  return result.data;
}

export async function getTimeline() {
  const result = await fetchFromSheet('getTimeline');
  return result.data || [];
}

export async function getGallery() {
  const result = await fetchFromSheet('getGallery');
  return result.data || [];
}
