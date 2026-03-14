import { store } from '@/lib/store';
import { generateCobroTicket } from '@/lib/ticket';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cobro   = await store.getCobro(id);
  if (!cobro) return new Response('Not found', { status: 404 });

  const empresa = await store.getEmpresa();
  const ticket  = await generateCobroTicket(cobro, empresa);

  return new Response(ticket, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="ticket-cobro-${cobro.numero}.bin"`,
    },
  });
}
