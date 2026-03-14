import { store } from '@/lib/store';
import { generateReportePDF } from '@/lib/pdf';

export async function GET(req: Request) {
  const url   = new URL(req.url);
  const mes   = parseInt(url.searchParams.get('mes')  ?? String(new Date().getMonth() + 1));
  const anio  = parseInt(url.searchParams.get('anio') ?? String(new Date().getFullYear()));

  const reporte = await store.getReporteVentas(mes, anio);
  const empresa = await store.getEmpresa();
  const pdf     = await generateReportePDF(reporte, empresa, mes, anio);

  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reporte-ventas-${anio}-${mes}.pdf"`,
    },
  });
}
