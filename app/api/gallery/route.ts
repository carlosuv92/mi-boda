import { connectDB } from '@/lib/db';
import { Gallery } from '@/lib/models/Gallery';

export async function GET() {
  await connectDB();
  const images = await Gallery.find();
  return Response.json(images);
}
