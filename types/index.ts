export interface Guest {
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

export interface RSVP {
  guest_id: string;
  estado: 'ACEPTADO' | 'RECHAZADO' | 'PENDIENTE';
  acompanantes_confirmados: number;
  acompanantes_nombres: string[];
  total_confirmados: number;
  fecha: string;
  comentario: string;
}

export interface SongSuggestion {
  guest_id: string;
  guest_name: string;
  cancion: string;
  artista: string;
  comentario: string;
}

export interface WeddingConfig {
  clave: string;
  valor: string;
}

export interface TimelineEvent {
  id: string;
  hora: string;
  titulo: string;
  descripcion: string;
  icono: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  descripcion: string;
  tipo: 'foto' | 'video';
  subido_por?: string;
  aprobado?: boolean;
  createdAt?: string;
}

export interface MoodboardImage {
  id: string;
  url: string;
  categoria: string;
  descripcion: string;
}
