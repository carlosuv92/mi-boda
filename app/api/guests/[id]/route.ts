import { connectDB } from '@/lib/db';
import { Guest } from '@/lib/models/Guest';
import { sanitizePhone } from '@/lib/utils';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const body = await request.json();
  if (body.telefono) body.telefono = sanitizePhone(body.telefono);
  const guest = await Guest.findByIdAndUpdate(id, body, { new: true });
  if (!guest) return Response.json({ error: 'Guest not found' }, { status: 404 });
  return Response.json(guest);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const deleted = await Guest.findByIdAndDelete(id);
  if (!deleted) return Response.json({ error: 'Guest not found' }, { status: 404 });
  return Response.json({ success: true });
}
