import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { Guest } from '@/lib/models/Guest';

export async function GET(request: NextRequest) {
  await connectDB();
  const slug = request.nextUrl.searchParams.get('slug');
  if (slug) {
    const guest = await Guest.findOne({ slug });
    return Response.json(guest || null);
  }
  const guests = await Guest.find().sort({ createdAt: -1 });
  return Response.json(guests);
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const guest = await Guest.create(body);
  return Response.json(guest, { status: 201 });
}
