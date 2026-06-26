import { connectDB } from '@/lib/db';
import { RSVP } from '@/lib/models/RSVP';

export async function GET(_request: Request, { params }: { params: Promise<{ guest_id: string }> }) {
  await connectDB();
  const { guest_id } = await params;
  const rsvp = await RSVP.findOne({ guest_id });
  return Response.json(rsvp || null);
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
      total_confirmados: 1 + (body.acompanantes_confirmados || 0),
      comentario: body.comentario || '',
      fecha: new Date().toISOString().split('T')[0],
    },
    { new: true }
  );
  if (!updated) return Response.json({ error: 'RSVP not found' }, { status: 404 });
  return Response.json(updated);
}
