import { connectDB } from '@/lib/db';
import { RSVP } from '@/lib/models/RSVP';

export async function GET() {
  await connectDB();
  const rsvps = await RSVP.find().sort({ createdAt: -1 });
  return Response.json(rsvps);
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const existing = await RSVP.findOne({ guest_id: body.guest_id });
  if (existing) {
    const updated = await RSVP.findOneAndUpdate(
      { guest_id: body.guest_id },
      {
        estado: body.estado,
        acompanantes_confirmados: body.acompanantes_confirmados,
        total_confirmados: 1 + (body.acompanantes_confirmados || 0),
        comentario: body.comentario || '',
        fecha: new Date().toISOString().split('T')[0],
      },
      { new: true }
    );
    return Response.json(updated);
  }
  const rsvp = await RSVP.create({
    ...body,
    total_confirmados: 1 + (body.acompanantes_confirmados || 0),
    fecha: new Date().toISOString().split('T')[0],
  });
  return Response.json(rsvp, { status: 201 });
}
