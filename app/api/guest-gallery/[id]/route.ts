import { connectDB } from '@/lib/db';
import { Gallery } from '@/lib/models/Gallery';
import cloudinary from '@/lib/cloudinary';

function getPublicIdFromUrl(url: string): string | null {
  if (!url.includes('res.cloudinary.com')) return null;
  const match = url.match(/\/image\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return match ? match[1] : null;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  const body = await request.json();

  const image = await Gallery.findByIdAndUpdate(id, body, { new: true });
  if (!image) {
    return Response.json({ error: 'Imagen no encontrada' }, { status: 404 });
  }

  return Response.json(image);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  const image = await Gallery.findById(id);
  if (!image) {
    return Response.json({ error: 'Imagen no encontrada' }, { status: 404 });
  }

  const publicId = getPublicIdFromUrl(image.url);
  if (publicId) {
    await cloudinary.uploader.destroy(publicId).catch((err) => {
      console.error('Error deleting from Cloudinary:', err);
    });
  }

  await Gallery.findByIdAndDelete(id);

  return Response.json({ success: true });
}
