import { connectDB } from '@/lib/db';
import { Config } from '@/lib/models/Config';

export async function GET() {
  try {
    await connectDB();
    const items = await Config.find();
    const config: Record<string, string> = {};
    items.forEach((item) => {
      config[item.clave] = item.valor;
    });
    return Response.json(config);
  } catch (error) {
    console.error('Error en GET /api/config:', error);
  }
}

export async function PUT(request: Request) {
  await connectDB();
  const { clave, valor } = await request.json();
  const updated = await Config.findOneAndUpdate(
    { clave },
    { valor },
    { upsert: true, new: true }
  );
  return Response.json(updated);
}
