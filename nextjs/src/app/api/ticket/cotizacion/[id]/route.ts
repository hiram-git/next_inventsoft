import { store } from '@/lib/store';
import { generateCotizacionTicket } from '@/lib/ticket';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cotizacion = await store.getCotizacion(id);
  if (!cotizacion) return new Response('Not found', { status: 404 });

  const empresa = await store.getEmpresa();
  const ticket  = await generateCotizacionTicket(cotizacion, empresa);

  return new Response(ticket, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="ticket-${cotizacion.numero}.bin"`,
    },
  });
}
