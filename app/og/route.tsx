import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { Config } from '@/lib/models/Config';

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectDB();
  const config = await Config.findOne({ clave: 'fotoPrincipal' });
  const url = config?.valor || '/images/principal.webp';
  redirect(url);
}
