import { connectDB } from '@/lib/db';
import { Gallery } from '@/lib/models/Gallery';

export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const aprobadas = searchParams.get('aprobadas') === 'true';

  const filter = aprobadas ? { aprobado: true } : {};
  const images = await Gallery.find(filter).sort({ createdAt: -1 });
  return Response.json(images);
}

export async function POST(request: Request) {
  await connectDB();
  const { url, descripcion, subido_por } = await request.json();

  if (!url) {
    return Response.json({ error: 'URL de imagen requerida' }, { status: 400 });
  }

  const image = await Gallery.create({
    url,
    descripcion: descripcion || '',
    tipo: 'foto',
    subido_por: subido_por || 'Invitado',
    aprobado: false,
  });

  return Response.json(image, { status: 201 });
}
