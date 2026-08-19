import { connectDB } from '@/lib/db';
import { Song } from '@/lib/models/Song';
import { Guest } from '@/lib/models/Guest';

export async function GET() {
  await connectDB();
  const songs = await Song.find().sort({ createdAt: -1 }).lean();

  const guestIds = [...new Set(songs.map((s) => s.guest_id).filter(Boolean))];
  const guestsById = guestIds.length
    ? await Guest.find({ _id: { $in: guestIds } })
        .select('nombre apellidos slug')
        .lean()
    : [];
  const guestsBySlug = guestIds.length
    ? await Guest.find({ slug: { $in: guestIds } })
        .select('nombre apellidos slug')
        .lean()
    : [];

  const guestMap = new Map<string, { nombre: string; apellidos: string }>();
  for (const g of guestsById) guestMap.set(g._id.toString(), g);
  for (const g of guestsBySlug) guestMap.set(g.slug, g);

  const songsWithGuests = songs.map((song) => {
    const guest = guestMap.get(song.guest_id);
    return {
      ...song,
      guest_full_name: guest
        ? `${guest.nombre} ${guest.apellidos}`.trim()
        : song.guest_name || 'Anónimo',
    };
  });

  return Response.json(songsWithGuests);
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const song = await Song.create(body);
  return Response.json(song, { status: 201 });
}
