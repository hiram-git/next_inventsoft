import { store } from '@/lib/store';
import { generateFacturaPDF } from '@/lib/pdf';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const factura = await store.getFactura(id);
  if (!factura) return new Response('Not found', { status: 404 });

  const empresa = await store.getEmpresa();
  const pdf = await generateFacturaPDF(factura, empresa);

  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${factura.numero}.pdf"`,
    },
  });
}
