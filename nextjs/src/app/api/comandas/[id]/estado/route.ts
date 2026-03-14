import { store } from '@/lib/store';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { estado } = await req.json();
  await store.updateComandaEstado(id, estado);
  return Response.json({ ok: true });
}
