import { store } from '@/lib/store';
import { generateFacturaTicket } from '@/lib/ticket';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const factura = await store.getFactura(id);
  if (!factura) return new Response('Not found', { status: 404 });

  const empresa = await store.getEmpresa();
  const ticket  = await generateFacturaTicket(factura, empresa);

  return new Response(ticket, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="ticket-${factura.numero}.bin"`,
    },
  });
}
