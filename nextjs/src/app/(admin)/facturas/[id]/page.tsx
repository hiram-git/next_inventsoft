import Link from 'next/link';
import { store } from '@/lib/store';
import { notFound } from 'next/navigation';

export default async function FacturaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const factura = await store.getFactura(id);
  if (!factura) notFound();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Factura {factura.numero}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
            Fecha: {factura.fecha}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href={`/api/pdf/factura/${id}`} target="_blank" className="btn btn-secondary">
            <span className="material-icons-round">picture_as_pdf</span> PDF
          </Link>
          <Link href={`/api/ticket/factura/${id}`} target="_blank" className="btn btn-secondary">
            <span className="material-icons-round">receipt</span> Ticket
          </Link>
          <Link href="/facturas" className="btn btn-secondary">
            <span className="material-icons-round">arrow_back</span> Volver
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Datos del Cliente</h2>
          <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px' }}>
            <dt style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Cliente:</dt>
            <dd><strong>{factura.clienteNombre}</strong></dd>
            {factura.almacenNombre && (
              <>
                <dt style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Almacén:</dt>
                <dd>{factura.almacenNombre}</dd>
              </>
            )}
            {factura.fechaVencimiento && (
              <>
                <dt style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Vencimiento:</dt>
                <dd>{factura.fechaVencimiento}</dd>
              </>
            )}
          </dl>
        </div>
        <div className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Estado</h2>
          <span className={`badge ${
            factura.estado === 'pagada' ? 'badge-success' :
            factura.estado === 'cancelada' ? 'badge-danger' : 'badge-warning'
          }`} style={{ fontSize: '0.9rem', padding: '4px 12px' }}>{factura.estado}</span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Líneas de Factura</h2>
        <table>
          <thead>
            <tr>
              <th>Descripción</th><th>Tipo</th><th>P. Unitario</th><th>Cantidad</th><th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {factura.items.map((item, i) => (
              <tr key={i}>
                <td>{item.nombre}</td>
                <td>{item.tipo}</td>
                <td>${item.precioUnitario?.toFixed(2) ?? '—'}</td>
                <td>{item.cantidad}</td>
                <td><strong>${item.subtotal?.toFixed(2) ?? '—'}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ maxWidth: 320, marginLeft: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
          <span>Subtotal:</span><span>${factura.subtotal?.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
          <span>IVA (16%):</span><span>${factura.iva?.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontWeight: 700, fontSize: '1.1rem' }}>
          <span>Total:</span><span>${factura.total.toFixed(2)}</span>
        </div>
      </div>
      <style>{`.badge-warning{background:#fef3c7;color:#b45309}`}</style>
    </div>
  );
}
