import { connectDB } from '@/lib/db';
import { Song } from '@/lib/models/Song';

export async function GET() {
  await connectDB();
  const songs = await Song.find().sort({ createdAt: -1 });
  return Response.json(songs);
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const song = await Song.create(body);
  return Response.json(song, { status: 201 });
}
