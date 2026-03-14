import { store } from '@/lib/store';
import { generatePedidoPDF } from '@/lib/pdf';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pedido = await store.getPedido(id);
  if (!pedido) return new Response('Not found', { status: 404 });

  const empresa = await store.getEmpresa();
  const pdf = await generatePedidoPDF(pedido, empresa);

  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${pedido.numero}.pdf"`,
    },
  });
}
