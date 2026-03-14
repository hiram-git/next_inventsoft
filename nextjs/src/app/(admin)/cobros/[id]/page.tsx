import Link from 'next/link';
import { store } from '@/lib/store';
import { notFound } from 'next/navigation';

export default async function CobroDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cobro = await store.getCobro(id);
  if (!cobro) notFound();

  const metodoPagoLabel: Record<string, string> = {
    efectivo: 'Efectivo', transferencia: 'Transferencia', cheque: 'Cheque', tarjeta: 'Tarjeta',
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Cobro {cobro.numero}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>Fecha: {cobro.fecha}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href={`/api/ticket/cobro/${id}`} target="_blank" className="btn btn-secondary">
            <span className="material-icons-round">receipt</span> Ticket
          </Link>
          <Link href="/cobros" className="btn btn-secondary">
            <span className="material-icons-round">arrow_back</span> Volver
          </Link>
        </div>
      </div>

      <div className="card">
        <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px 24px' }}>
          <dt style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Cliente:</dt>
          <dd><strong>{cobro.clienteNombre}</strong></dd>
          <dt style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Factura:</dt>
          <dd><Link href={`/facturas/${cobro.facturaId}`} style={{ color: 'var(--primary)' }}>{cobro.facturaNumero}</Link></dd>
          <dt style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Método de pago:</dt>
          <dd>{metodoPagoLabel[cobro.metodoPago] ?? cobro.metodoPago}</dd>
          {cobro.referencia && (
            <>
              <dt style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Referencia:</dt>
              <dd>{cobro.referencia}</dd>
            </>
          )}
          {cobro.notas && (
            <>
              <dt style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Notas:</dt>
              <dd>{cobro.notas}</dd>
            </>
          )}
          <dt style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Monto:</dt>
          <dd><strong style={{ fontSize: '1.25rem', color: 'var(--success)' }}>${cobro.monto.toFixed(2)}</strong></dd>
          <dt style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Estado:</dt>
          <dd>
            <span className={`badge ${cobro.estado === 'aplicado' ? 'badge-success' : 'badge-danger'}`}>
              {cobro.estado === 'aplicado' ? 'Aplicado' : 'Anulado'}
            </span>
          </dd>
        </dl>
      </div>
    </div>
  );
}
