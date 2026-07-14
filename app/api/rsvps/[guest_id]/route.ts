import { connectDB } from '@/lib/db';
import { RSVP } from '@/lib/models/RSVP';
import { Guest } from '@/lib/models/Guest';

export async function GET(_request: Request, { params }: { params: Promise<{ guest_id: string }> }) {
  await connectDB();
  const { guest_id } = await params;
  const rsvp = await RSVP.findOne({ guest_id });
  return Response.json(rsvp || null);
}

async function syncGuest(guest_id: string, estado: string, acompanantes_confirmados: number, acompanantes_nombres: string[]) {
  const guest = await Guest.findById(guest_id);
  if (!guest) return;
  const estadoMap: Record<string, 'confirmado' | 'rechazado' | 'pendiente'> = {
    ACEPTADO: 'confirmado',
    RECHAZADO: 'rechazado',
    PENDIENTE: 'pendiente',
  };
  guest.estado = estadoMap[estado] || 'pendiente';
  guest.acompanantes_confirmados = acompanantes_confirmados;
  guest.acompanantes_nombres = acompanantes_nombres;
  await guest.save();
}

export async function PUT(request: Request, { params }: { params: Promise<{ guest_id: string }> }) {
  await connectDB();
  const { guest_id } = await params;
  const body = await request.json();
  const updated = await RSVP.findOneAndUpdate(
    { guest_id },
    {
      estado: body.estado,
      acompanantes_confirmados: body.acompanantes_confirmados,
      acompanantes_nombres: body.acompanantes_nombres || [],
      total_confirmados: 1 + (body.acompanantes_confirmados || 0),
      comentario: body.comentario || '',
      fecha: new Date().toISOString().split('T')[0],
    },
    { new: true }
  );
  if (!updated) return Response.json({ error: 'RSVP not found' }, { status: 404 });
  await syncGuest(guest_id, body.estado, body.acompanantes_confirmados, body.acompanantes_nombres || []);
  return Response.json(updated);
}
