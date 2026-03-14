import { store } from '@/lib/store';
import { generatePedidoTicket } from '@/lib/ticket';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pedido = await store.getPedido(id);
  if (!pedido) return new Response('Not found', { status: 404 });

  const empresa = await store.getEmpresa();
  const ticket  = await generatePedidoTicket(pedido, empresa);

  return new Response(ticket, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="ticket-${pedido.numero}.bin"`,
    },
  });
}
