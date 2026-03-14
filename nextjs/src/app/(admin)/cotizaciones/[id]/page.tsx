import Link from 'next/link';
import { store } from '@/lib/store';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import ConfirmButton from '@/components/ConfirmButton';

async function convertirAFactura(formData: FormData) {
  'use server';
  const cotId = formData.get('cotId')?.toString() ?? '';
  const result = await store.convertirCotizacionAFactura(cotId);
  if (result) {
    redirect(`/facturas/${result.id}`);
  }
  revalidatePath(`/cotizaciones/${cotId}`);
}

export default async function CotizacionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cotizacion = await store.getCotizacion(id);
  if (!cotizacion) notFound();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Cotización {cotizacion.numero}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>Fecha: {cotizacion.fecha}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href={`/api/pdf/cotizacion/${id}`} target="_blank" className="btn btn-secondary">
            <span className="material-icons-round">picture_as_pdf</span> PDF
          </Link>
          {cotizacion.estado !== 'convertida' && cotizacion.estado !== 'cancelada' && cotizacion.estado !== 'rechazada' && (
            <form action={convertirAFactura} style={{ display: 'inline' }}>
              <input type="hidden" name="cotId" value={id} />
              <ConfirmButton mensaje="¿Convertir a factura?" className="btn btn-success">
                <span className="material-icons-round">receipt</span> Convertir a Factura
              </ConfirmButton>
            </form>
          )}
          <Link href="/cotizaciones" className="btn btn-secondary">
            <span className="material-icons-round">arrow_back</span> Volver
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Datos</h2>
          <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px' }}>
            <dt style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Cliente:</dt>
            <dd><strong>{cotizacion.clienteNombre}</strong></dd>
            {cotizacion.fechaVencimiento && (
              <>
                <dt style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Válida hasta:</dt>
                <dd>{cotizacion.fechaVencimiento}</dd>
              </>
            )}
            {cotizacion.notas && (
              <>
                <dt style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Notas:</dt>
                <dd>{cotizacion.notas}</dd>
              </>
            )}
          </dl>
        </div>
        <div className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Estado</h2>
          <span className={`badge ${
            cotizacion.estado === 'aceptada' || cotizacion.estado === 'convertida' ? 'badge-success' :
            cotizacion.estado === 'rechazada' || cotizacion.estado === 'vencida' ? 'badge-danger' :
            cotizacion.estado === 'enviada' ? 'badge-info' : 'badge-secondary'
          }`} style={{ fontSize: '0.9rem', padding: '4px 12px' }}>{cotizacion.estado}</span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Líneas</h2>
        <table>
          <thead><tr><th>Descripción</th><th>Tipo</th><th>P. Unitario</th><th>Cantidad</th><th>Subtotal</th></tr></thead>
          <tbody>
            {cotizacion.items.map((item, i) => (
              <tr key={i}>
                <td>{item.nombre}</td>
                <td>{item.tipo}</td>
                <td>${item.precioUnitario?.toFixed(2)}</td>
                <td>{item.cantidad}</td>
                <td><strong>${item.subtotal?.toFixed(2)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ maxWidth: 280, marginLeft: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
          <span>Subtotal:</span><span>${cotizacion.subtotal?.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
          <span>IVA:</span><span>${cotizacion.iva?.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontWeight: 700, fontSize: '1.1rem' }}>
          <span>Total:</span><span>${cotizacion.total.toFixed(2)}</span>
        </div>
      </div>
      <style>{`.badge-secondary{background:var(--bg);color:var(--text-muted)}.badge-info{background:#dbeafe;color:#2563eb}`}</style>
    </div>
  );
}
