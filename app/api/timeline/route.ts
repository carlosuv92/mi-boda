import { connectDB } from '@/lib/db';
import { Timeline } from '@/lib/models/Timeline';

export async function GET() {
  await connectDB();
  const events = await Timeline.find().sort({ hora: 1 });
  return Response.json(events);
}
