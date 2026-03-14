import { store } from '@/lib/store';

export async function GET() {
  const comandas = await store.getComandasActivas();
  return Response.json(comandas);
}
