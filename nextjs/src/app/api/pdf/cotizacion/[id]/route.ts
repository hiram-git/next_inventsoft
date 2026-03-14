import { store } from '@/lib/store';
import { generateCotizacionPDF } from '@/lib/pdf';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cotizacion = await store.getCotizacion(id);
  if (!cotizacion) return new Response('Not found', { status: 404 });

  const empresa = await store.getEmpresa();
  const pdf = await generateCotizacionPDF(cotizacion, empresa);

  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${cotizacion.numero}.pdf"`,
    },
  });
}
